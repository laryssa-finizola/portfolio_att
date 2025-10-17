// src/components/ProjectsSection.tsx
import { projects } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";

export const ProjectsSection = () => {
  return (
    <section className="w-full max-w-5xl mx-auto py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};