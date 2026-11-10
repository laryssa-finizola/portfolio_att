"use client";

import { useState } from "react";
import { Code2, Database, Folder, Palette, Settings2, Terminal } from "lucide-react";
import "./lab.css";

type Skill = { name: string; title: string; detail: string };
type SkillGroup = { id: string; name: string; title: string; detail: string; evidence: string; Icon: typeof Code2; skills: Skill[] };

const groups: SkillGroup[] = [
  {
    id: "frontend", Icon: Code2, name: "Front-end", title: "Experiências que fazem sentido.", detail: "Interfaces responsivas e componentes que conectam as necessidades do produto às ações de quem usa.", evidence: "Heloire · Margem · Este portfólio",
    skills: [
      { name: "React", title: "React · Interfaces modulares", detail: "Componentes reutilizáveis e estados locais para interações como os filtros e as prévias deste portfólio." },
      { name: "Next.js", title: "Next.js · Produtos web", detail: "Rotas e componentes de servidor organizam este portfólio, isolando as partes que precisam de interação." },
      { name: "TypeScript", title: "TypeScript · Contratos explícitos", detail: "Tipos documentam os dados dos projetos e ajudam a manter consistência entre componentes." },
      { name: "Tailwind", title: "Tailwind CSS · Sistemas visuais", detail: "Estilização responsiva utilizada no projeto original e na interface demonstrativa da Margem." },
      { name: "HTML/CSS", title: "HTML e CSS · Estrutura e expressão", detail: "Semântica, layouts responsivos e transformações CSS compõem a experiência desta página." },
    ],
  },
  {
    id: "backend", Icon: Terminal, name: "Back-end", title: "Regras claras. Integrações sólidas.", detail: "Serviços com responsabilidades definidas e contratos de comunicação entre interface e regras do produto.", evidence: "Challengefy · Fullstackfy · Experiência profissional",
    skills: [
      { name: "Node.js", title: "Node.js · Serviços web", detail: "Desenvolvimento de serviços e integração com interfaces nas plataformas de recrutamento apresentadas." },
      { name: "NestJS", title: "NestJS · Organização modular", detail: "Estrutura de serviços, controladores e módulos nas experiências profissionais descritas na trajetória." },
      { name: "Java", title: "Java · Regras de domínio", detail: "Linguagem utilizada em projetos de software, incluindo o projeto acadêmico de gerenciamento de biblioteca." },
      { name: "Spring", title: "Spring Boot · APIs", detail: "Construção de aplicações web e serviços com responsabilidades organizadas, conforme a stack fornecida." },
      { name: "REST", title: "REST · Integração", detail: "Contratos HTTP conectam o front-end aos serviços. Neste portfólio, a rota de contato valida e encaminha mensagens." },
    ],
  },
  {
    id: "data", Icon: Database, name: "Dados", title: "Informações com estrutura.", detail: "Modelagem e acesso a dados fazem parte da construção do produto, com escolhas adequadas ao contexto.", evidence: "Challengefy · Fullstackfy · Projetos acadêmicos",
    skills: [
      { name: "Postgres", title: "PostgreSQL · Dados relacionais", detail: "Modelagem e consultas relacionais fazem parte da stack de dados apresentada no material profissional." },
      { name: "Firebase", title: "Firebase · Integrações", detail: "Tecnologia utilizada na stack de Challengefy e Fullstackfy, apresentada junto ao acesso ao código." },
      { name: "Prisma", title: "Prisma · Acesso a dados", detail: "Modelos e operações de persistência integram a experiência de desenvolvimento full-stack fornecida." },
      { name: "MongoDB", title: "MongoDB · Documentos", detail: "Banco orientado a documentos presente nas habilidades do portfólio original." },
      { name: "SQLite", title: "SQLite · Persistência local", detail: "Banco relacional utilizado no projeto acadêmico Memory Game informado no portfólio original." },
    ],
  },
  {
    id: "design", Icon: Palette, name: "Design & UI", title: "Interfaces com intenção.", detail: "Da primeira ideia ao componente final: hierarquia visual, prototipação e acessibilidade orientam as decisões de interface.", evidence: "Este portfólio · Heloire · Exploração de produto",
    skills: [
      { name: "Figma", title: "Figma · Do rascunho à interface", detail: "Wireframes e protótipos ajudam a organizar ideias e discutir fluxos antes de escrever código." },
      { name: "UX/UI", title: "UX/UI · Pessoas e contexto", detail: "Hierarquia, consistência e caminhos claros ajudam quem usa a encontrar o que precisa." },
      { name: "Prototipação", title: "Prototipação · Aprender antes de construir", detail: "Exploração de navegação e estados de interface para transformar uma ideia em uma proposta compreensível." },
      { name: "Acessibilidade", title: "Acessibilidade · Mais formas de navegar", detail: "Semântica, contraste, foco visível e interações por teclado fazem parte da construção deste portfólio." },
    ],
  },
  {
    id: "tools", Icon: Settings2, name: "Ferramentas e arquitetura", title: "Da ideia à evolução do código.", detail: "Prototipação, versionamento e ambientes consistentes apoiam decisões e colaboração durante o desenvolvimento.", evidence: "Challengefy · Fullstackfy · Processo de desenvolvimento",
    skills: [
      { name: "Git", title: "Git · Evolução rastreável", detail: "Branches e histórico registram decisões e permitem revisar a evolução de cada projeto." },
      { name: "Docker", title: "Docker · Ambientes consistentes", detail: "Docker e Docker Compose integram a stack dos projetos Challengefy e Fullstackfy." },
      { name: "Figma", title: "Figma · Exploração de interface", detail: "Wireframes e protótipos ajudam a discutir a experiência antes de implementar, conforme o material fornecido." },
      { name: "CI/CD", title: "CI/CD · Entrega", detail: "Práticas de automação e entrega contínua fazem parte das ferramentas apresentadas no portfólio original." },
      { name: "AWS", title: "AWS · Infraestrutura", detail: "Plataforma de nuvem incluída nas ferramentas do portfólio original, sem atribuição de certificações ou resultados." },
    ],
  },
];

