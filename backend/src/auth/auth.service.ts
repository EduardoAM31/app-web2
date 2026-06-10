import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  // Redefine a senha de um usuário a partir do e-mail (sem verificação por e-mail).
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Não há usuário cadastrado com esse e-mail');
    }
    // usersService.update já aplica o hash bcrypt na senha.
    await this.usersService.update(user.id, { password: dto.password });
    return { message: 'Senha redefinida com sucesso' };
  }

  // Token sem credenciais — usado pelo frontend web.
  async generateToken(dto: CreateTokenDto) {
    const payload = dto.payload ?? {};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
