import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { API_VERSION } from '../helpers';
import { responseData } from '../interfaces';
import { RolesGuard } from '../roles.guard';
import { NotificationsService } from './notifications.service';

@Controller(`${API_VERSION}notifications`)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  @UseGuards(RolesGuard)
  async getMyNotifications(@Req() request: Request): Promise<responseData> {
    try {
      const user = request['guardUser'];
      const data = await this.notificationsService.getMyNotifications({
        userId: user.id,
      });
      return {
        status: 'success',
        message: 'All Supported Coins',
        data: data,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
