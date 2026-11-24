/**
 * Conteúdo do portfólio — fonte única de verdade.
 * Regra editorial: só entra aqui o que está confirmado no material da Laryssa.
 * Nada de métricas, clientes ou resultados presumidos.
 */

export type ProjectStatus = 'Site publicado' | 'Em construção' | 'Em manutenção' | 'Em desenvolvimento' | 'Repositório';

export interface Project {
  id: 'loop' | 'heloire' | 'margem' | 'alinhora' | 'rodrigues' | 'challengefy' | 'fullstackfy';
  title: string;
  /** Duas ou três palavras: o tipo de projeto, mostrado na grade. */
  category: string;
  status: ProjectStatus;
  /** Uma linha: o que é. Fica disponível para leitores de tela e SEO. */
  summary: string;
  problem: string;
  solution: string;
  stack: readonly string[];
  link?: { url: string; label: string };
  /** Capa com vídeo de prévia (960×~500) ou só imagem. */
  preview?: { video: string; poster: string; alt: string };
  image?: { src: string; width: number; height: number; alt: string };
}

/** Ordem de exibição na grade de projetos. */
export const projects: readonly Project[] = [
  {
    id: 'loop', title: 'LOOP 3D Studio', category: 'Landing page', status: 'Site publicado',
    summary: 'Landing page de um estúdio de impressão 3D, com uma peça que se imprime na tela.',
    problem: 'Mostrar como a impressão 3D transforma uma ideia em objeto — sem afogar o visitante em termos técnicos.',
    solution: 'Cena com progresso de impressão e giro da peça, catálogo de criações, perguntas frequentes e chamada para orçamento via WhatsApp.',
    stack: ['React', 'Vite', 'TypeScript', 'Three.js', 'WebGL'],
    link: { url: 'https://loop-3d-studio.vercel.app/', label: 'Ver site' },
    preview: { video: '/portfolio/assets/previews/loop-preview.mp4', poster: '/portfolio/assets/previews/loop-poster.webp', alt: 'Página inicial do LOOP 3D Studio: título “Sua ideia ganha forma. Camada por camada.” ao lado de um vaso impresso em 3D, com controle para girar a peça.' },
  },
  {
    id: 'heloire', title: 'Heloire', category: 'Catálogo online', status: 'Site publicado',
    summary: 'Landing page de um ateliê de bolsas de crochê, com catálogo filtrável e pedidos pelo WhatsApp.',
    problem: 'Vender bolsas de crochê feitas à mão para quem chega pelo Instagram — sem carrinho e sem login.',
    solution: 'Vitrine com filtros por categoria, detalhes das peças, seções de marca e dúvidas frequentes; o pedido segue direto para o WhatsApp.',
    stack: ['React', 'Vite', 'TypeScript', 'CSS'],
    link: { url: 'https://heloire.vercel.app/', label: 'Ver site' },
    preview: { video: '/portfolio/assets/previews/heloire-preview.mp4', poster: '/portfolio/assets/previews/heloire-poster.webp', alt: 'Catálogo da Heloire: título “Nossas peças atuais” e quatro bolsas de crochê com variações de cor.' },
  },
  {
    id: 'rodrigues', title: 'Rodrigues Turismo', category: 'Landing page', status: 'Site publicado',
    summary: 'Landing page de turismo com destinos em destaque.',
    problem: 'Apresentar uma proposta de turismo de forma atraente e compreensível.',
    solution: 'Destinos em destaque, serviços apresentados e caminhos diretos para o contato.',
    stack: [],
    link: { url: 'https://rodrigues-tour.vercel.app/', label: 'Ver site' },
    preview: { video: '/portfolio/assets/previews/rodrigues-turismo-preview.mp4', poster: '/portfolio/assets/previews/rodrigues-turismo-poster.webp', alt: 'Página inicial da Rodrigues Turismo: título “O mundo é grande. Viva cada pedaço dele.” e foto aérea de uma praia.' },
  },
  {
    id: 'margem', title: 'Margem', category: 'Produto digital', status: 'Em construção',
    summary: 'Plataforma literária em construção: descoberta, estante, resenhas, clubes e metas de leitura.',
    problem: 'Reunir descoberta de livros, estante e convivência entre leitores em uma navegação só.',
    solution: 'Protótipo navegável com onboarding, descoberta, estante, resenhas, clubes, metas e sessões de leitura.',
    stack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'React Router', 'Zod'],
    preview: { video: '/portfolio/assets/previews/margem-preview.mp4', poster: '/portfolio/assets/previews/margem-poster.webp', alt: 'Página inicial da Margem: título “Algumas histórias foram feitas para encontrar você.” com capas de livros ilustradas.' },
  },
  {
    id: 'alinhora', title: 'Alinhora', category: 'Agendamento', status: 'Em manutenção',
    summary: 'Agendamento de serviços entre profissionais e clientes.',
    problem: 'Simplificar a descoberta de serviços e o agendamento, mantendo claras as opções de atendimento.',
    solution: 'Experiência organizada em torno de serviços, disponibilidade e marcação.',
    stack: [],
    preview: { video: '/portfolio/assets/previews/alinhora-preview.mp4', poster: '/portfolio/assets/previews/alinhora-poster.webp', alt: 'Página inicial do Alinhora: título “Sua agenda, alinhada.” ao lado de um relógio com categorias de serviços.' },
  },
  {
    id: 'challengefy', title: 'Challengefy', category: 'Plataforma web', status: 'Repositório',
    summary: 'Desafios técnicos customizáveis para processos seletivos.',
    problem: 'Organizar a criação e a apresentação de desafios técnicos em um fluxo coerente para recrutadores e candidatos.',
    solution: 'Desafios personalizados por candidato, com funcionalidades web e integração aos serviços da plataforma de recrutamento.',
    stack: ['Next.js', 'Node.js', 'Docker', 'Docker Compose', 'Firebase', 'Bootstrap', 'Sass'],
    link: { url: 'https://github.com/jrs-soft/challengefy-front', label: 'Ver repositório' },
    image: { src: '/projects/challengefy.png', width: 1906, height: 951, alt: 'Página inicial do Challengefy: título “Desafios de código gerados por IA para avaliar talento real.”' },
  },
  {
    id: 'fullstackfy', title: 'Fullstackfy', category: 'Plataforma web', status: 'Repositório',
    summary: 'Recrutamento e seleção com fluxos para diferentes perfis de usuário.',
    problem: 'Criar fluxos adequados a diferentes perfis e etapas da jornada de seleção.',
    solution: 'Interface web, APIs e integração de recursos para a experiência de recrutamento.',
    stack: ['Next.js', 'Node.js', 'Docker', 'Docker Compose', 'Firebase', 'Bootstrap', 'Sass'],
    link: { url: 'https://github.com/jrs-soft/fullstackfy-front', label: 'Ver repositório' },
    preview: { video: '/portfolio/assets/previews/fullstackfy-preview.mp4', poster: '/portfolio/assets/previews/fullstackfy-poster.webp', alt: 'Seção “Por que escolher o FullStackFy?” com quatro cartões de benefícios.' },
  },
];

export const experience = [
  { when: '2026 — agora', role: 'Estágio em Engenharia de Software', org: 'NUTES / UEPB', detail: 'APIs REST e microsserviços para saúde digital.' },
  { when: '2025 — 2026', role: 'Desenvolvimento full-stack', org: 'Jrssoft', detail: 'TypeScript, NestJS e integrações entre sistemas.' },
  { when: '2025 — 2026', role: 'Desenvolvedora Residente', org: 'Bolsa Futuro Digital por Softex, Aponti e MCTI', detail: 'Python, Django, React, Vite, JavaScript e PostgreSQL.' },
] as const;

export const contact = {
  email: 'laryssafinizoladev@gmail.com',
  phone: { href: 'tel:+5583921497340', label: '+55 (83) 92149-7340' },
  linkedin: 'https://www.linkedin.com/in/laryssafinizola/',
  github: 'https://github.com/laryssa-finizola',
  location: 'Campina Grande, Paraíba, Brasil',
} as const;
