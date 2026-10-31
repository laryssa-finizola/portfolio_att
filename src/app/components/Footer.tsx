export function Footer() {
  return (
    <footer className="section-dark">
      <div className="shell site-footer">
        <a href="#inicio" aria-label="Laryssa Finizola, voltar ao início">LF<span aria-hidden="true">.</span></a>
        <span>© {new Date().getFullYear()} LARYSSA FINIZOLA · PORTFÓLIO INTERATIVO</span>
        <a href="#inicio">VOLTAR AO TOPO <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
