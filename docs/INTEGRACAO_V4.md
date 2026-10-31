# Integração V4 — relatório técnico

Data: 31/10/2026. Trabalho local, sem commit automático, push, merge ou deploy.

## Estado original e decisões

- Git inicialmente limpo; branch original `navbar`; commit `cb280e7e701cc94d67676855f7167042d0a47e00`.
- Branch de trabalho: `reformulacao-v4`. Uma cópia ZIP dos arquivos rastreados originais está em `.qa/original-cb280e7.zip`.
- Arquitetura original preservada: Next.js App Router, React 19.1, TypeScript estrito, Tailwind e next-themes. A página, o texto do hero, Sobre e o rodapé continuam renderizados no servidor; os controles e seções interativas têm fronteiras de cliente próprias.
- O ZIP foi inspecionado antes da implementação. Dependências e configurações não foram substituídas pelas do ZIP. Apenas estilos aprovados e sete arquivos de mídia foram aproveitados; o JavaScript global e `portfolio-markup.ts` não são usados pela aplicação.
- O código original tinha `next lint` incompatível com Next 16, configuração ESLint antiga, SEO com URLs fictícias e imagem Open Graph ausente. Essas inconsistências foram corrigidas.

## Implementação

- Hero: tipografia e composição V4, CSS 3D em camadas, arraste limitado, setas, teclas 1/2/3, controles visíveis e restauração da vista. Gestos verticais por toque mantêm a rolagem natural. Movimento reduzido e dispositivos identificados com recursos limitados recebem uma apresentação 2D, com a mesma seleção e descrições.
- Galeria: LOOP 3D Studio em destaque, Heloire, Margem, Alinhora, Rodrigues Turismo, Challengefy e Fullstackfy. Filtros com contagens 7/3/2/2. Bastidores com problema, solução, tecnologias e decisões confirmadas. Modais nativos com foco inicial, ciclo de Tab/Shift+Tab, Escape, clique no fundo e retorno ao acionador.
- Vídeos: três clipes reais, sem áudio, `muted`, `playsInline`, `preload="none"`, `src` atribuído apenas na interação. Um coordenador permite apenas uma reprodução. Pausa fora da área visível, em mudança de visibilidade e ao abrir modal. A pausa explícita permanece ao trocar filtros. Economia de dados, conexão lenta e movimento reduzido bloqueiam reprodução automática; a ação explícita de assistir continua disponível. Capas permanecem quando há falha.
- Laboratório: Front-end, Back-end, Dados, Ferramentas e arquitetura. Categorias e nós exploráveis, descrições e contexto de aplicação. Sem porcentagens artificiais.
- Navegação: indicação da seção atual, progresso via transform com um listener de scroll controlado por requestAnimationFrame, menu mobile com teclado/Escape/foco e tema persistido pelo provider existente.
- Sobre e trajetória: biografia/UEPB e foto preservadas; experiências do material V4 descritas publicamente, sem conteúdo privado de projetos profissionais.
- Contato: copiar e-mail com feedback, redes, telefone e localização originais; formulário original preservado e adaptado ao visual. Validação e honeypot mantidos, limite real de 16 KiB, JSON inválido 400, tipo incompatível 415, corpo excessivo 413, configuração ausente 503. Erros brutos do provedor não são retornados. Falha na confirmação opcional não invalida o envio principal.

## Arquivos alterados e criados

| Arquivo | Finalidade |
| --- | --- |
| `.gitignore` | Ignorar referências locais e artefatos de QA. |
| `package.json` / `package-lock.json` | Comandos de validação, correções específicas de segurança e lock reproduzível. |
| `eslint.config.mjs` | Configuração flat oficial do Next, mantendo regras ativas. |
| `src/app/layout.tsx` | Tema original, metadados reais, capa existente e dados estruturados sem inserção de HTML. Fonte do sistema conforme V4, sem requisição ao Google Fonts. |
| `src/app/page.tsx` | Composição das seções, navegação, main semântico e link para pular conteúdo. |
| `src/app/globals.css` | Design V4 com temas, responsividade, contraste e foco. |
| `src/app/components/Navbar.tsx` | Navegação, seção ativa e menu responsivo. |
| `src/app/components/ThemeSwitcher.tsx` | Alternância acessível com resolvedTheme. |
| `src/app/components/Hero.tsx` | Apresentação do hero como Server Component. |
| `src/app/components/ArchitectureScene.tsx` (novo) | Estado e eventos da experiência CSS 3D. |
| `src/app/components/Skills.tsx` | Laboratório interativo com quatro grupos. |
| `src/app/components/lab.css` (novo) | Controles da cena, alternativa 2D e ajustes do laboratório. |
| `src/lib/data.ts` | Modelo tipado e conteúdo central dos sete projetos. |
| `src/app/components/ProjectsSection.tsx` | Filtros e coordenação da galeria. |
| `src/app/components/ProjectCard.tsx` | Cards reutilizáveis e composições conceituais identificadas. |
| `src/app/components/ProjectPreview.tsx` (novo) | Carregamento e reprodução coordenada das mídias. |
| `src/app/components/CaseDialog.tsx` (novo) | Bastidores e gerenciamento de foco. |
| `src/app/components/gallery.css` (novo) | Ajustes de cards, foco e modal nativo. |
| `src/app/components/About.tsx` | Biografia, foto e trajetória. |
| `src/app/components/Contact.tsx` | Canais, cópia do e-mail e formulário original adaptado. |
| `src/app/components/contact.css` (novo) | Formulário, foto e layout responsivo. |
| `src/app/components/Footer.tsx` | Rodapé no sistema visual V4. |
| `src/app/api/contact/route.ts` | Validação, limites e respostas seguras do contato. |
| `public/portfolio/assets/previews/` (novo) | 3 MP4 e 3 capas WebP, total 791.990 bytes. |
| `public/portfolio/og-cover.jpg` (novo) | Capa social fornecida no ZIP. |
| `scripts/check-contact.cjs` (novo) | Testes Node isolados da API, com Resend simulado. |
| `scripts/check-browser.mjs` (novo) | Bateria opcional no Chromium, sem dependência nova de runtime. |
| `README.md` / `docs/INTEGRACAO_V4.md` | Execução, manutenção, testes, limites e reversão. |

