import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessoesService } from './sessoes.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';

@ApiTags('sessoes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessoes')
export class SessoesController {
  constructor(private readonly service: SessoesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar sessão' })
  create(@Body() dto: CreateSessaoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar sessões' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar sessão por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sessão' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSessaoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover sessão' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}