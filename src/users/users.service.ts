import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { encrypt, decrypt } from '../common/utils/encryption';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: encrypt(createUserDto.password), // Encrypt
      points: createUserDto.points || 0,
      role: (createUserDto.role as UserRole) || UserRole.USER,
    });

    return this.usersRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Encrypt password if updated
    if (updateUserDto.password) {
      updateUserDto.password = encrypt(updateUserDto.password);
    }

    // Explicitly cast or handle the DTO to avoid type mismatch with Enum
    const updatedUser = this.usersRepository.merge(user, updateUserDto as any);
    return this.usersRepository.save(updatedUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    // Decrypt passwords for Admin/API view
    return users.map(user => {
      if (user.password) user.password = decrypt(user.password);
      return user;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.password) user.password = decrypt(user.password);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [
        { email: identifier },
        { username: identifier },
        { name: identifier }
      ],
      withDeleted: true,
    });
  }

  // ตัวอย่างฟังก์ชันสำหรับเชื่อมกับ Campaign
  async findUserWithCampaign(id: string) {
    const user = await this.findOne(id);
    return {
      ...user,
      active_campaigns: [],
    };
  }
}