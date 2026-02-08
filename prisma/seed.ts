import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user (Lucas)
  const passwordHash = await hash("edital2026", 12);
  const user = await prisma.user.upsert({
    where: { email: "lucas@email.com" },
    update: {},
    create: {
      email: "lucas@email.com",
      passwordHash,
      name: "Lucas Leocadio de Almeida",
      cpf: "000.000.000-00",
      cidade: "Caruaru",
      area: "Cultura",
      plan: "free",
    },
  });

  console.log(`User created: ${user.email}`);

  // Create Edital 003/2026 - Lei Aldir Blanc PE
  const edital = await prisma.edital.create({
    data: {
      userId: user.id,
      nome: "Edital 003/2026 - Aldir Blanc PE - Agreste",
      orgao: "Secretaria de Cultura de Pernambuco - SECULT/PE",
      tipo: "cultural",
      valor: 30000,
      valorExato: true,
      prazo: new Date("2026-03-15"),
      plataforma: "mapacultural.pe.gov.br",
      status: "active",
      restricoes: [
        "Maximo 8.000 caracteres por campo",
        "Plataforma NAO aceita acentos nos textos",
        "Orcamento deve ser EXATAMENTE R$ 30.000,00",
        "3 cotacoes por item de orcamento",
        "Candidato deve residir no Agreste de PE",
      ],

      // Candidato
      candidato: {
        create: {
          nome: "Lucas Leocadio de Almeida",
          cpf: "000.000.000-00",
          cidade: "Caruaru",
          area: "Producao Cultural",
          cotas: ["PCD"],
        },
      },

      // 8 Campos de texto
      campos: {
        create: [
          {
            ordem: 0,
            criterioId: "a",
            nome: "Objeto da Proposta",
            curto: "Objeto",
            placeholder: "Descreva o objetivo geral e especificos do projeto cultural...",
            maxChars: 8000,
            template: "O presente projeto tem como objetivo principal [DESCREVER OBJETIVO].\n\nOs objetivos especificos sao:\n1. [OBJETIVO 1]\n2. [OBJETIVO 2]\n3. [OBJETIVO 3]\n\nO projeto se justifica pela necessidade de [JUSTIFICATIVA] na regiao do Agreste pernambucano, especificamente em [CIDADE/REGIAO].\n\nA proposta contempla [ATIVIDADES PRINCIPAIS], beneficiando diretamente [PUBLICO-ALVO] e contribuindo para o fortalecimento da cultura local.",
          },
          {
            ordem: 1,
            criterioId: "b",
            nome: "Oportunidades Geradas pelo Projeto",
            curto: "Oportunidades",
            placeholder: "Descreva as oportunidades que o projeto gera para a comunidade...",
            maxChars: 8000,
            template: "O projeto gera as seguintes oportunidades para a comunidade:\n\nACESSO CULTURAL: [DESCREVER]\n\nFORMACAO: [DESCREVER]\n\nGERACAO DE RENDA: [DESCREVER]\n\nINCLUSAO: [DESCREVER]\n\nO publico beneficiario direto sera de aproximadamente [NUMERO] pessoas, incluindo [GRUPOS ESPECIFICOS].",
          },
          {
            ordem: 2,
            criterioId: "c",
            nome: "Trajetoria Cultural do Proponente",
            curto: "Trajetoria",
            placeholder: "Descreva sua experiencia e trajetoria na area cultural...",
            maxChars: 8000,
            template: "FORMACAO E EXPERIENCIA:\n[DESCREVER FORMACAO]\n\nPRINCIPAIS REALIZACOES:\n1. [REALIZACAO 1] - [ANO]\n2. [REALIZACAO 2] - [ANO]\n3. [REALIZACAO 3] - [ANO]\n\nPARTICIPACAO EM PROJETOS ANTERIORES:\n[LISTAR PROJETOS]\n\nRECONHECIMENTOS:\n[PREMIOS, CERTIFICADOS, ETC]",
          },
          {
            ordem: 3,
            criterioId: "d",
            nome: "Resultados e Metas Esperados",
            curto: "Resultados",
            placeholder: "Defina metas mensuraveis e resultados esperados...",
            maxChars: 8000,
            template: "METAS QUANTITATIVAS:\n- Meta 1: [DESCRICAO] - Indicador: [NUMERO/METRICA]\n- Meta 2: [DESCRICAO] - Indicador: [NUMERO/METRICA]\n- Meta 3: [DESCRICAO] - Indicador: [NUMERO/METRICA]\n\nRESULTADOS ESPERADOS:\n1. [RESULTADO 1]\n2. [RESULTADO 2]\n3. [RESULTADO 3]\n\nINDICADORES DE IMPACTO:\n- [INDICADOR 1]\n- [INDICADOR 2]",
          },
          {
            ordem: 4,
            criterioId: "f",
            nome: "Sustentabilidade do Projeto",
            curto: "Sustentabilidade",
            placeholder: "Como o projeto se sustenta apos o financiamento...",
            maxChars: 8000,
          },
          {
            ordem: 5,
            criterioId: "g",
            nome: "Justificativa e Relevancia",
            curto: "Justificativa",
            placeholder: "Justifique a importancia e relevancia do projeto...",
            maxChars: 8000,
          },
          {
            ordem: 6,
            criterioId: "h",
            nome: "Emprego e Renda",
            curto: "Emprego",
            placeholder: "Como o projeto gera emprego e renda na cadeia produtiva...",
            maxChars: 8000,
          },
          {
            ordem: 7,
            criterioId: "j",
            nome: "Valor Social e Impacto no Territorio",
            curto: "Valor Social",
            placeholder: "Descreva o valor social e impacto no territorio...",
            maxChars: 8000,
          },
        ],
      },

      // 10 Criterios de avaliacao
      criterios: {
        create: [
          { codigo: "a", nome: "Qualidade do objeto da proposta apresentada", curto: "Objeto", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar clareza, coerencia e viabilidade do projeto proposto" },
          { codigo: "b", nome: "Oportunidades geradas pelo projeto", curto: "Oportunidades", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar o potencial de acesso e alcance do projeto" },
          { codigo: "c", nome: "Trajetoria cultural do proponente", curto: "Trajetoria", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar experiencia e portfolio do candidato" },
          { codigo: "d", nome: "Resultados e metas esperados", curto: "Resultados", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar se metas sao mensuraveis e realistas" },
          { codigo: "e", nome: "Acessibilidade e inclusao", curto: "Acessibilidade", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar acoes de acessibilidade e inclusao" },
          { codigo: "f", nome: "Sustentabilidade apos o projeto", curto: "Sustentabilidade", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar continuidade e legado do projeto" },
          { codigo: "g", nome: "Justificativa e relevancia", curto: "Justificativa", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar contexto e necessidade do projeto" },
          { codigo: "h", nome: "Emprego e renda gerados", curto: "Emprego", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar impacto na cadeia produtiva cultural" },
          { codigo: "i", nome: "Inovacao e criatividade", curto: "Inovacao", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar originalidade e experimentacao" },
          { codigo: "j", nome: "Valor social e impacto no territorio", curto: "Valor Social", peso: 10, escala: [0, 3, 5, 7, 10], dica: "Avaliar transformacao social e identidade territorial" },
        ],
      },

      // Bonus de inducao
      bonus: {
        create: [
          { nome: "Pertencimento PCD", pontos: 15, destaque: true, descricao: "Proponente e Pessoa com Deficiencia (requer Laudo Medico Anexo VII)" },
          { nome: "Pertencimento Negro(a)", pontos: 15, destaque: false, descricao: "Proponente autodeclarado negro(a)" },
          { nome: "Pertencimento Indigena", pontos: 15, destaque: false, descricao: "Proponente autodeclarado indigena" },
          { nome: "Territorio Agreste", pontos: 15, destaque: true, descricao: "Proponente residente no Agreste pernambucano" },
        ],
      },

      // Orcamento sugerido
      orcamento: {
        create: [
          { nome: "Producao Artistica", valor: 8000, descricao: "Caches artisticos e producao cultural" },
          { nome: "Equipamentos e Materiais", valor: 5000, descricao: "Locacao/compra de equipamentos" },
          { nome: "Logistica e Transporte", valor: 3000, descricao: "Deslocamentos e frete" },
          { nome: "Comunicacao e Divulgacao", valor: 3000, descricao: "Material grafico, redes sociais, assessoria" },
          { nome: "Alimentacao e Hospedagem", valor: 2500, descricao: "Alimentacao da equipe e convidados" },
          { nome: "Encargos e Impostos", valor: 3500, descricao: "INSS, ISS, IR e encargos trabalhistas" },
          { nome: "Acessibilidade", valor: 2000, descricao: "Interprete de Libras, material em Braille, rampas" },
          { nome: "Documentacao e Registro", valor: 1500, descricao: "Fotografia, video, registro audiovisual" },
          { nome: "Gestao e Administracao", valor: 1500, descricao: "Prestacao de contas, contabilidade" },
        ],
      },

      // Timeline (10 dias)
      timeline: {
        create: [
          {
            dia: 1, titulo: "Planejamento", emoji: "📋", horas: 8,
            tasks: [
              { t: "Ler edital completo (PDF)", d: "Baixar e ler todas as paginas", done: false },
              { t: "Criar conta na plataforma", d: "mapacultural.pe.gov.br", done: false },
              { t: "Reunir documentos pessoais", d: "RG, CPF, comprovante residencia", done: false },
              { t: "Obter Laudo Medico PCD (Anexo VII)", d: "Nome, CID, descricao, CRM", done: false },
            ],
          },
          {
            dia: 2, titulo: "Objeto e Justificativa", emoji: "✍️", horas: 6,
            tasks: [
              { t: "Escrever campo Objeto da Proposta", d: "Maximo 8000 chars, sem acentos", done: false },
              { t: "Escrever campo Justificativa", d: "Relevancia e contexto", done: false },
              { t: "Revisar com detector de acentos", done: false },
            ],
          },
          {
            dia: 3, titulo: "Trajetoria e Oportunidades", emoji: "📝", horas: 6,
            tasks: [
              { t: "Escrever campo Trajetoria Cultural", d: "Portfolio e experiencia", done: false },
              { t: "Escrever campo Oportunidades Geradas", d: "Acesso e beneficiarios", done: false },
            ],
          },
          {
            dia: 4, titulo: "Resultados e Sustentabilidade", emoji: "📊", horas: 6,
            tasks: [
              { t: "Escrever campo Resultados e Metas", d: "Metas mensuraveis", done: false },
              { t: "Escrever campo Sustentabilidade", d: "Continuidade pos-projeto", done: false },
            ],
          },
          {
            dia: 5, titulo: "Emprego e Valor Social", emoji: "💼", horas: 6,
            tasks: [
              { t: "Escrever campo Emprego e Renda", d: "Cadeia produtiva", done: false },
              { t: "Escrever campo Valor Social", d: "Impacto territorial", done: false },
            ],
          },
          {
            dia: 6, titulo: "Orcamento", emoji: "💰", horas: 4,
            tasks: [
              { t: "Detalhar itens do orcamento", d: "Total = R$ 30.000", done: false },
              { t: "Obter 3 cotacoes por item", d: "Lojas locais de Caruaru", done: false },
              { t: "Verificar balanco (deve fechar exato)", done: false },
            ],
          },
          {
            dia: 7, titulo: "Revisao Geral", emoji: "🔍", horas: 4,
            tasks: [
              { t: "Revisar todos os 8 textos", done: false },
              { t: "Remover todos os acentos", done: false },
              { t: "Verificar contagem de caracteres", done: false },
              { t: "Rodar Quality Gate", done: false },
            ],
          },
          {
            dia: 8, titulo: "Documentacao", emoji: "📄", horas: 4,
            tasks: [
              { t: "Escanear documentos pessoais", done: false },
              { t: "Preparar Laudo Medico PCD", done: false },
              { t: "Organizar portfolio comprobatorio", done: false },
            ],
          },
          {
            dia: 9, titulo: "Submissao", emoji: "🚀", horas: 4,
            tasks: [
              { t: "Preencher formulario na plataforma", done: false },
              { t: "Anexar documentos", done: false },
              { t: "Conferir dados antes de enviar", done: false },
              { t: "SUBMETER candidatura", done: false },
            ],
          },
          {
            dia: 10, titulo: "Pos-Submissao", emoji: "✅", horas: 2,
            tasks: [
              { t: "Salvar comprovante de submissao", done: false },
              { t: "Exportar PDF da proposta", done: false },
              { t: "Anotar data de resultado", done: false },
            ],
          },
        ],
      },
    },
  });

  console.log(`Edital created: ${edital.nome}`);
  console.log("\nSeed completed!");
  console.log("Login: lucas@email.com / edital2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
