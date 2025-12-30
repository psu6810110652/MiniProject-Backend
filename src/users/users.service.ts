import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid'; // สมมติว่าใช้ uuid สำหรับรหัส

@Injectable()
export class UsersService {
  private users: User[] = []; // เก็บข้อมูลใน Memory แทน Prisma

  // สร้าง User ใหม่
  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      user_id: uuid(),
      ...createUserDto,
      points: createUserDto.points || 0,
    };
    this.users.push(newUser);
    return newUser;
  }

  // ดึง User ทั้งหมด
  findAll(): User[] {
    return this.users;
  }

  // ดึง User ตาม ID
  findOne(id: string): User {
    const user = this.users.find((u) => u.user_id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // ตัวอย่างฟังก์ชันสำหรับเชื่อมกับ Campaign (ถ้ามีการ Join ข้อมูลภายนอก)
  findUserWithCampaign(id: string) {
    const user = this.findOne(id);
    // Logic การไปดึงข้อมูล Campaign จาก Service อื่นมาแสดงผลร่วมกัน
    return {
      ...user,
      active_campaigns: [], // ใส่ข้อมูล campaign ที่ดึงมา
    };
  }
}