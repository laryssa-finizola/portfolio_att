import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Importe o Provider que criamos (verifique se o caminho está correto)
import { ThemeProvider } from "./providers"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Laryssa Finizola | Desenvolvedora Full-Stack",
    template: "%s | Laryssa Finizola",
  },
  description:
    "Portfólio de Laryssa Finizola, Desenvolvedora Full-Stack especializada em Next.js, React, Node.js e TypeScript. Transformando ideias em experiências digitais.",
  keywords: [
    "Laryssa Finizola",
    "Desenvolvedora Full-Stack",
    "Desenvolvedora Web",
    "React",
    "Next.js",
    "TypeScript",
    "Front-end",
    "Back-end",
    "Brasil",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://laryssafinizola.vercel.app",
    siteName: "Laryssa Finizola Portfolio",
    title: "Laryssa Finizola | Desenvolvedora Full-Stack",
    description: "Confira meus projetos e habilidades em desenvolvimento web moderno.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Laryssa Finizola Portfolio",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Adicione suppressHydrationWarning para evitar erros com o tema
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body 
        // 3. Cores dinâmicas: claro (slate-50/slate-900) e escuro (slate-950/slate-100)
        className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased transition-colors duration-300`}
      >
        {/* 4. Envolva tudo no ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* O script de SEO fica aqui dentro também, sem problemas */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "http://schema.org",
                "@type": "Person",
                "name": "Laryssa Finizola",
                "jobTitle": "Desenvolvedora Full-Stack",
                "url": "https://seu-portfolio.vercel.app",
                "sameAs": [
                  "https://linkedin.com/in/seu-linkedin",
                  "https://github.com/seu-github"
                ]
              })
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}