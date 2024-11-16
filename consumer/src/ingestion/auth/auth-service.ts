
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getCurrentUser(req: Request) {
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ')[1];

    const decodedToken = this.jwtService.decode(bearerToken);
    const username = decodedToken['username'];

    return username as string;
  }
}
