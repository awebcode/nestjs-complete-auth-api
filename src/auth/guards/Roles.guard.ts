import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../pipes/Roles.pipe';
import type { Role } from 'src/types/enums';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true; // If no roles are specified, allow access
    }
   
    
    const request = context.switchToHttp().getRequest();
    console.log({request:request.user})
    const userId = Number(request.user.userId)||1

    // Fetch the user from the database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied');
    }

    // Check if the user's role matches any of the required roles
    const hasRole = () => requiredRoles.includes(user.role as Role);

    if (!hasRole()) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
