import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { generateToken } from 'src/utils/generate-token.util';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateToken(token: string): Promise<User> {
    const users = await this.usersService.findAll();
    for (const user of users) {
      if (generateToken(user.id) === token) {
        return user;
      }
    }

    throw new UnauthorizedException('Invalid token');
  }
}
