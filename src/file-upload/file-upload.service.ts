import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  constructor(
    private s3Service: S3Service,
    private configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const optimizedBuffer = await this.optimizeImage(file.buffer);
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    return this.s3Service.uploadFile(optimizedBuffer, key, file.mimetype);
  }

  async getPresignedUrl(key: string): Promise<string> {
    return this.s3Service.getPresignedUrl(key);
  }

  private async optimizeImage(buffer: Buffer): Promise<Buffer> {
    const width = this.configService.get<number>('MAX_IMAGE_WIDTH');
    const height = this.configService.get<number>('MAX_IMAGE_WIDTH');
    const quality = this.configService.get<number>('IMAGE_QUALITY');

    return sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
  }
}
