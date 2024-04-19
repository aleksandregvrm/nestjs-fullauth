import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MailModule } from 'src/mail/mail.module';
import { JWTUserService } from './jwt/jwt-user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule,TypeOrmModule.forFeature([User]), MailModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JWTUserService]
})
export class AuthModule { }
