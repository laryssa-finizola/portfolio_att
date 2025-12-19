import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const ContactSchema = z
  .object({
    name: z.string().trim().min(2, 'Nome inválido').max(100, 'Nome muito longo'),
    email: z.string().trim().email('Email inválido').max(200, 'Email muito longo'),
    message: z.string().trim().min(10, 'Mensagem muito curta').max(2000, 'Mensagem muito longa'),
    // Honeypot (campo invisível). Se vier preenchido, provavelmente é bot.
    company: z.string().optional().default(''),
  })
  .strict();

export async function POST(req: Request) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
    const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
      return NextResponse.json(
        { ok: false, error: 'Server not configured' },
        { status: 500 },
      );
    }

    const json = await req.json();
    const parsed = ContactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, message, company } = parsed.data;

    // Honeypot acionado
    if (company && company.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const resend = new Resend(RESEND_API_KEY);

    // 1) Email para você
    const subjectToYou = `Novo contato do portfólio: ${name}`;
    const htmlToYou = `
      <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
        <h2>Novo contato pelo portfólio</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensagem:</strong></p>
        <pre style="white-space: pre-wrap; font-family: ui-sans-serif, system-ui; background:#f6f7f9; padding:12px; border-radius:8px">${escapeHtml(message)}</pre>
      </div>
    `;

    // 2) Confirmação para o usuário
    const subjectToUser = 'Recebemos sua mensagem!';
    const htmlToUser = `
      <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
        <p>Oi, ${escapeHtml(name)}!</p>
        <p>Obrigada por entrar em contato. Eu recebi sua mensagem e vou te responder o mais breve possível.</p>
        <p style="margin-top:16px"><strong>Cópia da sua mensagem:</strong></p>
        <pre style="white-space: pre-wrap; font-family: ui-sans-serif, system-ui; background:#f6f7f9; padding:12px; border-radius:8px">${escapeHtml(message)}</pre>
        <p style="margin-top:16px">Atenciosamente,<br/>Laryssa Finizola</p>
      </div>
    `;

    // Envio 1 (principal): sempre tentamos enviar para você primeiro.
    const toYou = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: subjectToYou,
      html: htmlToYou,
    });

    if (toYou.error) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Email send failed',
          details: { toYou: toYou.error, toUser: null },
        },
        { status: 502 },
      );
    }

    // Envio 2 (opcional): confirmação para o usuário.
    // Em contas sem domínio verificado, esse envio pode falhar por políticas do provedor.
    const toUser = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: email,
      subject: subjectToUser,
      html: htmlToUser,
    });

    // Se o principal deu certo, retornamos ok:true mesmo que a confirmação falhe.
    return NextResponse.json(
      {
        ok: true,
        userEmailSent: !toUser.error,
        userEmailError: toUser.error ?? null,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
