'use client';

import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/data';

/**
 * Coordena as prévias em vídeo da página: só uma toca por vez, nenhuma toca
 * com um diálogo aberto, e uma pausa feita pela pessoa é respeitada.
 */
interface PlaybackCoordinator {
  claim: (video: HTMLVideoElement, stop: () => void) => number | null;
  isCurrent: (video: HTMLVideoElement, token: number) => boolean;
  release: (video: HTMLVideoElement) => void;
  block: (blocked: boolean) => void;
  isUserPaused: (projectId: string) => boolean;
  setUserPaused: (projectId: string, paused: boolean) => void;
}
const PlaybackContext = createContext<PlaybackCoordinator | null>(null);

export function PreviewPlaybackProvider({ children }: { children: ReactNode }) {
  const playback = useRef<{ serial: number; blocked: boolean; active: { video: HTMLVideoElement; stop: () => void } | null; userPaused: Set<string> }>({ serial: 0, blocked: false, active: null, userPaused: new Set() });
  const coordinator = useMemo<PlaybackCoordinator>(() => ({
    claim(video, stop) {
      const state = playback.current;
      if (state.blocked) return null;
      const previous = state.active;
      state.active = null;
      state.serial += 1;
      previous?.stop();
      state.active = { video, stop };
      return state.serial;
    },
    isCurrent(video, token) {
      return playback.current.active?.video === video && playback.current.serial === token && !playback.current.blocked;
    },
    release(video) {
      if (playback.current.active?.video === video) {
        playback.current.active = null;
        playback.current.serial += 1;
      }
    },
    block(blocked) {
      playback.current.blocked = blocked;
      if (blocked) {
        const previous = playback.current.active;
        playback.current.active = null;
        playback.current.serial += 1;
        previous?.stop();
      }
    },
    isUserPaused(projectId) {
      return playback.current.userPaused.has(projectId);
    },
    setUserPaused(projectId, paused) {
      if (paused) playback.current.userPaused.add(projectId);
      else playback.current.userPaused.delete(projectId);
    },
  }), []);
  return <PlaybackContext.Provider value={coordinator}>{children}</PlaybackContext.Provider>;
}

export function usePreviewPlayback() {
  const coordinator = useContext(PlaybackContext);
  if (!coordinator) throw new Error('Prévia fora da galeria de projetos.');
  return coordinator;
}

export interface PreviewHandle { play: () => void; pause: () => void }
interface ConnectionPreference extends EventTarget { saveData?: boolean; effectiveType?: string }
function connectionPreference(): ConnectionPreference | undefined {
  return (navigator as Navigator & { connection?: ConnectionPreference }).connection;
}
function automaticPlaybackAllowed() {
  const connection = connectionPreference();
  return !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !connection?.saveData && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType || '');
}

interface ProjectPreviewProps { project: Project; autoplay?: boolean; controls?: boolean; sizes?: string; children?: ReactNode }

/**
 * Capa + vídeo sob demanda. Com autoplay=false (padrão), o vídeo só toca por ação explícita:
 * o botão (controls) ou o handle play() chamado no hover/foco de quem usa o componente.
 */
export const ProjectPreview = forwardRef<PreviewHandle, ProjectPreviewProps>(function ProjectPreview({ project, autoplay = false, controls = true, sizes = '(max-width: 900px) 92vw, 58vw', children }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const request = useRef(0);
  const visible = useRef(false);
  const alive = useRef(true);
  const token = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const coordinator = usePreviewPlayback();
  const preview = project.preview;

  const pause = useCallback(() => {
    request.current += 1;
    pending.current = false;
    const video = videoRef.current;
    if (video) { video.pause(); coordinator.release(video); }
    token.current = null;
    if (alive.current) setPlaying(false);
  }, [coordinator]);

  const play = useCallback(async (userInitiated = false) => {
    const video = videoRef.current;
    if (!video || !preview || unavailable || pending.current || !video.paused) return;
    if (!userInitiated && (coordinator.isUserPaused(project.id) || !automaticPlaybackAllowed() || !visible.current)) return;
    if (userInitiated) coordinator.setUserPaused(project.id, false);
    const nextToken = coordinator.claim(video, pause);
    if (nextToken === null) return;
    token.current = nextToken;
    const nextRequest = ++request.current;
    pending.current = true;
    video.muted = true;
    video.playsInline = true;
    if (!video.getAttribute('src')) video.src = preview.video;
    try {
      await video.play();
      if (!alive.current || nextRequest !== request.current || !coordinator.isCurrent(video, nextToken)) {
        // Uma promessa antiga não pode parar um pedido mais novo deste mesmo vídeo.
        if (token.current === null || !coordinator.isCurrent(video, token.current)) video.pause();
        return;
      }
      setPlaying(true);
    } catch {
      if (alive.current && nextRequest === request.current) setPlaying(false);
    } finally {
      if (nextRequest === request.current) pending.current = false;
    }
  }, [coordinator, pause, preview, project.id, unavailable]);

  useImperativeHandle(ref, () => ({ play: () => { void play(); }, pause }), [play, pause]);

  useEffect(() => {
    alive.current = true;
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = connectionPreference();
    const stop = () => {
      request.current += 1;
      pending.current = false;
      video.pause();
      coordinator.release(video);
      token.current = null;
    };
    const updatePreferences = () => { if (!automaticPlaybackAllowed()) stop(); };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.65;
        if (!visible.current) stop();
        else if (autoplay) void play();
      }
    }, { threshold: [0, 0.65] }) : null;
    if (observer) observer.observe(frame);
    else visible.current = true;
    document.addEventListener('visibilitychange', updatePreferences);
    reducedMotion.addEventListener('change', updatePreferences);
    connection?.addEventListener('change', updatePreferences);
    return () => {
      alive.current = false;
      observer?.disconnect();
      document.removeEventListener('visibilitychange', updatePreferences);
      reducedMotion.removeEventListener('change', updatePreferences);
      connection?.removeEventListener('change', updatePreferences);
      stop();
      video.removeAttribute('src');
      video.load();
    };
  }, [autoplay, coordinator, play]);

  if (!preview) return null;
  return (
    <div ref={frameRef} className={`preview${playing ? ' is-playing' : ''}`} data-video-project={project.id}>
      <div className="preview__media">
        <video ref={videoRef} aria-hidden="true" className="preview__video" loop muted playsInline preload="none"
          onPlaying={(event) => { if (token.current !== null && coordinator.isCurrent(event.currentTarget, token.current)) setPlaying(true); else event.currentTarget.pause(); }}
          onPause={() => { if (alive.current) setPlaying(false); }}
          onError={() => { if (alive.current) { pause(); setUnavailable(true); } }} />
        <Image alt={preview.alt} src={preview.poster} width={960} height={504} sizes={sizes} className="preview__poster" />
        {children}
      </div>
      {controls && <button className="preview__toggle" type="button" aria-pressed={playing} disabled={unavailable}
        aria-label={unavailable ? `Prévia indisponível de ${project.title}` : `${playing ? 'Pausar' : 'Reproduzir'} prévia de ${project.title}`}
        onClick={() => {
          if (playing) {
            coordinator.setUserPaused(project.id, true);
            pause();
          } else {
            // A ação visível confirma a reprodução, mesmo que algo já esteja carregando.
            coordinator.setUserPaused(project.id, false);
            if (!pending.current) void play(true);
          }
        }}>
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
        <span>{unavailable ? 'Prévia indisponível' : playing ? 'Pausar prévia' : 'Assistir prévia em vídeo'}</span>
      </button>}
    </div>
  );
});
