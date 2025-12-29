import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Campaign } from '../campaigns/campaign.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Campaign) private campaignRepo: Repository<Campaign>,
  ) {}

  async createOrder(user: User, campaignId: number, quantity: number) {
    // 1. ดึงข้อมูลแคมเปญ
    const campaign = await this.campaignRepo.findOne({ where: { id: campaignId } });
    if (!campaign) throw new BadRequestException('Campaign not found');

    // 2. Logic: เช็คว่าหมดเวลาหรือยัง?
    if (new Date() > new Date(campaign.endDate)) {
      throw new BadRequestException('Campaign has ended');
    }

    // 3. สร้าง Order
    const order = this.orderRepo.create({
      user,
      campaign,
      quantity,
      totalPrice: campaign.price * quantity,
    });
    
    // 4. บันทึก Order
    await this.orderRepo.save(order);

    // 5. Complex Logic: อัปเดตยอด Current ใน Campaign ทันที (Atomic Update จำลอง)
    campaign.current += quantity;
    await this.campaignRepo.save(campaign);

    return order;
  }
}