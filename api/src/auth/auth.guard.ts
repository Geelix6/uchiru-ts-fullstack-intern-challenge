import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = req.headers['authorization'];

    if (
      !header ||
      !header.startsWith('Bearer ') ||
      header.split(' ').length !== 2
    ) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = header.split(' ')[1];

    try {
      const user = await this.auth.validateToken(token);
      req.user = user;
      return true;
    } catch (e) {
      throw e;
    }
  }
}
