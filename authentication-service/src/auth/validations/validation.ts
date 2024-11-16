import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Role } from '../entities/user.entity';

export function IsValidRole(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsRoleValidator,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsRoleValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    const allowedRoles = [Role.ADMIN, Role.EDITOR, Role.VIEWER];
    return allowedRoles.includes(value as Role);
  }
}
