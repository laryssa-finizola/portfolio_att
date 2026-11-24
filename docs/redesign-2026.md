# Redesign 2026

## v2 — Simplificação (versão atual no código)

Feedback: a v1 (“Caderno anotado”, abaixo) mostrava informação demais; o visitante desiste antes de ler. Referências de texto: dejan.works, ianlunn.co.uk, denisechandler.com — uma frase de papel, uma de benefício, projetos com nome + uma linha.

- **Hero:** “Construo software agradável de usar — e fácil de manter.” + “Interfaces que as pessoas entendem na hora. Código que a equipe evolui sem medo.” Sem experiências, sem ficha. Eyebrow: “Laryssa Finizola · Engenheira de Software”.
- **Robô de argila 3D** (`ClayRobot.tsx`) no lugar do dinossauro: criação própria, inspirada no estilo “clay” do OriginKit, sem copiar o componente pago. Um único fragment shader WebGL2 (ray marching de SDF), sem bibliotecas. Segue o cursor, pisca, acena ao aparecer e pula com olhos felizes ao toque. Só desenha visível; reduz a resolução se a GPU atrasar; movimento reduzido = quadro estático; sem WebGL2 = `clay-robot.webp` (28 KB, gerada do próprio render).
- **Projetos (v2.1):** uma grade única de 2 colunas com os 7 projetos. Cada bloco: imagem, nome e categoria (com o status quando não há link público). O vídeo de prévia toca no hover ou no foco do teclado e pausa ao sair; com movimento reduzido fica só a capa. Sem botões, sem tags, sem descrição visível (o resumo fica para leitores de tela). Referências: portfólios de outras pessoas enviados pela Laryssa, usados só como princípio (imagem em primeiro plano, texto mínimo).
- **Voltaram do design anterior:** malha quadriculada, paleta lilás, Habilidades (pastas), Contato e Rodapé.
- **Mantido da v1:** Trajetória (sem a legenda da ilustração), títulos em Fraunces, ProfilePage, robots e sitemap.
- **Saíram:** Como construo (pilha), Serviços, selo flutuante e colofão.
- O arquivo do Figma ainda mostra a v1 (o plano Starter atingiu o limite de chamadas do MCP).

---

## v1 — “Caderno anotado” (registro)

Figma: https://www.figma.com/design/zINzCmmXfW3b9yEAvKwHy1 (página 00: direção, tokens e componentes · 01: home desktop 1440 · 02: home mobile 390)

## 1. Auditoria do design anterior

**O que funcionava e foi mantido**
- Personalidade: lilás/rosa, ilustração autoral, o dinossauro em pixel, o tom gentil.
- Engenharia sólida por baixo: rota de contato com Zod, honeypot e limite de payload; prévias em vídeo coordenadas, que respeitam movimento reduzido e economia de dados; diálogo acessível.

**Problemas encontrados**
1. *Hero genérico.* “Transformo ideias em soluções digitais com foco em impacto, usabilidade e qualidade” é exatamente a frase vazia que o briefing pede para evitar; os dois botões e a ilustração não dizem para quem nem o quê.
2. *A estética virou embalagem, não linguagem.* Todo bloco era uma janela “.EXE” com `_ □ ×` decorativos. O tema repetido nivelava tudo: nada se destacava.
3. *Hierarquia invertida.* As provas mais fortes (estágio no NUTES/UEPB com APIs e microsserviços; full-stack na Jrssoft com NestJS) estavam num painel pequeno, abaixo dos projetos, em 11–12 px.
4. *Texto pequeno demais.* Corpo em 11–12,5 px e rótulos em 10 px — leitura cansativa e acessibilidade comprometida.
5. *Projetos como cartões idênticos.* Três cards iguais + filtros + “mais projetos” + nota de rodapé para sete itens. O raciocínio técnico ficava escondido num modal (“Bastidores”).
6. *Ruído de processo vazando para a interface.* Frases como “resultados comerciais e métricas não foram presumidos” e “presente nas habilidades do portfólio original” falam do processo de produção, não com o visitante.
7. *Habilidades como inventário.* Pastas com listas de ferramentas, sem ligação com onde foram usadas.
8. *Sem serviços.* Nada dizia a um cliente o que você constrói para ele.
9. *Navegação desalinhada.* Ordem do menu ≠ ordem da página; numeração começava em 02.
10. *Contato duplicado.* Dois títulos, e-mail, botão de copiar, telefone, redes e formulário competindo.

## 2. Pesquisa e referências

