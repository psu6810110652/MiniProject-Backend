import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SuppliersService {
  private suppliers: Supplier[] = [];

  create(createSupplierDto: CreateSupplierDto): Supplier {
    const newSupplier: Supplier = {
      supplier_id: uuid(),
      ...createSupplierDto,
    };
    this.suppliers.push(newSupplier);
    return newSupplier;
  }

  findAll(): Supplier[] {
    return this.suppliers;
  }

  findOne(id: string): Supplier {
    const supplier = this.suppliers.find(s => s.supplier_id === id);
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }
}