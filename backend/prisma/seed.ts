import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL não definida');

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  // Usuário de teste (login no mobile)
  const password = await bcrypt.hash('senha123', 10);
  const user = await prisma.user.create({
    data: { name: 'Usuário Teste', email: 'teste@email.com', password },
  });

  // Gênero + Filme
  const genero = await prisma.genero.create({ data: { nome: 'Ação' } });
  const filme = await prisma.filme.create({
    data: {
      titulo: 'Filme de Teste',
      sinopse: 'Um filme para testar o fluxo de compra.',
      classificacaoEtaria: '12',
      duracao: 120,
      generoId: genero.id,
    },
  });

  // Sala em matriz (5 fileiras x 10 colunas) + Sessão (amanhã)
  const sala = await prisma.sala.create({
    data: { numero: 1, fileiras: 5, colunas: 10 },
  });
  const sessao = await prisma.sessao.create({
    data: {
      filmeId: filme.id,
      salaId: sala.id,
      horarioInicio: new Date(Date.now() + 24 * 60 * 60 * 1000),
      valorIngresso: 30,
    },
  });

  // Lanches/combos
  await prisma.lancheCombo.createMany({
    data: [
      { nome: 'Pipoca G', descricao: 'Pipoca grande', preco: 25 },
      { nome: 'Combo Casal', descricao: '2 refrigerantes + pipoca', preco: 45 },
    ],
  });

  await prisma.$disconnect();

  console.log(
    'SEED_OK ' +
      JSON.stringify({
        user: user.email,
        senha: 'senha123',
        generoId: genero.id,
        filmeId: filme.id,
        salaId: sala.id,
        sessaoId: sessao.id,
      }),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
