import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidRole } from '../validations/validation';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  @IsValidRole({
    message: 'Invalid role. Allowed roles are: ADMIN, EDITOR, VIEWER',
  })
  role: string;
}
