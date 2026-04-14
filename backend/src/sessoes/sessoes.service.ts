import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';

@Injectable()
export class SessoesService {
  constructor(private readonly prisma: PrismaService) {}

  private async validarSobreposicao(
    salaId: number,
    filmeId: number,
    horarioInicio: Date,
    sessaoIgnoradaId?: number,
  ) {
    const filme = await this.prisma.filme.findUnique({ where: { id: filmeId } });
    if (!filme) throw new NotFoundException('Filme não encontrado');

    const sala = await this.prisma.sala.findUnique({ where: { id: salaId } });
    if (!sala) throw new NotFoundException('Sala não encontrada');

    const novoInicio = horarioInicio;
    const novoFim = new Date(horarioInicio.getTime() + filme.duracao * 60000);

    const sessoesDaSala = await this.prisma.sessao.findMany({
      where: {
        salaId,
        ...(sessaoIgnoradaId ? { NOT: { id: sessaoIgnoradaId } } : {}),
      },
      include: { filme: true },
    });

    for (const sessao of sessoesDaSala) {
      const inicioExistente = new Date(sessao.horarioInicio);
      const fimExistente = new Date(
        inicioExistente.getTime() + sessao.filme.duracao * 60000,
      );

      const sobrepoe =
        inicioExistente < novoFim && fimExistente > novoInicio;

      if (sobrepoe) {
        throw new BadRequestException(
          'Já existe uma sessão nessa sala em horário sobreposto',
        );
      }
    }
  }

  async create(dto: CreateSessaoDto) {
    await this.validarSobreposicao(
      dto.salaId,
      dto.filmeId,
      new Date(dto.horarioInicio),
    );

    return this.prisma.sessao.create({
      data: {
        ...dto,
        horarioInicio: new Date(dto.horarioInicio),
      },
      include: {
        filme: { include: { genero: true } },
        sala: true,
      },
    });
  }

  findAll() {
    return this.prisma.sessao.findMany({
      include: {
        filme: { include: { genero: true } },
        sala: true,
      },
      orderBy: { horarioInicio: 'asc' },
    });
  }

  async findOne(id: number) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id },
      include: {
        filme: { include: { genero: true } },
        sala: true,
        ingressos: true,
      },
    });

    if (!sessao) throw new NotFoundException('Sessão não encontrada');
    return sessao;
  }

  async update(id: number, dto: UpdateSessaoDto) {
    const atual = await this.prisma.sessao.findUnique({ where: { id } });
    if (!atual) throw new NotFoundException('Sessão não encontrada');

    const filmeId = dto.filmeId ?? atual.filmeId;
    const salaId = dto.salaId ?? atual.salaId;
    const horarioInicio = new Date(dto.horarioInicio ?? atual.horarioInicio);

    await this.validarSobreposicao(salaId, filmeId, horarioInicio, id);

    return this.prisma.sessao.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.horarioInicio ? { horarioInicio: new Date(dto.horarioInicio) } : {}),
      },
      include: {
        filme: { include: { genero: true } },
        sala: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sessao.delete({ where: { id } });
  }
}