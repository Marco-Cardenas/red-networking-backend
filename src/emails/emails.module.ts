import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const emailPort = configService.get<string>('EMAIL_PORT');
        if (!emailPort) {
          throw new Error('EMAIL_PORT is not defined in environment variables');
        }

        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: parseInt(emailPort),
            secure: emailPort === '465',
            auth: {
              user: configService.get<string>('EMAIL_USER'),
              pass: configService.get<string>('EMAIL_PASSWORD'),
            },
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [EmailsService],
  providers: [EmailsService]
})
export class EmailsModule {}
