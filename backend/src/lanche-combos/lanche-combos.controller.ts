import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LancheCombosService } from './lanche-combos.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';

@ApiTags('lanche-combos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lanche-combos')
export class LancheCombosController {
  constructor(private readonly service: LancheCombosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar lanche/combo' })
  create(@Body() dto: CreateLancheComboDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar lanches/combos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar lanche/combo por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar lanche/combo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLancheComboDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover lanche/combo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}