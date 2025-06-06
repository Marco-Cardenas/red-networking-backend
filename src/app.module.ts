import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServiceController } from './service/service.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, ServiceController],
  providers: [AppService],
})
export class AppModule {}
