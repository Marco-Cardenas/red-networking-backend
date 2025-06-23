import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = { _id: "123456", email: "m@gmail.com", password: await bcrypt.hash("xyz", 4)};
    if(user && await bcrypt.compare(password, user.password)) {
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