import { Linkedin, Github, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
  <footer className="bg-violet-600 dark:bg-slate-950 border-t border-violet-900/40 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white dark:text-white mb-4">
              Laryssa Finizola
            </h3>
            <p className="text-violet-50/90 dark:text-gray-400 text-sm leading-relaxed">
              Desenvolvedora Full-Stack apaixonada por criar experiências digitais incríveis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white dark:text-white mb-4">
              Navegação
            </h4>
            <ul className="space-y-2">
              {['Sobre', 'Habilidades', 'Projetos', 'Contato'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase() === 'sobre' ? 'about' : item.toLowerCase() === 'habilidades' ? 'skills' : item.toLowerCase() === 'projetos' ? 'projects' : 'contact'}`}
                    className="text-violet-50/90 dark:text-gray-400 hover:text-white dark:hover:text-violet-400 transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white dark:text-white mb-4">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/laryssafinizola/", label: "LinkedIn" },
                { icon: Github, href: "https://github.com/laryssa-finizola", label: "GitHub" },
                { icon: Mail, href: "mailto:laryssafinizoladev@gmail.com", label: "Email" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.icon === Mail ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 bg-white/15 dark:bg-slate-800 border border-white/25 dark:border-slate-700 hover:bg-white/25 dark:hover:bg-violet-600 hover:border-white/40 dark:hover:border-violet-500 text-white dark:text-gray-300 hover:text-white dark:hover:text-white rounded-lg transition-all hover:-translate-y-1 shadow-sm"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/20 dark:border-slate-800 text-center">
          <p className="text-violet-50/80 dark:text-gray-500 text-sm flex items-center justify-center gap-2">
            © {currentYear} Laryssa Finizola. {' '}
            <Heart size={16} className="text-white fill-white animate-pulse" />{' '}
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}