export function Skills() {
  const [groupIndex, setGroupIndex] = useState(0);
  const [skillIndex, setSkillIndex] = useState<number | null>(null);
  const group = groups[groupIndex];
  const activeSkill = skillIndex === null ? null : group.skills[skillIndex];

  return (
    <section aria-labelledby="skills-title" className="skills-section section" id="habilidades">
      <div className="container">
        <div className="section-marker"><span>05.</span> HABILIDADES.EXE</div>
        <div className="skills-main">
          <div className="skills-intro">
            <div className="section-heading-icon" aria-hidden="true">✦</div>
            <h2 id="skills-title">Habilidades</h2>
            <p>Meu kit de ferramentas para tirar ideias do papel.</p>
          </div>
          <div className="folders-and-detail">
            <div className="folder-grid" role="group" aria-label="Áreas de atuação">
              {groups.map(({ id, name, Icon }, index) => (
                <button key={id} type="button" aria-pressed={index === groupIndex} aria-controls="labInsight" className={`skill-folder lab-tab${index === groupIndex ? " skill-folder-active is-active" : ""}`} onClick={() => { setGroupIndex(index); setSkillIndex(null); }}>
                  <span className="skill-folder-icon"><Folder aria-hidden="true" size={49} strokeWidth={1.45} /><Icon className="skill-icon-inner" aria-hidden="true" size={20} strokeWidth={1.8} /></span>
                  <span className="lab-tab-name">{name}</span>
                </button>
              ))}
            </div>
            <div className="skill-details lab-insight" id="labInsight">
              <div aria-live="polite" aria-atomic="true" className="lab-insight-copy">
                <span className="skill-detail-prompt">C:\PORTFOLIO\SKILLS&gt; {group.name}</span>
                <h3 className="lab-detail-title">{activeSkill?.title ?? group.title}</h3>
                <p>{activeSkill?.detail ?? group.detail}</p>
                <p className="lab-evidence"><span>CONTEXTO DE APLICAÇÃO</span><strong>{group.evidence}</strong></p>
              </div>
              <div role="group" aria-label="Tecnologias da área selecionada" className="skill-tags skill-cloud">
                {group.skills.map((skill, index) => <button key={skill.name} type="button" className="skill-tag" aria-pressed={skillIndex === index} aria-controls="labInsight" onClick={() => setSkillIndex(index)}>{skill.name}</button>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
