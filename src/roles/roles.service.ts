import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleName } from './role.enum';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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
}
