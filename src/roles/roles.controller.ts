import { Controller, Post, Param, ParseIntPipe, UseGuards, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { RoleName } from './role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  assignRole(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('role') roleName: RoleName,
  ) {
    return this.rolesService.assignRole(userId, roleName);
  }
}
