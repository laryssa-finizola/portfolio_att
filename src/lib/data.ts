export type ProjectCategory = 'landing' | 'produto' | 'repo';

export interface Project {
  id: 'loop' | 'heloire' | 'margem' | 'alinhora' | 'rodrigues' | 'challengefy' | 'fullstackfy';
  title: string;
  category: ProjectCategory;
  prompt: string;
  description: string;
  status: string;
  tags: readonly string[];
  result?: { url: string; label: string };
  preview?: { video: string; poster: string };
  image?: string;
  caseStudy: {
    description: string;
    challenge: string;
    solution: string;
    technologies: readonly string[];
    decision: string;
  };
}

export const projects: readonly Project[] = [
  {
    id: 'loop', title: 'LOOP 3D Studio', category: 'landing',
    prompt: 'DESIGN, PRODUTO & INTERAÇÃO', status: 'SITE PUBLICADO',
    description: 'Uma experiência digital para um estúdio de impressão 3D, com apresentação das criações, exploração interativa e caminhos diretos para orçamento.',
    tags: ['Landing page', 'Interação 3D', 'UI / UX', 'Responsividade'],
    result: { url: 'https://loop-3d-studio.vercel.app/', label: 'Ver site' },
    preview: { video: '/portfolio/assets/previews/loop-preview.mp4', poster: '/portfolio/assets/previews/loop-poster.webp' },
    caseStudy: {
      description: 'Landing page publicada para um estúdio de impressão 3D. O hero apresenta uma peça impressa em camadas, manipulável por controles acessíveis.',
      challenge: 'Mostrar como um serviço de impressão 3D transforma ideias em objetos, sem sobrecarregar o visitante com informações técnicas.',
      solution: 'Cena com progresso de impressão e giro da peça, catálogo de criações, perguntas frequentes e chamada para orçamento via WhatsApp.',
      technologies: ['React', 'Vite', 'TypeScript', 'Three.js', 'WebGL'],
      decision: 'O site do projeto oferece alternativa SVG para dispositivos sem WebGL e controles acessíveis para explorar a peça.',
    },
  },
  {
    id: 'heloire', title: 'Heloire', category: 'landing',
    prompt: 'INTERFACE / EXPERIÊNCIA DIGITAL', status: 'SITE PUBLICADO',
    description: 'Landing page para um atelier de bolsas artesanais de crochê, com catálogo filtrável e pedidos via WhatsApp.',
    tags: ['React', 'TypeScript', 'Catálogo interativo'],
    result: { url: 'https://heloire.vercel.app/', label: 'Ver site' },
    preview: { video: '/portfolio/assets/previews/heloire-preview.mp4', poster: '/portfolio/assets/previews/heloire-poster.webp' },
    caseStudy: {
      description: 'Landing page publicada para uma marca de bolsas artesanais. Catálogo organizado por categoria e experiência pensada para visitantes vindos do Instagram.',
      challenge: 'Apresentar os produtos com um posicionamento editorial e facilitar a escolha sem exigir carrinho ou login.',
      solution: 'Vitrine com filtros de categorias, detalhes de peças, seções de marca e dúvidas frequentes, com pedidos encaminhados diretamente ao WhatsApp.',
      technologies: ['React', 'Vite', 'TypeScript', 'CSS'],
      decision: 'O fluxo de pedido usa o canal de WhatsApp da marca, mantendo a navegação simples em celulares.',
    },
  },
  {
    id: 'margem', title: 'Margem', category: 'produto',
    prompt: 'DESCOBERTA / LEITURA / COMUNIDADE', status: 'EM CONSTRUÇÃO',
    description: 'Universo literário em desenvolvimento: descoberta, estante, resenhas, clubes e metas em uma demonstração navegável.',
    tags: ['React', 'TypeScript', 'Demo de interface'],
    preview: { video: '/portfolio/assets/previews/margem-preview.mp4', poster: '/portfolio/assets/previews/margem-poster.webp' },
    caseStudy: {
      description: 'Plataforma literária em construção. A versão atual demonstra interfaces e fluxos com dados fictícios em estado local, sem persistência em servidor.',
      challenge: 'Unificar descoberta de livros, organização de leituras e convivência entre leitores em uma navegação simples e coerente.',
      solution: 'Protótipo navegável com onboarding, descoberta, estante, resenhas, clubes, metas e sessões de leitura.',
      technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'React Router', 'Zod'],
      decision: 'Dados locais permitem explorar a proposta. Integrações reais, autenticação e persistência são etapas futuras; ainda não há link público fornecido.',
    },
  },
  {
    id: 'alinhora', title: 'Alinhora', category: 'produto',
    prompt: 'SERVIÇOS / ORGANIZAÇÃO', status: 'EM MANUTENÇÃO',
    description: 'Uma proposta de agendamento de serviços para facilitar a rotina de profissionais e clientes.',
    tags: ['Agendamentos', 'Produto digital'],
    caseStudy: {
      description: 'Projeto de agendamento de serviços para profissionais e seus clientes, atualmente em manutenção.',
      challenge: 'Simplificar a descoberta de serviços e o agendamento, mantendo claras as opções de atendimento.',
      solution: 'Organização da experiência em torno de serviços, disponibilidade e marcação.',
      technologies: [],
      decision: 'A apresentação é conceitual. O projeto está em manutenção, sem link público confirmado ou stack técnica detalhada no material recebido.',
    },
  },
  {
    id: 'rodrigues', title: 'Rodrigues Turismo', category: 'landing',
    prompt: 'VIAGENS / EXPERIÊNCIA WEB', status: 'TURISMO',
    description: 'Projeto de presença digital para o segmento de turismo, com comunicação visual voltada à descoberta.',
    tags: ['Turismo', 'Interface web'],
    caseStudy: {
      description: 'Projeto web para o segmento de turismo. A apresentação visual exibida é conceitual.',
      challenge: 'Apresentar uma proposta de turismo de forma atraente e compreensível para os visitantes.',
      solution: 'O wireframe representa uma direção visual para a vitrine.',
      technologies: [],
      decision: 'Funcionalidades, implementação e link público serão detalhados quando confirmados. Nenhum endereço foi presumido.',
    },
  },
  {
    id: 'challengefy', title: 'Challengefy', category: 'repo',
    prompt: 'RECRUTAMENTO / DESAFIOS TÉCNICOS', status: 'REPOSITÓRIO',
    description: 'Plataforma de desafios técnicos customizáveis para processos seletivos.',
    tags: ['Next.js', 'Node.js', 'Docker'], image: '/projects/challengefy.png',
    result: { url: 'https://github.com/jrs-soft/challengefy-front', label: 'Ver repositório' },
    caseStudy: {
      description: 'Sistema de desafios de código para processos de seleção de talentos, apresentado através do repositório.',
      challenge: 'Organizar a criação e a apresentação de desafios técnicos em um fluxo coerente para recrutadores e candidatos.',
      solution: 'Criação de desafios personalizados para candidatos, com funcionalidades web e integração com serviços da plataforma de recrutamento.',
      technologies: ['Next.js', 'Node.js', 'Docker', 'Docker Compose', 'Firebase', 'Bootstrap', 'Sass'],
      decision: 'O acesso disponível é ao código do front-end. Não há aplicação publicada indicada nesta vitrine.',
    },
  },
  {
    id: 'fullstackfy', title: 'Fullstackfy', category: 'repo',
    prompt: 'TALENTOS / PLATAFORMA DIGITAL', status: 'REPOSITÓRIO',
    description: 'Experiência de recrutamento e seleção com diferentes perfis de usuário.',
    tags: ['Next.js', 'Node.js', 'Firebase'], image: '/projects/fullstackfy.PNG',
    result: { url: 'https://github.com/jrs-soft/fullstackfy-front', label: 'Ver repositório' },
    caseStudy: {
      description: 'Plataforma de recrutamento e seleção, apresentada através do repositório.',
      challenge: 'Criar fluxos adequados a diferentes perfis e etapas da jornada de seleção.',
      solution: 'Desenvolvimento de interface web, APIs e integração de recursos para a experiência de recrutamento.',
      technologies: ['Next.js', 'Node.js', 'Docker', 'Docker Compose', 'Firebase', 'Bootstrap', 'Sass'],
      decision: 'O repositório permite conhecer a implementação. Não há link público de aplicação fornecido.',
    },
  },
];
