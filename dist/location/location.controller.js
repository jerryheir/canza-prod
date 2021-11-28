"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../helpers");
const roles_guard_1 = require("../roles.guard");
const location_dto_1 = require("./dto/location.dto");
const location_service_1 = require("./location.service");
let LocationController = class LocationController {
    constructor(locationService) {
        this.locationService = locationService;
    }
    async getLocation(id) {
        try {
            const result = this.locationService.findOne({ id });
            return {
                status: 'success',
                message: 'Location retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async getAllLocations() {
        try {
            const result = await this.locationService.findAll();
            return {
                status: 'success',
                message: 'Locations retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async createLocation(req, locationDto) {
        try {
            const user = req['guardUser'];
            if (user && user.role > 2) {
                const result = await this.locationService.createLocation(locationDto);
                return {
                    status: 'success',
                    message: 'Location created successfully',
                    data: result,
                };
            }
            else {
                throw new common_1.UnauthorizedException();
            }
        }
        catch (err) {
            console.log('/create', err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async updateLocation(req, locationDto, locationId) {
        try {
            const result = await this.locationService.updateLocation({ id: locationId }, locationDto);
            return {
                status: 'success',
                message: 'Location updated successfully',
                data: result,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
};
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getLocation", null);
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getAllLocations", null);
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, location_dto_1.LocationCreateDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Put)('/update/:locationId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, location_dto_1.LocationCreateDto, Number]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "updateLocation", null);
LocationController = __decorate([
    (0, common_1.Controller)(`${helpers_1.API_VERSION}location`),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationController);
exports.LocationController = LocationController;
//# sourceMappingURL=location.controller.js.map