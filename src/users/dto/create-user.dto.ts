import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';
 
export class CreateUserDto {
  @IsString()
  name: string;
 
  @IsEmail()
  email: string;
 
  @IsString()
  @MinLength(6)
  password: string;
 
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;
 
  @IsOptional()
  @IsString()
  address?: string;
 
  @IsOptional()
  @IsNumber()
  latitude?: number;
 
  @IsOptional()
  @IsNumber()
  longitude?: number;
}