import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Need } from './entities/need.entity';
import { NeedStatus } from './need-status.enum';
import { CreateNeedDto, UpdateNeedStatusDto } from './dto/need.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Donation } from '../donations/entities/donation.entity';

 
@Injectable()
export class NeedsService {
  constructor(
    @InjectRepository(Need)
    private readonly needsRepo: Repository<Need>,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
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
      [NeedStatus.COMPLETED]:   [],
      [NeedStatus.CANCELLED]:   [],
    };
    return map[current];
  }

  async completeNeed(
  needId: string,
  ongId: string,
  message: string,
  images: string[],
): Promise<Need> {
  const need = await this.findOne(needId);

  if (need.ong.id !== ongId) {
    throw new ForbiddenException();
  }

  if (need.status === NeedStatus.COMPLETED) {
    throw new BadRequestException('Campanha já finalizada');
  }

  need.status = NeedStatus.COMPLETED;
  need.completionMessage = message;
  need.images = images;

  await this.needsRepo.save(need);

  await this.notifyDonors(need.id);

  return need;

}
async notifyDonors(needId: string): Promise<void> {
  const donations = await this.dataSource
    .getRepository(Donation)
    .find({
      where: { need: { id: needId }, confirmed: true, },
      relations: ['user'],
    });

  const uniqueUsers = new Map<string, any>();

  for (const d of donations) {
    if (d.user?.id) {
      uniqueUsers.set(d.user.id, d.user);
    }
  }

  for (const user of uniqueUsers.values()) {
    await this.notificationsService.notifyUser(
      user.email,
      'A campanha que você ajudou foi finalizada! 🎉',
    );
  }
}


}