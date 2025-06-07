import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(username: string, password: string): { access_token: string } | null {
    // Credenciales temporales
    if (username === 'admin' && password === '1234') {
      return { access_token: 'Autenticado Fake' };
    }
    return null;
  }
}