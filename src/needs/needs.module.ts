import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Need } from './entities/need.entity';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';
import { NotificationsModule } from '../notifications/notifications.module';
 
@Module({
  imports: [TypeOrmModule.forFeature([Need]),NotificationsModule],
  providers: [NeedsService],
  controllers: [NeedsController],
  exports: [NeedsService],
  
})
export class NeedsModule {}
