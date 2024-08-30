import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { S3Service } from './s3.service';

@Injectable()
export class FileUploadService {
  constructor(private s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const optimizedBuffer = await this.optimizeImage(file.buffer);
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    return this.s3Service.uploadFile(optimizedBuffer, key, file.mimetype);
  }

  async getPresignedUrl(key: string): Promise<string> {
    return this.s3Service.getPresignedUrl(key);
  }

  private async optimizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(process.env.MAX_IMAGE_WIDTH, process.env.MAX_IMAGE_WIDTH, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: process.env.IMAGE_QUALITY })
      .toBuffer();
  }
}
