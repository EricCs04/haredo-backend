import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  IsNumber,
} from 'class-validator';
 
export class CreateOngDto {
  @IsString()
  name!: string;
 
  @IsEmail()
  email!: string;
 
  @IsString()
  @MinLength(6)
  password!: string;
 
  @IsString()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ inválido. Formato esperado: XX.XXX.XXX/XXXX-XX',
  })
  cnpj!: string;
 
  @IsOptional()
  @IsString()
  description?: string;
 
  @IsOptional()
  @IsString()
  address?: string;
 
  @IsOptional()
  @IsString()
  phone?: string;
 
  @IsOptional()
  @IsNumber()
  latitude?: number;
 
  @IsOptional()
  @IsNumber()
  longitude?: number;
}