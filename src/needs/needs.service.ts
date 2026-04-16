import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Need } from './entities/need.entity';
import { NeedStatus } from './need-status.enum';
import { CreateNeedDto, UpdateNeedStatusDto } from './dto/need.dto';
 
@Injectable()
export class NeedsService {
  constructor(
    @InjectRepository(Need)
    private readonly needsRepo: Repository<Need>,
  ) {}
 
  async create(dto: CreateNeedDto, ongId: string): Promise<Need> {
    const need = this.needsRepo.create({
      ...dto,
      quantityReceived: 0,
      status: NeedStatus.OPEN,
      ong: { id: ongId },
    });
    return this.needsRepo.save(need);
  }
 
  async findAll(ongId?: string): Promise<Need[]> {
    const where = ongId ? { ong: { id: ongId } } : {};
    return this.needsRepo.find({ where, relations: ['ong'] });
  }
 
  async findOne(id: string): Promise<Need> {
    const need = await this.needsRepo.findOne({ where: { id }, relations: ['ong'] });
    if (!need) throw new NotFoundException('Necessidade não encontrada.');
    return need;
  }
 
  // Chamado pelo DonationsService ao registrar uma doação
  async onDonationAdded(needId: string, quantity: number): Promise<void> {
    const need = await this.needsRepo.findOneOrFail({ where: { id: needId } });
 
    need.quantityReceived = (need.quantityReceived || 0) + quantity;
 
    if (need.quantityReceived >= need.quantityNeeded) {
      need.status = NeedStatus.FULFILLED;
    } else if (need.quantityReceived > 0) {
      need.status = NeedStatus.IN_PROGRESS;
    }
 
    await this.needsRepo.save(need);
  }
 
  // Ação manual da ONG (cancelar ou reabrir)
  async updateStatus(
    needId: string,
    ongId: string,
    dto: UpdateNeedStatusDto,
  ): Promise<Need> {
    const need = await this.findOne(needId);
 
    if (need.ong.id !== ongId) {
      throw new ForbiddenException('Apenas a ONG responsável pode alterar esta necessidade.');
    }
 
    const allowed = this.getAllowedTransitions(need.status);
    if (!allowed.includes(dto.status)) {
      throw new ForbiddenException(
        `Transição inválida: ${need.status} → ${dto.status}`,
      );
    }
 
    need.status = dto.status;
    return this.needsRepo.save(need);
  }
 
  private getAllowedTransitions(current: NeedStatus): NeedStatus[] {
    const map: Record<NeedStatus, NeedStatus[]> = {
      [NeedStatus.OPEN]:        [NeedStatus.CANCELLED],
      [NeedStatus.IN_PROGRESS]: [NeedStatus.CANCELLED],
      [NeedStatus.FULFILLED]:   [NeedStatus.OPEN],
      [NeedStatus.CANCELLED]:   [],
    };
    return map[current];
  }
}