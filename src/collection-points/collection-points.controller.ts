import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CollectionPointsService } from './collection-points.service';
import { CreateCollectionPointDto } from './dto/create-collection-point.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RequestWithUser } from '@/common/types/request-with-user';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';

@ApiBearerAuth('access-token')
@Controller('collection-points')
export class CollectionPointsController {
  constructor(private readonly service: CollectionPointsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG_ADMIN)
  create(@Body() dto: CreateCollectionPointDto, @Request() req: RequestWithUser) {
    return this.service.create(dto, req.user.sub);
  }

  @Get('nearby')
  findNearby(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.service.findNearby(Number(lat), Number(lng));
  }
}