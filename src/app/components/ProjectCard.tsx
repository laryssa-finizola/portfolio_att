import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';

type ProjectProps = {
  project: {
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    liveUrl: string;
    githubUrl: string;
  }
};

export const ProjectCard = ({ project }: ProjectProps) => {
  return (
    <div className="bg-gray-detail/20 dark:bg-gray-dark-detail/50 rounded-lg overflow-hidden flex flex-col group">
      <div className="relative w-full h-48">
        <Image src={project.imageUrl} alt={`Thumbnail do projeto ${project.title}`} fill className="object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-sm text-text-light/80 dark:text-text-dark/80 mb-4 flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs bg-lavender/20 text-lavender font-semibold px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex justify-end gap-4">
          <a href="..." target="_blank" className="hover:text-lavender transition-colors"><Github size={20} /></a>
          <a href="..." target="_blank" className="hover:text-lavender transition-colors"><ExternalLink size={20} /></a>
        </div>
      </div>
    </div>
  );
};