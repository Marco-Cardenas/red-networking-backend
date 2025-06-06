import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { InvalidToken, InvalidTokenSchema } from './entities/invalid-token.entity';
import { EmailsModule } from 'src/emails/emails.module';
import { UserRoleGuard } from './guards/user-role.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRoleGuard],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: InvalidToken.name,
        schema: InvalidTokenSchema
      }
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' }
      })
    }),
    EmailsModule,
  ],
  exports: [AuthService, JwtStrategy, MongooseModule, PassportModule, JwtModule, UserRoleGuard]
})
export class AuthModule {}
