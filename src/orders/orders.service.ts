import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // 1. Validate Stock and Deduct
    for (const item of createOrderDto.items) {
      await this.productsService.decreaseStock(item.product_id, item.quantity);
    }

    // 2. Calculate Total
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.product_id);
      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      const orderItem = new OrderItem();
      orderItem.product_id = product.product_id;
      orderItem.quantity = item.quantity;
      orderItem.unit_price = Number(product.price);
      orderItems.push(orderItem);
    }

    totalAmount += createOrderDto.shipping_fee;

    // 3. Create Order
    const newOrder = this.ordersRepository.create({
      user_id: createOrderDto.user_id,
      total_amount: totalAmount,
      shipping_fee: createOrderDto.shipping_fee,
      payment_status: 'PENDING',
      items: orderItems,
    });

    return this.ordersRepository.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['items'],
      order: { order_date: 'DESC' }
    });
  }
}