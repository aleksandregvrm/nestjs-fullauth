export class TokenUserDto {
    name: string;
    id: string;
    email: string;
}
export class CookieResponseDto {
    user: TokenUserDto;
    refreshToken: string;
    expiresAt: Date;
    res:any
}
export class PasswordComparisionDTo {
    candidatePassword: string;
    password: string;
}