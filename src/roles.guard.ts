import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from './users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: Request = context.switchToHttp().getRequest();
      const jwt = req.headers.authorization.replace('Bearer ', '');
      const result = this.jwtService.verify(jwt);
      if (!result) {
        throw new UnauthorizedException('Unauthorized');
      }
      const user = await this.usersService.findOne({ id: result.id });
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
      req['guardUser'] = user;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
