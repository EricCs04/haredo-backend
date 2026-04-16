import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NeedsService } from './needs.service';
import { CreateNeedDto, UpdateNeedStatusDto } from './dto/need.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
 
@ApiTags('Needs')
@ApiBearerAuth()
@Controller('needs')
export class NeedsController {
  constructor(private readonly needsService: NeedsService) {}
 
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG_ADMIN)
  create(@Body() dto: CreateNeedDto, @Request() req) {
    return this.needsService.create(dto, req.user.sub);
  }
 
  @Get()
  findAll(@Query('ongId') ongId?: string) {
    return this.needsService.findAll(ongId);
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.needsService.findOne(id);
  }
 
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG_ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateNeedStatusDto,
    @Request() req,
  ) {
    return this.needsService.updateStatus(id, req.user.sub, dto);
  }
}
