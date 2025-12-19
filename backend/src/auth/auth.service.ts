import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private signToken(payload: { sub: number; username: string; email: string }) {
    const secret = this.configService.get<string>('JWT_SECRET') ?? 'dev-secret';
    const expiresIn =
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d';
    return sign(payload, secret, { expiresIn });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByIdentifierWithPassword(
      loginDto.username,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken({
      sub: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async registerAndLogin(createDto: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) {
    const user = await this.usersService.create(createDto);
    const token = this.signToken({
      sub: user.id,
      username: user.username,
      email: user.email,
    });
    return {
      token,
      user,
    };
  }

  async logout() {
    // JWT is stateless; client should discard token. Hook for future blacklist if needed.
    return { success: true };
  }
}
