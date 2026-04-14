import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';

@Injectable()
export class LancheCombosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateLancheComboDto) {
    return this.prisma.lancheCombo.create({ data: dto });
  }

  findAll() {
    return this.prisma.lancheCombo.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const combo = await this.prisma.lancheCombo.findUnique({ where: { id } });
    if (!combo) throw new NotFoundException('Lanche/Combo não encontrado');
    return combo;
  }

  async update(id: number, dto: UpdateLancheComboDto) {
    await this.findOne(id);
    return this.prisma.lancheCombo.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.lancheCombo.delete({ where: { id } });
  }
}