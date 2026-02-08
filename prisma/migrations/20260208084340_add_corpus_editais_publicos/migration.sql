-- CreateTable
CREATE TABLE "EditalPublico" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "orgao" TEXT,
    "descricao" TEXT,
    "descricaoLonga" TEXT,
    "tipo" TEXT,
    "valor" DOUBLE PRECISION,
    "vagas" INTEGER,
    "inscricaoDe" TIMESTAMP(3),
    "inscricaoAte" TIMESTAMP(3),
    "url" TEXT,
    "estado" TEXT,
    "cidade" TEXT,
    "areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categorias" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cotasDisponiveis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "statusEdital" TEXT NOT NULL DEFAULT 'aberto',
    "rawData" JSONB,
    "parsedData" JSONB,
    "matchScore" DOUBLE PRECISION,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditalPublico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EditalPublico_estado_idx" ON "EditalPublico"("estado");

-- CreateIndex
CREATE INDEX "EditalPublico_statusEdital_idx" ON "EditalPublico"("statusEdital");

-- CreateIndex
CREATE INDEX "EditalPublico_inscricaoAte_idx" ON "EditalPublico"("inscricaoAte");

-- CreateIndex
CREATE INDEX "EditalPublico_tipo_idx" ON "EditalPublico"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "EditalPublico_source_sourceId_key" ON "EditalPublico"("source", "sourceId");
