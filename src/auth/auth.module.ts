import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../BD/schemas/users.schema';


@Module({
  imports: [
    JwtModule.register({
      global:true,
      secret: 'secretKey', // cambiar
      signOptions: { expiresIn: '10m' },
    }),
    MongooseModule.forFeature([
      { name: "users", schema: UserSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
