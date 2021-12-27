"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_controller_1 = require("./users/users.controller");
const users_entity_1 = require("./users/users.entity");
const coins_entity_1 = require("./coins/coins.entity");
const users_service_1 = require("./users/users.service");
const jwt_1 = require("@nestjs/jwt");
const location_controller_1 = require("./location/location.controller");
const location_service_1 = require("./location/location.service");
const location_entity_1 = require("./location/location.entity");
const coins_controller_1 = require("./coins/coins.controller");
const orders_controller_1 = require("./orders/orders.controller");
const transactions_controller_1 = require("./transactions/transactions.controller");
const notifications_controller_1 = require("./notifications/notifications.controller");
const coins_service_1 = require("./coins/coins.service");
const orders_service_1 = require("./orders/orders.service");
const transactions_service_1 = require("./transactions/transactions.service");
const notifications_service_1 = require("./notifications/notifications.service");
const issue_controller_1 = require("./issue/issue.controller");
const issue_service_1 = require("./issue/issue.service");
const orders_entity_1 = require("./orders/orders.entity");
const notifications_entity_1 = require("./notifications/notifications.entity");
const issue_entity_1 = require("./issue/issue.entity");
const transactions_entity_1 = require("./transactions/transactions.entity");
const currencies_1 = require("./coins/currencies");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DATABASE_HOST'),
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
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
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
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRE_TIME') },
                }),
                inject: [config_1.ConfigService],
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
            currencies_1.Currencies,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map