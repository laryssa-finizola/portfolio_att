'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Rocket, Users, Award } from 'lucide-react';

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const highlights = [
    {
      icon: Code2,
      title: 'Código Limpo',
      description: 'Escrevo código limpo, testável e manutenível seguindo as melhores práticas.',
    },
    {
      icon: Rocket,
      title: 'Performance',
      description: 'Otimização constante para garantir aplicações rápidas e responsivas.',
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Trabalho bem em equipe, comunicação clara e foco em resultados.',
    },
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Comprometida com excelência e atenção aos detalhes em cada projeto.',
    },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Título da Seção */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Sobre Mim
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Lado Esquerdo: Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 space-y-6"
          >
            <p>
              Sou desenvolvedora full-stack apaixonada por criar soluções web inovadoras e eficientes. Com experiência em diversas tecnologias modernas, busco constantemente aprender e aplicar as melhores práticas do mercado.
            </p>
            <p>
              Minha jornada na programação começou com curiosidade e evoluiu para uma carreira dedicada a transformar ideias complexas em interfaces intuitivas e sistemas robustos.
            </p>
            <p>
              Quando não estou codificando, gosto de explorar novas tecnologias, contribuir com a comunidade open source e compartilhar conhecimento com outros desenvolvedores.
            </p>
          </motion.div>

          {/* Lado Direito: Cards de Destaque */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                // Card adaptativo: Branco no Light / Dark Glass no Dark
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-violet-500/50 hover:shadow-lg dark:hover:shadow-violet-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
                  <highlight.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}