
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(identifier: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsernameOrEmail(identifier);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.user_id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                phone: user.phone,
                address: user.address,
                house_number: user.house_number,
                sub_district: user.sub_district,
                district: user.district,
                province: user.province,
                postal_code: user.postal_code,
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        const newUser = await this.usersService.create(createUserDto);
        return this.login(newUser);
    }
}
