import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async logIn(@Res() respuesta, @Body() loginDTO: {email: string, password: string}) {

    const user = await this.authService.validateUser(loginDTO.email, loginDTO.password);

    if (!user) {
      return respuesta.status(HttpStatus.OK).json({  proceso: false, message: 'Credenciales inválidas' });
    }

    const token = await this.authService.verifyFromBD(user);

    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      message: 'Inicio de sesión exitoso',
      token: token
    });
  }

  @Post('register')
  async register(@Res() respuesta, @Body() logupDTO: {name: string, born: string, email:string, password: string}) {
    const user = await this.authService.isAUser(logupDTO.email);
    if(user) {
      return respuesta.status(HttpStatus.OK).json({  proceso: false, message: 'Usuario ya registrado' });
    }
    logupDTO.password = await bcrypt.hash(logupDTO.password, 4);
    await this.authService.registerUser(logupDTO);
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      message: 'Usuario Registrado Con Exito'
    });
  }

  @Get('users')
  async findUsers(@Res() respuesta) {
    const users = await this.authService.getUser();
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      users,
    });
  }
}