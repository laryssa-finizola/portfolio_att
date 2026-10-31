# Portfólio — Laryssa Finizola

Integração do visual V4 no projeto original Next.js App Router, React e TypeScript. A página usa componentes React e CSS 3D; não executa o HTML ou o script global do ZIP.

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
- `src/app/components/ArchitectureScene.tsx`: rotação, seleção das camadas e alternativa 2D.
- `src/app/components/Skills.tsx`: quatro categorias e tecnologias do laboratório.
- `src/app/globals.css`: sistema visual aprovado; os arquivos CSS dos componentes contêm adaptações locais.
- `public/portfolio/assets/previews/`: três clipes otimizados e capas WebP; as gravações longas não foram copiadas.

Margem, Alinhora e Rodrigues Turismo não têm endereço público confirmado. Adicione `result` ao respectivo projeto somente quando houver uma URL confirmada. Challengefy e Fullstackfy apontam para repositórios.

## Contato

O formulário preserva a integração original com Resend. Configure apenas no servidor as variáveis `RESEND_API_KEY`, `CONTACT_TO_EMAIL` e `CONTACT_FROM_EMAIL`, usando os valores reais já adotados no projeto. Sem elas, a API responde 503; e-mail direto, telefone, redes e copiar e-mail continuam disponíveis. Nunca coloque esses valores em `public/` nem use o prefixo `NEXT_PUBLIC_`.

Veja o [relatório de integração](docs/INTEGRACAO_V4.md) para diagnóstico, alterações, validação, limitações e reversão segura.

