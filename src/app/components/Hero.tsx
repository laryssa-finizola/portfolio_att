import Image from "next/image";
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-section" id="inicio" aria-labelledby="heroTitle">
      <div className="hero-inner container">
        <div className="hero-copy">
          <h1 id="heroTitle">Olá, eu sou<br /><span className="pixel-name">Laryssa Finizola<span className="typing-cursor" aria-hidden="true">|</span></span></h1>
          <p>Transformo ideias em soluções digitais<br className="desktop-break" /> com foco em impacto, usabilidade e qualidade.</p>
          <div className="hero-buttons">
            <a className="btn btn-primary" href="#projetos">Ver projetos <ArrowRight size={19} aria-hidden="true" /></a>
            <a className="btn btn-secondary" href="#contato">Converse comigo <ArrowDown size={19} aria-hidden="true" /></a>
          </div>
          <div className="social-strip" aria-label="Redes e contato">
            <a href="https://github.com/laryssa-finizola" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={22} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/laryssafinizola/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={22} aria-hidden="true" /></a>
            <a href="mailto:laryssafinizoladev@gmail.com" aria-label="Enviar e-mail"><Mail size={24} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="hero-art">
          <Image src="/portfolio/assets/hero-dino.webp" alt="Janela retrô LF.exe com um dinossauro rosa em pixel art, corações, nuvens e estrelas." width={1195} height={560} sizes="(max-width: 680px) 100vw, (max-width: 1280px) 53vw, 690px" loading="eager" />
          <span className="hero-art-caption" aria-hidden="true">hello, world! ♡</span>
        </div>
      </div>
      <div className="pixel-divider" aria-hidden="true" />
    </section>
  );
}
