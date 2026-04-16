import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { Message } from './entities/message.entity';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { NeedsModule } from '../needs/needs.module';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Donation, Message]),
    NeedsModule,
  ],
  providers: [DonationsService],
  controllers: [DonationsController],
})
export class DonationsModule {}
