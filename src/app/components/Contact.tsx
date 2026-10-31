'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import './contact.css';

const emailAddress = 'laryssafinizoladev@gmail.com';
const emptyForm = { name: '', email: '', message: '', company: '' };
type ContactStatus = { state: 'idle' | 'sending' | 'success' | 'error'; message: string };

export function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<ContactStatus>({ state: 'idle', message: '' });
  const [copyMessage, setCopyMessage] = useState('');
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopyMessage('E-mail copiado!');
    } catch {
      setCopyMessage('Não foi possível copiar. Selecione o endereço acima ou abra seu aplicativo de e-mail.');
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setStatus({ state: 'sending', message: 'Enviando sua mensagem…' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok || !data || typeof data !== 'object' || !('ok' in data) || data.ok !== true) {
        setStatus({ state: 'error', message: response.status === 400 ? 'Revise os campos: nome com ao menos 2 caracteres, e-mail válido e mensagem com ao menos 10 caracteres.' : 'Não foi possível enviar agora. Tente novamente ou use o e-mail acima.' });
        return;
      }
      setStatus({ state: 'success', message: 'userEmailSent' in data && data.userEmailSent === false ? 'Mensagem enviada! A confirmação por e-mail não foi enviada, mas recebi seu contato e vou responder em breve.' : 'Mensagem enviada! Obrigada por entrar em contato.' });
      setFormData(emptyForm);
    } catch {
      if (!controller.signal.aborted) setStatus({ state: 'error', message: 'Verifique sua conexão e tente novamente, ou use o e-mail acima.' });
    } finally {
      request.current = null;
    }
  }

  return (
    <section aria-labelledby="contactTitle" className="contact-section section-dark" id="contato">
      <div className="shell contact-shell">
        <div className="section-kicker"><span className="section-index">04 / 04</span><span>PRÓXIMA CONEXÃO</span></div>
        <div className="contact-heading"><p>PRONTO PARA O PRÓXIMO DESAFIO?</p><h2 id="contactTitle">Vamos criar<br /><span>algo <i>relevante.</i></span><b aria-hidden="true">↗</b></h2></div>
        <div className="contact-bottom">
          <div className="contact-left">
            <p>Se você tem uma oportunidade, um projeto ou uma boa conversa sobre tecnologia, a próxima linha começa aqui.</p>
            <a className="contact-mail" href={`mailto:${emailAddress}`}>{emailAddress} <span aria-hidden="true">↗</span></a>
            <button className="copy-email" type="button" onClick={copyEmail}><span aria-hidden="true">⧉</span><span>Copiar e-mail</span></button>
            <p className="contact-copy-status" role="status">{copyMessage}</p>
            <address className="contact-address"><a href="tel:+5583921497340">+55 (83) 92149-7340</a><span>Campina Grande — PB, Brasil</span></address>
          </div>
          <div className="social-links" role="group" aria-label="Canais de contato">
            <a href="https://github.com/laryssa-finizola" rel="noopener noreferrer" target="_blank"><span>GitHub</span><span aria-hidden="true">↗</span></a>
            <a href="https://www.linkedin.com/in/laryssafinizola/" rel="noopener noreferrer" target="_blank"><span>LinkedIn</span><span aria-hidden="true">↗</span></a>
            <a href={`mailto:${emailAddress}`}><span>E-mail</span><span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="contact-form-layout">
          <div className="contact-form-intro"><p className="section-kicker">OU ESCREVA POR AQUI</p><h3>Uma boa conversa<br />é um começo.</h3><p>Conte um pouco sobre o que você tem em mente. Seu contato chega diretamente ao meu e-mail.</p></div>
          <form className="contact-form" onSubmit={handleSubmit} aria-labelledby="formTitle" aria-busy={status.state === 'sending'}>
            <h3 id="formTitle" className="sr-only">Enviar mensagem para Laryssa</h3>
            <div hidden aria-hidden="true"><label htmlFor="contact-company">Empresa</label><input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={formData.company} onChange={event => setFormData({ ...formData, company: event.target.value })} /></div>
            <div className="contact-form-row">
              <div><label htmlFor="contact-name">Nome</label><input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={formData.name} onChange={event => setFormData({ ...formData, name: event.target.value })} placeholder="Como posso chamar você?" /></div>
              <div><label htmlFor="contact-email">E-mail</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={200} value={formData.email} onChange={event => setFormData({ ...formData, email: event.target.value })} placeholder="seu@email.com" /></div>
            </div>
            <div><label htmlFor="contact-message">Mensagem</label><textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={5} value={formData.message} onChange={event => setFormData({ ...formData, message: event.target.value })} placeholder="Vamos conversar sobre sua ideia…" /></div>
            <button className="button button-accent contact-submit" type="submit" disabled={status.state === 'sending'}><span>{status.state === 'sending' ? 'Enviando…' : 'Enviar mensagem'}</span><span aria-hidden="true">↗</span></button>
            <p className={`contact-form-status${status.state === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">{status.message}</p>
          </form>
        </div>
      </div>
      <div aria-hidden="true" className="contact-orbit" />
    </section>
  );
}
