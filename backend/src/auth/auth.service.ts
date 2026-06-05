import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Login com credenciais (email/senha) — usado pelo app mobile.
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const { password: _omit, ...safeUser } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: safeUser,
    };
  }

  // Token sem credenciais — usado pelo frontend web.
  async generateToken(dto: CreateTokenDto) {
    const payload = dto.payload ?? {};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
