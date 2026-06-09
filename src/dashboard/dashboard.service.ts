// dashboard.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Need } from '../needs/entities/need.entity';
import { Donation } from '../donations/entities/donation.entity';
import { NeedStatus } from '../needs/need-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,

    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
  ) {}

  async getKpis() {
    const [
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      fulfilledCampaigns,
      totalDonations,
    ] = await Promise.all([
      // total de campanhas
      this.needRepo.count(),

      // campanhas em andamento
      this.needRepo.count({
        where: { status: NeedStatus.IN_PROGRESS },
      }),

      // campanhas encerradas oficialmente
      this.needRepo.count({
        where: { status: NeedStatus.COMPLETED },
      }),

      // campanhas que atingiram a meta mas ainda estão abertas
      this.needRepo.count({
        where: { status: NeedStatus.FULFILLED },
      }),

      // total de doações no sistema
      this.donationRepo.count(),
    ]);

    const completionRate =
      totalCampaigns === 0
        ? 0
        : (completedCampaigns / totalCampaigns) * 100;

    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      fulfilledCampaigns, // KPI separado (importante para negócio)
      totalDonations,
      completionRate: Number(completionRate.toFixed(2)),
    };
  }
}