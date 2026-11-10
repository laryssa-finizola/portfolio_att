# Portfólio — Laryssa Finizola

Identidade retrô/Y2K integrada ao projeto original Next.js App Router, React e TypeScript. Janelas em lavanda e rosa, pixel art e pastas de habilidades apresentam os projetos, com formulário de contato, filtros e detalhes das tecnologias. A aplicação usa componentes React; a prévia HTML independente do ZIP não integra o build.

A integração está na branch `feature/redesign-y2k`, baseada em `reformulacao-v4` (`f06fe9f`). Nenhum commit, push, merge ou deploy é feito automaticamente.

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

- `src/lib/data.ts`: sete projetos, status, links confirmados, mídias e bastidores tipados.
- `src/app/components/Skills.tsx`: cinco pastas de habilidades, seleção de tecnologias e detalhes individuais.
- `src/app/components/Experience.tsx`: trajetória profissional e formação, separadas da seção Sobre; a foto real e a biografia permanecem no portfólio.
- `src/app/globals.css`: identidade Y2K e temas; os arquivos CSS dos componentes contêm adaptações locais.
- `public/portfolio/assets/`: artes WebP da apresentação e do Sobre.
- `public/portfolio/assets/previews/`: seis clipes otimizados e capas WebP; as gravações longas não foram copiadas.

A vitrine mostra LOOP 3D Studio, Margem e Heloire primeiro; os outros quatro projetos ficam em “Explorar mais projetos”. Os filtros por categoria continuam disponíveis e encontram também os projetos adicionais. Os vídeos usam carregamento por intenção/interação, reprodução coordenada e pausa fora da área visível ou ao ocultar a aba. Movimento reduzido, economia de dados e conexão lenta desativam a reprodução automática; o botão de reprodução permanece disponível.

O CTA “Converse comigo” leva à seção de contato (`#contato`). O currículo provisório do ZIP não foi incluído: um download de currículo depende do PDF oficial.

Margem, Alinhora e Rodrigues Turismo não têm endereço público confirmado. Adicione `result` ao respectivo projeto somente quando houver uma URL confirmada. Challengefy e Fullstackfy apontam para repositórios.

## Contato

O formulário preserva a integração original com Resend. Configure apenas no servidor as variáveis `RESEND_API_KEY`, `CONTACT_TO_EMAIL` e `CONTACT_FROM_EMAIL`, usando os valores reais já adotados no projeto. Sem elas, a API responde 503; e-mail direto, telefone, redes e copiar e-mail continuam disponíveis. Nunca coloque esses valores em `public/` nem use o prefixo `NEXT_PUBLIC_`.
