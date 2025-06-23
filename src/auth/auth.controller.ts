import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async logIn(@Res() respuesta, @Body() loginDTO: {email: string, password: string}) {

    const user = await this.authService.validateUser(loginDTO.email, loginDTO.password);

    if (!user) {
      return respuesta.status(HttpStatus.UNAUTHORIZED).json({ message: 'Credenciales inválidas' });
    }

    const token = await this.authService.verifyFromBD(user);

    return respuesta.status(HttpStatus.OK).json({
      message: 'Inicio de sesión exitoso',
      token: token
    });
  }
}