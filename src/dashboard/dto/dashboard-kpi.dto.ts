// dashboard/dto/dashboard-kpi.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class DashboardKpiDto {
  @ApiProperty()
  totalCampaigns!: number;

  @ApiProperty()
  activeCampaigns!: number;

  @ApiProperty()
  completedCampaigns!: number;

  @ApiProperty()
  fulfilledCampaigns!: number;

  @ApiProperty()
  totalDonations!: number;

  @ApiProperty()
  completionRate!: number; // %

}