import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    return this.authService.login(credentials.username, credentials.password);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() credentials: CreateUserDto) {
    try {
      return await this.authService.register(credentials);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
