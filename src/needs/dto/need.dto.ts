import { IsString, IsInt, IsOptional, IsEnum, Min, IsDateString } from 'class-validator';
import { NeedStatus } from '../need-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { NeedPriority } from '../need-priority.enum';
 
export class CreateNeedDto {
  @ApiProperty()
  @IsString()
  title!: string;
 
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
 
  @ApiProperty()
  @IsString()
  category!: string;
 
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantityNeeded!: number;

  @ApiProperty()
  @IsEnum(NeedPriority)
  priority!: NeedPriority;

  @ApiProperty()
  @IsDateString()
  deadline!: string;
}
 
export class UpdateNeedStatusDto {
  @IsEnum(NeedStatus)
  status!: NeedStatus;
}