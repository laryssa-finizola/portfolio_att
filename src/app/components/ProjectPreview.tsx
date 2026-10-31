'use client';

import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/data';

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

export const ProjectPreview = forwardRef<PreviewHandle, { project: Project; featured: boolean }>(function ProjectPreview({ project, featured }, ref) {
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
        // An older promise must not stop a newer request for this same video.
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
        else {
          // Scrolling can deliver pointer/focus intent before visibility updates.
          const card = frame.closest('article');
          const desktopIntent = card?.matches(':hover') || card?.contains(document.activeElement);
          if (window.matchMedia('(hover: none), (pointer: coarse)').matches || desktopIntent) void play();
        }
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
  }, [coordinator, play]);

  if (!preview) return null;
  return (
    <div ref={frameRef} className={`preview-frame preview-frame--${featured ? 'feature' : 'regular'}${playing ? ' is-playing' : ''}`} data-video-project={project.id}>
      <div aria-hidden="true" className="preview-chrome"><span className="preview-dots"><i /><i /><i /></span><span>{project.title} / DEMONSTRAÇÃO REAL</span><span className="preview-arrow">↗</span></div>
      <div className="preview-media">
        <video ref={videoRef} aria-hidden="true" className="preview-video" loop muted playsInline preload="none" poster={preview.poster}
          onPlaying={(event) => { if (token.current !== null && coordinator.isCurrent(event.currentTarget, token.current)) setPlaying(true); else event.currentTarget.pause(); }}
          onPause={() => { if (alive.current) setPlaying(false); }}
          onError={() => { if (alive.current) { pause(); setUnavailable(true); } }} />
        <Image alt={`Prévia da interface de ${project.title}`} src={preview.poster} width={960} height={504} sizes={featured ? '(max-width: 1000px) 85vw, 44vw' : '(max-width: 760px) 80vw, 38vw'} className="preview-poster" />
        <span aria-hidden="true" className="preview-overlay" />
        <button className="preview-toggle" type="button" aria-label={unavailable ? `Prévia indisponível de ${project.title}` : `${playing ? 'Pausar' : 'Reproduzir'} prévia de ${project.title}`} aria-pressed={playing} disabled={unavailable}
          onClick={() => {
            if (playing) {
              coordinator.setUserPaused(project.id, true);
              pause();
            } else {
              // Hover/focus may already be loading: the visible Play action confirms it.
              coordinator.setUserPaused(project.id, false);
              if (!pending.current) void play(true);
            }
          }}>
          <span aria-hidden="true" className="preview-toggle-icon">{playing ? '❚❚' : '▶'}</span><span className="preview-toggle-label">{unavailable ? 'Prévia indisponível' : playing ? 'Pausar' : 'Assistir prévia'}</span>
        </button>
      </div>
    </div>
  );
});
