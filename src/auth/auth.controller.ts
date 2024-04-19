import { Controller, Post, Body, Query, Patch, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpCredentialsDto } from './dto/auth.credentials-dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('/signup')
    async signup(@Body() signUpCredentialsDto: SignUpCredentialsDto): Promise<string> {
        return this.authService.signup(signUpCredentialsDto);
    }

    @Post('/login')
    async login(@Body('email') email: string, @Body('password') password: string, @Res() res): Promise<Record<string, string>> {
        return this.authService.login({ email, password, res })
    }

    @Patch('/verify')
    async verifyEmail(@Query('email') email: string, @Query('verificationToken') verificationToken: string): Promise<string> {
        return this.authService.verifyEmail({ email, verificationToken });
    }
}


