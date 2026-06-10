-- DropForeignKey
ALTER TABLE "Ingresso" DROP CONSTRAINT "Ingresso_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Ingresso" DROP COLUMN "usuarioId",
ADD COLUMN     "nomeComprador" TEXT;
