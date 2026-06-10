import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password },
      });
      const { password: _omit, ...safe } = user;
      return safe;
    } catch (e: any) {
      // Violação de unicidade do e-mail (Prisma P2002).
      if (e?.code === 'P2002') {
        throw new ConflictException('Já existe um usuário com esse e-mail');
      }
      throw e;
    }
  }
  findAll() {
    return this.prisma.user.findMany();
  }
  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
