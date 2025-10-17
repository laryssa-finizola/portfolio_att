// src/app/page.tsx
import { Hero } from "./components/Hero";
import { ProjectsSection } from "./components/ProjectsSection"; 

export default function Home() {
  return (
    <>
      <Hero />
      <ProjectsSection /> 
    </>
  );
}