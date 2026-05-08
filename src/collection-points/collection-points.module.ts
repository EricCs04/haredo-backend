import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionPoint } from './entities/collection-point.entity';
import { CollectionPointsService } from './collection-points.service';
import { CollectionPointsController } from './collection-points.controller';
import { Need } from '@/needs/entities/need.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionPoint, Need])],
  providers: [CollectionPointsService],
  controllers: [CollectionPointsController],
})
export class CollectionPointsModule {}