| Referência | Princípio | Como entrou aqui (sem copiar) |
|---|---|---|
| April Dunford, *Obviously Awesome* | Posicionamento começa pelas alternativas competitivas; atributos únicos → valor | Alternativas: devs que só fazem front ou só back; para clientes, construtores de site prontos. Atributo único: interface **e** arquitetura na mesma pessoa. Valor: “agradável de usar — e fácil de manter”. |
| Joanna Wiebe / Copyhackers | Mensagem na voz de quem tem o problema (*message mining*) | Serviços começam pelo problema do cliente (“Seu processo vive em planilhas…”), não pela tecnologia. Sem depoimentos inventados. |
| Nielsen Norman Group — padrões de leitura (F-pattern, *layer cake*) | As pessoas escaneiam títulos e as duas primeiras palavras | Títulos informativos, cada decisão começa com a ideia (“A peça é o argumento”), coluna de margem com rótulos escaneáveis. |
| Google Search Central — ProfilePage | `ProfilePage` com `mainEntity` Person | JSON-LD trocado de Person solto para ProfilePage + robots.txt + sitemap. |
| Portfólios de devs (Brittany Chiang, Josh Comeau, Lynn Fisher) | Clareza escaneável; profundidade técnica + personalidade; o site como obra | O próprio site vira um caso (Colofão). |
| Suas referências: MÙN (rooftop bar) | Tipografia e objeto coreografados pela rolagem; selo circular fixo | Selo circular girando = carimbo do caderno e atalho fixo para o contato; a mídia dos casos se abre com a rolagem. |
| Suas referências: makemeplay | Círculos como janelas para o conteúdo | A imagem de cada caso nasce de um círculo e se abre para o quadro inteiro. |
| Suas referências: Jalyssa / anel vermelho | Serifa expressiva + acento de cor; um único elemento geométrico forte | Fraunces com itálico + marca-texto; anel berry em volta da foto da ficha. |

Observação: as referências de portfólios vêm de resumos encontrados na busca; não abri cada site individualmente. Os vídeos que você mandou foram vistos como folhas de quadros.

## 3. Posicionamento

- **Mensagem central:** Construo software agradável de usar — e fácil de manter.
- **Prova imediata (5 s):** ficha com o que você faz *agora* (NUTES/UEPB, Jrssoft), formação e stack.
- **Dois públicos, duas rotas:** “Recrutando? → trajetória e stack” e “Tem um projeto? → serviços e processo”.
- **Diferencial:** uma pessoa que pensa a pilha inteira — e mostra as decisões, não só o resultado.

## 4. Direção criativa — “Caderno anotado”

O portfólio como o caderno de uma engenheira: papel quente, tipografia editorial, anotações na margem que explicam o porquê. A delicadeza está no material (papel, marca-texto, fita adesiva, cantos suaves); o rigor está na estrutura (grade, numeração §, figuras, diagrama de camadas).

- **Tipos:** Fraunces (display, eixo SOFT — suave sem ser infantil), Instrument Sans (texto), JetBrains Mono (anotações).
- **Cor:** papel `#FBF7F2`, tinta ameixa `#24152F`, caneta berry `#B3245F` para anotação e ação, rosa e lilás só como marca-texto. Modo escuro “caderno à noite”. Todos os pares passam WCAG AA (a maioria AAA).
- **Grade:** coluna de margem de 240 px para rótulos (§ 01…) + conteúdo; no mobile, uma coluna.

## 5. Arquitetura de informação

Antes: Hero → Projetos (filtros, cards, modal) → Sobre + Experiência → Habilidades → Contato.

Agora:
1. **Hero** — mensagem, prova (ficha), rotas por público.
2. **§ 01 Trabalho selecionado** — 3 casos anotados + índice de outros trabalhos (com expansão).
3. **§ 02 Como eu construo** — camadas da pilha (abas) com evidências.
4. **§ 03 Serviços** — problema → oferta → onde já fiz isso; processo em 4 passos.
5. **§ 04 Trajetória** — bio curta + `git log` da experiência.
6. **§ 05 Contato** — um título, e-mail, formulário com assunto.
7. **Colofão** — como este site foi feito.

## 6. Interações (e por que existem)

| Interação | Propósito | Acessibilidade |
|---|---|---|
| Pinos numerados sobre a imagem ↔ lista de decisões | Mostrar *onde* cada decisão aparece na interface | Botões reais, `aria-describedby` para o texto da decisão; hover (mouse), foco (teclado) e toque |
| Prévia em vídeo sob demanda | Ver o produto funcionando sem pesar a página | Só carrega ao pedir; pinos somem enquanto toca; respeita movimento reduzido e economia de dados |
| Abertura em círculo da mídia ao rolar | Ritmo e foco, inspirado nas suas referências | Só com `animation-timeline` suportado e sem movimento reduzido |
| Camadas da pilha (abas) | Substituir a nuvem de tecnologias por contexto | Padrão WAI-ARIA de abas: setas, Home/End |
| Índice com `<details>` | Revelar progressivamente os outros projetos | Nativo, funciona sem JavaScript |
| Assunto do contato pré-selecionado | Quem vem de “Serviços” já chega com “Um projeto” marcado | Rádios nativos |
| Selo circular fixo | Atalho constante para o contato | Some no hero e no contato; giro desliga com movimento reduzido |
| Marca-texto que se desenha no título | Ler as duas promessas em sequência | Estático com movimento reduzido |

## 7. Para você confirmar

- **Título profissional.** O código usa “Desenvolvedora full-stack” (como no seu material). O Figma testou “Engenheira de software full-stack”; troque se preferir.
- **Serviços e processo.** As três ofertas e os 4 passos (Conversa → Proposta → Construção → Publicação) são uma proposta de como apresentar o trabalho para clientes; confirme se reflete como você quer trabalhar.
- **Notas dos casos.** Os textos dos pinos vêm do material de cada projeto; as posições dos pinos foram marcadas sobre as capas.
- **Imagem de compartilhamento.** `og-cover.jpg` ainda é a arte antiga.
