import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsValidRole } from '../validations/validation';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  @IsValidRole({
    message: 'Invalid role. Allowed roles are: ADMIN, EDITOR, VIEWER',
  })
  role: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
