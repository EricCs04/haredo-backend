import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
 
type SafeUser = Omit<User, 'passwordHash'>;
 
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}
 
  async create(dto: CreateUserDto): Promise<SafeUser> {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('E-mail já cadastrado.');
 
    const passwordHash = await bcrypt.hash(dto.password, 10);
 
    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
      address: dto.address,
    });
 
    
    if (dto.latitude && dto.longitude) {
      await this.usersRepo
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          ...user,
          location: () =>
            `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
        })
        .execute();
 
      const saved = await this.usersRepo.findOneOrFail({ where: { email: dto.email } });
      const { passwordHash: _, ...result } = saved;
      return result;
    }
 
    const saved = await this.usersRepo.save(user);
    const { passwordHash: _, ...result } = saved;
    return result;
  }
 
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }
 
  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) return null;
    const { passwordHash: _, ...result } = user;
    return result;
  }
}