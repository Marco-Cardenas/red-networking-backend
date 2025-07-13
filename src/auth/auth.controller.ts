import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async logIn(@Res() respuesta, @Body() loginDTO: LoginDto) {
    const user = await this.authService.validateUser(loginDTO.email, loginDTO.password);
    if (!user) {
      return respuesta.status(HttpStatus.OK).json({  proceso: false, message: 'Credenciales inválidas' });
    }
    const info = await this.authService.verifyFromBD(user._doc);
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      message: 'Inicio de sesión exitoso',
      token: info.token,
      id: user._doc._id,
      name: user._doc.name,
      email: user._doc.email,
      role: user._doc.role
    });
  }

  @Post('register')
  async register(@Res() respuesta, @Body() logupDTO: RegisterDto) {
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