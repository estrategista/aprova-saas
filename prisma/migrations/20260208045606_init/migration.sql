-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT,
    "cidade" TEXT,
    "area" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "claudeApiKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edital" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "orgao" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'cultural',
    "valor" DOUBLE PRECISION NOT NULL,
    "valorExato" BOOLEAN NOT NULL DEFAULT true,
    "prazo" TIMESTAMP(3),
    "plataforma" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "configJson" JSONB,
    "restricoes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "faq" JSONB DEFAULT '[]',
    "contatos" JSONB DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidato" (
    "id" TEXT NOT NULL,
    "editalId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "cidade" TEXT,
    "area" TEXT,
    "empresa" TEXT,
    "cotas" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campo" (
    "id" TEXT NOT NULL,
    "editalId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "criterioId" TEXT,
    "nome" TEXT NOT NULL,
    "curto" TEXT,
    "placeholder" TEXT,
    "maxChars" INTEGER NOT NULL DEFAULT 8000,
    "template" TEXT,
    "conteudo" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criterio" (
    "id" TEXT NOT NULL,
    "editalId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "curto" TEXT,
    "dica" TEXT,
    "peso" INTEGER NOT NULL DEFAULT 10,
    "escala" INTEGER[] DEFAULT ARRAY[0, 3, 5, 7, 10]::INTEGER[],
    "pontuacao" INTEGER,

    CONSTRAINT "Criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BonusItem" (
    "id" TEXT NOT NULL,
    "editalId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pontos" INTEGER NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BonusItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrcamentoItem" (
    "id" TEXT NOT NULL,
    "editalId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT,
    "cotacoes" JSONB DEFAULT '[]',

    CONSTRAINT "OrcamentoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineDay" (
    "id" TEXT NOT NULL,
    "editalId" TEXT NOT NULL,
    "dia" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "emoji" TEXT,
    "horas" INTEGER,
    "tasks" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "TimelineDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Edital_userId_idx" ON "Edital"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_editalId_key" ON "Candidato"("editalId");

-- CreateIndex
CREATE INDEX "Campo_editalId_idx" ON "Campo"("editalId");

-- CreateIndex
CREATE INDEX "Criterio_editalId_idx" ON "Criterio"("editalId");

-- CreateIndex
CREATE INDEX "BonusItem_editalId_idx" ON "BonusItem"("editalId");

-- CreateIndex
CREATE INDEX "OrcamentoItem_editalId_idx" ON "OrcamentoItem"("editalId");

-- CreateIndex
CREATE INDEX "TimelineDay_editalId_idx" ON "TimelineDay"("editalId");

-- AddForeignKey
ALTER TABLE "Edital" ADD CONSTRAINT "Edital_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campo" ADD CONSTRAINT "Campo_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterio" ADD CONSTRAINT "Criterio_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusItem" ADD CONSTRAINT "BonusItem_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrcamentoItem" ADD CONSTRAINT "OrcamentoItem_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineDay" ADD CONSTRAINT "TimelineDay_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
