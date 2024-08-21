import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { PasswordResetController } from './password-reset.controller';

@Module({
  imports: [FileUploadModule],
  providers: [UserService],
  controllers: [UsersController, PasswordResetController],
  exports: [UserService],
})
export class UsersModule {}
