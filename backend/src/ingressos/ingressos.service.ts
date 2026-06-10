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
      include: { sala: true },
    });

    if (!sessao) throw new NotFoundException('Sessão não encontrada');

    // Valida o assento contra a matriz da sala (fileiras x colunas).
    const match = /^([A-Z])(\d+)$/.exec(dto.assento.trim().toUpperCase());
    if (!match) {
      throw new BadRequestException(
        'Assento inválido. Use o formato letra+número, ex.: A1',
      );
    }

    const fileiraIdx = match[1].charCodeAt(0) - 65; // A=0, B=1, ...
    const coluna = parseInt(match[2], 10);

    if (
      fileiraIdx < 0 ||
      fileiraIdx >= sessao.sala.fileiras ||
      coluna < 1 ||
      coluna > sessao.sala.colunas
    ) {
      throw new BadRequestException('Assento fora da grade da sala');
    }

    const assento = `${match[1]}${coluna}`;

    const ocupado = await this.prisma.ingresso.findFirst({
      where: { sessaoId: dto.sessaoId, assento },
    });
    if (ocupado) {
      throw new BadRequestException('Assento já ocupado para esta sessão');
    }

    try {
      return await this.prisma.ingresso.create({
        data: {
          sessaoId: dto.sessaoId,
          tipo: dto.tipo,
          valorPago: dto.valorPago,
          assento,
          nomeComprador: dto.nomeComprador ?? null,
        },
        include: {
          sessao: {
            include: {
              filme: true,
              sala: true,
            },
          },
        },
      });
    } catch (e: any) {
      // Corrida no índice único (sessaoId, assento).
      if (e?.code === 'P2002') {
        throw new BadRequestException('Assento já ocupado para esta sessão');
      }
      throw e;
    }
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
