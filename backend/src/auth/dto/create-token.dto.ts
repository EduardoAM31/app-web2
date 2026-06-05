import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export class CreateTokenDto {
  @ApiPropertyOptional({
    description: 'Dados a serem embutidos no token (payload do JWT).',
    example: { sub: 1, nome: 'João Silva', papel: 'cliente' },
  })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
