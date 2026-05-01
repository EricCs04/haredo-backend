import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RefreshTokenDto, LoginDto } from './dto/auth.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '@/common/types/request-with-user';
 
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
 
  @ApiBody({ type: LoginDto })  
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
 
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}