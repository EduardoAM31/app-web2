import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SessoesController } from './sessoes.controller';
import { SessoesService } from './sessoes.service';

@Module({
  imports: [PrismaModule],
  controllers: [SessoesController],
  providers: [SessoesService],
})
export class SessoesModule {}