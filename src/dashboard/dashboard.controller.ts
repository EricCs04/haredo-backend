// dashboard.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardKpiDto } from './dto/dashboard-kpi.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'KPIs públicos do sistema' })
  async getKpis(): Promise<DashboardKpiDto> {
    return this.dashboardService.getKpis();
  }
}