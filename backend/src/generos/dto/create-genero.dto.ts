import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGeneroDto {
  @ApiProperty({ example: 'Ação' })
  @IsString()
  @IsNotEmpty()
  nome!: string;
}