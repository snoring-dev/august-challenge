import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
