import { responseData } from '../interfaces';
import { LocationCreateDto } from './dto/location.dto';
import { LocationService } from './location.service';
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    getLocation(id: number): Promise<responseData>;
    getAllLocations(): Promise<responseData>;
    createLocation(req: any, locationDto: LocationCreateDto): Promise<{
        status: string;
        message: string;
        data: LocationCreateDto & import("./location.entity").Location;
    }>;
    updateLocation(req: any, locationDto: LocationCreateDto, locationId: number): Promise<{
        status: string;
        message: string;
        data: import("typeorm").UpdateResult;
    }>;
}
