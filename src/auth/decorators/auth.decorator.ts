import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { UserRoleGuard } from '../guards/user-role.guard';
import { AuthGuard } from '@nestjs/passport';


export function Auth(role?: ValidRoles) {
  return applyDecorators(
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}
