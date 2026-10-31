// Run with: node scripts/check-contact.cjs
// Uses only installed dependencies and node:test. All provider calls are mocked;
// the route receives an isolated environment and cannot import the real Resend SDK.
async function main() {
  const { default: assert } = await import('node:assert/strict');
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { createRequire } = await import('node:module');
  const { runInNewContext } = await import('node:vm');
  const { test } = await import('node:test');
  const { default: ts } = await import('typescript');
  const nodeRequire = createRequire(__filename);
  const routePath = join(__dirname, '..', 'src', 'app', 'api', 'contact', 'route.ts');
  const output = ts.transpileModule(readFileSync(routePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
    fileName: routePath,
  });
  assert.equal(output.diagnostics.length, 0, 'The contact route must transpile');

  function loadRoute(mode = 'success', configured = false) {
    const sent = [];
    let constructed = 0;
    class MockResend {
      constructor() { constructed += 1; }
      emails = { send: async input => {
        sent.push(input);
        if (mode === 'primary-error' && sent.length === 1) {
          return { error: { message: 'PRIVATE_PROVIDER_DETAIL' } };
        }
        if (mode === 'primary-throw' && sent.length === 1) throw new Error('PRIVATE_PROVIDER_DETAIL');
        if (mode === 'receipt-throw' && sent.length === 2) throw new Error('PRIVATE_PROVIDER_DETAIL');
        if (mode === 'receipt-error' && sent.length === 2) {
          return { error: { message: 'PRIVATE_PROVIDER_DETAIL' } };
        }
        return { data: { id: 'mock' }, error: null };
      } };
    }
    const env = configured ? {
      RESEND_API_KEY: 'mock-key',
      CONTACT_TO_EMAIL: 'owner@example.test',
      CONTACT_FROM_EMAIL: 'sender@example.test',
    } : {};
    const routeModule = { exports: {} };
    runInNewContext(output.outputText, {
      exports: routeModule.exports,
      module: routeModule,
      require: name => {
        if (name === 'resend') return { Resend: MockResend };
        if (name === 'next/server' || name === 'zod') return nodeRequire(name);
        throw new Error('Unmocked route dependency: ' + name);
      },
      process: { env },
      TextDecoder,
      fetch: () => { throw new Error('Network access is forbidden in this test'); },
    }, { filename: routePath });
    return { post: routeModule.exports.POST, sent, get constructed() { return constructed; } };
  }

  function request(body, headers = { 'content-type': 'application/json' }) {
    return new Request('http://localhost/api/contact', {
      method: 'POST', headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  const valid = { name: 'Pessoa Teste', email: 'person@example.test', message: 'Mensagem de teste local.' };
  const rejectedRequests = [
    ['malformed JSON is rejected before provider configuration', () => request('{'), 400],
    ['invalid fields are rejected before provider configuration', () => request({}), 400],
    ['unknown fields are rejected by the strict schema', () => request({ ...valid, unexpected: true }), 400],
    ['newlines cannot enter the subject through the name', () => request({ ...valid, name: 'Pessoa\r\nInjected' }), 400],
    ['non-JSON content type is rejected', () => request('{}', { 'content-type': 'text/plain' }), 415],
    ['declared body size is limited', () => request('{}', { 'content-type': 'application/json', 'content-length': '17000' }), 413],
    ['streamed body size is limited without Content-Length', () => request('x'.repeat(17000)), 413],
    ['missing provider configuration produces a generic service error', () => request(valid), 503],
  ];

  for (const [name, makeRequest, expectedStatus] of rejectedRequests) {
    await test(name, async () => {
      const route = loadRoute();
      const response = await route.post(makeRequest());
      assert.equal(response.status, expectedStatus);
      assert.equal((await response.json()).ok, false);
      assert.equal(route.constructed, 0, 'Rejected requests must not instantiate the provider');
      assert.equal(route.sent.length, 0);
      if (expectedStatus === 413 && name.startsWith('streamed')) {
        const unicodeResponse = await route.post(request({ message: 'ã'.repeat(10000) }));
        assert.equal(unicodeResponse.status, 413, 'The limit must count UTF-8 bytes');
      }
    });
  }

  await test('honeypot returns neutral success without contacting the provider', async () => {
    const route = loadRoute();
    const response = await route.post(request({ ...valid, company: 'bot' }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
    assert.equal(route.constructed, 0);
    assert.equal(route.sent.length, 0);
  });

  for (const mode of ['success', 'primary-error', 'receipt-error', 'receipt-throw']) {
    await test('provider mode: ' + mode, async () => {
      const route = loadRoute(mode, true);
      const response = await route.post(request({ ...valid, message: '<script>alert("test")</script>' }));
      const payload = await response.json();
      assert.equal(response.status, mode === 'primary-error' ? 502 : 200);
      assert.equal(payload.ok, mode !== 'primary-error');
      assert.equal(JSON.stringify(payload).includes('PRIVATE_PROVIDER_DETAIL'), false);
      assert.equal('details' in payload, false, 'Raw provider errors must not be exposed');
      assert.equal(route.sent.length, mode === 'primary-error' ? 1 : 2);
      assert.equal(route.sent[0].replyTo, valid.email);
      assert.equal(route.sent[0].to, 'owner@example.test');
      for (const email of route.sent) {
        assert.equal(email.html.includes('<script>'), false);
        assert.equal(email.html.includes('&lt;script&gt;'), true);
      }
      if (mode !== 'primary-error') {
        assert.equal(payload.userEmailSent, mode === 'success');
        assert.equal(route.sent[1].to, valid.email);
      } else {
        const thrown = loadRoute('primary-throw', true);
        const thrownResponse = await thrown.post(request(valid));
        assert.equal(thrownResponse.status, 500);
        assert.equal((await thrownResponse.text()).includes('PRIVATE_PROVIDER_DETAIL'), false);
        assert.equal(thrown.sent.length, 1, 'Do not send a receipt after primary failure');
      }
    });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
