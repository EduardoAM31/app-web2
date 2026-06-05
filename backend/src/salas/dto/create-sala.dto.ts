import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class CreateSalaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  numero!: number;

  @ApiProperty({ example: 5, description: 'Número de fileiras (A–Z), máximo 26' })
  @IsInt()
  @Min(1)
  @Max(26)
  fileiras!: number;

  @ApiProperty({ example: 10, description: 'Número de colunas (assentos por fileira)' })
  @IsInt()
  @Min(1)
  @Max(50)
  colunas!: number;
}
