import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'novaSenha123', description: 'Nova senha (mínimo 6 caracteres)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
