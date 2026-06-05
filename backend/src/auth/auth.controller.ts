import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar com email e senha e obter token JWT' })
  @ApiResponse({ status: 200, description: 'Autenticado. Retorna access_token e user.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gerar um token JWT (sem credenciais)' })
  @ApiResponse({ status: 200, description: 'Token gerado. Retorna access_token.' })
  generateToken(@Body() dto: CreateTokenDto) {
    return this.authService.generateToken(dto);
  }
}
