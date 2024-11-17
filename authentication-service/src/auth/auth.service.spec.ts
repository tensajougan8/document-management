import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

jest.mock('bcryptjs');
jest.mock('uuid', () => ({ v4: jest.fn().mockReturnValue('mock-uuid') }));

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    id: 'mock-uuid',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'ADMIN',
  };

  const mockCreateUserDto = {
    email: 'test@example.com',
    username: 'testuser',
    role: 'ADMIN',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      usersRepository.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
      const result = await authService.register(mockCreateUserDto);
      expect(usersRepository.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        username: mockCreateUserDto.username,
        email: mockCreateUserDto.email,
        password: 'hashedpassword',
        role: mockCreateUserDto.role,
      });
      expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      usersRepository.findOneBy = jest.fn().mockResolvedValueOnce(mockUser);

    
      try {
        await authService.register(mockCreateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User Email already exists');
      }
    });

    it('should throw ConflictException if username already exists', async () => {
      usersRepository.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);
      try {
        await authService.register(mockCreateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User Email already exists');
      }
    });
  });

   describe('login', () => {
     it('should successfully log in with valid credentials', async () => {
       usersRepository.findOne = jest.fn().mockResolvedValue(mockUser);
       bcrypt.compare = jest.fn().mockResolvedValue(true);
       const result = await authService.login(
         mockCreateUserDto.username,
         mockCreateUserDto.password,
       );
       expect(jwtService.sign).toHaveBeenCalledWith({
         userId: 'mock-uuid',
         username: mockCreateUserDto.username,
         roles: mockCreateUserDto.role,
       });
       expect(result).toEqual({ access_token: 'mock-token' });
     });

     it('should throw BadRequestException if credentials are invalid', async () => {
       usersRepository.findOneBy = jest.fn().mockResolvedValue(null);
       try {
         await authService.login(
           mockCreateUserDto.username,
           mockCreateUserDto.password,
         );
       } catch (e) {
         expect(e).toBeInstanceOf(BadRequestException);
         expect(e.message).toBe('Invalid credentials');
       }
     });

     it('should throw BadRequestException if password is incorrect', async () => {
       usersRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
       bcrypt.compare = jest.fn().mockResolvedValue(false);
       try {
         await authService.login(
           mockCreateUserDto.username,
           mockCreateUserDto.password,
         );
       } catch (e) {
         expect(e).toBeInstanceOf(BadRequestException);
         expect(e.message).toBe('Invalid credentials');
       }
     });
   });
});

