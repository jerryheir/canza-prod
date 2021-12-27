import { notificationData } from '../interfaces';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';
export declare class NotificationsService {
    private readonly notificationsRepository;
    constructor(notificationsRepository: Repository<Notifications>);
    getMyNotifications(object: any): Promise<Notifications[]>;
    createNotifications(object: notificationData): Promise<notificationData & Notifications>;
}
