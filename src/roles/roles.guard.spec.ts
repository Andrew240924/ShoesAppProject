import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { RoleName } from './role.enum';

describe('RolesGuard (unit)', () => {
  const makeContext = (role?: string) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: role ? { role } : undefined,
        }),
      }),
    }) as any;

  it('allows request when user has required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([RoleName.ADMIN]),
    } as unknown as Reflector;

    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeContext('ADMIN'))).toBe(true);
  });

  it('denies request when user role is missing or not in required roles', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([RoleName.ADMIN]),
    } as unknown as Reflector;

    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeContext('USER'))).toBe(false);
    expect(guard.canActivate(makeContext(undefined))).toBe(false);
  });
});
