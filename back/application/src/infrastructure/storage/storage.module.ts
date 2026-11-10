import { Module } from '@nestjs/common';
import { ImageProcessorService } from '@infrastructure/storage/image-processor.service';
import { StorageService } from '@infrastructure/storage/storage.service';

@Module({
  providers: [StorageService, ImageProcessorService],
  exports: [StorageService, ImageProcessorService],
})
export class StorageModule {}
