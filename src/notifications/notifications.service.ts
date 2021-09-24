import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { notificationData } from '../interfaces';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}

  async getMyNotifications(object: any): Promise<Notifications[]> {
    return await this.notificationsRepository.find(object);
  }

  async createNotifications(object: notificationData) {
    return await this.notificationsRepository.save(object);
  }
}
