import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateFilmeDto {
  @ApiProperty({ example: 'Interestelar' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  generoId!: number;

  @ApiProperty({ example: 169 })
  @IsInt()
  @Min(1)
  duracao!: number;

  @ApiProperty({ example: '12 anos' })
  @IsString()
  @IsNotEmpty()
  classificacaoEtaria!: string;

  @ApiProperty({ example: 'Uma jornada pelo espaço.', required: false })
  @IsOptional()
  @IsString()
  sinopse?: string;
}