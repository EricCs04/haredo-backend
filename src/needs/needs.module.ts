import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Need } from './entities/need.entity';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';
 
@Module({
  imports: [TypeOrmModule.forFeature([Need])],
  providers: [NeedsService],
  controllers: [NeedsController],
  exports: [NeedsService],
})
export class NeedsModule {}
