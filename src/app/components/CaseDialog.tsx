'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/lib/data';
import { usePreviewPlayback } from './ProjectPreview';

export function CaseDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const playback = usePreviewPlayback();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    playback.block(true);
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      // React StrictMode replays effects while preserving this DOM node. Closing
      // here would queue a native close event that removes the reopened dialog.
      // Removing an unmounted dialog also removes it from the browser top layer.
      document.body.style.overflow = previousOverflow;
      playback.block(false);
    };
  }, [playback]);

  function close() { dialogRef.current?.close(); }

  return (
    <dialog ref={dialogRef} className="case-dialog" aria-labelledby="dialogTitle" aria-describedby="dialogDescription" onClose={onClose}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const dialog = event.currentTarget;
        const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
          .filter((control) => control.getClientRects().length > 0 && !control.hidden);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) { event.preventDefault(); return; }
        const active = document.activeElement;
        if (event.shiftKey && (active === first || !dialog.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
          event.preventDefault();
          first.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      }}>
      <button ref={closeRef} className="dialog-close" type="button" aria-label="Fechar bastidores" onClick={close}><span aria-hidden="true">×</span></button>
      <span className="dialog-kicker">BASTIDORES / {project.status}</span>
      <h2 id="dialogTitle">{project.title}</h2>
      <p className="dialog-description" id="dialogDescription">{project.caseStudy.description}</p>
      <div className="dialog-columns">
        <div><h3 className="dialog-small">O DESAFIO</h3><p>{project.caseStudy.challenge}</p></div>
        <div><h3 className="dialog-small">A SOLUÇÃO</h3><p>{project.caseStudy.solution}</p></div>
      </div>
      <div className="dialog-decision"><h3 className="dialog-small">DECISÕES E CONTEXTO</h3><p>{project.caseStudy.decision}</p></div>
      <div className="dialog-foot">
        <div><h3 className="dialog-small">TECNOLOGIAS</h3><p>{project.caseStudy.technologies.length ? project.caseStudy.technologies.join(' · ') : 'Stack técnica não detalhada no material recebido.'}</p></div>
        {project.result && <a className="button button-accent" href={project.result.url} target="_blank" rel="noopener noreferrer">{project.result.label}<span aria-hidden="true">↗</span></a>}
      </div>
      <p className="dialog-disclaimer">Informações baseadas no material do projeto. Demonstrações e conceitos são identificados; resultados comerciais e métricas não foram presumidos.</p>
    </dialog>
  );
}
