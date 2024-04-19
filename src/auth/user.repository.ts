import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { Repository, DataSource } from "typeorm"
import { User } from "./user.entity"
import { SignUpCredentialsDto, SignInCredentialsDto, VerifyUserDto } from "./dto/auth.credentials-dto"
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailService } from "src/mail/mail.service";
import { JWTUserService } from "./jwt/jwt-user.service";

@Injectable()
export class UserRepository extends Repository<User>{
  constructor(private dataSource: DataSource, private readonly mailService: MailService, private jwtUserService: JWTUserService) {
    super(User, dataSource.createEntityManager())
  }
  async registerUser(signUpCredentialsDto: SignUpCredentialsDto): Promise<string> {
    const { name, email, username, password } = signUpCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = this.create({ name, email, username, password: hashedPassword, verificationToken })
    try {
      await this.save(user);
      await this.mailService.sendUserConfirmation({ name, email, token: verificationToken })
      return "User Registered"
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async login(signInCredentialsDto: SignInCredentialsDto): Promise<Record<string,string>> {
    const { email, password:candidatePassword, res } = signInCredentialsDto;
    const user = await this.findOneBy({ email });
    const { isVerified, name, id, password } = user;
    if(!(await this.jwtUserService.comparePasswords({password,candidatePassword}))){
      throw new ConflictException('Incorrect credentials');
    }
    if (!isVerified) {
      throw new ConflictException('User is not verified');
    }
    let refreshToken = '';
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;
    const expirationTime = new Date(Date.now() + thirtyDays);
    const tokenUser = this.jwtUserService.createTokenUser({ name, id, email });
    this.jwtUserService.attachCookiesToResponse({user:tokenUser,refreshToken,expiresAt:expirationTime, res});
    return {name,email,id};
  }
  async verifyUser(verifyUserDto: VerifyUserDto): Promise<string> {
    const { email, verificationToken:verificationTokenSubmitted } = verifyUserDto;
    const user = await this.findOneBy({ email });
    if(!user){
      throw new NotFoundException("The user doesn't exist")
    }
    const {verificationToken} = user;
    if(verificationTokenSubmitted !== verificationToken){
      throw new ConflictException('Invalid verification token')
    }
    user.isVerified = true;
    user.verificationToken ='';
    await this.save(user);
    return "User has been verified"
  }
}