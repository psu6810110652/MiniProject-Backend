import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // 1. คำนวณยอดรวม (Total Amount)
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + (item.unit_price * item.quantity),
      0
    ) + createOrderDto.shipping_fee;

    // 2. สร้าง Order Object
    const newOrder: Order = {
      order_id: uuid(),
      order_date: new Date(),
      total_amount: totalAmount,
      shipping_fee: createOrderDto.shipping_fee,
      payment_status: 'PENDING',
      user_id: createOrderDto.user_id,
      items: createOrderDto.items.map(item => ({ ...item })),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  findAll(): Order[] {
    // เรียงลำดับจากวันที่ล่าสุด
    return [...this.orders].sort((a, b) => b.order_date.getTime() - a.order_date.getTime());
  }
}