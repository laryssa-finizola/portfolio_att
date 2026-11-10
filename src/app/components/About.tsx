import Image from "next/image";
import { Heart, Code2, Lightbulb, Boxes } from "lucide-react";

export function About() {
  return (
    <section id="sobre" className="retro-panel about-panel" aria-labelledby="aboutTitle">
      <div className="retro-titlebar"><span><Heart size={15} aria-hidden="true" /> 03. SOBRE.EXE</span><span aria-hidden="true" className="retro-controls">_ □ ×</span></div>
      <div className="about-inner">
        <div className="about-figure"><Image src="/portfolio/assets/about-illustration.webp" alt="Ilustração de uma desenvolvedora de cabelos escuros, com notebook e detalhes retrô." width={800} height={543} sizes="(max-width: 680px) 45vw, (max-width: 900px) 25vw, 18vw" loading="lazy" /></div>
        <div className="about-text">
          <div className="about-intro"><Image src="/profile-pic.png" alt="Laryssa Finizola" width={76} height={76} sizes="76px" className="about-portrait" loading="lazy" /><span className="eyebrow-mini">um pouco sobre mim ♡</span></div>
          <h2 id="aboutTitle">Prazer, sou a Laryssa!</h2>
          <p>Sou desenvolvedora full-stack e estudante de Ciência da Computação pela Universidade Estadual da Paraíba. Gosto de entender o problema antes de propor a solução — e de conectar decisões de interface, arquitetura e dados em um produto consistente.</p>
          <p>Meu foco é o desenvolvimento web, com abertura para novas áreas e desafios. Aprendizado contínuo, comunicação e colaboração fazem parte de como trabalho.</p>
          <div className="about-pills"><span><Code2 size={13} aria-hidden="true" /> Full Stack</span><span><Lightbulb size={13} aria-hidden="true" /> UX/UI</span><span><Boxes size={13} aria-hidden="true" /> Produtos digitais</span></div>
          <p className="about-principle">Experiência de usuário e engenharia fazem parte da mesma construção.</p>
        </div>
      </div>
    </section>
  );
}
