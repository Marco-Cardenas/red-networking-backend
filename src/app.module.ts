import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CrudModule } from './crud/crud.module';
import { ProcesosModule } from './procesos/procesos.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb+srv://tovarfigueroa:1234@cluster0.tfq0c23.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    CrudModule,
    ProcesosModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
