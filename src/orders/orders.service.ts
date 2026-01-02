import { Injectable, BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';
import { Shipment } from './entities/shipment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Shipment)
    private shipmentsRepository: Repository<Shipment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private productsService: ProductsService,
  ) { }

  private validateAddress(user: User) {
    const hasStructured = !!(user.house_number && user.district && user.province && user.postal_code);
    const hasLegacy = !!user.address;

    if (!hasStructured && !hasLegacy) {
      throw new BadRequestException('Invalid address: missing required fields');
    }

    const address = {
      name: user.name,
      phone: user.phone,
      address1: user.house_number || user.address,
      sub_district: user.sub_district,
      district: user.district,
      province: user.province,
      postal_code: user.postal_code,
    };

    if (!address.name || !address.phone) {
      throw new BadRequestException('Invalid address: missing customer name/phone');
    }

    return address;
  }

  private async mockShippingProviderCreateLabel(payload: any): Promise<{ tracking_number: string; label_url: string; provider: string }> {
    // Simulate provider downtime
    const roll = Math.random();
    if (roll < 0.08) {
      throw new ServiceUnavailableException('Shipping provider is temporarily unavailable');
    }

    // Simulate validation error
    if (!payload?.to_address?.postal_code) {
      throw new BadRequestException('Shipping provider rejected address');
    }

    const ts = Date.now().toString().slice(-10);
    return {
      provider: 'MockCarrier',
      tracking_number: `TH${ts}`,
      label_url: `https://mock-carrier.local/labels/${ts}.pdf`,
    };
  }

  private async sendShippingEmail(email: string, trackingNumber: string, labelUrl: string) {
    // Mock email sending
    // eslint-disable-next-line no-console
    console.log('[send_shipping_email]', { email, trackingNumber, labelUrl });
  }

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
      stock_deducted: true,
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

  async create_shipping_label(order_id: string): Promise<Shipment> {
    const order = await this.ordersRepository.findOne({
      where: { order_id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${order_id} not found`);
    }

    if (order.payment_status !== 'PAID') {
      throw new BadRequestException("Order status must be 'PAID' before creating shipment");
    }

    // Prevent duplicate label creation
    const existingShipment = await this.shipmentsRepository.findOne({ where: { order_id } });
    if (existingShipment) {
      return existingShipment;
    }

    // Fetch customer for address
    const user = await this.usersRepository.findOne({ where: { user_id: order.user_id } });
    if (!user) {
      throw new BadRequestException('Order has invalid user_id');
    }

    const toAddress = this.validateAddress(user);

    // Optionally deduct stock here (if not already deducted)
    if (!order.stock_deducted) {
      for (const item of order.items || []) {
        await this.productsService.decreaseStock(item.product_id, item.quantity);
      }
      order.stock_deducted = true;
    }

    // Parcel dimension (mock)
    const parcel = { length_cm: 20, width_cm: 15, height_cm: 10, weight_kg: 1 };

    const payload = {
      order_id: order.order_id,
      to_address: toAddress,
      parcel,
    };

    const providerResp = await this.mockShippingProviderCreateLabel(payload);

    const shipment = this.shipmentsRepository.create({
      order_id: order.order_id,
      provider: providerResp.provider,
      tracking_number: providerResp.tracking_number,
      label_url: providerResp.label_url,
    });

    const savedShipment = await this.shipmentsRepository.save(shipment);

    order.payment_status = 'SHIPPED';
    await this.ordersRepository.save(order);

    await this.sendShippingEmail(user.email, savedShipment.tracking_number, savedShipment.label_url);

    return savedShipment;
  }
}