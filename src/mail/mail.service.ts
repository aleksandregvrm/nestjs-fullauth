import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

class MailConfirmationDto {
  name:string;
  email:string
  token:string;
}

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(mailConfirmationDto:MailConfirmationDto) {
        const {email,token,name} = mailConfirmationDto;
        const url = `http://localhost:3000/auth/verify?verificationToken=${token}&email=${email}`;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Welcome to Nice App! Confirm your Email',
                template: 'confirmation', 
                context: { 
                    name: name,
                    url,
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
}
