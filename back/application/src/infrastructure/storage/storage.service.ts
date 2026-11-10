import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateBucketCommand, DeleteObjectsCommand, HeadBucketCommand, ListObjectsV2Command, PutBucketPolicyCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { EnvConfigService } from '@common/env/env-config.service';
import { StorageConfig } from '@domain/types/storage-config.type';
import { ProcessedImageVariant } from '@domain/types/processed-image.type';
import { ImageVariantName } from '@domain/enums/image-variant-name.enum';
import { IMAGE_CACHE_CONTROL, IMAGE_OUTPUT_CONTENT_TYPE, IMAGE_OUTPUT_EXTENSION } from '@domain/constants/upload.constant';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly config: StorageConfig;
  private readonly client: S3Client;

  constructor(env: EnvConfigService) {
    this.config = env.getStorageConfig();
    this.client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      forcePathStyle: this.config.forcePathStyle,
      credentials: { accessKeyId: this.config.accessKeyId, secretAccessKey: this.config.secretAccessKey },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.config.bucket }));
    } catch {
      await this.createPublicBucket();
    }
  }

  publicUrl(baseKey: string, variant: ImageVariantName): string {
    return `${this.config.publicBaseUrl}/${this.variantKey(baseKey, variant)}`;
  }

  async putVariants(baseKey: string, variants: ProcessedImageVariant[]): Promise<void> {
    await Promise.all(
      variants.map((variant) =>
        this.client.send(
          new PutObjectCommand({
            Bucket: this.config.bucket,
            Key: this.variantKey(baseKey, variant.name),
            Body: variant.buffer,
            ContentType: IMAGE_OUTPUT_CONTENT_TYPE,
            CacheControl: IMAGE_CACHE_CONTROL,
          }),
        ),
      ),
    );
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const listed = await this.client.send(new ListObjectsV2Command({ Bucket: this.config.bucket, Prefix: prefix }));
    const objects = (listed.Contents ?? []).flatMap((item) => (item.Key ? [{ Key: item.Key }] : []));
    if (objects.length === 0) return;
    await this.client.send(new DeleteObjectsCommand({ Bucket: this.config.bucket, Delete: { Objects: objects } }));
  }

  private variantKey(baseKey: string, variant: ImageVariantName): string {
    return `${baseKey}/${variant}.${IMAGE_OUTPUT_EXTENSION}`;
  }

  private async createPublicBucket(): Promise<void> {
    await this.client.send(new CreateBucketCommand({ Bucket: this.config.bucket }));
    const policy = {
      Version: '2012-10-17',
      Statement: [{ Effect: 'Allow', Principal: '*', Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${this.config.bucket}/*`] }],
    };
    try {
      await this.client.send(new PutBucketPolicyCommand({ Bucket: this.config.bucket, Policy: JSON.stringify(policy) }));
    } catch (error) {
      this.logger.warn(`Bucket policy not applied, configure public read on the provider: ${(error as Error).message}`);
    }
  }
}
