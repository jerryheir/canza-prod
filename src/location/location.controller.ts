import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { API_VERSION } from '../helpers';
import { responseData } from 'src/interfaces';
import { RolesGuard } from 'src/roles.guard';
import { UsersService } from 'src/users/users.service';
import { LocationCreateDto } from './dto/location.dto';
import { LocationService } from './location.service';

@Controller(`${API_VERSION}location`)
export class LocationController {
  constructor(
    private readonly usersService: UsersService,
    private locationService: LocationService,
  ) {}

  @Get('/:id')
  async getLocation(@Param() id: number): Promise<responseData> {
    try {
      const result = this.locationService.findOne({ id });
      return {
        status: 'success',
        message: 'Location retrieved successfully',
        data: result,
      };
    } catch (err: any) {
      throw new InternalServerErrorException();
    }
  }

  @Get('')
  async getAllLocations(): Promise<responseData> {
    try {
      const result = await this.locationService.findAll();
      return {
        status: 'success',
        message: 'Locations retrieved successfully',
        data: result,
      };
    } catch (err: any) {
      throw new InternalServerErrorException();
    }
  }

  @Post('/create')
  @UseGuards(RolesGuard)
  async createLocation(@Req() req, @Body() locationDto: LocationCreateDto) {
    console.log('REQUEST', req);
    try {
      const result = await this.locationService.createLocation(locationDto);
      return {
        status: 'success',
        message: 'Location created successfully',
        data: result,
      };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  @Put('/update/:id')
  @UseGuards(RolesGuard)
  async updateLocation(
    @Req() req,
    @Body() locationDto: LocationCreateDto,
    @Param() locationId: number,
  ) {
    console.log('REQUEST', req);
    try {
      const result = await this.locationService.updateLocation(
        { id: locationId },
        locationDto,
      );
      return {
        status: 'success',
        message: 'Location updated successfully',
        data: result,
      };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
