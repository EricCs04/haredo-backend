import { Role } from './role.enum';

export interface JwtPayload {
  sub: string;        // id do usuário ou ONG
  email: string;
  role: Role;
}