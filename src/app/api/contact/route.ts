import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const MAX_BODY_BYTES = 16 * 1024;
const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Nome inválido').max(100, 'Nome muito longo')
    .refine(value => !/[\r\n]/.test(value), 'Nome inválido'),
  email: z.string().trim().email('Email inválido').max(200, 'Email muito longo'),
  message: z.string().trim().min(10, 'Mensagem muito curta').max(2000, 'Mensagem muito longa'),
  company: z.string().max(200).optional().default(''),
}).strict();

class BodyError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function readJsonBody(req: Request): Promise<unknown> {
  const declaredLength = Number(req.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new BodyError(413, 'Payload too large');
  }
  if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new BodyError(415, 'Content-Type must be application/json');
  }
  if (!req.body) throw new BodyError(400, 'Invalid JSON');

  const reader = req.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new BodyError(413, 'Payload too large');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof BodyError) throw error;
    throw new BodyError(400, 'Invalid JSON');
  } finally {
    reader.releaseLock();
  }
}

export async function POST(req: Request) {
  try {
    const parsed = ContactSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
    }
    const { name, email, message, company } = parsed.data;
    // A filled honeypot receives a neutral response without contacting the provider.
    if (company.trim()) return NextResponse.json({ ok: true });

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !toEmail || !fromEmail) {
      return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 503 });
    }

    const resend = new Resend(apiKey);
    const htmlToYou = `
      <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
        <h2>Novo contato pelo portfólio</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensagem:</strong></p>
        <pre style="white-space: pre-wrap; font-family: ui-sans-serif, system-ui; background:#f6f7f9; padding:12px; border-radius:8px">${escapeHtml(message)}</pre>
      </div>
    `;
    const toYou = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Novo contato do portfólio: ${name}`,
      html: htmlToYou,
    });
    if (toYou.error) {
      return NextResponse.json({ ok: false, error: 'Email send failed' }, { status: 502 });
    }

    // Receipt delivery is optional. Its failure must not hide a successful contact.
    let userEmailSent = false;
    try {
      const toUser = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Recebemos sua mensagem!',
        html: `
          <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
            <p>Oi, ${escapeHtml(name)}!</p>
            <p>Obrigada por entrar em contato. Eu recebi sua mensagem e vou te responder o mais breve possível.</p>
            <p style="margin-top:16px"><strong>Cópia da sua mensagem:</strong></p>
            <pre style="white-space: pre-wrap; font-family: ui-sans-serif, system-ui; background:#f6f7f9; padding:12px; border-radius:8px">${escapeHtml(message)}</pre>
            <p style="margin-top:16px">Atenciosamente,<br/>Laryssa Finizola</p>
          </div>
        `,
      });
      userEmailSent = !toUser.error;
    } catch {
      userEmailSent = false;
    }
    return NextResponse.json({ ok: true, userEmailSent });
  } catch (error) {
    if (error instanceof BodyError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
