'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { ThemeSwitcher } from './ThemeSwitcher'; 

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- BOTÃO DE TEMA --- */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeSwitcher/>
      </div>

      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 dark:bg-violet-600/20 blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 dark:bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* LADO ESQUERDO: TEXTO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left order-2 md:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4"
            >
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            >
              Olá, eu sou <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-500">
                Laryssa Finizola
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-violet-700 dark:text-violet-200/80 mb-6 font-medium"
            >
              Desenvolvedora Full-Stack
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-700 dark:text-gray-400 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium dark:font-normal"
            >
             Desenvolvo soluções full-stack que não apenas funcionam, mas que elevam o patamar do seu negócio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center md:justify-start mb-8"
            >
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/laryssafinizola/" },
                { icon: Github, href: "https://github.com/laryssa-finizola" },
                { icon: Mail, href: "mailto:laryssafinizoladev@gmail.com" }
              ].map((Social, index) => (
                <a
                  key={index}
                  href={Social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-slate-800/50 hover:bg-violet-50 dark:hover:bg-violet-600/20 border border-slate-200 dark:border-slate-700 hover:border-violet-500 text-slate-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-white rounded-lg transition-all hover:-translate-y-1 duration-300 shadow-sm"
                >
                  <Social.icon size={24} />
                </a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all hover:scale-105 shadow-lg shadow-violet-600/25 font-semibold"
              >
                Ver Projetos
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl transition-all hover:scale-105 font-medium shadow-sm"
              >
                Entre em Contato
              </button>
            </motion.div>
          </motion.div>

          {/* AVATAR  */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center order-1 md:order-2 relative perspective-1000"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full blur-3xl"
            />
            
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotateX: 5,
                rotateY: -5,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-4 border-white/50 dark:border-violet-500/50 shadow-2xl shadow-violet-500/20 z-10 overflow-hidden bg-slate-100 dark:bg-slate-900"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/profile-pic.png" 
                alt="Foto de Laryssa Finizola"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Ícones Flutuantes */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-0 md:-right-4 w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-900/80 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-violet-500/30 flex items-center justify-center shadow-xl z-20"
            >
              <span className="text-3xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#821eb8" className="icon icon-tabler icons-tabler-filled icon-tabler-heart">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
              </svg>
              </span>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-0 md:-left-4 w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-900/80 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-fuchsia-500/30 flex items-center justify-center shadow-xl z-20"
            >
              <span className="text-3xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#821eb8" className="icon icon-tabler icons-tabler-filled icon-tabler-carambola">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M17.108 22.085c-1.266 -.068 -2.924 -.859 -5.071 -2.355l-.04 -.027l-.037 .027c-2.147 1.497 -3.804 2.288 -5.072 2.356l-.178 .005c-2.747 0 -3.097 -2.64 -1.718 -7.244l.054 -.178l-.1 -.075c-6.056 -4.638 -5.046 -7.848 2.554 -8.066l.202 -.005l.115 -.326c1.184 -3.33 2.426 -5.085 4.027 -5.192l.156 -.005c1.674 0 2.957 1.76 4.182 5.197l.114 .326l.204 .005c7.6 .218 8.61 3.428 2.553 8.065l-.102 .075l.055 .178c1.35 4.512 1.04 7.137 -1.556 7.24l-.163 .003z" /></svg>
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <motion.button
            onClick={() => scrollToSection('about')}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-slate-400 hover:text-violet-600 dark:text-violet-400/50 dark:hover:text-violet-400 transition-colors"
          >
            <ChevronDown size={32} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}