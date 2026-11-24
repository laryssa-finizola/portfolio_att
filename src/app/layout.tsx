import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { contact } from "@/lib/data";

const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "opsz"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const siteUrl = "https://laryssafinizola.vercel.app";
const title = "Laryssa Finizola — Desenvolvedora full-stack";
const description = "Desenvolvedora full-stack em Campina Grande (PB). Interfaces acessíveis em React e Next.js, APIs em Node.js e NestJS. Projetos, habilidades, trajetória e contato.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — Laryssa Finizola" },
  description,
  keywords: ["Laryssa Finizola", "desenvolvedora full-stack", "React", "Next.js", "TypeScript", "NestJS", "Node.js", "landing page", "sistema web sob medida", "Campina Grande", "Paraíba"],
  authors: [{ name: "Laryssa Finizola", url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile", locale: "pt_BR", url: siteUrl, siteName: "Laryssa Finizola",
    title, description: "Construo software agradável de usar — e fácil de manter.",
    firstName: "Laryssa", lastName: "Finizola",
    images: [{ url: "/portfolio/og-cover.jpg", width: 1200, height: 630, alt: "Portfólio de Laryssa Finizola" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/portfolio/og-cover.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbff" },
    { media: "(prefers-color-scheme: dark)", color: "#20142f" },
  ],
};

// Google Search Central: ProfilePage com a pessoa como mainEntity.
const profile = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: siteUrl,
  inLanguage: "pt-BR",
  mainEntity: {
    "@type": "Person",
    "@id": `${siteUrl}/#laryssa`,
    name: "Laryssa Finizola",
    jobTitle: "Desenvolvedora Full-Stack",
    url: siteUrl,
    email: `mailto:${contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Campina Grande", addressRegion: "PB", addressCountry: "BR" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidade Estadual da Paraíba" },
    knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "NestJS", "APIs REST", "Microsserviços", "Acessibilidade web"],
    sameAs: [contact.linkedin, contact.github],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <script type="application/ld+json">{JSON.stringify(profile).replace(/</g, "\\u003c")}</script>
      </body>
    </html>
  );
}
