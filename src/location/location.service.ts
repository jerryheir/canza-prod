import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationCreateDto } from './dto/location.dto';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async createLocation(locationDto: LocationCreateDto) {
    return await this.locationRepository.save(locationDto);
  }

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find();
  }

  async findOne(object: any): Promise<Location> {
    return await this.locationRepository.findOne(object);
  }

  async updateLocation(i: any, object: LocationCreateDto) {
    return await this.locationRepository.update(i, object);
  }
}
