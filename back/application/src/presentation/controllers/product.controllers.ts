import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplicationProductMapper } from '@application/mappers/product.mapper';
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';
import { CreateProductDto, UpdateProductDto } from '@shared/dtos/export-all.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findProductUseCase: FindProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductDto) {
    const command = ApplicationProductMapper.toCreateCommand(dto);
    return await this.createProductUseCase.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'Find products' })
  @HttpCode(HttpStatus.OK)
  async find(@Query('page') page: number, @Query('limit') limit: number, @Query('id') id?: string) {
    return await this.findProductUseCase.execute(page, limit, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const command = ApplicationProductMapper.toUpdateCommand(id, dto);
    return await this.updateProductUseCase.execute(command);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing product' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return await this.deleteProductUseCase.execute(id);
  }
}
