import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { generateToken } from '../utils/generate-token.util';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(() => {
    usersService = {
      findAll: jest
        .fn()
        .mockResolvedValue([
          { id: 'user1-id', login: 'user1', password: 'hash1' },
        ]),
    };
    authService = new AuthService(usersService as UsersService);
  });

  it('should return user for valid token', async () => {
    const token = generateToken('user1-id');
    const user = await authService.validateToken(token);
    expect(user.id).toBe('user1-id');
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    await expect(authService.validateToken('badtoken')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
