import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

// Мокаем bcrypt, чтобы тесты не зависели от нативной сборки.
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService (unit)', () => {
  let service: AuthService;

  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('register: delegates to UsersService.create', async () => {
    usersService.create.mockResolvedValue({ id: 1, email: 'a@a.ru' });

    const res = await service.register({ email: 'a@a.ru', password: '123' });
    expect(usersService.create).toHaveBeenCalledWith({
      email: 'a@a.ru',
      password: '123',
    });
    expect(res).toEqual({ id: 1, email: 'a@a.ru' });
  });

  it('login: returns access_token on valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 10,
      email: 'admin@site.ru',
      password: 'hashed',
      role: { name: 'ADMIN' },
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('jwt_token');

    const res = await service.login({ email: 'admin@site.ru', password: 'pw' });

    expect(usersService.findByEmail).toHaveBeenCalledWith('admin@site.ru');
    expect(bcrypt.compare).toHaveBeenCalledWith('pw', 'hashed');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 10,
      email: 'admin@site.ru',
      role: 'ADMIN',
    });
    expect(res).toEqual({ access_token: 'jwt_token' });
  });

  it('login: throws UnauthorizedException on invalid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 10,
      email: 'admin@site.ru',
      password: 'hashed',
      role: { name: 'ADMIN' },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'admin@site.ru', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    // Если пароль не совпал — токен не должен быть сгенерирован
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
