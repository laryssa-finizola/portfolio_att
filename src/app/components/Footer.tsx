import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer"><div className="container footer-inner"><span className="footer-love">Feito com <span aria-label="carinho">♥</span> e algumas linhas de código.</span><span>© {new Date().getFullYear()} Laryssa Finizola</span><a href="#inicio">Voltar ao topo <ArrowUp size={14} aria-hidden="true" /></a></div></footer>
  );
}
