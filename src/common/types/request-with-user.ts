import { Request } from 'express';
import { JwtPayload } from '@/auth/jwt.payload';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}