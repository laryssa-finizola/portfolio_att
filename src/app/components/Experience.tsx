import { ArrowUpRight, BriefcaseBusiness, GraduationCap } from "lucide-react";

export function Experience() {
  return (
    <section id="experiencia" className="retro-panel experience-panel" aria-labelledby="experienceTitle">
      <div className="retro-titlebar"><span><BriefcaseBusiness size={15} aria-hidden="true" /> 04. EXPERIENCIA.EXE</span><span aria-hidden="true" className="retro-controls">_ □ ×</span></div>
      <div className="experience-inner">
        <div className="experience-overview"><div className="pixel-monitor" aria-hidden="true"><span>♡</span><i /></div><h2 id="experienceTitle">Experiência</h2><p>Minha trajetória entre desenvolvimento, produtos e aprendizado contínuo.</p></div>
        <ol className="experience-timeline">
          <li><time>2026 — atual</time><h3>Estágio em Engenharia de Software</h3><p>NUTES / UEPB</p><span>APIs REST · Microserviços · Saúde digital</span></li>
          <li><time>2025 — atual</time><h3>Desenvolvimento Full-stack</h3><p>Jrssoft</p><span>TypeScript · NestJS · Integrações</span></li>
          <li><div className="timeline-education"><GraduationCap size={17} aria-hidden="true" /><span>Ciência da Computação · UEPB</span></div></li>
        </ol>
      </div>
      <a className="experience-link" href="https://www.linkedin.com/in/laryssafinizola/" rel="noopener noreferrer" target="_blank">Conhecer minha trajetória completa <ArrowUpRight size={16} aria-hidden="true" /></a>
    </section>
  );
}
