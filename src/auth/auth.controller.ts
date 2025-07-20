import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RecuperarContrasenaDto } from '../dtos/recuperar-contrasena.dto';
import { CambiarContrasenaDto } from '../dtos/cambiar-contrasena.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async logIn(@Res() respuesta, @Body() loginDTO: LoginDto) {
    const user = await this.authService.validateUser(
      loginDTO.email,
      loginDTO.password,
    );
    if (!user) {
      return respuesta
        .status(HttpStatus.OK)
        .json({ proceso: false, message: 'Credenciales inválidas' });
    }
    const token = await this.authService.verifyFromBD(user);
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      message: 'Inicio de sesión exitoso',
      token: token,
    });
  }

  @Post('register')
  async register(@Res() respuesta, @Body() logupDTO: RegisterDto) {
    const user = await this.authService.isAUser(logupDTO.email);
    if (user) {
      return respuesta
        .status(HttpStatus.OK)
        .json({ proceso: false, message: 'Usuario ya registrado' });
    }
    logupDTO.password = await bcrypt.hash(logupDTO.password, 4);
    await this.authService.registerUser(logupDTO);
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      message: 'Usuario Registrado Con Exito',
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

  @Post('recuperar-contrasena')
  async recuperarContrasena(
    @Res() respuesta,
    @Body() recuperarDto: RecuperarContrasenaDto,
  ) {
    const user = await this.authService.isAUser(recuperarDto.email);
    if (!user) {
      return respuesta
        .status(HttpStatus.OK)
        .json({
          proceso: false,
          message: 'No existe un usuario con este correo electrónico',
        });
    }

    // En un entorno real, aquí se enviaría un email con un token de recuperación
    // Por ahora, solo verificamos que el usuario existe
    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      message:
        'Se ha enviado un enlace de recuperación a tu correo electrónico',
    });
  }

  @Post('cambiar-contrasena')
  async cambiarContrasena(
    @Res() respuesta,
    @Body() cambiarDto: CambiarContrasenaDto,
  ) {
    const user = await this.authService.isAUser(cambiarDto.email);
    if (!user) {
      return respuesta
        .status(HttpStatus.OK)
        .json({
          proceso: false,
          message: 'No existe un usuario con este correo electrónico',
        });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(cambiarDto.password, 4);

    // Actualizar la contraseña en la base de datos
    await this.authService.updatePassword(cambiarDto.email, hashedPassword);

    return respuesta.status(HttpStatus.OK).json({
      proceso: true,
      message: 'Contraseña actualizada exitosamente',
    });
  }
}
