import Image from 'next/image';
import { contact, experience } from '@/lib/data';

export function Trajectory() {
  return (
    <section className="section" id="trajetoria" aria-labelledby="trajTitle">
      <div className="wrap">
        <p className="section-marker"><span>03.</span> TRAJETÓRIA.EXE</p>
        <div className="trajectory">
          <div className="trajectory__bio">
            <h2 id="trajTitle">Gosto de entender o problema antes de propor a solução.</h2>
            <p>
              Estudo Ciência da Computação na Universidade Estadual da Paraíba e trabalho com desenvolvimento web de ponta a ponta.
              O que me move é conectar decisões de interface, arquitetura e dados em um produto consistente — com aprendizado contínuo,
              comunicação e colaboração como parte do trabalho.
            </p>
            <Image className="sticker" src="/portfolio/assets/about-illustration.webp" alt="Ilustração de Laryssa: cabelos escuros, notebook com o símbolo de código e um gatinho ao lado."
              width={800} height={543} sizes="220px" />
          </div>
          <div className="log">
            <p className="log__cmd" aria-hidden="true">git log --trajetoria</p>
            <ol>
              {experience.map((e) => (
                <li key={e.role}>
                  <span className="log__when">{e.when}</span>
                  <div>
                    <h3>{e.role}</h3>
                    <p className="log__org">{e.org}</p>
                    <p>{e.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a className="btn btn--link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">Trajetória completa no LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
