import { ApiProperty } from '@nestjs/swagger';
import { TipoIngresso } from '../../generated/prisma/enums';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateIngressoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  sessaoId!: number;

  @ApiProperty({ enum: TipoIngresso, example: TipoIngresso.INTEIRA })
  @IsEnum(TipoIngresso)
  tipo!: TipoIngresso;

  @ApiProperty({ example: 32.5 })
  @IsNumber()
  @Min(0)
  valorPago!: number;

  @ApiProperty({ example: 'A1', description: 'Assento escolhido: letra da fileira + número da coluna' })
  @IsString()
  @IsNotEmpty()
  assento!: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome de quem comprou o ingresso', required: false })
  @IsOptional()
  @IsString()
  nomeComprador?: string;
}
