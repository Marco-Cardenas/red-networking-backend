import { Controller, Post, Body, Req, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { Request } from 'express';
import { AccountUpdateDto } from './dto/account-update.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('validate-token')
  @Auth()
  validateToken(@GetUser() user: User, @Req() req: Request) {
    const { password, ...userWithoutPassword } = user.toObject();
    const token = req.headers.authorization?.split(' ')[1];
    return {
      user: userWithoutPassword,
      token
    };
  }

  @Post('logout')
  @Auth()
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    await this.authService.logout(token);
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Post('send-verification-email')
  @Auth()
  sendVerificationEmail(@GetUser() user: User) {
    return this.authService.sendVerificationEmail(user);
  }

  @Post('verify-email')
  @Auth()
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.id);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('seed')
  seed() {
    return this.authService.seed();
  }

  @Post('account-update')
  @Auth()
  accountUpdate(@Body() accountUpdateDto: AccountUpdateDto, @GetUser() user: User) {
    return this.authService.accountUpdate(accountUpdateDto, user);
  }
}

