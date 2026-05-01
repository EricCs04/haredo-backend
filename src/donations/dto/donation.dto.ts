import { IsUUID, IsInt, IsEnum, IsString, Min } from 'class-validator';
import { DonationStatus } from '../donation-status.enum';
 
export class CreateDonationDto {
  @IsUUID()
  needId!: string;
 
  @IsInt()
  @Min(1)
  quantity!: number;
}
 
export class UpdateDonationStatusDto {
  @IsEnum(DonationStatus)
  status!: DonationStatus;
}
 
export class CreateMessageDto {
  @IsString()
  content!: string;
}
export class ConfirmDonationDto {
  @IsString()
  code!: string;
}