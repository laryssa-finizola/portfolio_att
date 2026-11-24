"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const links = [
  ["projetos", "Projetos"],
  ["habilidades", "Habilidades"],
  ["trajetoria", "Trajetória"],
  ["contato", "Contato"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Seção ativa: a última cujo topo já passou de 35% da janela.
  useEffect(() => {
    const sections = links.map(([id]) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = [...sections].reverse().find((s) => s.getBoundingClientRect().top <= window.innerHeight * 0.35);
      setActive(current?.id ?? null);
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
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); menuButton.current?.focus(); } };
    const outside = (e: PointerEvent) => { if (e.target instanceof Node && !header.current?.contains(e.target)) setOpen(false); };
    const desktop = window.matchMedia("(min-width: 900px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <header className="site-header" ref={header}>
      <nav className="site-nav wrap" aria-label="Navegação principal"
        onBlur={(e) => { if (e.relatedTarget instanceof Node && !e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
        <a className="brand" href="#inicio" onClick={() => setOpen(false)}>Laryssa Finizola</a>
        <ul className={`nav-links${open ? " is-open" : ""}`} id="navLinks">
          {links.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className={id === "contato" ? "nav-cta" : undefined}
                aria-current={active === id ? "location" : undefined} onClick={() => setOpen(false)}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-controls">
          <ThemeSwitcher />
          <button ref={menuButton} className="menu-toggle" type="button" aria-controls="navLinks" aria-expanded={open}
            onClick={() => setOpen(!open)}>{open ? "Fechar" : "Menu"}</button>
        </div>
      </nav>
    </header>
  );
}
