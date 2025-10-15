import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StorageService, UploadResult } from './storage.service';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Upload single image
   * POST /storage/upload
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResult> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      console.log('📤 Received file upload:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });

      // Validate file type
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image files are allowed');
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new BadRequestException('File size must be less than 10MB');
      }

      return await this.storageService.uploadImage(file);
    } catch (error) {
      console.error('❌ Storage upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images
   * POST /storage/upload-multiple
   */
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Validate all files
    files.forEach((file) => {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException(`File ${file.originalname} is not an image`);
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new BadRequestException(
          `File ${file.originalname} is larger than 10MB`,
        );
      }
    });

    return this.storageService.uploadImages(files);
  }
}

