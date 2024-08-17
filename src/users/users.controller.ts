import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './users.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const registredUser = await this.usersService.registerUser(
      registerUserDto.email,
      registerUserDto.phoneNumber,
      registerUserDto.password,
    );

    return registredUser;
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    if (!verifyEmailDto.email || !verifyEmailDto.verificationCode) {
      throw new BadRequestException('Email and verification code are required');
    }
    return this.usersService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.verificationCode,
    );
  }

  @Post('resend-verification-code')
  async resendVerificationCode(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.usersService.resendVerificationCode(email);
  }
}
