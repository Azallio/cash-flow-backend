import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../enums/user-role.enum';
import { SELF_OR_ROLES_KEY } from '../decorators/user/selfOrRoles.decorator';

@Injectable()
export class SelfOrRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles =
      this.reflector.getAllAndOverride<UserRole[]>(SELF_OR_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    return String(user.id) === String(request.params.id);
  }
}
