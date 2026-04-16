import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import {
  CreateDonationDto,
  UpdateDonationStatusDto,
  CreateMessageDto,
} from './dto/donation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
 
@ApiBearerAuth('access-token')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}
 
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  create(@Body() dto: CreateDonationDto, @Request() req) {
    console.log('REQ USER:', req.user);
    return this.donationsService.create(dto, req.user.sub);
  }
 
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyDonations(@Request() req) {
    if (req.user.role === Role.USER) {
      return this.donationsService.findByUser(req.user.sub);
    }
    return this.donationsService.findByOng(req.user.sub);
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne(id);
  }
 
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG_ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDonationStatusDto,
    @Request() req,
  ) {
    return this.donationsService.updateStatus(id, req.user.sub, dto);
  }
 
  @Post(':id/messages')
  @UseGuards(JwtAuthGuard)
  addMessage(
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
    @Request() req,
  ) {
    return this.donationsService.addMessage(id, req.user.sub, req.user.role, dto);
  }
 
  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  getMessages(@Param('id') id: string) {
    return this.donationsService.getMessages(id);
  }
}
