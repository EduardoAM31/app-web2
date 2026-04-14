import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GenerosController } from './generos.controller';
import { GenerosService } from './generos.service';

@Module({
  imports: [PrismaModule],
  controllers: [GenerosController],
  providers: [GenerosService],
})
export class GenerosModule {}