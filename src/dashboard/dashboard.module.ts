// src/dashboard/dashboard.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { Need } from '../needs/entities/need.entity';
import { Donation } from '../donations/entities/donation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Need, Donation])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}