import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './users.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(
    @Param('id') id: string,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    const userId = parseInt(id, 10);
    return this.usersService.updateUserInfo(userId, updateUserInfoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfilePicture(id, file);
  }
}
