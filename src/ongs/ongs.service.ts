import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Ong } from './entities/ong.entity';
import { CreateOngDto } from './dto/create-ong.dto';
 
@Injectable()
export class OngsService {
  constructor(
    @InjectRepository(Ong)
    private readonly ongsRepo: Repository<Ong>,
  ) {}
 
  async create(dto: CreateOngDto): Promise<Omit<Ong, 'passwordHash'>> {
  const emailExists = await this.ongsRepo.findOne({ where: { email: dto.email } });
  if (emailExists) throw new ConflictException('E-mail já cadastrado.');

  const cnpjExists = await this.ongsRepo.findOne({ where: { cnpj: dto.cnpj } });
  if (cnpjExists) throw new ConflictException('CNPJ já cadastrado.');

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const ong = this.ongsRepo.create({
    name: dto.name,
    email: dto.email,
    passwordHash,
    cnpj: dto.cnpj,
    description: dto.description,
    address: dto.address,
    phone: dto.phone,
  });

  // location precisa ser inserido via query raw — não funciona dentro do create()
  if (dto.latitude && dto.longitude) {
    await this.ongsRepo
      .createQueryBuilder()
      .insert()
      .into(Ong)
      .values({
        ...ong,
        location: () =>
          `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
      })
      .execute();

    const saved = await this.ongsRepo.findOneOrFail({ where: { email: dto.email } });
    const { passwordHash: _, ...result } = saved;
    return result;
  }

  const saved = await this.ongsRepo.save(ong);
  const { passwordHash: _, ...result } = saved;
  return result;
}
 
  async findByEmail(email: string): Promise<Ong | null> {
    return this.ongsRepo.findOne({ where: { email } });
  }
 
  async findById(id: string): Promise<Ong | null> {
    return this.ongsRepo.findOne({ where: { id } });
  }
 
  async findAll(): Promise<Omit<Ong, 'passwordHash'>[]> {
    const ongs = await this.ongsRepo.find();
    return ongs.map(({ passwordHash: _, ...ong }) => ong);
  }
 
  // Busca ONGs próximas a um ponto geográfico (PostGIS)
  async findNearby(lat: number, lng: number, radiusKm: number) {
    return this.ongsRepo
      .createQueryBuilder('ong')
      .where(
        `ST_DWithin(
          ong.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`,
        { lat, lng, radius: radiusKm * 1000 },
      )
      .select([
        'ong.id',
        'ong.name',
        'ong.email',
        'ong.address',
        'ong.description',
        'ong.phone',
      ])
      .getMany();
  }
}