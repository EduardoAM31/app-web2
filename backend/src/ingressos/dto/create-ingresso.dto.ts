import { ApiProperty } from '@nestjs/swagger';
import { TipoIngresso } from '../../generated/prisma/enums';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

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
}