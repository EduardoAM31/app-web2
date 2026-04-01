import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@Injectable()
export class GenerosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateGeneroDto) {
    return this.prisma.genero.create({ data: dto });
  }

  findAll() {
    return this.prisma.genero.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const genero = await this.prisma.genero.findUnique({ where: { id } });
    if (!genero) throw new NotFoundException('Gênero não encontrado');
    return genero;
  }

  async update(id: number, dto: UpdateGeneroDto) {
    await this.findOne(id);
    return this.prisma.genero.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genero.delete({ where: { id } });
  }
}