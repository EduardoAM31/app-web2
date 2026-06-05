import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilmesService } from './filmes.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';

@ApiTags('filmes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('filmes')
export class FilmesController {
  constructor(private readonly service: FilmesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar filme' })
  create(@Body() dto: CreateFilmeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar filmes com gênero' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar filme por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar filme' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFilmeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover filme' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}