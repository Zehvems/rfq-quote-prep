// Offline integration tests: node --test src/lib/rfq/extract.test.cjs (Node 22.15+).
const { registerHooks } = require('node:module');
const { readFileSync, existsSync } = require('node:fs');
const { fileURLToPath } = require('node:url');
const ts = require('typescript');
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Fail closed: this test file must never make a real (paid) network request.
globalThis.fetch = async () => { throw new Error('Real network requests are disabled in tests.'); };
registerHooks({
  resolve(specifier, context, nextResolve) {
    // Match Next.js's server compiler alias outside the Next.js runtime.
    if (specifier === 'server-only') return nextResolve('next/dist/compiled/server-only/empty.js', context);
    if (specifier.startsWith('.') && context.parentURL?.endsWith('.ts')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return { url: url.href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith('file:') && url.endsWith('.ts')) {
      return {
        format: 'commonjs', shortCircuit: true,
        source: ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
        }).outputText,
      };
    }
    return nextLoad(url, context);
  },
});

const { z } = require('zod');
const { extractRFQ } = require('./extract.ts');
const { rfqSchema } = require('./schema.ts');
const { POST } = require('../../app/api/extract/route.ts');
const empty = { productType: null, quantity: null, specification: null, deadline: null, deliveryLocation: null };
const sample = { productType: 'pompa obiegowa', quantity: 2, specification: '230 V', deadline: 'do piątku', deliveryLocation: 'Łódź' };
const completed = (data) => ({ status: 'completed', output: [
  { type: 'reasoning', summary: [] },
  { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(data) }] },
] });
const request = (body) => new Request('http://localhost/api/extract', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

beforeEach((t) => {
  const original = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key-not-real';
  t.after(() => {
    if (original === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = original;
  });
});

test('jedno wywołanie Responses, właściwy model i schemat wygenerowany z RFQ Zod', async (t) => {
  const rawText = 'Proszę o ofertę na dwie pompy obiegowe. Termin: do piątku.';
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer test-key-not-real');
    assert.ok(options.signal instanceof AbortSignal);
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'gpt-6-luna');
    assert.deepEqual(body.input, [{ role: 'user', content: rawText }]);
    assert.equal(body.store, false);
    assert.equal(body.reasoning.effort, 'none');
    assert.equal(body.text.format.type, 'json_schema');
    assert.equal(body.text.format.strict, true);
    assert.deepEqual(body.text.format.schema, z.toJSONSchema(rfqSchema));
    assert.match(body.instructions, /Brak, nieustalona lub niejednoznaczna wartość to null/);
    return Response.json(completed(sample));
  });
  assert.deepEqual(await extractRFQ(rawText), sample);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test('null jest prawidłowym wynikiem, bez uruchamiania archiwalnego parsera', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json(completed(empty)));
  // The old parser would fill product and quantity here. The app must return AI's result.
  assert.deepEqual(await extractRFQ('Proszę o wycenę 3 agregatów chłodniczych.'), empty);
});

test('brak klucza jest zgłaszany przed próbą połączenia', async (t) => {
  delete process.env.OPENAI_API_KEY;
  const fetchMock = t.mock.method(globalThis, 'fetch');
  await assert.rejects(extractRFQ('RFQ'), /Brak OPENAI_API_KEY/);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('pusty tekst lub zły typ nie uruchamia API', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch');
  for (const rawText of ['', '  ', null, 123]) await assert.rejects(extractRFQ(rawText), /Brak tekstu/);
  assert.equal(fetchMock.mock.callCount(), 0);
});

for (const [status, expected] of [[401, /klucz API/], [403, /Brak uprawnień/], [404, /niedostępny/], [429, /limit lub brak środków/], [500, /HTTP 500/]]) {
  test(`błąd HTTP ${status}: czytelny komunikat i brak automatycznej powtórki`, async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', async () => Response.json({ error: { message: 'raw private error' } }, { status }));
    await assert.rejects(extractRFQ('RFQ'), expected);
    assert.equal(fetchMock.mock.callCount(), 1);
  });
}

test('błąd sieci i nieprawidłowe ciało HTTP są obsługiwane', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('fetch failed'); });
  await assert.rejects(extractRFQ('RFQ'), /Nie udało się odczytać odpowiedzi/);
  t.mock.method(globalThis, 'fetch', async () => new Response('not json'));
  await assert.rejects(extractRFQ('RFQ'), /Nie udało się odczytać odpowiedzi/);
});

test('timeout 20 s przerywa ekstrakcję, także podczas odczytu odpowiedzi', async (t) => {
  const controller = new AbortController();
  t.mock.method(AbortSignal, 'timeout', (ms) => {
    assert.equal(ms, 20_000);
    return controller.signal;
  });
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => ({
    ok: true,
    json: async () => {
      controller.abort(new DOMException('Timeout', 'TimeoutError'));
      throw signal.reason;
    },
  }));
  await assert.rejects(extractRFQ('RFQ'), /limit czasu ekstrakcji \(20 s\)/);
});

test('odmowa, niekompletna i pusta odpowiedź nie stają się danymi RFQ', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ status: 'completed', output: [
    { type: 'message', content: [{ type: 'refusal', refusal: 'No' }] },
  ] }));
  await assert.rejects(extractRFQ('RFQ'), /odmówiło ekstrakcji/);
  for (const payload of [{ ...completed(sample), status: 'incomplete' }, {}, { status: 'completed', output: [] }]) {
    t.mock.method(globalThis, 'fetch', async () => Response.json(payload));
    await assert.rejects(extractRFQ('RFQ'), /kompletnej odpowiedzi|schematem RFQ/);
  }
});

test('JSON wyniku musi zawierać pięć pól o typach zgodnych z obecnym Zod', async (t) => {
  for (const data of [{}, { ...sample, quantity: '2' }, { ...sample, quantity: 2.5 }, { ...sample, productType: 42 }]) {
    t.mock.method(globalThis, 'fetch', async () => Response.json(completed(data)));
    await assert.rejects(extractRFQ('RFQ'), /schematem RFQ/);
  }
  const broken = completed(sample);
  broken.output[1].content[0].text = '{';
  t.mock.method(globalThis, 'fetch', async () => Response.json(broken));
  await assert.rejects(extractRFQ('RFQ'), /schematem RFQ/);
});

test('endpoint zachowuje status 200 i kontrakt ok/data', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json(completed(sample)));
  const response = await POST(request({ rawText: 'RFQ' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, data: sample });
});

test('endpoint obsługuje brak tekstu i uszkodzony JSON bez wywołania API', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch');
  for (const body of [{}, { rawText: ' ' }, { rawText: 123 }, null]) {
    const response = await POST(request(body));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'Brak tekstu zapytania.' });
  }
  const response = await POST(new Request('http://localhost/api/extract', { method: 'POST', body: '{' }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).ok, false);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('endpoint przekazuje kontrolowany błąd ekstrakcji w kontrakcie ok/error', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({}, { status: 429 }));
  const response = await POST(request({ rawText: 'RFQ' }));
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.match(body.error, /limit lub brak środków/);
});
