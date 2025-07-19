import { Controller, Post, Body, Res, HttpStatus, Get, Put, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

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
      users
    });
  }

  @Put('change_password') //Le debe llegar el email y el password
  async change_password(@Res() respuesta, @Body() inputData) {
    const users = await this.authService.getUser({email: inputData.email});
    if(users.length == 0) {
      return respuesta.status(HttpStatus.OK).json({
        process: false,
        message: "No se pudo cambiar la clave debido a: Usuario no registrado"
      });
    }
    inputData.password = await bcrypt.hash(inputData.password, 4);
    await this.authService.changePasword(users[0]._id, inputData.password);
    return respuesta.status(HttpStatus.OK).json({
      process: true,
      message: "Clave cambiada correctamente"
    });

  }

  @Post('forgot-password')
  async forgotPassword(@Res() respuesta,@Body() forgotPasswordDto: ForgotPasswordDto) {


    try{
      const res = await this.authService.forgotPassword(forgotPasswordDto);
      return respuesta.status(HttpStatus.OK).json({
        proceso: true,
        message: res.message
      });
    }catch(error){
      if(error instanceof BadRequestException){
        return respuesta.status(HttpStatus.OK).json({
          proceso: false,
          message: error.message
        });
      } 
      return respuesta.status(HttpStatus.OK).json({
        proceso: false,
        message: 'Error al enviar el correo de recuperación de contraseña'
      });
    }
  
  }

  @Post('reset-password')
  async resetPassword(@Res() respuesta, @Body() resetPasswordDto: ResetPasswordDto) {
    try{
      const res = await this.authService.resetPassword(resetPasswordDto);
      return respuesta.status(HttpStatus.OK).json({
        proceso: true,
        message: res.message
      });
    }
    catch(error){
      if(error instanceof BadRequestException){
        return respuesta.status(HttpStatus.OK).json({
          proceso: false,
          message: error.message
        });
      }
      return respuesta.status(HttpStatus.OK).json({
        proceso: false,
        message: 'Error al restablecer la contraseña'
      });
    }
  }
}