import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GenerosModule } from './generos/generos.module';
import { FilmesModule } from './filmes/filmes.module';
import { SalasModule } from './salas/salas.module';
import { SessoesModule } from './sessoes/sessoes.module';
import { IngressosModule } from './ingressos/ingressos.module';
import { LancheCombosModule } from './lanche-combos/lanche-combos.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, GenerosModule, FilmesModule, SalasModule, SessoesModule, IngressosModule, LancheCombosModule, PedidosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
