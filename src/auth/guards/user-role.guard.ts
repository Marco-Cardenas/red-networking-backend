
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { AuthService } from '../auth.service';
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly authService: AuthService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    const isInvalid = await this.authService.isTokenInvalid(token);
    
    if (isInvalid) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const validRoles: string = this.reflector.get(META_ROLES, context.getHandler());
    if (!validRoles) {
      return true;
    }

    if (validRoles === user.role) {
      return true;
    }

    throw new ForbiddenException(`User ${user.email} is not authorized to access this resource`);

  }
}
