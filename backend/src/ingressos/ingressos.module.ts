import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IngressosController } from './ingressos.controller';
import { IngressosService } from './ingressos.service';

@Module({
  imports: [PrismaModule],
  controllers: [IngressosController],
  providers: [IngressosService],
})
export class IngressosModule {}