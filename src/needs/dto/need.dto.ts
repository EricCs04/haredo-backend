import { IsString, IsInt, IsOptional, IsEnum, Min } from 'class-validator';
import { NeedStatus } from '../need-status.enum';
import { ApiProperty } from '@nestjs/swagger';
 
export class CreateNeedDto {
  @ApiProperty()
  @IsString()
  title: string;
 
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
 
  @ApiProperty()
  @IsString()
  category: string;
 
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantityNeeded: number;
}
 
export class UpdateNeedStatusDto {
  @IsEnum(NeedStatus)
  status: NeedStatus;
}