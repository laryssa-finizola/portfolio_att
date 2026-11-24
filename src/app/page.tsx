import { SiteHeader } from "./components/SiteHeader";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Trajectory } from "./components/Trajectory";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Pular para o conteúdo</a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
        <Skills />
        <Trajectory />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
