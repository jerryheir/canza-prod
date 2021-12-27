import { Repository } from 'typeorm';
import { LocationCreateDto } from './dto/location.dto';
import { Location } from './location.entity';
export declare class LocationService {
    private readonly locationRepository;
    constructor(locationRepository: Repository<Location>);
    createLocation(locationDto: LocationCreateDto): Promise<LocationCreateDto & Location>;
    findAll(): Promise<Location[]>;
    findOne(object: any): Promise<Location>;
    updateLocation(i: any, object: LocationCreateDto): Promise<import("typeorm").UpdateResult>;
}
