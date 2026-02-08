export interface EditalConfig {
  meta: {
    nome: string;
    orgao: string;
    tipo: string;
    valor: number;
    valorExato: boolean;
    prazo: string;
    plataforma: string;
  };
  candidato: {
    nome: string;
    cpf: string;
    cidade: string;
    area: string;
    empresa: string;
    cotas: string[];
  };
  campos: CampoConfig[];
  criterios: CriterioConfig[];
  orcamento: OrcamentoItemConfig[];
  timeline: TimelineDayConfig[];
  bonus: BonusItemConfig[];
  restricoes: string[];
  faq: { p: string; r: string }[];
  contatos: { nome: string; tel: string; email: string }[];
}

export interface CampoConfig {
  nome: string;
  curto: string;
  criterioId?: string;
  placeholder?: string;
  maxChars: number;
  template?: string;
}

export interface CriterioConfig {
  codigo: string;
  nome: string;
  curto?: string;
  dica?: string;
  peso: number;
  escala: number[];
}

export interface BonusItemConfig {
  nome: string;
  pontos: number;
  destaque?: boolean;
  descricao?: string;
}

export interface OrcamentoItemConfig {
  nome: string;
  valor: number;
  descricao?: string;
  cotacoes?: { loja: string; tel: string; valor: number }[];
}

export interface TimelineDayConfig {
  dia: number;
  titulo: string;
  emoji?: string;
  horas?: number;
  tasks: { t: string; d?: string; done: boolean }[];
}

export interface ScoreResult {
  criterios: { codigo: string; nota: number; max: number }[];
  subtotal: number;
  bonus: number;
  total: number;
  corte: number;
  aprovado: boolean;
}

export interface TextAnalysis {
  score: number;
  keywords: { found: string[]; missing: string[] };
  charCount: number;
  hasAccents: boolean;
  suggestions: string[];
}
