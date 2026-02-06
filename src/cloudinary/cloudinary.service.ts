import { BadRequestException, Injectable } from '@nestjs/common';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private allowedExtensions = ['.png', '.jpg', '.webp', '.jpeg', '.pdf', '.mp4', '.mov'];

  private allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',     // mov
    'application/pdf',
  ];

  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024;      // 5MB
  private readonly MAX_DOC_SIZE = 100 * 1024 * 1024;      // 100MB

  async uploadFile(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!file.buffer || file.size === 0) throw new BadRequestException('File is empty');

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file mimetype. Allowed: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Invalid extension. Allowed: ${this.allowedExtensions.join(', ')}`,
      );
    }

    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    const maxSize = isImage ? this.MAX_IMAGE_SIZE : this.MAX_DOC_SIZE;

    if (file.size > maxSize) {
      throw new BadRequestException(`File size cannot exceed ${maxSize / (1024 * 1024)}MB`);
    }

    const resource_type: 'image' | 'video' | 'raw' =
      isImage ? 'image' : isVideo ? 'video' : 'raw';

    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder, resource_type },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary returned no result'));
          resolve(result);
        },
      ).end(file.buffer);
    });
  }

  async deleteFile(public_id: string, resource_type: 'image' | 'video' | 'raw' = 'image') {
    const result = await cloudinary.uploader.destroy(public_id, { resource_type });
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new BadRequestException(`File delete failed: ${result.result}`);
    }
  }
}
