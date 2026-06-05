import { Injectable } from '@nestjs/common';
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
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password },
    });
    const { password: _omit, ...safe } = user;
    return safe;
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
