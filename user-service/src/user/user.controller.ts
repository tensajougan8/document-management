import { Controller, Get, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './entities/user.entity';
import { response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Patch('update-role/:username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
 async updateUserRole(
    @Param('username') username: string,
    @Body('role') newRole: string,
  ) {
    return await this.userService.updateUserRole(username, newRole);
  }

  @Get('/:username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUserByUsername(@Param('username') username: string) {
    const reponse = await this.userService.getUserByUserName(username);
    return reponse; 
  }
}
