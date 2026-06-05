import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'joao@email.com', description: 'O email do usuário' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'A senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
