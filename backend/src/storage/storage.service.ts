import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as B2 from 'backblaze-b2';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';

export interface UploadResult {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private b2: any;
  private bucketId: string;
  private cdnUrl: string;

  constructor(private configService: ConfigService) {
    this.b2 = new (B2 as any)({
      applicationKeyId: this.configService.get('B2_APPLICATION_KEY_ID'),
      applicationKey: this.configService.get('B2_APPLICATION_KEY'),
    });
    this.bucketId = this.configService.get('B2_BUCKET_ID');
    this.cdnUrl = this.configService.get('B2_CDN_URL'); // Cloudflare CDN URL
  }

  /**
   * Authorize with Backblaze B2
   */
  private async authorize(): Promise<void> {
    try {
      this.logger.log('🔑 Attempting B2 authorization...');
      this.logger.log(`Key ID: ${this.configService.get('B2_APPLICATION_KEY_ID')?.substring(0, 8)}...`);
      this.logger.log(`Bucket ID: ${this.bucketId}`);
      
      await this.b2.authorize();
      this.logger.log('✅ Authorized with Backblaze B2');
    } catch (error) {
      this.logger.error('❌ Failed to authorize with B2:', error);
      this.logger.error('Check Railway env vars: B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_ID');
      throw new Error(`Backblaze B2 authorization failed: ${error.message}`);
    }
  }

  /**
   * Upload a single image with automatic resizing
   */
  async uploadImage(file: Express.Multer.File): Promise<UploadResult> {
    await this.authorize();

    const fileId = randomUUID();
    const fileExtension = file.originalname.split('.').pop();
    const baseFileName = `${fileId}.${fileExtension}`;

    try {
      // Generate only 2 sizes for faster upload (thumbnail and medium)
      // Medium will be used for both medium and large/original
      const [thumbnail, medium] = await Promise.all([
        this.processImage(file.buffer, baseFileName, 'thumbnail', 200),
        this.processImage(file.buffer, baseFileName, 'medium', 1200), // Increased to 1200 for better quality
      ]);

      // Upload only 2 sizes to B2 (much faster!)
      const [thumbnailUrl, mediumUrl] = await Promise.all([
        this.uploadToB2(thumbnail.buffer, thumbnail.filename, file.mimetype),
        this.uploadToB2(medium.buffer, medium.filename, file.mimetype),
      ]);

      this.logger.log(`✅ Uploaded image: ${baseFileName}`);

      // Return direct B2 URLs (f005) - use medium for all larger sizes
      return {
        original: mediumUrl,    // Use medium for original
        thumbnail: thumbnailUrl,
        medium: mediumUrl,
        large: mediumUrl,       // Use medium for large
      };
    } catch (error) {
      this.logger.error('❌ Failed to upload image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images
   */
  async uploadImages(files: Express.Multer.File[]): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }

  /**
   * Process image (resize and optimize)
   */
  private async processImage(
    buffer: Buffer,
    baseFileName: string,
    size: string,
    width: number | null,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const filename = `${size}/${baseFileName}`;

    // Use lower quality for faster processing (70 is still good quality)
    let sharpInstance = sharp(buffer)
      .webp({ quality: 70, effort: 2 }) // Lower quality & effort = faster processing
      .rotate(); // Auto-rotate based on EXIF

    if (width) {
      sharpInstance = sharpInstance.resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const processedBuffer = await sharpInstance.toBuffer();

    return {
      buffer: processedBuffer,
      filename,
    };
  }

  /**
   * Upload file to Backblaze B2
   */
  private async uploadToB2(
    buffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    try {
      // Get upload URL
      const uploadUrlResponse = await this.b2.getUploadUrl({
        bucketId: this.bucketId,
      });

      // Upload file
      const uploadResponse = await this.b2.uploadFile({
        uploadUrl: uploadUrlResponse.data.uploadUrl,
        uploadAuthToken: uploadUrlResponse.data.authorizationToken,
        fileName,
        data: buffer,
        contentType: 'image/webp', // Always WebP after processing
      });

      // Return the native B2 URL (will be converted to CDN URL)
      const bucketName = this.configService.get('B2_BUCKET_NAME');
      return `https://f005.backblazeb2.com/file/${bucketName}/${fileName}`;
    } catch (error) {
      this.logger.error(`❌ Failed to upload to B2: ${fileName}`, error);
      throw error;
    }
  }

  /**
   * Convert Backblaze B2 URL to Cloudflare CDN URL
   */
  private convertToCdnUrl(b2Url: string): string {
    const bucketName = this.configService.get('B2_BUCKET_NAME');
    return b2Url.replace(
      `https://f005.backblazeb2.com/file/${bucketName}`,
      this.cdnUrl,
    );
  }

  /**
   * Delete image from B2 (cleanup)
   */
  async deleteImage(fileName: string): Promise<void> {
    await this.authorize();

    try {
      // Delete all sizes
      const sizes = ['original', 'thumbnail', 'medium', 'large'];
      await Promise.all(
        sizes.map(async (size) => {
          const fullFileName = `${size}/${fileName}`;
          
          // Get file version
          const fileVersions = await this.b2.listFileVersions({
            bucketId: this.bucketId,
            startFileName: fullFileName,
            maxFileCount: 1,
          });

          if (fileVersions.data.files.length > 0) {
            const file = fileVersions.data.files[0];
            await this.b2.deleteFileVersion({
              fileId: file.fileId,
              fileName: fullFileName,
            });
          }
        }),
      );

      this.logger.log(`✅ Deleted image: ${fileName}`);
    } catch (error) {
      this.logger.error(`❌ Failed to delete image: ${fileName}`, error);
      throw error;
    }
  }
}

