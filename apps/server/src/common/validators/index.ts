/**
 * 自定义验证器
 * 可在此添加业务特定的验证规则
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * 验证密码强度
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (typeof value !== 'string') return false;
          // 至少包含一个大写字母、一个小写字母和一个数字
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          return hasUpperCase && hasLowerCase && hasNumber;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 必须包含至少一个大写字母、一个小写字母和一个数字`;
        },
      },
    });
  };
}
