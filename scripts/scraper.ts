/**
 * Scraper de Editais Públicos - Mapas Culturais API
 *
 * Busca editais de múltiplas instâncias do Mapas Culturais (plataforma
 * open-source usada por estados/municípios brasileiros).
 *
 * Uso:
 *   npx tsx scripts/scraper.ts              # Scrape all sources
 *   npx tsx scripts/scraper.ts --source pe  # Only PE
 *   npx tsx scripts/scraper.ts --open-only  # Only open editais
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// SOURCES: Instâncias do Mapas Culturais por estado
// ============================================================

interface MapasCulturaisSource {
  id: string;
  name: string;
  baseUrl: string;
  estado: string;
}

const SOURCES: MapasCulturaisSource[] = [
  { id: "mapacultural_pe", name: "Mapa Cultural PE", baseUrl: "https://mapacultural.pe.gov.br", estado: "PE" },
  { id: "mapacultural_sp", name: "SP Cultura", baseUrl: "https://spcultura.prefeitura.sp.gov.br", estado: "SP" },
  { id: "mapacultural_ce", name: "Mapa Cultural CE", baseUrl: "https://mapacultural.secult.ce.gov.br", estado: "CE" },
  { id: "mapacultural_rs", name: "Mapa Cultural RS", baseUrl: "https://mapa.cultura.rs.gov.br", estado: "RS" },
  { id: "mapacultural_mg", name: "Mapa Cultural MG", baseUrl: "https://mapacultural.mg.gov.br", estado: "MG" },
  { id: "mapacultural_ba", name: "Mapa Cultural BA", baseUrl: "https://mapacultural.ba.gov.br", estado: "BA" },
];

// ============================================================
// SCRAPING LOGIC
// ============================================================

interface RawOpportunity {
  id: number;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  status: number;
  type?: { id: number; name: string };
  registrationFrom?: { date: string };
  registrationTo?: { date: string };
  owner?: number | { id: number; name?: string };
  totalResource?: string;
  vacancies?: string;
  registrationCategories?: string[];
  singleUrl?: string;
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  const stopwords = new Set([
    "de", "do", "da", "dos", "das", "e", "a", "o", "em", "para", "com",
    "que", "no", "na", "por", "ao", "se", "os", "as", "um", "uma", "ou",
    "entre", "sobre", "sua", "seu", "mais", "como", "ser", "ter", "foi",
    "este", "esta", "nao", "sao", "pela", "pelo", "nos", "nas",
  ]);
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w));
  const freq = new Map<string, number>();
  words.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

function detectCategorias(text: string): string[] {
  const lower = (text || "").toLowerCase();
  const cats: string[] = [];
  const mappings: [string, string[]][] = [
    ["musica", ["musica", "musical", "banda", "coral", "instrumento", "sonoro"]],
    ["teatro", ["teatro", "teatral", "dramaturg", "palco", "cenico", "cena"]],
    ["danca", ["danca", "coreograf", "bailarin"]],
    ["cinema", ["cinema", "audiovisual", "filme", "curta", "documentario"]],
    ["literatura", ["literatur", "livro", "poesia", "poeta", "escrita", "leitura"]],
    ["artes visuais", ["artes visuais", "pintura", "escultura", "fotografia", "exposic"]],
    ["patrimonio", ["patrimonio", "patrimônio", "memoria", "preservac", "restaur"]],
    ["cultura popular", ["cultura popular", "folclore", "tradicional", "artesanato", "maracatu"]],
    ["hip hop", ["hip hop", "hiphop", "rap", "grafite", "breaking", "dj"]],
    ["circo", ["circo", "circense", "palhaç", "malabar"]],
  ];
  for (const [cat, terms] of mappings) {
    if (terms.some((t) => lower.includes(t))) cats.push(cat);
  }
  return cats;
}

function detectCotas(text: string): string[] {
  const lower = (text || "").toLowerCase();
  const cotas: string[] = [];
  if (/pcd|deficien|pessoa com deficien/i.test(lower)) cotas.push("PCD");
  if (/negr[oa]|afro|pret[oa]|pard[oa]/i.test(lower)) cotas.push("Negro(a)");
  if (/indigen|originari/i.test(lower)) cotas.push("Indigena");
  if (/lgbtq|lgbt|trans|travesti/i.test(lower)) cotas.push("LGBTQIA+");
  if (/mulher|feminino/i.test(lower)) cotas.push("Mulher");
  if (/idos[oa]|terceira idade|60 anos/i.test(lower)) cotas.push("Idoso");
  return cotas;
}

function parseDate(dateObj: { date: string } | undefined): Date | null {
  if (!dateObj?.date) return null;
  try {
    return new Date(dateObj.date.replace(" ", "T"));
  } catch {
    return null;
  }
}

async function scrapeSource(source: MapasCulturaisSource, openOnly: boolean): Promise<number> {
  console.log(`\n  Scraping ${source.name} (${source.baseUrl})...`);

  const fields = [
    "id", "name", "shortDescription", "longDescription", "status", "type",
    "registrationFrom", "registrationTo", "owner", "singleUrl",
  ].join(",");

  // Mapas Culturais metadata fields
  const metaFields = "totalResource,vacancies,registrationCategories";

  let page = 1;
  const limit = 50;
  let total = 0;
  let hasMore = true;

  while (hasMore) {
    try {
      const statusFilter = openOnly ? "&status=EQ(1)" : "&status=GTE(0)";
      const url = `${source.baseUrl}/api/opportunity/find?@select=${fields}&@limit=${limit}&@page=${page}&@order=createTimestamp DESC${statusFilter}`;

      const res = await fetch(url, {
        headers: { "User-Agent": "Aprova.ai/1.0 (edital discovery bot)" },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        console.log(`    HTTP ${res.status} - skipping source`);
        break;
      }

      const data: RawOpportunity[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        hasMore = false;
        break;
      }

      for (const opp of data) {
        try {
          const fullText = `${opp.name || ""} ${opp.shortDescription || ""} ${opp.longDescription || ""}`;
          const valor = opp.totalResource ? parseFloat(String(opp.totalResource).replace(/[^\d.,]/g, "").replace(",", ".")) : null;
          const inscDe = parseDate(opp.registrationFrom);
          const inscAte = parseDate(opp.registrationTo);
          const now = new Date();
          const statusEdital = inscAte && inscAte < now ? "encerrado" : "aberto";

          await prisma.editalPublico.upsert({
            where: {
              source_sourceId: {
                source: source.id,
                sourceId: String(opp.id),
              },
            },
            update: {
              nome: opp.name || "Sem nome",
              descricao: opp.shortDescription || null,
              descricaoLonga: opp.longDescription || null,
              tipo: opp.type?.name || null,
              valor: valor && !isNaN(valor) ? valor : null,
              vagas: opp.vacancies ? parseInt(String(opp.vacancies)) : null,
              inscricaoDe: inscDe,
              inscricaoAte: inscAte,
              url: opp.singleUrl || `${source.baseUrl}/oportunidade/${opp.id}`,
              estado: source.estado,
              areas: opp.registrationCategories || [],
              categorias: detectCategorias(fullText),
              cotasDisponiveis: detectCotas(fullText),
              keywords: extractKeywords(fullText),
              statusEdital,
              rawData: opp as any, // eslint-disable-line @typescript-eslint/no-explicit-any
              scrapedAt: now,
              updatedAt: now,
            },
            create: {
              sourceId: String(opp.id),
              source: source.id,
              nome: opp.name || "Sem nome",
              descricao: opp.shortDescription || null,
              descricaoLonga: opp.longDescription || null,
              tipo: opp.type?.name || null,
              valor: valor && !isNaN(valor) ? valor : null,
              vagas: opp.vacancies ? parseInt(String(opp.vacancies)) : null,
              inscricaoDe: inscDe,
              inscricaoAte: inscAte,
              url: opp.singleUrl || `${source.baseUrl}/oportunidade/${opp.id}`,
              estado: source.estado,
              areas: opp.registrationCategories || [],
              categorias: detectCategorias(fullText),
              cotasDisponiveis: detectCotas(fullText),
              keywords: extractKeywords(fullText),
              statusEdital,
              rawData: opp as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            },
          });
          total++;
        } catch (err) {
          console.log(`    Error on opp ${opp.id}: ${err instanceof Error ? err.message : "unknown"}`);
        }
      }

      console.log(`    Page ${page}: ${data.length} editais (${total} total)`);

      if (data.length < limit) {
        hasMore = false;
      } else {
        page++;
        // Rate limiting
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (err) {
      console.log(`    Fetch error page ${page}: ${err instanceof Error ? err.message : "unknown"}`);
      hasMore = false;
    }
  }

  return total;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const sourceFilter = args.find((a) => a.startsWith("--source="))?.split("=")[1];
  const openOnly = args.includes("--open-only");

  console.log("=== Aprova.ai Edital Scraper ===");
  console.log(`Mode: ${openOnly ? "open only" : "all editais"}`);
  if (sourceFilter) console.log(`Source filter: ${sourceFilter}`);

  const sources = sourceFilter
    ? SOURCES.filter((s) => s.id.includes(sourceFilter) || s.estado.toLowerCase() === sourceFilter.toLowerCase())
    : SOURCES;

  if (sources.length === 0) {
    console.log("No matching sources found.");
    return;
  }

  let grandTotal = 0;

  for (const source of sources) {
    try {
      const count = await scrapeSource(source, openOnly);
      grandTotal += count;
    } catch (err) {
      console.log(`  FAILED: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  // Stats
  const stats = await prisma.editalPublico.groupBy({
    by: ["source"],
    _count: true,
  });

  console.log("\n=== RESULTADO ===");
  console.log(`Total scraped nesta execucao: ${grandTotal}`);
  console.log(`\nCorpus total por fonte:`);
  for (const s of stats) {
    console.log(`  ${s.source}: ${s._count} editais`);
  }

  const totalCorpus = await prisma.editalPublico.count();
  const openCount = await prisma.editalPublico.count({ where: { statusEdital: "aberto" } });
  console.log(`\n  CORPUS TOTAL: ${totalCorpus} editais (${openCount} abertos)`);
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
