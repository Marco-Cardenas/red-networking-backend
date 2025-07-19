import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../BD/schemas/users.schema';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('users') private readonly userModel: Model<User>,
    private readonly emailService: EmailService
  ) { }
  async isAUser(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return false;
    }
    return true;
  }

  async registerUser(logup: any) {
    const newUser = await this.userModel.create(logup);
    return await newUser.save();
  }

  async getUser(opt = {}) {
    const users = await this.userModel.find(opt);
    return users;
  }

  async changePasword(userID, newPassword) {
    const user = await this.userModel.findByIdAndUpdate(userID, { password: newPassword }, { new: true });
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    if (await bcrypt.compare(password, user.password)) {
      const { password, ...resultado } = user;
      return resultado;
    }
    return null;
  }

  async verifyFromBD(user: any): Promise<any> {
    const { email, _id } = user;
    const payload = { sub: _id, email };
    return {
      token: this.jwtService.sign(payload),
      id: _id
    };
  }



  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const token = this.jwtService.sign({ id: user._id, email: user.email });
    let subject = 'Recuperación de contraseña';
    await this.emailService.sendEmail(user.email, subject, {
      baseUrl: '',
      token,
      type: 'forgot-password',
    });

    user.remember_token = token;
    await user.save();

    return {
      message: 'Correo de recuperación de contraseña enviado correctamente'
    };
  }



  async resetPassword(resetPasswordDto: ResetPasswordDto){


    const { token, password } = resetPasswordDto;

    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded || !decoded.exp) {
      throw new BadRequestException('Token inválido');
    }

    const user = await this.userModel.findOne({ remember_token: token });

    if (!user) {
      throw new BadRequestException('Token inválido');
    }

    user.password = bcrypt.hashSync(password, 10);
    user.remember_token = '';
    await user.save();

    return {
      message: 'Contraseña restablecida correctamente'
    };

  }

}