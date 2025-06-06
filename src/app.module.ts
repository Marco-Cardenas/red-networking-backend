import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { appConfig } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { EmailsModule } from './emails/emails.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB as string),
    AuthModule,
    EmailsModule,
  ],
  providers: [],
})
export class AppModule { }