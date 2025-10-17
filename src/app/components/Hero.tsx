import Image from 'next/image';
import { Github, Linkedin } from 'lucide-react'; 

export const Hero = () => {
  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8 py-20 px-4">

      {/* Lado Esquerdo: Textos e Links */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark">
          Laryssa Finizola
        </h1>
        <p className="mt-2 text-lg text-lavender font-semibold">
          Desenvolvedora Full-Stack.
        </p>

        {/* Links Sociais */}
        <div className="mt-6 flex justify-center md:justify-start gap-4">
          <a href="..." target="_blank" className="text-gray-detail hover:text-lavender transition-colors">
            <Linkedin size={28} />
          </a>
          <a href="..." target="_blank" className="text-gray-detail hover:text-lavender transition-colors">
            <Github size={28} />
          </a>
        </div>
      </div>

      {/* Lado Direito: Imagem */}
      <div className="w-48 h-48 md:w-64 md:h-64 relative">
        <Image
          src="/icon/icone.png" 
          alt="Foto de Laryssa Finizola"
          fill
          className="rounded-full object-cover border-4 border-lavender"
        />
      </div>

    </section>
  );
};