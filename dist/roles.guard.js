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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("./users/users.service");
let RolesGuard = class RolesGuard {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        try {
            const req = context.switchToHttp().getRequest();
            const jwt = req.headers.authorization.replace('Bearer ', '');
            const result = this.jwtService.verify(jwt);
            if (!result) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            const user = await this.usersService.findOne({ id: result.id });
            if (!user) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            req['guardUser'] = user;
            return true;
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
};
RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map