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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const typeorm_2 = require("typeorm");
const nodemailer = require("nodemailer");
const aws_sdk_1 = require("aws-sdk");
const users_entity_1 = require("./users.entity");
const verifyEmail_1 = require("../users/templates/verifyEmail");
const helpers_1 = require("../helpers");
let UsersService = class UsersService {
    constructor(usersRepository, contactsRepository, configService, jwtService) {
        this.usersRepository = usersRepository;
        this.contactsRepository = contactsRepository;
        this.configService = configService;
        this.jwtService = jwtService;
        this.transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: this.configService.get('EMAIL_SMTP_ADDRESS'),
                pass: this.configService.get('EMAIL_SMTP_PASSWORD'),
            },
        });
    }
    async registerService(registerDto) {
        const result = await this.usersRepository.save(Object.assign(Object.assign({}, registerDto), { google_signin: 0 }));
        this.verifyEmail(result);
    }
    verifyEmail(result) {
        const emailToken = this.jwtService.sign({
            id: result.id,
        }, {
            expiresIn: '15m',
        });
        const url = `https://canza-api-6dbce.ondigitalocean.app/${helpers_1.API_VERSION}confirmation_code/${emailToken}`;
        const options = {
            from: this.configService.get('EMAIL_SMTP_ADDRESS'),
            to: result.email,
            subject: 'Verify your email address',
            html: (0, verifyEmail_1.emailverification)(url),
        };
        this.transporter.sendMail(options, (err, info) => {
            if (err)
                return common_1.Logger.log('Email Error: ' + err);
            common_1.Logger.log('Verification email sent! ' + info);
        });
    }
    async findAll(a) {
        const data = await this.usersRepository.find(a);
        const result = data
            ? data.map((i) => {
                return {
                    id: i.id,
                    email: i.email,
                    verified: i.verified,
                    firstname: i.firstname,
                    lastname: i.lastname,
                    location: i.location,
                    image_url: i.image_url,
                    phone: i.phone,
                    banned: i.banned,
                };
            })
            : [];
        return result;
    }
    async findOne(object) {
        const i = await this.usersRepository.findOne(object);
        return {
            id: i.id,
            email: i.email,
            verified: i.verified,
            firstname: i.firstname,
            lastname: i.lastname,
            location: i.location,
            image_url: i.image_url,
            phone: i.phone,
            banned: i.banned,
            wallet_balance: i.wallet_balance,
            password: i.password,
            role: i.role,
        };
    }
    async getWalletBalance(object) {
        const i = await this.usersRepository.findOne(object);
        return {
            wallet_balance: i.wallet_balance,
        };
    }
    async findAndUpdate(i, object) {
        const result = await this.usersRepository.update(i, object);
        return result;
    }
    forgotPassword(email, newPassword, response) {
        const options = {
            from: this.configService.get('EMAIL_SMTP_ADDRESS'),
            to: email,
            subject: 'Reset Password Instructions',
            html: (0, verifyEmail_1.getNewPassword)(newPassword),
        };
        this.transporter.sendMail(options, (err, info) => {
            if (err)
                return common_1.Logger.log('Email Error: ' + err);
            common_1.Logger.log('Email sent! ' + info);
        });
        return response.send('Your password has been reset. Check your email!');
    }
    resetPassword(email, id) {
        const emailToken = this.jwtService.sign({
            id: id,
        }, {
            expiresIn: '15m',
        });
        const url = `https://canza-api-6dbce.ondigitalocean.app/${helpers_1.API_VERSION}reset/${emailToken}`;
        const options = {
            from: this.configService.get('EMAIL_SMTP_ADDRESS'),
            to: email,
            subject: 'Reset Password Instructions',
            html: (0, verifyEmail_1.requestNewPassword)(url),
        };
        this.transporter.sendMail(options, (err, info) => {
            if (err)
                return common_1.Logger.log('Email Error: ' + err);
            common_1.Logger.log('Email sent! ' + info);
        });
    }
    async upload(file) {
        const { originalname } = file;
        const bucketS3 = this.configService.get('AWS_S3_BUCKET_NAME');
        const name = originalname.trim().replace(/ /g, '');
        const data = await this.uploadS3(file.buffer, bucketS3, name);
        return data['Location'];
    }
    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    common_1.Logger.error(err);
                    reject(err.message);
                }
                resolve(data);
            });
        });
    }
    getS3() {
        return new aws_sdk_1.S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        });
    }
    async validateUser(auth) {
        try {
            const jwt = auth.replace('Bearer ', '');
            const { id } = this.jwtService.verify(jwt);
            const user = await this.usersRepository.findOne({ id });
            if (!user) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            return user;
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
    async validateAdmin(auth) {
        try {
            const jwt = auth.replace('Bearer ', '');
            const { id } = this.jwtService.verify(jwt);
            const user = await this.usersRepository.findOne({ id });
            if (user && user.role > 2) {
                return user;
            }
            else {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
    async getMyContacts(id) {
        try {
            const res = await this.contactsRepository.find({ userId: id });
            const ids = [...new Set(res.map((item) => item.contact_id))];
            const data = await this.usersRepository.findByIds(ids);
            const result = data
                ? data.map((i) => {
                    return {
                        id: i.id,
                        email: i.email,
                        verified: i.verified,
                        firstname: i.firstname,
                        lastname: i.lastname,
                        location: i.location,
                        image_url: i.image_url,
                        phone: i.phone,
                        banned: i.banned,
                    };
                })
                : [];
            return result;
        }
        catch (err) {
            return [];
        }
    }
    async addContact(object) {
        try {
            await this.contactsRepository.save(object);
            return object;
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
    }
    async deleteContact(object) {
        try {
            await this.contactsRepository.delete(object);
            return true;
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.Contacts)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map