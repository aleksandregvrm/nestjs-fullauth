import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { TokenUserDto, CookieResponseDto, PasswordComparisionDTo } from "../dto/jwt-user-dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JWTUserService {
    constructor(private configService: ConfigService,) { }
    async comparePasswords(passwordComparisionDto: PasswordComparisionDTo): Promise<boolean> {
        const { candidatePassword, password } = passwordComparisionDto;
        const isMatch = await bcrypt.compare(candidatePassword, password);
        return isMatch;
    }
    createTokenUser(tokenUserDto: TokenUserDto): TokenUserDto {
        const { name, id, email } = tokenUserDto;
        return { name, id, email }
    }
    createJWT({ payload }): string {
        const token = jwt.sign(payload, this.configService.get('JWT_SECRET'));
        return token;
    }
    attachCookiesToResponse(cookieResponseDto: CookieResponseDto): void {
        const { user, refreshToken, expiresAt, res } = cookieResponseDto;
        const accessTokenJWT = this.createJWT({ payload: { user } });
        const refreshTokenJWT = this.createJWT({ payload: { user, refreshToken } });
        const oneDay = 1000 * 60 * 60 * 24;
        res.cookie("accessToken", accessTokenJWT, {
            httpOnly: true,
            expires: new Date(Date.now() + oneDay),
            secure: false,
            signed: true,
            sameSite: true,
        });
        res.cookie("refreshToken", refreshTokenJWT, {
            httpOnly: true,
            expires: expiresAt,
            secure: this.configService.get('NODE_ENV') === "production",
            signed: true,
            sameSite: true,
        });
    }
}