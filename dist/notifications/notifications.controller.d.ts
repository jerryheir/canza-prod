import { Request } from 'express';
import { responseData } from '../interfaces';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(request: Request): Promise<responseData>;
}
