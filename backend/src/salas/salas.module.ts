import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SalasController } from './salas.controller';
import { SalasService } from './salas.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalasController],
  providers: [SalasService],
})
export class SalasModule {}