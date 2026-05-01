import { IsString, IsNumber } from 'class-validator';

export class CreateCollectionPointDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}