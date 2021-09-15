import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { S3 } from 'aws-sdk';
import { Response } from 'express';
import { RegisterDto } from './dto/users.dto';
import { User } from './users.entity';
import {
  emailverification,
  getNewPassword,
  requestNewPassword,
} from '../users/templates/verifyEmail';
import { API_VERSION } from 'src/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  private readonly transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: this.configService.get('EMAIL_SMTP_ADDRESS'),
      pass: this.configService.get('EMAIL_SMTP_PASSWORD'),
    },
  });

  async registerService(registerDto: RegisterDto) {
    const result = await this.usersRepository.save({
      ...registerDto,
      google_signin: 0,
    });
    this.verifyEmail(result);
  }

  verifyEmail(result: { id: number; email: string }) {
    const emailToken = this.jwtService.sign({
      id: result.id,
    });
    const url = `http://localhost:8000/${API_VERSION}confirmation_code/${emailToken}`;
    const options = {
      from: this.configService.get('EMAIL_SMTP_ADDRESS'),
      to: result.email,
      subject: 'Verify your email address',
      html: emailverification(url),
    };
    this.transporter.sendMail(options, (err, info) => {
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

  async findAndUpdate(i: any, object: any) {
    const result = await this.usersRepository.update(i, object);
    return result;
  }

  forgotPassword(email: string, newPassword: string, response: Response) {
    const options = {
      from: this.configService.get('EMAIL_SMTP_ADDRESS'),
      to: email,
      subject: 'Reset Password Instructions',
      html: getNewPassword(newPassword),
    };
    this.transporter.sendMail(options, (err, info) => {
      if (err) return Logger.log('Email Error: ' + err);
      Logger.log('Email sent! ' + info);
    });
    return response.send('Your password has been reset. Check your email!');
    // return response.send(() => requestNewPassword(newPassword));
  }

  resetPassword(email: string, id: number) {
    const emailToken = this.jwtService.sign(
      {
        id: id,
      },
      {
        expiresIn: '15m',
      },
    );
    const url = `http://localhost:8000/${API_VERSION}reset/${emailToken}`;
    const options = {
      from: this.configService.get('EMAIL_SMTP_ADDRESS'),
      to: email,
      subject: 'Reset Password Instructions',
      html: requestNewPassword(url),
    };
    this.transporter.sendMail(options, (err, info) => {
      if (err) return Logger.log('Email Error: ' + err);
      Logger.log('Email sent! ' + info);
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
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async validateUser(auth: string) {
    try {
      const jwt = auth.replace('Bearer ', '');
      const { id } = this.jwtService.verify(jwt);
      const user = await this.usersRepository.findOne({ id });
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async validateAdmin(auth: string) {
    try {
      const jwt = auth.replace('Bearer ', '');
      const { id } = this.jwtService.verify(jwt);
      const user = await this.usersRepository.findOne({ id });
      if (user && user.role > 1) {
        return user;
      }
      throw new UnauthorizedException('Unauthorized');
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
