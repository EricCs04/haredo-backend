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
import { RequestWithUser } from '@/common/types/request-with-user';
import { CreateValidatorDto } from './dto/create-validator.dto';
import { Roles } from '@/auth/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Role } from '@/auth/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

 
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
  getProfile(@Request() req: RequestWithUser) {
    return this.ongsService.findById(req.user.sub);
  }

  @Post('/create-validator')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG_ADMIN)
  createValidator(
  @Body() dto: CreateValidatorDto,
  @Request() req: RequestWithUser,
) {
  return this.ongsService.createValidator(dto, req.user.sub);
}
}