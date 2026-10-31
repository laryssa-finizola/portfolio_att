import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Skills } from "./components/Skills";
import { ProjectsSection } from "./components/ProjectsSection";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Pular para o conteúdo</a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <div className="ticker" role="group" aria-label="Interfaces inteligentes, sistemas escaláveis, experiências digitais e engenharia de software">
          <div className="ticker-track" aria-hidden="true">INTERFACES INTELIGENTES <b>✳</b> SISTEMAS ESCALÁVEIS <b>✳</b> EXPERIÊNCIAS DIGITAIS <b>✳</b> ENGENHARIA DE SOFTWARE <b>✳</b></div>
        </div>
        <ProjectsSection />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
