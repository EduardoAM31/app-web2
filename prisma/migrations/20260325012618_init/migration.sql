-- CreateEnum
CREATE TYPE "TipoIngresso" AS ENUM ('INTEIRA', 'MEIA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genero" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filme" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopse" TEXT,
    "classificacaoEtaria" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    CONSTRAINT "Filme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sala" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "capacidade" INTEGER NOT NULL,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessao" (
    "id" SERIAL NOT NULL,
    "filmeId" INTEGER NOT NULL,
    "salaId" INTEGER NOT NULL,
    "horarioInicio" TIMESTAMP(3) NOT NULL,
    "valorIngresso" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingresso" (
    "id" SERIAL NOT NULL,
    "sessaoId" INTEGER NOT NULL,
    "tipo" "TipoIngresso" NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Ingresso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LancheCombo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "itens" TEXT,

    CONSTRAINT "LancheCombo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoIngresso" (
    "pedidoId" INTEGER NOT NULL,
    "ingressoId" INTEGER NOT NULL,

    CONSTRAINT "PedidoIngresso_pkey" PRIMARY KEY ("pedidoId","ingressoId")
);

-- CreateTable
CREATE TABLE "PedidoLancheCombo" (
    "pedidoId" INTEGER NOT NULL,
    "lancheComboId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PedidoLancheCombo_pkey" PRIMARY KEY ("pedidoId","lancheComboId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_nome_key" ON "Genero"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Sala_numero_key" ON "Sala"("numero");

-- AddForeignKey
ALTER TABLE "Filme"
ADD CONSTRAINT "Filme_generoId_fkey"
FOREIGN KEY ("generoId") REFERENCES "Genero"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao"
ADD CONSTRAINT "Sessao_filmeId_fkey"
FOREIGN KEY ("filmeId") REFERENCES "Filme"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao"
ADD CONSTRAINT "Sessao_salaId_fkey"
FOREIGN KEY ("salaId") REFERENCES "Sala"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingresso"
ADD CONSTRAINT "Ingresso_sessaoId_fkey"
FOREIGN KEY ("sessaoId") REFERENCES "Sessao"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoIngresso"
ADD CONSTRAINT "PedidoIngresso_pedidoId_fkey"
FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoIngresso"
ADD CONSTRAINT "PedidoIngresso_ingressoId_fkey"
FOREIGN KEY ("ingressoId") REFERENCES "Ingresso"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoLancheCombo"
ADD CONSTRAINT "PedidoLancheCombo_pedidoId_fkey"
FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoLancheCombo"
ADD CONSTRAINT "PedidoLancheCombo_lancheComboId_fkey"
FOREIGN KEY ("lancheComboId") REFERENCES "LancheCombo"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;