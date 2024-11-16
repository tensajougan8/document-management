import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async getCurrentUser(req: Request) {
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ')[1];

    const decodedToken = this.jwtService.decode(bearerToken);
    const username = decodedToken['username']; 

    return username;
  }
}