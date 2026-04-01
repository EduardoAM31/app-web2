import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';

@Injectable()
export class FilmesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFilmeDto) {
    const genero = await this.prisma.genero.findUnique({ where: { id: dto.generoId } });
    if (!genero) throw new NotFoundException('Gênero não encontrado');

    return this.prisma.filme.create({
      data: dto,
      include: { genero: true },
    });
  }

  findAll() {
    return this.prisma.filme.findMany({
      include: { genero: true },
      orderBy: { titulo: 'asc' },
    });
  }

  async findOne(id: number) {
    const filme = await this.prisma.filme.findUnique({
      where: { id },
      include: { genero: true, sessoes: true },
    });

    if (!filme) throw new NotFoundException('Filme não encontrado');
    return filme;
  }

  async update(id: number, dto: UpdateFilmeDto) {
    await this.findOne(id);

    if (dto.generoId) {
      const genero = await this.prisma.genero.findUnique({ where: { id: dto.generoId } });
      if (!genero) throw new NotFoundException('Gênero não encontrado');
    }

    return this.prisma.filme.update({
      where: { id },
      data: dto,
      include: { genero: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.filme.delete({ where: { id } });
  }
}