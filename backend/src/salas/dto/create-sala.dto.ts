import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateSalaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  numero!: number;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(1)
  capacidade!: number;
}