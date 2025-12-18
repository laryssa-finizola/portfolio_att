// src/app/page.tsx
import { Hero } from "./components/Hero";
import { Skills } from "./components/Skills";
import { ProjectsSection } from "./components/ProjectsSection"; 
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Skills />
      <ProjectsSection /> 
      <About />
      <Contact />
      <Footer />
    </>
  );
}