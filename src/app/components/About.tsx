import Image from 'next/image';

export function About() {
  return (
    <section aria-labelledby="aboutTitle" className="about-section section-paper" id="sobre">
      <div className="shell">
        <div className="section-kicker"><span className="section-index">03 / 04</span><span>QUEM ESTÁ POR TRÁS</span></div>
        <div className="about-grid">
          <div className="about-story">
            <div className="about-intro">
              <Image src="/profile-pic.png" alt="Laryssa Finizola" width={76} height={76} sizes="76px" className="about-portrait" />
              <p className="story-mini">PRAZER, LARYSSA.</p>
            </div>
            <h2 id="aboutTitle">Curiosidade<br />que vira <em>código.</em></h2>
            <p>Sou desenvolvedora full-stack e estudante de Ciência da Computação pela Universidade Estadual da Paraíba. Gosto de entender o problema antes de propor a solução — e de conectar decisões de interface, arquitetura e dados em um produto consistente.</p>
            <p>Meu foco é o desenvolvimento web, com abertura para novas áreas e desafios. Aprendizado contínuo, comunicação e colaboração fazem parte de como trabalho.</p>
            <div className="about-quote"><span aria-hidden="true">✳</span><strong>Experiência de usuário e engenharia fazem parte da mesma construção.</strong></div>
          </div>
          <div className="timeline" aria-labelledby="experienceTitle">
            <div className="timeline-title"><h3 id="experienceTitle">TRAJETÓRIA / EM CONSTRUÇÃO</h3><span>2025 — ATUAL</span></div>
            <div className="timeline-item">
              <span className="timeline-time">2026 — ATUAL</span>
              <div><h3>NUTES / UEPB</h3><p>Estágio em Engenharia de Software</p><small>APIs REST · Microserviços · Saúde digital</small></div>
              <span className="timeline-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-time">2025 — ATUAL</span>
              <div><h3>Jrssoft</h3><p>Desenvolvimento Full-stack</p><small>TypeScript · NestJS · Integrações</small></div>
              <span className="timeline-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-time">FORMAÇÃO</span>
              <div><h3>UEPB</h3><p>Ciência da Computação</p><small>Fundamentos + experiências práticas</small></div>
              <span className="timeline-arrow" aria-hidden="true">↗</span>
            </div>
            <a className="about-link" href="https://www.linkedin.com/in/laryssafinizola/" rel="noopener noreferrer" target="_blank">Conhecer minha trajetória completa <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="principle-strip">
          {['Entender o contexto', 'Projetar com intenção', 'Construir com qualidade', 'Iterar com feedback'].map((principle, index) => (
            <div key={principle}><span>0{index + 1}</span><strong>{principle}</strong></div>
          ))}
        </div>
      </div>
    </section>
  );
}
