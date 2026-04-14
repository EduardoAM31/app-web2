import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePedidoDto) {
    const ingressoIds = dto.ingressoIds ?? [];
    const lanchesDto = dto.lanches ?? [];

    if (ingressoIds.length === 0 && lanchesDto.length === 0) {
      throw new BadRequestException('O pedido deve conter ao menos um item');
    }

    const ingressos = ingressoIds.length
      ? await this.prisma.ingresso.findMany({
          where: { id: { in: ingressoIds } },
        })
      : [];

    if (ingressos.length !== ingressoIds.length) {
      throw new NotFoundException('Um ou mais ingressos não foram encontrados');
    }

    const lancheIds = lanchesDto.map((l) => l.lancheComboId);
    const lanches = lancheIds.length
      ? await this.prisma.lancheCombo.findMany({
          where: { id: { in: lancheIds } },
        })
      : [];

    if (lanches.length !== lancheIds.length) {
      throw new NotFoundException('Um ou mais lanches/combos não foram encontrados');
    }

    const totalIngressos = ingressos.reduce((acc, item) => acc + item.valorPago, 0);

    const totalLanches = lanchesDto.reduce((acc, itemDto) => {
      const lanche = lanches.find((l) => l.id === itemDto.lancheComboId);
      if (!lanche) return acc;
      return acc + lanche.preco * itemDto.quantidade;
    }, 0);

    const valorTotal = totalIngressos + totalLanches;

    return this.prisma.pedido.create({
      data: {
        valorTotal,
        ingressos: {
          create: ingressoIds.map((ingressoId) => ({
            ingresso: { connect: { id: ingressoId } },
          })),
        },
        lanches: {
          create: lanchesDto.map((item) => ({
            quantidade: item.quantidade,
            lancheCombo: { connect: { id: item.lancheComboId } },
          })),
        },
      },
      include: {
        ingressos: {
          include: {
            ingresso: {
              include: {
                sessao: {
                  include: { filme: true, sala: true },
                },
              },
            },
          },
        },
        lanches: {
          include: {
            lancheCombo: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.pedido.findMany({
      include: {
        ingressos: {
          include: {
            ingresso: {
              include: {
                sessao: {
                  include: { filme: true, sala: true },
                },
              },
            },
          },
        },
        lanches: {
          include: {
            lancheCombo: true,
          },
        },
      },
      orderBy: { dataHora: 'desc' },
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        ingressos: {
          include: {
            ingresso: {
              include: {
                sessao: {
                  include: { filme: true, sala: true },
                },
              },
            },
          },
        },
        lanches: {
          include: {
            lancheCombo: true,
          },
        },
      },
    });

    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }
}