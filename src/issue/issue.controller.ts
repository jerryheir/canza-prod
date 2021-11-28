import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Get,
  Put,
  Req,
  UseGuards,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { API_VERSION } from '../helpers';
import { responseData } from '../interfaces';
import { RolesGuard } from '../roles.guard';
import { IssueDto } from './dto/issue.dto';
import { IssueService } from './issue.service';
import { Request } from 'express';

@Controller(`${API_VERSION}issue`)
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post('')
  @UseGuards(RolesGuard)
  async sendCoin(
    @Req() request: Request,
    @Body() issueDto: IssueDto,
  ): Promise<responseData> {
    try {
      const user = request['guardUser'];
      await this.issueService.createIssue({
        userId: user.id,
        ...issueDto,
      });
      return {
        status: 'success',
        message: `Issue created successfully`,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  async updateIssue(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() issueDto: any,
  ): Promise<responseData> {
    try {
      const user = request['guardUser'];
      await this.issueService.updateIssue(
        {
          id: id,
          userId: user.id,
        },
        {
          ...issueDto,
        },
      );
      return {
        status: 'success',
        message: `Issue updated successfully`,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Get('me')
  @UseGuards(RolesGuard)
  async getIssue(@Req() request: Request): Promise<responseData> {
    try {
      const user = request['guardUser'];
      const data = await this.issueService.getMyIssue({
        userId: user.id,
      });
      return {
        status: 'success',
        message: `Issues fetched successfully`,
        data: data,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Get('all')
  @UseGuards(RolesGuard)
  async getAllIssue(@Req() request: Request): Promise<responseData> {
    try {
      const user = request['guardUser'];
      if (user && user.role > 2) {
        const data = await this.issueService.getAllIssue();
        return {
          status: 'success',
          message: `All Issues fetched successfully`,
          data: data,
        };
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }
}
