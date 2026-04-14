import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';

@Injectable()
export class SalasService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSalaDto) {
    return this.prisma.sala.create({ data: dto });
  }

  findAll() {
    return this.prisma.sala.findMany({
      orderBy: { numero: 'asc' },
    });
  }

  async findOne(id: number) {
    const sala = await this.prisma.sala.findUnique({
      where: { id },
      include: { sessoes: true },
    });

    if (!sala) throw new NotFoundException('Sala não encontrada');
    return sala;
  }

  async update(id: number, dto: UpdateSalaDto) {
    await this.findOne(id);
    return this.prisma.sala.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sala.delete({ where: { id } });
  }
}