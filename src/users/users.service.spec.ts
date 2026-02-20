import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './users.entity';
import { Role } from '../roles/role.entity';

// Важно: чтобы unit-тесты не зависели от нативного bcrypt.
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('UsersService (unit)', () => {
  let service: UsersService;

  const userRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const roleRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Role), useValue: roleRepo },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('create: hashes password and saves user', async () => {
    userRepo.findOne.mockResolvedValue(null);
    roleRepo.findOne.mockResolvedValue({ id: 1, name: 'USER' });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

    userRepo.create.mockImplementation((data) => ({ id: 123, ...data }));
    userRepo.save.mockImplementation(async (u) => u);

    const result = await service.create({
      email: 'test@example.com',
      password: 'plain',
    });

    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(roleRepo.findOne).toHaveBeenCalledWith({ where: { name: 'USER' } });
    expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
    expect(userRepo.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashed_password',
      role: { id: 1, name: 'USER' },
    });
    expect(userRepo.save).toHaveBeenCalled();

    expect(result.email).toBe('test@example.com');
    expect(result.password).toBe('hashed_password');
  });

  it('create: throws ConflictException when email already exists', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

    await expect(
      service.create({ email: 'test@example.com', password: 'plain' }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(roleRepo.findOne).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(userRepo.save).not.toHaveBeenCalled();
  });
});
