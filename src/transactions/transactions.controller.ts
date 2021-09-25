import { Controller, Get, InternalServerErrorException, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../roles.guard';
import { API_VERSION } from '../helpers';
import { TransactionsService } from './transactions.service';
import { responseData } from '../interfaces';
import { Request } from 'express';

@Controller(`${API_VERSION}transactions`)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('me')
  @UseGuards(RolesGuard)
  async getIssue(@Req() request: Request): Promise<responseData> {
    try {
      const user = request['guardUser'];
      const data = await this.transactionsService.getMyTransactions({
        userId: user.id,
      });
      return {
        status: 'success',
        message: `Transactions fetched successfully`,
        data: data,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
