'use client';

import { useRef, useState } from 'react';
import { projects, type Project, type ProjectCategory } from '@/lib/data';
import { ProjectCard } from './ProjectCard';
import { CaseDialog } from './CaseDialog';
import { PreviewPlaybackProvider } from './ProjectPreview';
import './gallery.css';

const filters: readonly { key: 'all' | ProjectCategory; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'landing', label: 'Landing pages' },
  { key: 'produto', label: 'Produtos digitais' },
  { key: 'repo', label: 'Repositórios' },
];

export function ProjectsSection() {
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const visible = projects.filter((project) => filter === 'all' || project.category === filter);

  function openCase(project: Project, button: HTMLButtonElement) {
    trigger.current = button;
    setSelected(project);
  }

  return (
    <PreviewPlaybackProvider>
      <section aria-labelledby="projectsTitle" className="projects-section section-paper" id="projetos">
        <div className="shell">
          <div className="section-head projects-head">
            <div className="section-kicker"><span className="section-index">01 / 04</span><span>SELEÇÃO DE PROJETOS</span></div>
            <div className="head-main">
              <h2 id="projectsTitle">Projetos não são<br />apenas <em>telas.</em></h2>
              <div className="head-aside"><div aria-hidden="true" className="plus-circle">↗</div><p>Conheça a lógica, os desafios e as decisões por trás do que construo.</p></div>
            </div>
            <div aria-label="Filtrar projetos por categoria" className="filter-row" role="group">
              <div className="filter-controls">
                {filters.map(({ key, label }) => (
                  <button key={key} aria-pressed={key === filter} aria-controls="projectGrid" className={`filter-chip${key === filter ? ' is-active' : ''}`} onClick={() => setFilter(key)} type="button">
                    {label} <span>{String(projects.filter((project) => key === 'all' || project.category === key).length).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
              <span aria-hidden="true" className="filter-aside">ESCOLHA UM PROJETO &nbsp; ↘</span>
            </div>
          </div>
          <p className="sr-only" role="status">{visible.length} projetos exibidos.</p>
          <div className="project-grid" id="projectGrid">
            {visible.map((project) => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} onOpenCase={openCase} />)}
          </div>
          <p className="projects-note"><span aria-hidden="true">✳</span> LOOP 3D Studio, Heloire e Margem têm prévias reais. Alinhora e Rodrigues Turismo usam composições conceituais. Challengefy e Fullstackfy são apresentados por seus repositórios. Projetos sem link público confirmado têm apenas bastidores.</p>
        </div>
      </section>
      {selected && <CaseDialog project={selected} onClose={() => { setSelected(null); trigger.current?.focus(); }} />}
    </PreviewPlaybackProvider>
  );
}
