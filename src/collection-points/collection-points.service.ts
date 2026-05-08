import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CollectionPoint } from './entities/collection-point.entity';
import { CreateCollectionPointDto } from './dto/create-collection-point.dto';
import { Need } from '../needs/entities/need.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CollectionPointsService {
  constructor(
    @InjectRepository(CollectionPoint)
    private readonly repo: Repository<CollectionPoint>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCollectionPointDto, ongId: string): Promise<CollectionPoint> {
    const point = this.repo.create({
      name: dto.name,
      address: dto.address,
      location: {
        type: 'Point',
        coordinates: [dto.lng, dto.lat],
      },
      ong: { id: ongId } as any,
    });

    return this.repo.save(point);
  }

  async findNearby(lat: number, lng: number): Promise<CollectionPoint[]> {
    return this.repo.query(
      `
      SELECT *, 
      ST_Distance(location, ST_MakePoint($1, $2)::geography) as distance
      FROM collection_point
      ORDER BY distance ASC
      LIMIT 5
    `,
      [lng, lat],
    );
  }
  async findByNeed(needId: string) {
  const need = await this.dataSource.getRepository(Need).findOne({
    where: { id: needId },
    relations: ['ong'],
  });

  if (!need) {
    throw new NotFoundException('Need não encontrado');
  }

  return this.repo.find({
    where: { ong: { id: need.ong.id } },
  });
}
}