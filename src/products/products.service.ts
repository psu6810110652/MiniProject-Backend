import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  // สร้างสินค้า
  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      product_id: uuid(),
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // ดึงสินค้าทั้งหมด
  findAll(): Product[] {
    return this.products;
  }

  // ดึงตาม ID
  findOne(id: string): Product {
    const product = this.products.find(p => p.product_id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}