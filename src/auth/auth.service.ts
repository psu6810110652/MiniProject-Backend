
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { decrypt } from '../common/utils/encryption';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(identifier: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsernameOrEmail(identifier);

        let isValid = false;
        if (user) {
            if (user.password && user.password.startsWith('$2b$')) {
                isValid = await bcrypt.compare(pass, user.password);
            } else {
                isValid = decrypt(user.password) === pass;
            }
        }

        if (isValid && user) {
            if (user.isBlacklisted) {
                // Return user even if blacklisted so we can block them in controller/frontend 
                // OR duplicate the specific "Unauthorized" check here.
                // However, based on Login.tsx logic, the frontend expects to receive the user object 
                // with `isBlacklisted: true` so it can show the special modal.
                // So we MUST return the user here.
            }
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
                username: user.username,
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
                facebook: user.facebook,
                twitter: user.twitter,
                line: user.line,
                facebookName: user.facebookName,
                twitterName: user.twitterName,
                lineName: user.lineName,
                isBlacklisted: user.isBlacklisted,
                deletedAt: user.deletedAt,
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        const newUser = await this.usersService.create(createUserDto);
        return this.login(newUser);
    }
}
