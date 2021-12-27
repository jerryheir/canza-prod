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
exports.IssueController = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../helpers");
const roles_guard_1 = require("../roles.guard");
const issue_dto_1 = require("./dto/issue.dto");
const issue_service_1 = require("./issue.service");
let IssueController = class IssueController {
    constructor(issueService) {
        this.issueService = issueService;
    }
    async sendCoin(request, issueDto) {
        try {
            const user = request['guardUser'];
            await this.issueService.createIssue(Object.assign({ userId: user.id }, issueDto));
            return {
                status: 'success',
                message: `Issue created successfully`,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
    }
    async updateIssue(request, id, issueDto) {
        try {
            const user = request['guardUser'];
            await this.issueService.updateIssue({
                id: id,
                userId: user.id,
            }, Object.assign({}, issueDto));
            return {
                status: 'success',
                message: `Issue updated successfully`,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
    }
    async getIssue(request) {
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
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
    }
    async getAllIssue(request) {
        try {
            const user = request['guardUser'];
            if (user && user.role > 2) {
                const data = await this.issueService.getAllIssue();
                return {
                    status: 'success',
                    message: `All Issues fetched successfully`,
                    data: data,
                };
            }
            else {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException();
        }
    }
};
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, issue_dto_1.IssueDto]),
    __metadata("design:returntype", Promise)
], IssueController.prototype, "sendCoin", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], IssueController.prototype, "updateIssue", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IssueController.prototype, "getIssue", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IssueController.prototype, "getAllIssue", null);
IssueController = __decorate([
    (0, common_1.Controller)(`${helpers_1.API_VERSION}issue`),
    __metadata("design:paramtypes", [issue_service_1.IssueService])
], IssueController);
exports.IssueController = IssueController;
//# sourceMappingURL=issue.controller.js.map