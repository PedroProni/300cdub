import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ObjectIdPipe } from '@common/pipes/object-id.pipe';
import { CategoryService } from '@application/services/category.service';
import { CategoryDto } from '@presentation/dtos/category.dto';
import { ReorderDto } from '@presentation/dtos/reorder.dto';

@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categories: CategoryService) {}

  @Get()
  list() {
    return this.categories.list();
  }

  @Post()
  create(@Body() dto: CategoryDto) {
    return this.categories.create(dto.name);
  }

  @Put('reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorder(@Body() dto: ReorderDto) {
    return this.categories.reorder(dto.ids);
  }

  @Put(':id')
  update(@Param('id', ObjectIdPipe) id: string, @Body() dto: CategoryDto) {
    return this.categories.update(id, dto.name);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdPipe) id: string) {
    return this.categories.remove(id);
  }
}