`providers.tsx`, configurações Next/Tailwind/PostCSS/TypeScript, favicon e assets originais não foram substituídos. Memory Game e Library Project saíram da galeria para respeitar a seleção explícita de sete; seus assets e histórico foram preservados. Os três projetos explicitamente removidos não aparecem na vitrine. Nenhum material privado foi incorporado.

## Segurança das dependências

A auditoria inicial de produção apontou 10 pacotes com alertas. Foram aplicadas correções pontuais, sem mudança de versão principal: Next 16.1.0 → 16.4.1, eslint-config-next 16.1.0 → 16.4.1, Resend 6.6.0 → 6.12.3 e Zod 4.2.1 → 4.6.6. `source-map-js` transitivo também foi atualizado dentro da faixa compatível. Outras alterações no lock são dependências desses pacotes.

O [aviso oficial do Next](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) identifica correção para o problema crítico do otimizador de imagem a partir de 16.4.1.

Auditoria final `npm audit --omit=dev`: **zero alertas**. A auditoria completa ainda aponta **17 alertas nas ferramentas de desenvolvimento: 7 altos e 10 moderados**. Os altos envolvem brace-expansion, browserslist, flatted, glob, js-yaml, minimatch e picomatch. Recomenda-se tratar a cadeia de lint/build em atualização separada e validada. Não foi aplicado `npm audit fix --force`, que sugeria inclusive trocar a versão principal de pacotes. Esses resultados representam o banco de avisos consultado nesta data, não garantia de ausência de vulnerabilidades.

## Validação

- `npm run lint`: aprovado, sem desativar regras.
- `npm run typecheck`: aprovado.
- `npm test`: 13 testes aprovados; parsing, limites, validação estrita, honeypot, escape de HTML, erros do provedor e confirmação opcional. O código de teste compila o arquivo TypeScript confiável em um contexto Node com SDK e ambiente simulados; essa lógica não integra a aplicação nem executa entrada de visitantes.
- `npm run build`: aprovado; página principal pré-renderizada e API dinâmica.
- Chromium: bateria integrada em conclusão; resultados finais serão registrados antes da entrega.
- Contraste: inspeção dos tokens e verificação automatizada de texto com fundos sólidos nos dois temas; ajustes em legendas e foco. Esse teste não cobre toda combinação com gradientes, mídia ou texto transformado, nem certifica WCAG.

O navegador identificou e ajudou a corrigir o fechamento do modal em StrictMode, o ciclo de foco, uma corrida entre hover e observer e o transbordamento do Sobre a 320 px. As capturas e relatórios locais ficam em `.qa/`, fora da pasta pública e do versionamento.

## Pendências e limites reais

- Margem, Alinhora e Rodrigues Turismo: sem link público confirmado. Alinhora e Rodrigues também não têm stack detalhada no material; o site não a inventa.
- Envio real de e-mail depende das três variáveis originais e de remetente autorizado no Resend. Não houve envio real; sucesso/falha da UI e API foram verificados com mocks.
- Não foram testados Safari, Firefox, dispositivos físicos, leitor de tela ou ambiente publicado na Vercel.
- LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 continuam metas. Não foram declarados resultados de campo sem medição. Uma avaliação em produção com tráfego real e auditoria completa de acessibilidade continuam necessárias.
- Nenhuma nova proteção distribuída contra spam foi adicionada. O honeypot e limites foram preservados/fortalecidos; uma proteção distribuída exigiria decisão de infraestrutura.
- Os tipos React 18 do projeto original foram mantidos; o runtime React 19 compila e passa na checagem atual. Alinhamento dos tipos pode ser tratado separadamente.
- O build exibe aviso de dados Browserslist antigos. O comando passou; o banco não foi atualizado indiscriminadamente.

## Executar e validar

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Configuração e comando da bateria de navegador estão no README. Não existem testes anteriores no repositório original. A bateria nova não exige credenciais reais.

## Reversão segura

O commit original e a branch `navbar` foram preservados. Antes de trocar de versão, salve o trabalho atual em um commit local revisado; isso evita perder arquivos novos ou alterações posteriores:

```bash
git status
git diff
git add .gitignore eslint.config.mjs package.json package-lock.json src public/portfolio scripts README.md docs
git commit -m "Integra portfólio V4"
git switch navbar
npm ci
```

Esses comandos são uma orientação, não foram executados. Confira o diff e inclua somente o escopo desejado, especialmente se houver trabalho novo após esta entrega. A branch `reformulacao-v4` continuará guardando o commit salvo e poderá ser retomada com `git switch reformulacao-v4` e `npm ci`. Outra opção, depois de salvar a integração, é criar um `git revert` do commit correspondente. Não use reset destrutivo, stash ou git clean para esta reversão.

Para apenas consultar o original, o arquivo `.qa/original-cb280e7.zip` contém seus arquivos rastreados, sem credenciais e sem alterar o trabalho atual.
