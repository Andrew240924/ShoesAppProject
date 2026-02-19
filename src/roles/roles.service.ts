import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleName } from './role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const roles = Object.values(RoleName);

    for (const roleName of roles) {
      const existing = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (!existing) {
        await this.roleRepository.save({ name: roleName });
      }
    }
  }

  async assignRole(userId: number, roleName: RoleName) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.usersService.updateUserRole(userId, role);
  }
}
