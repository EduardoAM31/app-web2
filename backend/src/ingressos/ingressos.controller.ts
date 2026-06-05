import { Body, Controller, Get, Param, Post, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngressosService } from './ingressos.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';

@ApiTags('ingressos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ingressos')
export class IngressosController {
  constructor(private readonly service: IngressosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar ingresso' })
  create(@Body() dto: CreateIngressoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ingressos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ingresso por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}