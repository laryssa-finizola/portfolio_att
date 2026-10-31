import { ArchitectureScene } from "./ArchitectureScene";

export function Hero() {
  return (
    <section aria-labelledby="heroTitle" className="hero section-dark" id="inicio">
      <div aria-hidden="true" className="hero-back-grid" />
      <div className="hero-content shell">
        <div className="hero-left">
          <div className="eyebrow"><span className="status-pip" aria-hidden="true" /><span>PORTFÓLIO / 2026</span><span className="eyebrow-slash" aria-hidden="true">—</span><span>DESENVOLVEDORA FULL-STACK</span></div>
          <p className="hero-overline">Olá, eu sou Laryssa Finizola <span aria-hidden="true">✳</span></p>
          <h1 id="heroTitle">Transformo<br /><span className="outline-word">ideias</span> em<br /><span className="highlight-word">sistemas<span className="star-spark" aria-hidden="true">✳</span></span><span className="period">.</span></h1>
          <p className="hero-description">Da interface à arquitetura de dados, desenvolvo produtos digitais que combinam <strong>experiência, lógica e propósito.</strong></p>
          <div className="hero-actions"><a className="button button-accent" href="#projetos"><span>Explorar meu trabalho</span><span aria-hidden="true" className="button-arrow">↗</span></a><a className="button button-ghost" href="#laboratorio"><span>Conheça meu processo</span><span aria-hidden="true">↓</span></a></div>
          <div className="hero-footnote"><span aria-hidden="true" className="tiny-cross">✳</span><span>ENGENHARIA DE SOFTWARE<br />COM OLHAR DE PRODUTO</span><span className="hero-footline" aria-hidden="true" /><span>DESLIZE PARA EXPLORAR</span></div>
        </div>
        <ArchitectureScene />
      </div>
      <div aria-hidden="true" className="hero-corner-mark">LF—26 / WEB EXPERIENCES</div>
    </section>
  );
}
