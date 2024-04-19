import { IsString, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';

export class SignUpCredentialsDto {
    @IsString()
    @MinLength(3)
    @MaxLength(12)
    name: string;

    @IsString()
    @MinLength(4)
    @MaxLength(18)
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(12)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,64}$/gm, {
        message:
            'Password must be between 6 and 64 characters long with 1 special character and capital character each',
    })
    password: string;
}

export class SignInCredentialsDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
    
    res:Response
}

export class VerifyUserDto {

    @IsString()
    email: string;

    @IsString()
    verificationToken: string
}