// src/auth/auth.service.ts
import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(ConfigService) private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
       const user = await this.usersRepository.findOne({ where: { username } });
       if (user && (await bcrypt.compare(password, user.password))) {
         return user;
       }
       return null;
  }

  async register(user: CreateUserDto) {
    const existingUserEmail = await this.usersRepository.findOneBy({email : user.email
    });
    console.log(existingUserEmail);
    if (existingUserEmail) {
      throw new ConflictException('User Email already exists');
    }

    const existingUsername = await this.usersRepository.findOneBy({
      username: user.username,
    });

    if (existingUsername) {
      throw new ConflictException('User Email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const username = user.username;
    const role = user.role;
    const email = user.email;
    const id = uuidv4()
    const newUser = this.usersRepository.create({
      id,
      username,
      email,
      password: hashedPassword,
      role,
    });
    return this.usersRepository.save(newUser);
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = { userId:user.id, username: user.username, roles: user.role };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
