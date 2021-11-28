import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  Req,
  Res,
  Param,
  Logger,
  ForbiddenException,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  EditProfileDto,
  ResetDto,
  AgentsDto,
  FundWalletDto,
} from './dto/users.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { verificationDone } from '../users/templates/verifyEmail';
import { API_VERSION, generateRandomHash } from '../helpers';
import { FileInterceptor } from '@nestjs/platform-express';
import { responseData } from '../interfaces';
import { RolesGuard } from '../roles.guard';
import { TransactionsService } from '../transactions/transactions.service';

@Controller(`${API_VERSION}`)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const data = await this.usersService.findOne({
        email: registerDto.email,
      });
      if (data) {
        throw new BadRequestException('User already exists');
      }
      await this.usersService.registerService({
        ...registerDto,
        password: hashedPassword,
      });
      return {
        status: 'success',
        message: 'Registration successful',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('register/agents')
  async registerAgents(@Body() registerDto: AgentsDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const data = await this.usersService.findOne({
        email: registerDto.email,
      });
      if (data) {
        throw new BadRequestException('Agent already exists');
      }
      await this.usersService.registerService({
        ...registerDto,
        password: hashedPassword,
        role: 2,
      });
      return {
        status: 'success',
        message: 'Agents Registration successful',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.usersService.findOne({ email: loginDto.email });
      if (!user || (user && user.banned === 1)) {
        throw new BadRequestException('Invalid credentials');
      }
      if (!(await bcrypt.compare(loginDto.password, user.password))) {
        throw new BadRequestException('Invalid credentials');
      }
      if (!user.verified) {
        this.usersService.verifyEmail({ id: user.id, email: user.email });
        return response.status(403).json({
          status: 'error',
          message:
            'This user has not verified their account. A new email has been sent!',
        });
      }
      const jwt = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      });
      response.cookie('x-token', jwt, { httpOnly: true });
      return {
        status: 'success',
        message: 'Log in successful',
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          image_url: user.image_url,
          wallet_balance: user.wallet_balance,
          token: jwt,
        },
      };
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get('users/me')
  @UseGuards(RolesGuard)
  async getUser(@Req() request: Request) {
    try {
      const user = request['guardUser'];
      return {
        status: 'success',
        message: 'Retrieved successfully',
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          image_url: user.image_url,
          google_signin: user.google_signin,
          wallet_balance: user.wallet_balance,
        },
      };
    } catch (err: any) {
      throw new UnauthorizedException();
    }
  }

  @Get('users/agents')
  async getUsers() {
    const data = await this.usersService.findAll({ role: 2 });
    return {
      status: 'success',
      message: 'All agents fetched successfully',
      data: data,
    };
  }

  // @Get('users')
  // async getAllUsers(): Promise<any[]> {
  //   return await this.usersService.findAll();
  // }

  @Get('confirmation_code/:token')
  async confirm(@Res() response: Response, @Param('token') token: string) {
    try {
      const result = await this.jwtService.verifyAsync(token);
      if (result && result.id) {
        await this.usersService.findAndUpdate(
          {
            id: result.id,
          },
          {
            verified: true,
          },
        );
        const str = verificationDone();
        return response.send(str);
      } else {
        return response.send('An Error occurred. Please try again later!');
      }
    } catch (err: any) {
      Logger.log('err', err);
      throw new UnauthorizedException();
    }
  }

  @Post('request-reset')
  async requestReset(@Body() resetDto: ResetDto): Promise<responseData> {
    try {
      const user = await this.usersService.findOne({ email: resetDto.email });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      this.usersService.resetPassword(user.email, user.id);
      return {
        status: 'success',
        message: 'An email has been sent!',
      };
    } catch (err: any) {
      throw new ForbiddenException('Denied Access!');
    }
  }

  @Get('reset/:token')
  async resetPassword(
    @Res() response: Response,
    @Param('token') token: string,
  ) {
    try {
      const result = await this.jwtService.verifyAsync(token);
      if (!result) return response.send('Reset Password link has expired!');
      const user = await this.usersService.findOne({ id: result.id });
      if (user && user.id) {
        const randomHash = generateRandomHash(11);
        const hashedPassword = await bcrypt.hash(randomHash, 12);
        const page = await this.usersService.forgotPassword(
          user.email,
          randomHash,
          response,
        );
        await this.usersService.findAndUpdate(
          { id: user.id },
          {
            password: hashedPassword,
          },
        );
        return page;
      } else {
        return response.send('An Error occurred. Please try again later!');
      }
    } catch (err: any) {
      throw new ForbiddenException('Denied Access!');
    }
  }

  @Put('change-password')
  @UseGuards(RolesGuard)
  async changePassword(
    @Body() changeDto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.usersService.findOne({ email: changeDto.email });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      if (!(await bcrypt.compare(changeDto.password, user.password))) {
        throw new BadRequestException('Invalid credentials');
      }
      const hashedPassword = await bcrypt.hash(changeDto.newPassword, 12);
      await this.usersService.findAndUpdate(
        {
          id: user.id,
        },
        {
          password: hashedPassword,
        },
      );
      const jwt = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      });
      response.cookie('x-token', jwt, { httpOnly: true });
      return {
        status: 'success',
        message: 'Password change successful',
        data: {
          token: jwt,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  @Put('edit-profile')
  @UseGuards(RolesGuard)
  async editUser(@Req() request: Request, @Body() editDto: EditProfileDto) {
    try {
      const user = request['guardUser'];
      await this.usersService.findAndUpdate(
        { id: user.id },
        {
          ...editDto,
        },
      );
      return {
        status: 'success',
        message: 'Profile updated successfully',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RolesGuard)
  async upload(@Req() request: Request, @UploadedFile() file) {
    try {
      const user = request['guardUser'];
      const data = await this.usersService.upload(file);
      await this.usersService.findAndUpdate(
        { id: user.id },
        {
          image_url: data,
        },
      );
      return {
        status: 'success',
        message: 'Photo uploaded successfully',
        data: data,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Post('logout')
  @UseGuards(RolesGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('x-token');
    return {
      status: 'success',
      message: 'Log out successful',
    };
  }

  @Get('contacts/me')
  @UseGuards(RolesGuard)
  async getMyContacts(@Req() request: Request) {
    try {
      const user = request['guardUser'];
      const data = await this.usersService.getMyContacts(user.id);
      return {
        status: 'success',
        message: 'Contacts fetched successfully',
        data: data,
      };
    } catch (err: any) {
      throw new InternalServerErrorException();
    }
  }

  @Post('contacts/add')
  @UseGuards(RolesGuard)
  async addContact(
    @Req() request: Request,
    @Body() contactDto: { contact_id: number },
  ) {
    const user = request['guardUser'];
    await this.usersService.addContact({
      userId: user.id,
      contact_id: contactDto.contact_id,
    });
    return {
      status: 'success',
      message: 'Added contact successfully',
    };
  }

  @Delete('contacts')
  @UseGuards(RolesGuard)
  async deleteContact(
    @Req() request: Request,
    @Body() contactDto: { contact_id: number },
  ) {
    const user = request['guardUser'];
    await this.usersService.deleteContact({
      userId: user.id,
      contact_id: contactDto.contact_id,
    });
    return {
      status: 'success',
      message: 'Added deleted successfully',
    };
  }

  @Get('users/get')
  @UseGuards(RolesGuard)
  async getAUser(@Query() query: any) {
    try {
      if (!query || !query.email) throw new BadRequestException();
      const i = await this.usersService.findOne({ email: query.email });
      const data = {
        id: i.id,
        email: i.email,
        firstname: i.firstname,
        lastname: i.lastname,
        image_url: i.image_url,
        phone: i.phone,
      };
      return {
        status: 'success',
        message: 'User fetched successfully',
        data: data,
      };
    } catch (err: any) {
      throw new ForbiddenException('Denied Access!');
    }
  }

  @Get('agents')
  @UseGuards(RolesGuard)
  async getAgents() {
    try {
      const data = await this.usersService.findAll({ role: 2 });
      return {
        status: 'success',
        message: 'Agents fetched successfully',
        data: data.filter((i) => i.banned === 0),
      };
    } catch (err: any) {
      throw new InternalServerErrorException();
    }
  }

  @Put('fund-wallet')
  @UseGuards(RolesGuard)
  async fundWallet(
    @Req() request: Request,
    @Body() fundWalletDto: FundWalletDto,
  ) {
    try {
      const user = request['guardUser'];
      if (!fundWalletDto || !fundWalletDto.amount) {
        throw new BadRequestException();
      }
      await this.usersService.findAndUpdate(
        { id: user.id },
        { wallet_balance: user.wallet_balance + fundWalletDto.amount },
      );
      await this.transactionsService.createTransactions({
        userId: user.id,
        type: 'credit',
        description: `You have just funded your wallet with NGN ${fundWalletDto.amount}`,
        metadata: JSON.stringify({
          type: 'credit',
          amount: fundWalletDto.amount,
        }),
      });
      return {
        status: 'success',
        message: 'User fetched successfully',
        data: {
          wallet_balance: user.wallet_balance + fundWalletDto.amount,
        },
      };
    } catch (err: any) {
      throw new ForbiddenException('Denied Access!');
    }
  }

  @Put('withdraw')
  @UseGuards(RolesGuard)
  async withdraw(
    @Req() request: Request,
    @Body() fundWalletDto: FundWalletDto,
  ) {
    try {
      const user = request['guardUser'];
      if (
        !fundWalletDto ||
        !fundWalletDto.amount ||
        user.wallet_balance - fundWalletDto.amount < 0
      ) {
        throw new BadRequestException();
      }
      if (user.wallet_balance - fundWalletDto.amount >= 0) {
        await this.usersService.findAndUpdate(
          { id: user.id },
          { wallet_balance: user.wallet_balance - fundWalletDto.amount },
        );
        await this.transactionsService.createTransactions({
          userId: user.id,
          type: 'debit',
          description: `You have successfully requested a withdrawal of NGN ${fundWalletDto.amount} from your Canza Wallet`,
          metadata: JSON.stringify({
            type: 'debit',
            amount: fundWalletDto.amount,
          }),
        });
        return {
          status: 'success',
          message: 'Withdraw process successfully',
          data: {
            wallet_balance: user.wallet_balance - fundWalletDto.amount,
          },
        };
      } else {
        return {
          status: 'error',
          message: 'Withdraw process failed. Try again later.',
        };
      }
    } catch (err: any) {
      throw new ForbiddenException('Denied Access!');
    }
  }
}
