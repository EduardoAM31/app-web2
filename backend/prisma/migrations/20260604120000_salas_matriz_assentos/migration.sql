-- AlterTable
ALTER TABLE "Sala" DROP COLUMN "capacidade",
ADD COLUMN     "colunas" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "fileiras" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "Ingresso" ADD COLUMN     "assento" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ingresso_sessaoId_assento_key" ON "Ingresso"("sessaoId", "assento");
