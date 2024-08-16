import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
