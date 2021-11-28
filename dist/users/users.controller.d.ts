import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, ChangePasswordDto, EditProfileDto, ResetDto, AgentsDto, FundWalletDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { responseData } from '../interfaces';
import { TransactionsService } from '../transactions/transactions.service';
export declare class UsersController {
    private readonly usersService;
    private readonly jwtService;
    private readonly transactionsService;
    constructor(usersService: UsersService, jwtService: JwtService, transactionsService: TransactionsService);
    register(registerDto: RegisterDto): Promise<{
        status: string;
        message: string;
    }>;
    registerAgents(registerDto: AgentsDto): Promise<{
        status: string;
        message: string;
    }>;
    login(loginDto: LoginDto, response: Response): Promise<Response<any, Record<string, any>> | {
        status: string;
        message: string;
        data: {
            firstname: any;
            lastname: any;
            email: any;
            image_url: any;
            wallet_balance: any;
            token: string;
        };
    }>;
    getUser(request: Request): Promise<{
        status: string;
        message: string;
        data: {
            firstname: any;
            lastname: any;
            email: any;
            image_url: any;
            google_signin: any;
            wallet_balance: any;
        };
    }>;
    getUsers(): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    confirm(response: Response, token: string): Promise<Response<any, Record<string, any>>>;
    requestReset(resetDto: ResetDto): Promise<responseData>;
    resetPassword(response: Response, token: string): Promise<Response<any, Record<string, any>>>;
    changePassword(changeDto: ChangePasswordDto, response: Response): Promise<{
        status: string;
        message: string;
        data: {
            token: string;
        };
    }>;
    editUser(request: Request, editDto: EditProfileDto): Promise<{
        status: string;
        message: string;
    }>;
    upload(request: Request, file: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    logout(response: Response): Promise<{
        status: string;
        message: string;
    }>;
    getMyContacts(request: Request): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            email: string;
            verified: 0 | 1;
            firstname: string;
            lastname: string;
            location: number;
            image_url: string;
            phone: string;
            banned: 0 | 1;
        }[];
    }>;
    addContact(request: Request, contactDto: {
        contact_id: number;
    }): Promise<{
        status: string;
        message: string;
    }>;
    deleteContact(request: Request, contactDto: {
        contact_id: number;
    }): Promise<{
        status: string;
        message: string;
    }>;
    getAUser(query: any): Promise<{
        status: string;
        message: string;
        data: {
            id: any;
            email: any;
            firstname: any;
            lastname: any;
            image_url: any;
            phone: any;
        };
    }>;
    getAgents(): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    fundWallet(request: Request, fundWalletDto: FundWalletDto): Promise<{
        status: string;
        message: string;
        data: {
            wallet_balance: any;
        };
    }>;
    withdraw(request: Request, fundWalletDto: FundWalletDto): Promise<{
        status: string;
        message: string;
        data: {
            wallet_balance: number;
        };
    } | {
        status: string;
        message: string;
        data?: undefined;
    }>;
}
