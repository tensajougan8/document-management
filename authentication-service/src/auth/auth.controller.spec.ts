import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { ConflictException } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token when login is successful', async () => {
      const mockCredentials = { username: 'testuser', password: 'password123' };
      const mockToken = 'jwt-token';
      mockAuthService.login.mockResolvedValue(mockToken);
      const result = await authController.login(mockCredentials);
      expect(result).toBe(mockToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        mockCredentials.username,
        mockCredentials.password,
      );
    });

    it('should throw an error if login fails', async () => {
      const mockCredentials = {
        username: 'wronguser',
        password: 'wrongpassword',
      };
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));
      try {
        await authController.login(mockCredentials);
      } catch (e) {
        expect(e.message).toBe('Invalid credentials');
      }
    });
  });

  describe('register', () => {
    it('should successfully register a user with valid input', async () => {
      const mockCreateUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        role: 'ADMIN',
        password: 'password123',
      };
      const mockResponse = { id: 1, ...mockCreateUserDto };
      mockAuthService.register.mockResolvedValue(mockResponse);
      const result = await authController.register(mockCreateUserDto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should throw ConflictException if registration fails', async () => {
      const mockCreateUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        role: 'ADMIN',
        password: 'password123',
      };
      mockAuthService.register.mockRejectedValue(
        new ConflictException('User already exists'),
      );
      try {
        await authController.register(mockCreateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User already exists');
      }
    });
  });
});