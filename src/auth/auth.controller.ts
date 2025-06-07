import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    const result = this.authService.login(body.username, body.password);
    if (!result) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return result;
  }
}