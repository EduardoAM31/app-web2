import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PedidoLancheItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  lancheComboId!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantidade!: number;
}

export class CreatePedidoDto {
  @ApiProperty({ example: [1, 2], required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ingressoIds?: number[];

  @ApiProperty({
    required: false,
    example: [{ lancheComboId: 1, quantidade: 2 }],
    type: [PedidoLancheItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoLancheItemDto)
  lanches?: PedidoLancheItemDto[];
}