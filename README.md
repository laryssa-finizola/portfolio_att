## Portfólio (Next.js)

### Rodando localmente

```bash
npm install
npm run dev
```

### Formulário de contato (Resend)

Este projeto envia **dois e-mails** quando alguém entra em contato:

1. Um e-mail para você com os dados do formulário.
2. Um e-mail de confirmação para o usuário (“Recebemos sua mensagem…”).

#### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com:

```bash
RESEND_API_KEY=seu_token_do_resend
CONTACT_TO_EMAIL=laryssafinizoladev@gmail.com
CONTACT_FROM_EMAIL=Seu Nome <onboarding@resend.dev>
```

> **Importante:** sem domínio próprio, o `from` fica limitado ao que o Resend permitir na sua conta.
> Se o Resend bloquear envio para terceiros sem domínio verificado, a alternativa segura é:
> - manter `from` como um endereço permitido (ex.: `onboarding@resend.dev`), e
> - usar `replyTo` com o e-mail do usuário (já está implementado na API).

#### Deploy na Vercel

Adicione as mesmas variáveis em **Project Settings → Environment Variables**.

#### Endpoint

- `POST /api/contact`
- Body JSON:
	- `name` (string)
	- `email` (string)
	- `message` (string)
	- `company` (string, opcional — honeypot anti-spam)
