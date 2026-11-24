/**
 * Conteúdo do portfólio — fonte única de verdade.
 * Regra editorial: só entra aqui o que está confirmado no material da Laryssa.
 * Nada de métricas, clientes ou resultados presumidos.
 */

export type ProjectStatus = 'Site publicado' | 'Em construção' | 'Em manutenção' | 'Em desenvolvimento' | 'Repositório';

export interface Project {
  id: 'loop' | 'heloire' | 'margem' | 'alinhora' | 'rodrigues' | 'challengefy' | 'fullstackfy';
  title: string;
  status: ProjectStatus;
  /** Uma linha: o que é. Usada no índice e no SEO. */
  summary: string;
  /** O problema, na voz de quem tem o problema. */
  problem: string;
  solution: string;
  stack: readonly string[];
  link?: { url: string; label: string };
  preview?: { video: string; poster: string; alt: string };
}

export const featuredProjects: readonly Project[] = [
  {
    id: 'loop', title: 'LOOP 3D Studio', status: 'Site publicado',
    summary: 'Landing page de um estúdio de impressão 3D, com uma peça que se imprime na tela.',
    problem: 'Mostrar como a impressão 3D transforma uma ideia em objeto — sem afogar o visitante em termos técnicos.',
    solution: 'Cena com progresso de impressão e giro da peça, catálogo de criações, perguntas frequentes e chamada para orçamento via WhatsApp.',
    stack: ['React', 'Vite', 'TypeScript', 'Three.js', 'WebGL'],
    link: { url: 'https://loop-3d-studio.vercel.app/', label: 'Ver site publicado' },
    preview: { video: '/portfolio/assets/previews/loop-preview.mp4', poster: '/portfolio/assets/previews/loop-poster.webp', alt: 'Página inicial do LOOP 3D Studio: título “Sua ideia ganha forma. Camada por camada.” ao lado de um vaso impresso em 3D, com controle para girar a peça.' },
  },
  {
    id: 'heloire', title: 'Heloire', status: 'Site publicado',
    summary: 'Landing page de um ateliê de bolsas de crochê, com catálogo filtrável e pedidos pelo WhatsApp.',
    problem: 'Vender bolsas de crochê feitas à mão para quem chega pelo Instagram — sem carrinho e sem login.',
    solution: 'Vitrine com filtros por categoria, detalhes das peças, seções de marca e dúvidas frequentes; o pedido segue direto para o WhatsApp.',
    stack: ['React', 'Vite', 'TypeScript', 'CSS'],
    link: { url: 'https://heloire.vercel.app/', label: 'Ver site publicado' },
    preview: { video: '/portfolio/assets/previews/heloire-preview.mp4', poster: '/portfolio/assets/previews/heloire-poster.webp', alt: 'Catálogo da Heloire: título “Nossas peças atuais” e quatro bolsas de crochê com variações de cor.' },
  },
  {
    id: 'margem', title: 'Margem', status: 'Em construção',
    summary: 'Plataforma literária em construção: descoberta, estante, resenhas, clubes e metas de leitura.',
    problem: 'Reunir descoberta de livros, estante e convivência entre leitores em uma navegação só.',
    solution: 'Protótipo navegável com onboarding, descoberta, estante, resenhas, clubes, metas e sessões de leitura.',
    stack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'React Router', 'Zod'],
    preview: { video: '/portfolio/assets/previews/margem-preview.mp4', poster: '/portfolio/assets/previews/margem-poster.webp', alt: 'Página inicial da Margem: título “Algumas histórias foram feitas para encontrar você.” com capas de livros ilustradas.' },
  },
];

export const otherProjects: readonly Project[] = [
  {
    id: 'challengefy', title: 'Challengefy', status: 'Repositório',
    summary: 'Desafios técnicos customizáveis para processos seletivos.',
    problem: 'Organizar a criação e a apresentação de desafios técnicos em um fluxo coerente para recrutadores e candidatos.',
    solution: 'Desafios personalizados por candidato, com funcionalidades web e integração aos serviços da plataforma de recrutamento.',
    stack: ['Next.js', 'Node.js', 'Docker', 'Docker Compose', 'Firebase', 'Bootstrap', 'Sass'],
    link: { url: 'https://github.com/jrs-soft/challengefy-front', label: 'Repositório' },
  },
  {
    id: 'fullstackfy', title: 'Fullstackfy', status: 'Repositório',
    summary: 'Recrutamento e seleção com fluxos para diferentes perfis de usuário.',
    problem: 'Criar fluxos adequados a diferentes perfis e etapas da jornada de seleção.',
    solution: 'Interface web, APIs e integração de recursos para a experiência de recrutamento.',
    stack: ['Next.js', 'Node.js', 'Docker', 'Docker Compose', 'Firebase', 'Bootstrap', 'Sass'],
    link: { url: 'https://github.com/jrs-soft/fullstackfy-front', label: 'Repositório' },
  },
  {
    id: 'alinhora', title: 'Alinhora', status: 'Em manutenção',
    summary: 'Agendamento de serviços entre profissionais e clientes.',
    problem: 'Simplificar a descoberta de serviços e o agendamento, mantendo claras as opções de atendimento.',
    solution: 'Experiência organizada em torno de serviços, disponibilidade e marcação.',
    stack: [],
  },
  {
    id: 'rodrigues', title: 'Rodrigues Turismo', status: 'Em desenvolvimento',
    summary: 'Landing page de turismo com destinos em destaque.',
    problem: 'Apresentar uma proposta de turismo de forma atraente e compreensível.',
    solution: 'Destinos em destaque, serviços apresentados e caminhos diretos para o contato.',
    stack: [],
  },
];

export const experience = [
  { when: '2026 — agora', role: 'Estágio em Engenharia de Software', org: 'NUTES / UEPB', detail: 'APIs REST e microsserviços para saúde digital.' },
  { when: '2025 — agora', role: 'Desenvolvimento full-stack', org: 'Jrssoft', detail: 'TypeScript, NestJS e integrações entre sistemas.' },
  { when: 'em curso', role: 'Bacharelado em Ciência da Computação', org: 'UEPB', detail: 'Universidade Estadual da Paraíba.' },
] as const;

export const contact = {
  email: 'laryssafinizoladev@gmail.com',
  phone: { href: 'tel:+5583921497340', label: '+55 (83) 92149-7340' },
  linkedin: 'https://www.linkedin.com/in/laryssafinizola/',
  github: 'https://github.com/laryssa-finizola',
  location: 'Campina Grande, Paraíba, Brasil',
} as const;
