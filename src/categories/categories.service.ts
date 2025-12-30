import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [];

  create(createCategoryDto: CreateCategoryDto): Category {
    const newCategory: Category = {
      category_id: uuid(),
      category_name: createCategoryDto.category_name,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: string): Category {
    const category = this.categories.find(c => c.category_id === id);
    if (!category) throw new NotFoundException(`Category ID ${id} not found`);
    return category;
  }
}