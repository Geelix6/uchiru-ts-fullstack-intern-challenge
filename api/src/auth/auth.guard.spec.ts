import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

function mockExecutionContext(header?: string): ExecutionContext {
  const req: any = { headers: {} };
  if (header !== undefined) {
    req.headers['authorization'] = header;
  }
  return {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
  } as any;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: Partial<AuthService>;

  beforeEach(() => {
    authService = {
      validateToken: jest.fn(),
    };
    guard = new AuthGuard(authService as AuthService);
  });

  it('should throw UnauthorizedException if Authorization header is missing', async () => {
    const ctx = mockExecutionContext();
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if header format is wrong', async () => {
    const ctx1 = mockExecutionContext('Bearer');
    const ctx2 = mockExecutionContext('BadPrefix token');
    const ctx3 = mockExecutionContext('Bearer token extra');

    await expect(guard.canActivate(ctx1)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(ctx2)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(ctx3)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return true and attach user on valid token', async () => {
    const fakeUser = { id: 'u1', login: 'alice' };
    (authService.validateToken as jest.Mock).mockResolvedValue(fakeUser);

    const token = 'valid-token';
    const ctx = mockExecutionContext(`Bearer ${token}`);
    const req = ctx.switchToHttp().getRequest();

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(authService.validateToken).toHaveBeenCalledWith(token);
    expect(req.user).toBe(fakeUser);
  });

  it('should rethrow error from auth.validateToken (e.g. unauthorized)', async () => {
    const err = new UnauthorizedException('Invalid token');
    (authService.validateToken as jest.Mock).mockRejectedValue(err);

    const ctx = mockExecutionContext('Bearer badtoken');
    await expect(guard.canActivate(ctx)).rejects.toBe(err);
  });
});
