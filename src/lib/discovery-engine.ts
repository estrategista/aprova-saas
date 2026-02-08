/**
 * Discovery Engine - Match editais públicos ao perfil do usuário
 *
 * Scoring formula:
 *   matchScore = region(30) + area(25) + cotas(20) + value(15) + recency(10)
 *
 * Cada dimensão retorna 0-1, multiplicada pelo peso.
 * Score final: 0-100
 */

interface UserProfile {
  cidade?: string | null;
  estado?: string | null;
  area?: string | null;
  cotas?: string[];
  valorPreferido?: number | null;
}

interface EditalMatch {
  id: string;
  nome: string;
  orgao: string | null;
  descricao: string | null;
  tipo: string | null;
  valor: number | null;
  inscricaoAte: Date | string | null;
  url: string | null;
  estado: string | null;
  areas: string[];
  categorias: string[];
  cotasDisponiveis: string[];
  keywords: string[];
  statusEdital: string;
  source: string;
  matchScore: number;
  matchDetails: {
    region: number;
    area: number;
    cotas: number;
    value: number;
    recency: number;
  };
}

const WEIGHTS = {
  region: 30,
  area: 25,
  cotas: 20,
  value: 15,
  recency: 10,
};

// Map cidades to estados
const CIDADE_ESTADO: Record<string, string> = {
  caruaru: "PE", recife: "PE", olinda: "PE", jaboatao: "PE", petrolina: "PE",
  garanhuns: "PE", "santa cruz do capibaribe": "PE", arcoverde: "PE",
  fortaleza: "CE", juazeiro: "CE", sobral: "CE", crato: "CE",
  "sao paulo": "SP", campinas: "SP", santos: "SP",
  "belo horizonte": "MG", uberlandia: "MG",
  "porto alegre": "RS", caxias: "RS",
  salvador: "BA", "feira de santana": "BA",
};

function scoreRegion(profile: UserProfile, edital: { estado: string | null }): number {
  if (!edital.estado) return 0.3; // Unknown region = partial match

  let userEstado = profile.estado;
  if (!userEstado && profile.cidade) {
    userEstado = CIDADE_ESTADO[profile.cidade.toLowerCase()] || null;
  }

  if (!userEstado) return 0.5; // Unknown user location = neutral
  if (userEstado === edital.estado) return 1.0; // Same state = perfect
  return 0.1; // Different state
}

function scoreArea(profile: UserProfile, edital: { categorias: string[]; areas: string[]; keywords: string[] }): number {
  if (!profile.area) return 0.5;

  const userAreas = profile.area.toLowerCase().split(/[,;\/\s]+/).filter((a) => a.length > 2);
  const editalText = [...edital.categorias, ...edital.areas, ...edital.keywords].join(" ").toLowerCase();

  if (userAreas.length === 0) return 0.5;

  let matches = 0;
  for (const area of userAreas) {
    if (editalText.includes(area)) matches++;
  }

  return matches > 0 ? Math.min(1.0, matches / userAreas.length + 0.2) : 0.1;
}

function scoreCotas(profile: UserProfile, edital: { cotasDisponiveis: string[] }): number {
  if (!profile.cotas || profile.cotas.length === 0) return 0.5;
  if (edital.cotasDisponiveis.length === 0) return 0.3;

  const matches = profile.cotas.filter((c) =>
    edital.cotasDisponiveis.some((ec) => ec.toLowerCase() === c.toLowerCase())
  );

  return matches.length > 0 ? 1.0 : 0.2;
}

function scoreValue(profile: UserProfile, edital: { valor: number | null }): number {
  if (!profile.valorPreferido || !edital.valor) return 0.5;

  const ratio = edital.valor / profile.valorPreferido;
  if (ratio >= 0.5 && ratio <= 2.0) return 1.0; // Within 50-200% range
  if (ratio >= 0.2 && ratio <= 5.0) return 0.6; // Within 20-500% range
  return 0.2;
}

function scoreRecency(edital: { inscricaoAte: Date | string | null }): number {
  if (!edital.inscricaoAte) return 0.3;

  const deadline = typeof edital.inscricaoAte === "string" ? new Date(edital.inscricaoAte) : edital.inscricaoAte;
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return 0.0; // Expired
  if (daysLeft <= 7) return 0.9; // Urgent
  if (daysLeft <= 30) return 1.0; // Ideal window
  if (daysLeft <= 90) return 0.7; // Plenty of time
  return 0.4; // Far away
}

export function calculateMatchScore(
  profile: UserProfile,
  edital: {
    estado: string | null;
    categorias: string[];
    areas: string[];
    keywords: string[];
    cotasDisponiveis: string[];
    valor: number | null;
    inscricaoAte: Date | string | null;
  }
): { score: number; details: EditalMatch["matchDetails"] } {
  const details = {
    region: scoreRegion(profile, edital),
    area: scoreArea(profile, edital),
    cotas: scoreCotas(profile, edital),
    value: scoreValue(profile, edital),
    recency: scoreRecency(edital),
  };

  const score = Math.round(
    details.region * WEIGHTS.region +
    details.area * WEIGHTS.area +
    details.cotas * WEIGHTS.cotas +
    details.value * WEIGHTS.value +
    details.recency * WEIGHTS.recency
  );

  return { score, details };
}

export type { UserProfile, EditalMatch };
