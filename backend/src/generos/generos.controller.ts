import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@ApiTags('generos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('generos')
export class GenerosController {
  constructor(private readonly service: GenerosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar gênero' })
  create(@Body() dto: CreateGeneroDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar gêneros' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar gênero por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar gênero' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGeneroDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover gênero' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}