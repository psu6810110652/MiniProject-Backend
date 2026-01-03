
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') ?? 'defaultSecret',
        });
    }

    async validate(payload: any) {
        // Re-fetch user to check current blacklist status validation
        // This ensures that if a user is blacklisted WHILE they have an active token, 
        // their next request will fail.
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        if (user.isBlacklisted) {
            throw new UnauthorizedException('User is blacklisted');
        }
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
