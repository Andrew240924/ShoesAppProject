import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './role.entity';
import { RolesGuard } from './roles.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UsersModule],
  controllers: [RolesController],
  providers: [RolesService, RolesGuard],
  exports: [RolesGuard, TypeOrmModule],
})
export class RolesModule {}
