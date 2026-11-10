'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
import type { Project } from '@/lib/data';
import { ProjectPreview, type PreviewHandle } from './ProjectPreview';

interface ProjectCardProps {
  project: Project;
  onOpenCase: (project: Project, button: HTMLButtonElement) => void;
}

export function ProjectCard({ project, onOpenCase }: ProjectCardProps) {
  const preview = useRef<PreviewHandle>(null);
  const hovered = useRef(false);

  return (
    <article className="project-card project-item" data-category={project.category}
      onPointerEnter={event => { if (event.pointerType === 'mouse') { hovered.current = true; preview.current?.play(); } }}
      onPointerLeave={event => { hovered.current = false; if (!event.currentTarget.contains(document.activeElement)) preview.current?.pause(); }}
      onFocus={event => { if (!event.currentTarget.contains(event.relatedTarget)) preview.current?.play(); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !hovered.current) preview.current?.pause(); }}>
      {project.preview ? <ProjectPreview ref={preview} project={project} featured={false} /> : <>
        <div className="project-window-bar"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>{project.title}</span><span className="window-mini-controls" aria-hidden="true">_ □ ×</span></div>
        <div className="project-media">{project.image ? <Image alt={`Captura da interface do projeto ${project.title}`} src={project.image} width={960} height={600} sizes="(max-width: 800px) 90vw, (max-width: 1100px) 44vw, 26vw" /> : <div className="project-no-visual" aria-hidden="true"><FolderOpen size={60} /></div>}</div>
      </>}
      <div className="project-card-body">
        <div className="project-title-row"><h3>{project.title}</h3>{project.result && <a className="icon-square" href={project.result.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.result.label}: ${project.title}`}><ArrowUpRight size={18} aria-hidden="true" /></a>}</div>
        <p>{project.description}</p>
        <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <div className="project-bottom"><span className="status-chip">{project.status}</span><button className="project-detail-link" type="button" aria-label={`Bastidores de ${project.title}`} onClick={event => { preview.current?.pause(); onOpenCase(project, event.currentTarget); }}>Bastidores <span aria-hidden="true">↗</span></button></div>
      </div>
    </article>
  );
}
