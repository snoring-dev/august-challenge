import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './users.service';

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
}
