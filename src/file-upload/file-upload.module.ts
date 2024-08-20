import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [ConfigModule],
  providers: [S3Service, FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
