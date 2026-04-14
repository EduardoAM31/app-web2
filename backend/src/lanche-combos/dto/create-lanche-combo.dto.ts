import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateLancheComboDto {
  @ApiProperty({ example: 'Combo Casal' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({ example: '2 refrigerantes + 1 pipoca grande' })
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty({ example: 45.9 })
  @IsNumber()
  @Min(0)
  preco!: number;

  @ApiProperty({ example: 'Pipoca grande, 2 refrigerantes 700ml', required: false })
  @IsOptional()
  @IsString()
  itens?: string;
}