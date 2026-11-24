import { featuredProjects, otherProjects } from '@/lib/data';
import { PreviewPlaybackProvider, ProjectPreview } from './ProjectPreview';

export function Projects() {
  return (
    <section className="section" id="projetos" aria-labelledby="projectsTitle">
      <div className="wrap">
        <p className="section-marker"><span>01.</span> PROJETOS.EXE</p>
        <h2 id="projectsTitle" className="section-title">Projetos selecionados</h2>

        <PreviewPlaybackProvider>
          <ul className="projects">
            {featuredProjects.map((p, i) => (
              <li key={p.id} className={i === 0 ? 'project project--wide' : 'project'}>
                <ProjectPreview project={p} sizes={i === 0 ? '(max-width: 1000px) 92vw, 1280px' : '(max-width: 1000px) 92vw, 640px'} />
                <div className="project__text">
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <div className="project__meta">
                    <span className="status">{p.status}</span>
                    {p.link && <a href={p.link.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.link.label}: ${p.title} (abre em nova aba)`}>
                      {p.link.label} <span aria-hidden="true">↗</span></a>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PreviewPlaybackProvider>

        <h3 className="more-title">Mais projetos</h3>
        <ul className="more-list">
          {otherProjects.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              <span>{p.summary}</span>
              {p.link
                ? <a href={p.link.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.link.label}: ${p.title} (abre em nova aba)`}>{p.link.label} <span aria-hidden="true">↗</span></a>
                : <em>{p.status}</em>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
