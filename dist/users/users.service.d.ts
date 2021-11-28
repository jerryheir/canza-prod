import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { Response } from 'express';
import { Contacts, User } from './users.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly contactsRepository;
    private readonly configService;
    private jwtService;
    constructor(usersRepository: Repository<User>, contactsRepository: Repository<Contacts>, configService: ConfigService, jwtService: JwtService);
    private readonly transporter;
    registerService(registerDto: any): Promise<void>;
    verifyEmail(result: {
        id: number;
        email: string;
    }): void;
    findAll(a?: any): Promise<any[]>;
    findOne(object: any): Promise<any>;
    getWalletBalance(object: any): Promise<any>;
    findAndUpdate(i: any, object: any): Promise<import("typeorm").UpdateResult>;
    forgotPassword(email: string, newPassword: string, response: Response): Response<any, Record<string, any>>;
    resetPassword(email: string, id: number): void;
    upload(file: any): Promise<any>;
    uploadS3(file: any, bucket: any, name: any): Promise<unknown>;
    getS3(): S3;
    validateUser(auth: string): Promise<User>;
    validateAdmin(auth: string): Promise<User>;
    getMyContacts(id: number): Promise<{
        id: number;
        email: string;
        verified: 0 | 1;
        firstname: string;
        lastname: string;
        location: number;
        image_url: string;
        phone: string;
        banned: 0 | 1;
    }[]>;
    addContact(object: {
        userId: number;
        contact_id: number;
    }): Promise<{
        userId: number;
        contact_id: number;
    }>;
    deleteContact(object: {
        userId: number;
        contact_id: number;
    }): Promise<boolean>;
}
