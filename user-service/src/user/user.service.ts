// src/user/user.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Role, User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async updateUserRole(username: string, newRole: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    if (![Role.ADMIN, Role.EDITOR, Role.VIEWER].includes(newRole as Role)) {
      throw new Error('Invalid role');
    }
    user.role = newRole;
    return user;
  }

  async getUserByUserName(username: string) {
    return await this.usersRepository.findOne({ where: { username } });
  }
}
