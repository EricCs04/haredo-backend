import {
  IsEmail,
  IsString,
  MinLength
} from 'class-validator';

export class CreateValidatorDto {

  @IsString()
  name!:string;

  @IsEmail()
  email!:string;

  @MinLength(6)
  password!:string;

  @IsString()
  phone!:string;

}