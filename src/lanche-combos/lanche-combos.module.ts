import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LancheCombosController } from './lanche-combos.controller';
import { LancheCombosService } from './lanche-combos.service';

@Module({
  imports: [PrismaModule],
  controllers: [LancheCombosController],
  providers: [LancheCombosService],
})
export class LancheCombosModule {}