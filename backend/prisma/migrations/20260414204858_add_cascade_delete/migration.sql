/*
  Warnings:

  - You are about to drop the column `ativo` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `LancheCombo` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `Sala` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Filme" DROP CONSTRAINT "Filme_generoId_fkey";

-- DropForeignKey
ALTER TABLE "Ingresso" DROP CONSTRAINT "Ingresso_sessaoId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoIngresso" DROP CONSTRAINT "PedidoIngresso_ingressoId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoLancheCombo" DROP CONSTRAINT "PedidoLancheCombo_lancheComboId_fkey";

-- DropForeignKey
ALTER TABLE "Sessao" DROP CONSTRAINT "Sessao_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "Sessao" DROP CONSTRAINT "Sessao_salaId_fkey";

-- AlterTable
ALTER TABLE "Filme" DROP COLUMN "ativo";

-- AlterTable
ALTER TABLE "LancheCombo" DROP COLUMN "ativo";

-- AlterTable
ALTER TABLE "Sala" DROP COLUMN "ativo";

-- AddForeignKey
ALTER TABLE "Filme" ADD CONSTRAINT "Filme_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "Filme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingresso" ADD CONSTRAINT "Ingresso_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoIngresso" ADD CONSTRAINT "PedidoIngresso_ingressoId_fkey" FOREIGN KEY ("ingressoId") REFERENCES "Ingresso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoLancheCombo" ADD CONSTRAINT "PedidoLancheCombo_lancheComboId_fkey" FOREIGN KEY ("lancheComboId") REFERENCES "LancheCombo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
