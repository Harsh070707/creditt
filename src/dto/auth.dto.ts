import { Type } from '@nestjs/common';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DtoErrorMessage } from 'src/utils/constant';
import { PartialType } from '@nestjs/mapped-types';

export class RegistrationDto {
  @IsNotEmpty({ message: DtoErrorMessage.empty_name })
  @MaxLength(50, {
    message: DtoErrorMessage.name,
  })
  name: string;

  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsNotEmpty({ message: DtoErrorMessage.empty_email })
  @IsEmail({}, { message: DtoErrorMessage.invalid_email })
  email: string;

  @IsNotEmpty({ message: DtoErrorMessage.empty_password })
  @MinLength(8, {
    message: DtoErrorMessage.confirm_charac_validation,
  })
  @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/, {
    message: DtoErrorMessage.password,
  })
  password: string;

  @IsNotEmpty({ message: DtoErrorMessage.empty_confirm_password })
  @MinLength(8, {
    message: DtoErrorMessage.charac_validation,
  })
  @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/, {
    message: DtoErrorMessage.confirm_password,
  })
  confirm_password: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  hobbies: string;
}

export class EditRegistrationDto extends PartialType(RegistrationDto) {}

export class LoginRegisteredUserDto extends PartialType(RegistrationDto) {}
