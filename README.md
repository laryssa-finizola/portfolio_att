# Portfólio — Laryssa Finizola

Portfólio em Next.js App Router, React e TypeScript. Identidade lilás com malha quadriculada, títulos em Fraunces e uma página enxuta: hero, projetos selecionados, habilidades, trajetória e contato. Histórico das decisões de design em [docs/redesign-2026.md](docs/redesign-2026.md).

## Executar

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para testar a versão de produção:

```bash
npm run build
npm start
```

Nenhuma configuração da Vercel foi alterada. A publicação é uma etapa manual.

## Validar

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

`npm test` executa 13 cenários da API com o provedor de e-mail simulado. Não envia mensagens.

O teste opcional de navegador usa Playwright e Chrome já instalados no ambiente de QA. Não adiciona dependências à aplicação. Com o servidor em execução, informe `PORTFOLIO_TEST_URL` (padrão `http://127.0.0.1:3100`) e, se o Playwright estiver fora deste projeto, `PLAYWRIGHT_MODULE` com o diretório do pacote:

```powershell
$env:PORTFOLIO_TEST_URL = 'http://localhost:3000'
$env:PLAYWRIGHT_MODULE = 'C:\caminho\node_modules\playwright'
npm run test:browser
```

Se o pacote puder ser resolvido normalmente pelo Node, não é preciso definir `PLAYWRIGHT_MODULE`. Capturas e resultados são gravados em `.qa/`, ignorada pelo Git. A bateria simula a entrega do formulário, sem enviar e-mail.

## Conteúdo e manutenção

- `src/lib/data.ts`: projetos (ordem da grade, categoria e mídia), trajetória e contato.
- `src/app/components/Skills.tsx`: pastas de habilidades e detalhes de cada tecnologia (estilos em `lab.css`).
- `src/app/components/Contact.tsx`: contato e formulário (estilos em `contact.css`).
- `src/app/globals.css`: paleta, malha e estilos das demais seções.
- `public/portfolio/assets/previews/`: clipes otimizados e capas WebP.

Adicione `link` a um projeto só quando houver URL confirmada. As prévias em vídeo só carregam quando a pessoa pede; movimento reduzido desliga as animações.

## Contato

O formulário preserva a integração original com Resend. Configure apenas no servidor as variáveis `RESEND_API_KEY`, `CONTACT_TO_EMAIL` e `CONTACT_FROM_EMAIL`, usando os valores reais já adotados no projeto. Sem elas, a API responde 503; e-mail direto, telefone, redes e copiar e-mail continuam disponíveis. Nunca coloque esses valores em `public/` nem use o prefixo `NEXT_PUBLIC_`.
