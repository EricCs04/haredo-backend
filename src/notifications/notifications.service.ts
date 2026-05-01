import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async notifyUser(email: string, message: string): Promise<void> {
    
    console.log(`📢 Notificação para ${email}: ${message}`);
  }
}