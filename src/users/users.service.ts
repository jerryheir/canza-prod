import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { RegisterDto } from './dto/users.dto';
import { User } from './users.entity';
import {
  emailverification,
  requestNewPassword,
} from 'src/users/templates/verifyEmail';

const transporter = nodemailer.createTransport({
  source: 'hotmail',
  auth: {
    user: 'canzadev@outlook.com',
    pass: 'Canza@123',
  },
});

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  private readonly items: User[] = [
    {
      id: 1,
      firstname: 'Jerry',
      lastname: 'Heir',
      email: 'nwaezejerry@gmail.com',
      password: null,
      image_url: null,
      role: 'user',
      google_signin: 0,
      verified: 0,
    },
  ];

  async registerService(registerDto: RegisterDto) {
    const result = await this.usersRepository.save({
      ...registerDto,
      role: 'user',
      google_signin: 0,
    });
    const emailToken = this.jwtService.sign({
      id: result.id,
    });
    const url = `http://localhost:8000/confirmation_code/${emailToken}`;
    const options = {
      from: '"no-reply@canza.com" <no-reply@canza.com>',
      to: result.email,
      subject: 'Verify your email address',
      html: emailverification(url),
    };
    transporter.sendMail(options, (err, info) => {
      if (err) return Logger.log('Email Error: ' + err);
      Logger.log('Verification email sent! ' + info);
    });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(object: any): Promise<User> {
    return await this.usersRepository.findOne(object);
  }

  async findAndUpdate(object: any): Promise<User> {
    return await this.usersRepository.save(object);
  }

  forgotPassword(email: string, newPassword: string) {
    const options = {
      from: '"no-reply@canza.com" <no-reply@canza.com>',
      to: email,
      subject: 'Reset Password Instructions',
      html: requestNewPassword(newPassword),
    };
    transporter.sendMail(options, (err, info) => {
      if (err) return Logger.log('Email Error: ' + err);
      Logger.log('Verification email sent! ' + info);
    });
  }
}
