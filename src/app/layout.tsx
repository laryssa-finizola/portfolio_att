import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers";

const siteUrl = "https://laryssafinizola.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Laryssa Finizola | Desenvolvedora Full-Stack",
    template: "%s | Laryssa Finizola",
  },
  description: "Da interface à arquitetura de dados: conheça os projetos, o processo e a trajetória de Laryssa Finizola, desenvolvedora full-stack e estudante de Ciência da Computação na UEPB.",
  keywords: ["Laryssa Finizola", "Desenvolvedora Full-Stack", "React", "Next.js", "TypeScript", "Brasil"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "pt_BR", url: siteUrl,
    siteName: "Laryssa Finizola Portfolio",
    title: "Laryssa Finizola | Desenvolvedora Full-Stack",
    description: "Experiência, lógica e propósito na construção de produtos digitais.",
    images: [{ url: "/portfolio/og-cover.jpg", width: 1200, height: 630, alt: "Portfólio de Laryssa Finizola" }],
  },
  twitter: { card: "summary_large_image", images: ["/portfolio/og-cover.jpg"] },
  robots: { index: true, follow: true },
};

const person = {
  "@context": "https://schema.org", "@type": "Person", name: "Laryssa Finizola",
  jobTitle: "Desenvolvedora Full-Stack", url: siteUrl,
  sameAs: ["https://www.linkedin.com/in/laryssafinizola/", "https://github.com/laryssa-finizola"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <script type="application/ld+json">{JSON.stringify(person).replace(/</g, "\\u003c")}</script>
      </body>
    </html>
  );
}
