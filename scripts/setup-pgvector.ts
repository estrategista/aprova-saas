import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting up pgvector extension...");

  // Enable pgvector extension
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
  console.log("pgvector extension enabled");

  // Create embeddings table (separate from Prisma-managed tables)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS edital_embeddings (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      edital_publico_id TEXT NOT NULL REFERENCES "EditalPublico"(id) ON DELETE CASCADE,
      embedding vector(384),
      model TEXT DEFAULT 'all-MiniLM-L6-v2',
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(edital_publico_id)
    );
  `);
  console.log("edital_embeddings table created");

  // Create HNSW index for fast similarity search
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_edital_embeddings_vector
    ON edital_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
  `);
  console.log("HNSW index created for cosine similarity");

  console.log("pgvector setup complete!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
