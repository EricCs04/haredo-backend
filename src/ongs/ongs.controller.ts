import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OngsService } from './ongs.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
 
@Controller('ongs')
export class OngsController {
  constructor(private readonly ongsService: OngsService) {}
 
  @Post('register')
  register(@Body() dto: CreateOngDto) {
    return this.ongsService.create(dto);
  }
 
  @Get()
  findAll() {
    return this.ongsService.findAll();
  }
 
  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
  ) {
    return this.ongsService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius) || 10,
    );
  }
 
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.ongsService.findById(req.user.sub);
  }
}