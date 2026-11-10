import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Skills } from "./components/Skills";
import { ProjectsSection } from "./components/ProjectsSection";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Pular para o conteúdo</a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <ProjectsSection />
        <div className="bio-experience-grid container section">
          <About />
          <Experience />
        </div>
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
