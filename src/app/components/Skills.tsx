"use client";

import { useState, type CSSProperties } from "react";
import "./lab.css";

type Skill = { name: string; title: string; detail: string };
type SkillGroup = { id: string; name: string; core: string; title: string; detail: string; evidence: string; skills: Skill[] };

const groups: SkillGroup[] = [
  {
    id: "frontend", name: "Front-end", core: "UI", title: "Experiências que fazem sentido.", detail: "Interfaces responsivas e componentes que conectam as necessidades do produto às ações de quem usa.", evidence: "Heloire · Margem · Este portfólio",
    skills: [
      { name: "React", title: "React · Interfaces modulares", detail: "Componentes reutilizáveis e estados locais para interações como os filtros e as prévias deste portfólio." },
      { name: "Next.js", title: "Next.js · Produtos web", detail: "Rotas e componentes de servidor organizam este portfólio, isolando as partes que precisam de interação." },
      { name: "TypeScript", title: "TypeScript · Contratos explícitos", detail: "Tipos documentam os dados dos projetos e ajudam a manter consistência entre componentes." },
      { name: "Tailwind", title: "Tailwind CSS · Sistemas visuais", detail: "Estilização responsiva utilizada no projeto original e na interface demonstrativa da Margem." },
      { name: "HTML/CSS", title: "HTML e CSS · Estrutura e expressão", detail: "Semântica, layouts responsivos e transformações CSS compõem a experiência desta página." },
    ],
  },
  {
    id: "backend", name: "Back-end", core: "API", title: "Regras claras. Integrações sólidas.", detail: "Serviços com responsabilidades definidas e contratos de comunicação entre interface e regras do produto.", evidence: "Challengefy · Fullstackfy · Experiência profissional",
    skills: [
      { name: "Node.js", title: "Node.js · Serviços web", detail: "Desenvolvimento de serviços e integração com interfaces nas plataformas de recrutamento apresentadas." },
      { name: "NestJS", title: "NestJS · Organização modular", detail: "Estrutura de serviços, controladores e módulos nas experiências profissionais descritas na trajetória." },
      { name: "Java", title: "Java · Regras de domínio", detail: "Linguagem utilizada em projetos de software, incluindo o projeto acadêmico de gerenciamento de biblioteca." },
      { name: "Spring", title: "Spring Boot · APIs", detail: "Construção de aplicações web e serviços com responsabilidades organizadas, conforme a stack fornecida." },
      { name: "REST", title: "REST · Integração", detail: "Contratos HTTP conectam o front-end aos serviços. Neste portfólio, a rota de contato valida e encaminha mensagens." },
    ],
  },
  {
    id: "data", name: "Dados", core: "DB", title: "Informações com estrutura.", detail: "Modelagem e acesso a dados fazem parte da construção do produto, com escolhas adequadas ao contexto.", evidence: "Challengefy · Fullstackfy · Projetos acadêmicos",
    skills: [
      { name: "Postgres", title: "PostgreSQL · Dados relacionais", detail: "Modelagem e consultas relacionais fazem parte da stack de dados apresentada no material profissional." },
      { name: "Firebase", title: "Firebase · Integrações", detail: "Tecnologia utilizada na stack de Challengefy e Fullstackfy, apresentada junto ao acesso ao código." },
      { name: "Prisma", title: "Prisma · Acesso a dados", detail: "Modelos e operações de persistência integram a experiência de desenvolvimento full-stack fornecida." },
      { name: "MongoDB", title: "MongoDB · Documentos", detail: "Banco orientado a documentos presente nas habilidades do portfólio original." },
      { name: "SQLite", title: "SQLite · Persistência local", detail: "Banco relacional utilizado no projeto acadêmico Memory Game informado no portfólio original." },
    ],
  },
  {
    id: "tools", name: "Ferramentas e arquitetura", core: "DEV", title: "Da ideia à evolução do código.", detail: "Prototipação, versionamento e ambientes consistentes apoiam decisões e colaboração durante o desenvolvimento.", evidence: "Challengefy · Fullstackfy · Processo de desenvolvimento",
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
    <section aria-labelledby="labTitle" className="lab-section section-dark" id="laboratorio">
      <div className="shell">
        <div className="section-kicker lab-kicker"><span className="section-index">02 / 04</span><span>LABORATÓRIO / FERRAMENTAS</span></div>
        <div className="lab-heading"><div><h2 id="labTitle">Minha stack<br />tem <span>conexões.</span></h2><p>Mais do que uma lista de tecnologias, um mapa de como construo soluções completas.</p></div><div className="lab-subnote"><span className="corner-arrow" aria-hidden="true">↗</span><p>SELECIONE UMA CAMADA<br />PARA EXPLORAR</p></div></div>
        <div className="lab-grid">
          <div className="lab-left">
            <div aria-label="Áreas de atuação" className="lab-controls" role="group">{groups.map((item, index) => <button key={item.id} type="button" aria-pressed={index === groupIndex} aria-controls="labInsight skillOrbit" className={`lab-tab${index === groupIndex ? " is-active" : ""}`} onClick={() => { setGroupIndex(index); setSkillIndex(null); }}><span className="lab-tab-number">{String(index + 1).padStart(2, "0")}</span><span className="lab-tab-name">{item.name}</span><span className="lab-tab-arrow" aria-hidden="true">↗</span></button>)}</div>
            <div aria-live="polite" aria-atomic="true" className="lab-insight" id="labInsight"><span className="lab-insight-caption">CAMADA ATIVA <b>{String(groupIndex + 1).padStart(2, "0")} / 04</b></span><h3 className="lab-detail-title">{activeSkill?.title ?? group.title}</h3><p>{activeSkill?.detail ?? group.detail}</p><div className="lab-evidence"><span>CONTEXTO DE APLICAÇÃO</span><strong>{group.evidence}</strong></div></div>
            <div role="group" aria-label="Tecnologias da área selecionada" className="skill-cloud">{group.skills.map(skill => <span key={skill.name}>{skill.name}</span>)}</div>
          </div>
          <div className="lab-right">
            <div className="orbit-label"><span>TECH / EXPLORER</span><span className="orbit-coords" aria-hidden="true">X — 01 &nbsp; / &nbsp; Y — 04</span></div>
            <div role="group" aria-label={`Tecnologias de ${group.name}`} className="skill-orbit" id="skillOrbit">
              <div aria-hidden="true" className="orbit-line orbit-line-one" /><div aria-hidden="true" className="orbit-line orbit-line-two" /><div aria-hidden="true" className="orbit-line orbit-line-three" /><div aria-hidden="true" className="orbit-hairline h-line" /><div aria-hidden="true" className="orbit-hairline v-line" />
              <div className="orbit-center" aria-hidden="true"><div className="orbit-center-inner"><small>CAMADA ATIVA</small><b>{group.core}</b><span>✳</span></div></div>
              <div>{group.skills.map((skill, index) => { const angle = (-90 + index * 72) * Math.PI / 180; const style = { "--x": `${50 + 35 * Math.cos(angle)}%`, "--y": `${50 + 35 * Math.sin(angle)}%` } as CSSProperties; return <button key={`${group.id}-${skill.name}`} type="button" className={`orbit-node${skillIndex === index ? " is-active" : ""}`} style={style} aria-label={`Explorar ${skill.name}`} aria-pressed={skillIndex === index} aria-controls="labInsight" onClick={() => setSkillIndex(index)}>{skill.name}</button>; })}</div>
            </div>
            <div className="orbit-footer"><span><i className="status-pip" aria-hidden="true" /> STACK EXPLORÁVEL</span><span>CLIQUE NAS TECNOLOGIAS</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
