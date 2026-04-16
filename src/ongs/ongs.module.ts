import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ong } from './entities/ong.entity';
import { OngsService } from './ongs.service';
import { OngsController } from './ongs.controller';
 
@Module({
  imports: [TypeOrmModule.forFeature([Ong])],
  providers: [OngsService],
  controllers: [OngsController],
  exports: [OngsService],
})
export class OngsModule {}
 