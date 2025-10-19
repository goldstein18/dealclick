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
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const baseFileName = `${fileId}.${fileExtension}`;

    this.logger.log(`📤 Upload started: ${file.originalname} (${file.size} bytes, ${file.mimetype})`);

    try {
      // Check if it's HEIF/HEIC format
      const isHEIF = file.mimetype === 'image/heif' || 
                     file.mimetype === 'image/heic' ||
                     fileExtension === 'heif' ||
                     fileExtension === 'heic';

      if (isHEIF) {
        // HEIF/HEIC not supported by Sharp in Railway - upload original
        this.logger.warn(`⚠️ HEIF/HEIC detected - uploading original without processing`);
        const url = await this.uploadToB2(file.buffer, `medium/${baseFileName}`, file.mimetype);
        
        this.logger.log(`✅ Uploaded HEIF original: ${baseFileName}`);
        
        return {
          original: url,
          thumbnail: url,
          medium: url,
          large: url,
        };
      }

      // Generate ONLY 1 optimized size for maximum speed
      // Use medium size (800px) for everything - perfect for mobile
      this.logger.log(`🔧 Processing image...`);
      const medium = await this.processImage(file.buffer, baseFileName, 'medium', 800);
      this.logger.log(`✅ Image processed: ${medium.contentType}`);

      // Upload only 1 file to B2 (super fast!)
      const mediumUrl = await this.uploadToB2(medium.buffer, medium.filename, medium.contentType);

      this.logger.log(`✅ Uploaded image: ${baseFileName}`);

      // Return same URL for all sizes - super fast, only 1 upload!
      return {
        original: mediumUrl,
        thumbnail: mediumUrl,
        medium: mediumUrl,
        large: mediumUrl,
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
  ): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
    const filename = `${size}/${baseFileName}`;

    try {
      // Use JPEG directly - faster and more compatible (especially for HEIF/HEIC from iPhone)
      let sharpInstance = sharp(buffer, { 
        failOnError: false,
        unlimited: true, // Allow large images
      })
        .jpeg({ quality: 85, mozjpeg: true }) // High quality JPEG
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
        contentType: 'image/jpeg',
      };
    } catch (error) {
      this.logger.error(`Image processing failed: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      throw new Error(`Unable to process image: ${error.message}`);
    }
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
        contentType: contentType, // Use the correct content type (webp or jpeg)
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

