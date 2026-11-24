'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { projects, type Project } from '@/lib/data';
import { PreviewPlaybackProvider, ProjectPreview, type PreviewHandle } from './ProjectPreview';

const SIZES = '(max-width: 760px) 92vw, 640px';

/** Grade minimalista: imagem, nome e categoria. No hover/foco, a prévia em vídeo toca sozinha. */
function ProjectTile({ project }: { project: Project }) {
  const preview = useRef<PreviewHandle>(null);
  const media = project.preview
    ? <ProjectPreview ref={preview} project={project} controls={false} sizes={SIZES} />
    : project.image && (
      <div className="preview"><div className="preview__media">
        <Image className="preview__poster" src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes={SIZES} />
      </div></div>
    );
  const caption = (
    <span className="tile__caption">
      <span className="tile__title">{project.title}</span>
      <span className="tile__meta">
        {project.link ? 'Visualizar' : project.status}
        {project.link && <span className="tile__arrow" aria-hidden="true"> ↗</span>}
      </span>
    </span>
  );
  const intent = {
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') preview.current?.play(); },
    onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') preview.current?.pause(); },
  };

  return (
    <li className={`tile${project.link ? ' tile--link' : ''}`} {...intent}>
      {project.link ? (
        <a href={project.link.url} target="_blank" rel="noopener noreferrer"
          aria-label={`${project.title} — ${project.category}. ${project.link.label} (abre em nova aba)`}
          onFocus={() => preview.current?.play()} onBlur={() => preview.current?.pause()}>
          {media}{caption}
        </a>
      ) : (
        <div>{media}{caption}</div>
      )}
      <p className="sr-only">{project.summary}</p>
    </li>
  );
}

export function Projects() {
  return (
    <section className="section" id="projetos" aria-labelledby="projectsTitle">
      <div className="wrap">
        <p className="section-marker"><span>01.</span> PROJETOS.EXE</p>
        <h2 id="projectsTitle" className="section-title">Projetos</h2>
        <PreviewPlaybackProvider>
          <ul className="tiles">
            {projects.map((p) => <ProjectTile key={p.id} project={p} />)}
          </ul>
        </PreviewPlaybackProvider>
      </div>
    </section>
  );
}
