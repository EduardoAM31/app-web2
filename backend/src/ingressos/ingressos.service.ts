import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';

@Injectable()
export class IngressosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIngressoDto) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id: dto.sessaoId },
      include: {
        sala: true,
        _count: { select: { ingressos: true } },
      },
    });

    if (!sessao) throw new NotFoundException('Sessão não encontrada');

    if (sessao._count.ingressos >= sessao.sala.capacidade) {
      throw new BadRequestException(
        'Capacidade da sala atingida para esta sessão',
      );
    }

    return this.prisma.ingresso.create({
      data: dto,
      include: {
        sessao: {
          include: {
            filme: true,
            sala: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.ingresso.findMany({
      include: {
        sessao: {
          include: {
            filme: true,
            sala: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { id },
      include: {
        sessao: {
          include: {
            filme: true,
            sala: true,
          },
        },
      },
    });

    if (!ingresso) throw new NotFoundException('Ingresso não encontrado');
    return ingresso;
  }
}