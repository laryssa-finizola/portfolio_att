'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/data';
import { ProjectPreview, type PreviewHandle } from './ProjectPreview';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenCase: (project: Project, button: HTMLButtonElement) => void;
}

function ConceptVisual({ project }: { project: Project }) {
  if (project.id === 'alinhora') {
    return <div aria-hidden="true" className="alinhora-scene">
      <div className="alinhora-header"><strong>alinhora<span>.</span></strong><span>✳ AGENDA INTELIGENTE</span></div>
      <div className="calendar-window"><div className="calendar-title">Minha agenda <span>OUTUBRO 2026 ▾</span></div>
        <div className="calendar-days">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => <b key={index}>{day}</b>)}</div>
        <div className="calendar-dates">{['26', '27', '28', '29', '30', '31', '1'].map((day) => <span key={day} className={day === '28' ? 'selected' : ''}>{day}</span>)}</div>
        <div className="calendar-slot"><b>09:00</b><span>Horário disponível</span><i>↗</i></div>
        <div className="calendar-slot"><b>10:30</b><span>Agendamento</span><i>✓</i></div>
      </div><span className="alinhora-footer">AGENDE SEUS SERVIÇOS &nbsp; ↗</span>
    </div>;
  }
  return <div aria-hidden="true" className="rodrigues-scene"><span className="rodrigues-brow">R &nbsp; / &nbsp; TURISMO</span><div className="rodrigues-sun" /><div className="rodrigues-landscape"><i /><i /></div><div className="rodrigues-title">Viva novas<br /><em>histórias.</em></div><span className="rodrigues-signature">RODRIGUES <b>TURISMO</b></span></div>;
}

export function ProjectCard({ project, index, onOpenCase }: ProjectCardProps) {
  const preview = useRef<PreviewHandle>(null);
  const hovered = useRef(false);
  const featured = project.id === 'loop';
  const visualClass = project.id === 'challengefy' ? 'challenge' : project.id === 'fullstackfy' ? 'fullstack' : project.id;
  const caseButton = <button aria-label={`Bastidores de ${project.title}`} className={featured ? 'case-link' : undefined} onClick={(event) => { preview.current?.pause(); onOpenCase(project, event.currentTarget); }} type="button">Bastidores <span aria-hidden="true">{featured ? '↗' : '+'}</span></button>;
  const resultLink = project.result && <a className={featured ? 'feature-public-link' : undefined} href={project.result.url} rel="noopener noreferrer" target="_blank" aria-label={`${project.result.label}: ${project.title}`}>{project.result.label} <span aria-hidden="true">↗</span></a>;

  return (
    <article className={`project-card ${featured ? 'feature-project' : 'regular-project'}`} data-category={project.category}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') { hovered.current = true; preview.current?.play(); } }}
      onPointerLeave={(event) => { hovered.current = false; if (!event.currentTarget.contains(document.activeElement)) preview.current?.pause(); }}
      onFocus={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) preview.current?.play(); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget) && !hovered.current) preview.current?.pause(); }}>
      <div className={featured ? 'feature-visual feature-visual-loop' : `project-visual project-visual-${visualClass}`}>
        {project.preview ? <ProjectPreview ref={preview} project={project} featured={featured} /> : project.image ? <><Image alt={`Captura da interface do projeto ${project.title}`} src={project.image} width={960} height={600} sizes="(max-width: 760px) 80vw, 38vw" className="project-screenshot" /><span aria-hidden="true" className="image-sheen" /></> : <ConceptVisual project={project} />}
        {featured ? <div aria-hidden="true" className="loop-visual-foot"><span>LOOP 3D / IMPRESSÃO 3D</span><span>DEMONSTRAÇÃO REAL</span></div> : <><span className="visual-num">{String(index + 1).padStart(2, '0')} / 07</span><span className={`visual-status${project.id === 'margem' || project.id === 'alinhora' ? ' status-progress' : ''}`}>{project.status}</span></>}
      </div>
      {featured ? <div className="feature-copy">
        <div className="project-overline"><span>01 — PROJETO EM DESTAQUE</span><span className="project-type">{project.status}</span></div>
        <div><p className="project-prompt">{project.prompt}</p><h3 aria-label={project.title}>LOOP <span>3D</span><span aria-hidden="true" className="asterisk">✳</span></h3><p className="project-summary">{project.description}</p></div>
        <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-actions"><span className="private-note"><span aria-hidden="true" className="live-dot" /> DISPONÍVEL ONLINE</span><div className="featured-links">{resultLink}{caseButton}</div></div>
      </div> : <div className="regular-copy">
        <p className="project-prompt">{project.prompt}</p><h3>{project.title} <span aria-hidden="true">{project.id === 'heloire' || project.id === 'margem' ? '✳' : '↗'}</span></h3><p>{project.description}</p>
        <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="regular-actions">{resultLink || <span className="action-context">{project.id === 'rodrigues' ? 'APRESENTAÇÃO VISUAL' : project.status}</span>}{caseButton}</div>
      </div>}
    </article>
  );
}
