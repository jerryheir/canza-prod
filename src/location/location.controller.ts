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
import { responseData } from '../interfaces';
import { RolesGuard } from '../roles.guard';
// import { UsersService } from '../users/users.service';
import { LocationCreateDto } from './dto/location.dto';
import { LocationService } from './location.service';

@Controller(`${API_VERSION}location`)
export class LocationController {
  constructor(
    // private readonly usersService: UsersService,
    private readonly locationService: LocationService,
  ) {}

  @Get('/:id')
  async getLocation(@Param('id') id: number): Promise<responseData> {
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
    try {
      const user = req['guardUser'];
      if (user && user.role > 2) {
        const result = await this.locationService.createLocation(locationDto);
        return {
          status: 'success',
          message: 'Location created successfully',
          data: result,
        };
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      console.log('/create', err);
      throw new InternalServerErrorException(err);
    }
  }

  @Put('/update/:locationId')
  @UseGuards(RolesGuard)
  async updateLocation(
    @Req() req,
    @Body() locationDto: LocationCreateDto,
    @Param('locationId') locationId: number,
  ) {
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
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
