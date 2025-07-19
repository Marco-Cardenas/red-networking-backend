import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  async sendEmail(email: string, subject: string, context: any) {
    const baseUrl = 'https://guevaraeduard.alienstudio.com.ve';
    const response = await firstValueFrom(
      this.httpService.post(`${baseUrl}/api/send-email`, {
        ...context,
        email,
        subject
      })
    );
    console.log(response.data);
  }
}
