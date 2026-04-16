import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { OngsService } from '../ongs/ongs.service';
import { JwtPayload } from './jwt.payload';
import { Role } from './role.enum';
 
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ongsService: OngsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
 
  async validateActor(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return { sub: user.id, email: user.email, role: Role.USER };
    }
 
    const ong = await this.ongsService.findByEmail(email);
    if (ong && (await bcrypt.compare(password, ong.passwordHash))) {
      return { sub: ong.id, email: ong.email, role: Role.ONG_ADMIN };
    }
 
    throw new UnauthorizedException('Credenciais inválidas.');
  }
 
  async login(actor: { sub: string; email: string; role: Role }) {
    const payload: JwtPayload = actor;
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: this.config.get('JWT_REFRESH_SECRET'),
      }),
    };
  }
 
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const newPayload: JwtPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return {
        accessToken: this.jwtService.sign(newPayload, {
          expiresIn: '15m',
          secret: this.config.get('JWT_SECRET'),
        }),
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }
}