import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ObjectIdPipe } from '@common/pipes/object-id.pipe';
import { ProductService } from '@application/services/product.service';
import { ProductImageService } from '@application/services/product-image.service';
import { ProductDto } from '@presentation/dtos/product.dto';
import { ReorderDto } from '@presentation/dtos/reorder.dto';
import { ReorderImagesDto } from '@presentation/dtos/reorder-images.dto';
import { AdminListQueryDto } from '@presentation/dtos/admin-list-query.dto';
import { toProductInput } from '@presentation/mappers/product-input.mapper';
import { MAX_UPLOAD_BYTES, UPLOAD_FIELD_NAME } from '@domain/constants/upload.constant';

@Controller('admin/products')
export class AdminProductsController {
  constructor(
    private readonly products: ProductService,
    private readonly images: ProductImageService,
  ) {}

  @Get()
  list(@Query() query: AdminListQueryDto) {
    return this.products.listAll(query.search?.trim() || undefined, query.category);
  }

  @Post()
  create(@Body() dto: ProductDto) {
    return this.products.create(toProductInput(dto));
  }

  @Put('reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorder(@Body() dto: ReorderDto) {
    return this.products.reorder(dto.ids);
  }

  @Get(':id')
  get(@Param('id', ObjectIdPipe) id: string) {
    return this.products.get(id);
  }

  @Put(':id')
  update(@Param('id', ObjectIdPipe) id: string, @Body() dto: ProductDto) {
    return this.products.update(id, toProductInput(dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdPipe) id: string) {
    return this.products.remove(id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor(UPLOAD_FIELD_NAME, { storage: memoryStorage(), limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 } }))
  addImage(@Param('id', ObjectIdPipe) id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.images.add(id, file?.buffer);
  }

  @Put(':id/images/order')
  reorderImages(@Param('id', ObjectIdPipe) id: string, @Body() dto: ReorderImagesDto) {
    return this.images.reorder(id, dto.ids);
  }

  @Put(':id/images/:imageId/cover')
  setCover(@Param('id', ObjectIdPipe) id: string, @Param('imageId') imageId: string) {
    return this.images.setCover(id, imageId);
  }

  @Delete(':id/images/:imageId')
  removeImage(@Param('id', ObjectIdPipe) id: string, @Param('imageId') imageId: string) {
    return this.images.remove(id, imageId);
  }
}
