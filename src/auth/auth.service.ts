import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../BD/schemas/users.schema';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('users') private readonly userModel: Model<User>
  ) {  }
  async isAUser(email: string) {
    const user = await this.userModel.findOne({email});
    if(!user) {
      return false;
    }
    return true;
  }

  async registerUser(logup:any) {
    const newUser = await this.userModel.create(logup);
    return await newUser.save();
  }

  async getUser(opt = {}) {
    const users = await this.userModel.find(opt);
    return users;
  }

  async changePasword(userID, newPassword) {
    const user = await this.userModel.findByIdAndUpdate(userID, {password: newPassword}, { new: true });
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({email});
    if(!user) {
      return null;
    }
    if(await bcrypt.compare(password, user.password)) {
      const {password, ...resultado} = user;
      return resultado;
    }
    return null;
  }

  async verifyFromBD(user: any): Promise<any> {
    const {email, _id} = user;
    const payload = {sub: _id, email};
    return {
      token: this.jwtService.sign(payload),
      id: _id
    };
  }
}