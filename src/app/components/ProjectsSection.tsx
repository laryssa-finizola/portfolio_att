'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { FolderOpen, Sparkles } from 'lucide-react';
import { projects, type Project, type ProjectCategory } from '@/lib/data';
import { ProjectCard } from './ProjectCard';
import { PreviewPlaybackProvider } from './ProjectPreview';
import './gallery.css';

const CaseDialog = dynamic(() => import('./CaseDialog').then(module => module.CaseDialog));
const primaryIds = ['loop', 'margem', 'heloire'];
const featured = primaryIds.map(id => projects.find(project => project.id === id)!);
const additional = projects.filter(project => !primaryIds.includes(project.id));
const filters: readonly { key: 'all' | ProjectCategory; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'landing', label: 'Landing pages' },
  { key: 'produto', label: 'Produtos digitais' },
  { key: 'repo', label: 'Repositórios' },
];

export function ProjectsSection() {
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all');
  const [showMore, setShowMore] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const visible = projects.filter(project => project.category === filter);
  const count = filter === 'all' ? featured.length + (showMore ? additional.length : 0) : visible.length;

  function openCase(project: Project, button: HTMLButtonElement) {
    trigger.current = button;
    setSelected(project);
  }

  return (
    <PreviewPlaybackProvider>
      <section aria-labelledby="projectsTitle" className="projects-section section" id="projetos">
        <div className="container">
          <div className="section-marker"><span>02.</span> PROJETOS.EXE <Sparkles size={15} aria-hidden="true" /></div>
          <div aria-label="Filtrar projetos por categoria" className="filter-controls" role="group">
            {filters.map(({ key, label }) => (
              <button key={key} aria-pressed={key === filter} aria-controls="projectGrid" className="filter-chip" onClick={() => setFilter(key)} type="button">
                {label} <span>{String(projects.filter(project => key === 'all' || project.category === key).length).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <p className="sr-only" role="status">{count} projetos exibidos.</p>
          <div id="projectGrid">
            {filter === 'all' ? <>
              <div className="project-section-layout">
                <div className="project-intro">
                  <FolderOpen size={30} className="section-heading-icon" aria-hidden="true" />
                  <h2 id="projectsTitle">Projetos<br /> em destaque</h2>
                  <p>Uma seleção do que venho construindo, unindo tecnologia, criatividade e experiência do usuário.</p>
                  <span className="tiny-note">Explore as prévias e os bastidores de cada projeto.</span>
                </div>
                <div className="featured-grid">{featured.map(project => <ProjectCard key={project.id} project={project} onOpenCase={openCase} />)}</div>
              </div>
              <div className="more-projects-area">
                <div className="more-projects-title">
                  <span><FolderOpen size={19} aria-hidden="true" /> Mais projetos <span className="count-bubble">04</span></span>
                  <button type="button" aria-expanded={showMore} aria-controls="more-projects-grid" onClick={() => setShowMore(!showMore)}>{showMore ? 'Recolher projetos −' : 'Explorar mais projetos +'}</button>
                </div>
                <div id="more-projects-grid" hidden={!showMore}>{showMore && <div className="additional-grid">{additional.map(project => <ProjectCard key={project.id} project={project} onOpenCase={openCase} />)}</div>}</div>
              </div>
            </> : <>
              <h2 id="projectsTitle" className="filtered-heading">Projetos / {filters.find(item => item.key === filter)?.label}</h2>
              <div className="filtered-grid">{visible.map(project => <ProjectCard key={project.id} project={project} onOpenCase={openCase} />)}</div>
            </>}
          </div>
          <p className="projects-note">Seis projetos têm vídeo; Challengefy tem captura da interface. Conheça o contexto nos bastidores. Os links disponíveis levam aos sites ou repositórios confirmados.</p>
        </div>
      </section>
      {selected && <CaseDialog project={selected} onClose={() => { setSelected(null); requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true })); }} />}
    </PreviewPlaybackProvider>
  );
}
