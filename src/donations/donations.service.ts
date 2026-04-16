import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Donation } from './entities/donation.entity';
import { Message } from './entities/message.entity';
import { NeedsService } from '../needs/needs.service';
import { NeedStatus } from '../needs/need-status.enum';
import { DonationStatus } from './donation-status.enum';
import { Role } from '../auth/role.enum';
import {
  CreateDonationDto,
  UpdateDonationStatusDto,
  CreateMessageDto,
} from './dto/donation.dto';
 
@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationsRepo: Repository<Donation>,
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    private readonly needsService: NeedsService,
    private readonly dataSource: DataSource,
  ) {}
 
  // Criação atômica: persiste doação e atualiza quantityReceived na mesma transação
  async create(dto: CreateDonationDto, userId: string): Promise<Donation> {
    const need = await this.needsService.findOne(dto.needId);
 
    if (need.status === NeedStatus.FULFILLED || need.status === NeedStatus.CANCELLED) {
      throw new BadRequestException(
        `Não é possível doar para uma necessidade com status "${need.status}".`,
      );
    }
 
    return this.dataSource.transaction(async (manager) => {
      const donation = manager.create(Donation, {
        user: { id: userId },
        need: { id: need.id },
        ong: { id: need.ong.id },
        quantity: dto.quantity,
        status: DonationStatus.PENDING,
      });
 
      const saved = await manager.save(Donation, donation);
 
      // Atualiza quantityReceived e status da necessidade na mesma transação
      need.quantityReceived = (need.quantityReceived || 0) + dto.quantity;
      if (need.quantityReceived >= need.quantityNeeded) {
        need.status = NeedStatus.FULFILLED;
      } else if (need.quantityReceived > 0) {
        need.status = NeedStatus.IN_PROGRESS;
      }
      await manager.save(need);
 
      return saved;
    });
  }
 
  async findByUser(userId: string): Promise<Donation[]> {
    return this.donationsRepo.find({
      where: { user: { id: userId } },
      relations: ['need', 'ong'],
      order: { createdAt: 'DESC' },
    });
  }
 
  async findByOng(ongId: string): Promise<Donation[]> {
    return this.donationsRepo.find({
      where: { ong: { id: ongId } },
      relations: ['need', 'user'],
      order: { createdAt: 'DESC' },
    });
  }
 
  async findOne(id: string): Promise<Donation> {
    const donation = await this.donationsRepo.findOne({
      where: { id },
      relations: ['need', 'ong', 'user', 'messages'],
    });
    if (!donation) throw new NotFoundException('Doação não encontrada.');
    return donation;
  }
 
  // ONG atualiza o status da doação (ex: in_progress → completed)
  async updateStatus(
    donationId: string,
    ongId: string,
    dto: UpdateDonationStatusDto,
  ): Promise<Donation> {
    const donation = await this.findOne(donationId);
 
    if (donation.ong.id !== ongId) {
      throw new ForbiddenException('Apenas a ONG responsável pode atualizar esta doação.');
    }
 
    const allowed = this.getAllowedTransitions(donation.status);
    if (!allowed.includes(dto.status)) {
      throw new ForbiddenException(
        `Transição inválida: ${donation.status} → ${dto.status}`,
      );
    }
 
    donation.status = dto.status;
    return this.donationsRepo.save(donation);
  }
 
  // Chat: adiciona mensagem à doação
  async addMessage(
    donationId: string,
    senderId: string,
    role: Role,
    dto: CreateMessageDto,
  ): Promise<Message> {
    const donation = await this.findOne(donationId);
 
    const isParticipant =
      (role === Role.USER && donation.user?.id === senderId) ||
      (role === Role.ONG_ADMIN && donation.ong?.id === senderId);
 
    if (!isParticipant) {
      throw new ForbiddenException('Você não participa desta doação.');
    }
 
    const message = this.messagesRepo.create({
      donation: { id: donationId },
      senderId,
      senderType: role === Role.USER ? 'user' : 'ong',
      content: dto.content,
    });
 
    return this.messagesRepo.save(message);
  }
 
  async getMessages(donationId: string): Promise<Message[]> {
    return this.messagesRepo.find({
      where: { donation: { id: donationId } },
      order: { sentAt: 'ASC' },
    });
  }
 
  private getAllowedTransitions(current: DonationStatus): DonationStatus[] {
    const map: Record<DonationStatus, DonationStatus[]> = {
      [DonationStatus.PENDING]:     [DonationStatus.IN_PROGRESS, DonationStatus.CANCELLED],
      [DonationStatus.IN_PROGRESS]: [DonationStatus.COMPLETED, DonationStatus.CANCELLED],
      [DonationStatus.COMPLETED]:   [],
      [DonationStatus.CANCELLED]:   [],
    };
    return map[current];
  }
}