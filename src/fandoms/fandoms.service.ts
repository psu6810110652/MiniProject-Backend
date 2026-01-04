import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fandom } from './entities/fandom.entity';
import { CreateFandomDto, UpdateFandomDto } from './dto/create-fandom.dto';

@Injectable()
export class FandomsService {
  constructor(
    @InjectRepository(Fandom)
    private fandomsRepository: Repository<Fandom>,
  ) { }

  async create(createFandomDto: CreateFandomDto, creatorId: string): Promise<Fandom> {
    const { tags, ...fandomData } = createFandomDto;
    const fandom = this.fandomsRepository.create({
      ...fandomData,
      creator_id: creatorId,
      tags: tags ? JSON.stringify(tags) : undefined,
    });
    return this.fandomsRepository.save(fandom);
  }

  async findAll(): Promise<Fandom[]> {
    return this.fandomsRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Fandom> {
    const fandom = await this.fandomsRepository.findOne({ where: { id } });
    if (!fandom) {
      throw new NotFoundException(`Fandom with ID ${id} not found`);
    }
    return fandom;
  }

  async findByName(name: string): Promise<Fandom> {
    const fandom = await this.fandomsRepository.findOne({ where: { name } });
    if (!fandom) {
      throw new NotFoundException(`Fandom with name ${name} not found`);
    }
    return fandom;
  }

  async findByCategory(category: string): Promise<Fandom[]> {
    return this.fandomsRepository.find({
      where: { category, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateFandomDto: UpdateFandomDto): Promise<Fandom> {
    const fandom = await this.findOne(id);

    const updateData = {
      ...updateFandomDto,
      tags: updateFandomDto.tags ? JSON.stringify(updateFandomDto.tags) : fandom.tags,
    };

    Object.assign(fandom, updateData);
    return this.fandomsRepository.save(fandom);
  }

  async remove(id: string): Promise<void> {
    const fandom = await this.findOne(id);
    await this.fandomsRepository.remove(fandom);
  }

  async updateProductCount(id: string, count: number): Promise<void> {
    await this.fandomsRepository.update(id, { product_count: count });
  }

  async updateMemberCount(id: string, count: number): Promise<void> {
    await this.fandomsRepository.update(id, { member_count: count });
  }

  async search(query: string): Promise<Fandom[]> {
    return this.fandomsRepository
      .createQueryBuilder('fandom')
      .where('fandom.name ILIKE :query OR fandom.description ILIKE :query', {
        query: `%${query}%`,
      })
      .andWhere('fandom.is_active = :isActive', { isActive: true })
      .orderBy('fandom.created_at', 'DESC')
      .getMany();
  }
}
