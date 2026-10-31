"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const links = [
  ["projetos", "Projetos"], ["laboratorio", "Laboratório"],
  ["sobre", "Sobre"], ["contato", "Contato"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = ["inicio", ...links.map(([id]) => id)]
      .map((id) => document.getElementById(id)).filter((el) => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
      const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35);
      if (current) setActive(current.id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const focusFrame = requestAnimationFrame(() => header.current?.querySelector<HTMLAnchorElement>("#navLinks a")?.focus());
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 761px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><div ref={progress} /></div>
      <header className="nav-wrap" ref={header}>
        <nav className="site-nav" aria-label="Navegação principal" onBlur={(event) => {
          if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}>
          <a className="brand" href="#inicio" aria-label="Laryssa Finizola, início" onClick={() => setOpen(false)}>
            <span className="brand-symbol">LF<span className="brand-dot">.</span></span>
            <span className="brand-caption">LARYSSA<br />FINIZOLA</span>
          </a>
          <div className={`nav-links${open ? " is-open" : ""}`} id="navLinks">
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? "is-current" : undefined}
                aria-current={active === id ? "location" : undefined} onClick={() => setOpen(false)}>{label}</a>
            ))}
          </div>
          <div className="nav-actions">
            <ThemeSwitcher />
            <a className="nav-contact" href="mailto:laryssafinizoladev@gmail.com">Vamos conversar <span aria-hidden="true">↗</span></a>
            <button ref={menuButton} className="menu-toggle" type="button" aria-controls="navLinks"
              aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)}>
              <span /><span />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
