import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';

@Injectable()
export class FileUploadService {
  constructor(private s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    return this.s3Service.uploadFile(file, key);
  }

  async getPresignedUrl(key: string): Promise<string> {
    return this.s3Service.getPresignedUrl(key);
  }
}
