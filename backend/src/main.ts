import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription('API RESTful para gerenciamento de cinema com NestJS e Prisma')
    .setVersion('1.0')
    .addTag('generos')
    .addTag('filmes')
    .addTag('salas')
    .addTag('sessoes')
    .addTag('ingressos')
    .addTag('lanche-combos')
    .addTag('pedidos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('API disponível em http://localhost:3000/api');
}
bootstrap();