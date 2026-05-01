import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class CompleteNeedDto {
  @ApiProperty()
  @IsString()
  message!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  images!: string[];
}