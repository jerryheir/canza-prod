"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var config_1 = require("@nestjs/config");
var users_controller_1 = require("./users/users.controller");
var users_entity_1 = require("./users/users.entity");
var coins_entity_1 = require("./coins/coins.entity");
var users_service_1 = require("./users/users.service");
var jwt_1 = require("@nestjs/jwt");
var location_controller_1 = require("./location/location.controller");
var location_service_1 = require("./location/location.service");
var location_entity_1 = require("./location/location.entity");
var coins_controller_1 = require("./coins/coins.controller");
var orders_controller_1 = require("./orders/orders.controller");
var transactions_controller_1 = require("./transactions/transactions.controller");
var notifications_controller_1 = require("./notifications/notifications.controller");
var coins_service_1 = require("./coins/coins.service");
var orders_service_1 = require("./orders/orders.service");
var transactions_service_1 = require("./transactions/transactions.service");
var notifications_service_1 = require("./notifications/notifications.service");
var issue_controller_1 = require("./issue/issue.controller");
var issue_service_1 = require("./issue/issue.service");
var orders_entity_1 = require("./orders/orders.entity");
var notifications_entity_1 = require("./notifications/notifications.entity");
var issue_entity_1 = require("./issue/issue.entity");
var transactions_entity_1 = require("./transactions/transactions.entity");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (config) { return ({
                        type: 'mysql',
                        host: config.get('DATABASE_HOST'),
                        port: config.get('DATABASE_PORT'),
                        username: config.get('DATABASE_USERNAME'),
                        password: config.get('DATABASE_PASSWORD'),
                        database: config.get('DATABASE_NAME'),
                        entities: [
                            users_entity_1.User,
                            location_entity_1.Location,
                            coins_entity_1.Coins,
                            coins_entity_1.SupportedCoins,
                            orders_entity_1.Orders,
                            notifications_entity_1.Notifications,
                            issue_entity_1.Issue,
                            transactions_entity_1.Transactions,
                            users_entity_1.Contacts,
                        ],
                        synchronize: true
                    }); },
                    inject: [config_1.ConfigService]
                }),
                typeorm_1.TypeOrmModule.forFeature([
                    users_entity_1.User,
                    location_entity_1.Location,
                    coins_entity_1.Coins,
                    coins_entity_1.SupportedCoins,
                    orders_entity_1.Orders,
                    notifications_entity_1.Notifications,
                    issue_entity_1.Issue,
                    transactions_entity_1.Transactions,
                    users_entity_1.Contacts,
                ]),
                jwt_1.JwtModule.registerAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (configService) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    secret: configService.get('JWT_SECRET'),
                                    signOptions: { expiresIn: configService.get('JWT_EXPIRE_TIME') }
                                })];
                        });
                    }); },
                    inject: [config_1.ConfigService]
                }),
            ],
            controllers: [
                users_controller_1.UsersController,
                location_controller_1.LocationController,
                coins_controller_1.CoinsController,
                orders_controller_1.OrdersController,
                transactions_controller_1.TransactionsController,
                notifications_controller_1.NotificationsController,
                issue_controller_1.IssueController,
            ],
            providers: [
                users_service_1.UsersService,
                location_service_1.LocationService,
                coins_service_1.CoinsService,
                orders_service_1.OrdersService,
                transactions_service_1.TransactionsService,
                notifications_service_1.NotificationsService,
                issue_service_1.IssueService,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
