import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateSessaoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  filmeId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  salaId!: number;

  @ApiProperty({ example: '2026-04-10T19:30:00.000Z' })
  @IsDateString()
  horarioInicio!: string;

  @ApiProperty({ example: 32.5 })
  @IsNumber()
  @Min(0)
  valorIngresso!: number;
}