import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignInCredentialsDto, SignUpCredentialsDto,VerifyUserDto } from './dto/auth.credentials-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) { }
    async signup(signUpCredentialsDto: SignUpCredentialsDto): Promise<string> {
        return this.userRepository.registerUser(signUpCredentialsDto)
    }
    async login(signInCredentialsDto:SignInCredentialsDto):Promise <Record<string,string>>{
        return this.userRepository.login(signInCredentialsDto);
    }
    async verifyEmail(verifyUserDto: VerifyUserDto): Promise<string>{
        return this.userRepository.verifyUser(verifyUserDto);  
    }
}
