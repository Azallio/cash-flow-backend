// decorators/self-or-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../enums/user-role.enum';

export const SELF_OR_ROLES_KEY = 'selfOrRoles';
export const SelfOrRoles = (...roles: UserRole[]) =>
  SetMetadata(SELF_OR_ROLES_KEY, roles);
