import { ClayRobot } from "./ClayRobot";

export function Hero() {
  return (
    <section className="hero wrap" id="inicio" aria-labelledby="heroTitle">
      <div className="hero__copy">
        <p className="eyebrow">Laryssa Finizola · Engenheira de Software</p>
        <h1 id="heroTitle" className="hero__title">
          Construo software <mark className="hl hl--rose">agradável de usar</mark> — e <mark className="hl hl--lilac">fácil de manter.</mark>
        </h1>
        <p className="hero__lede">Interfaces que as pessoas entendem na hora. Código que a equipe evolui sem medo.</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#projetos">Ver projetos <span aria-hidden="true">→</span></a>
          <a className="btn btn--link" href="#contato">Fale comigo <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="hero__art">
        <ClayRobot />
      </div>
    </section>
  );
}
