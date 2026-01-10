import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  async onModuleInit() {
    // Seed data if table is empty
    const count = await this.categoriesRepository.count();
    if (count === 0) {
      console.log('Seeding Categories...');
      const seeds = [
        'Figure', 'Nendoroid', 'Plush', 'Apparel',
        'Accessories', 'Standee', 'Keychains', 'Other'
      ].map(name => this.categoriesRepository.create({ category_name: name }));

      await this.categoriesRepository.save(seeds);
      console.log('Categories Seeded!');
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ category_id: id });
    if (!category) throw new NotFoundException(`Category ID ${id} not found`);
    return category;
  }
}