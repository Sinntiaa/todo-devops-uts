const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../app');

// pool palsu supaya test tidak butuh database
const fakePool = {
  query: async (sql, params) => {
    if (sql.startsWith('SELECT')) return { rows: [{ id: 1, title: 'belajar docker', done: false }] };
    if (sql.startsWith('INSERT')) return { rows: [{ id: 2, title: params[0], done: false }] };
    return { rows: [] };
  },
};

async function withServer(fn) {
  const server = createApp(fakePool).listen(0);
  const base = 'http://127.0.0.1:' + server.address().port;
  try { await fn(base); } finally { server.close(); }
}

test('GET /api/info mengembalikan status ok', () => withServer(async (base) => {
  const body = await (await fetch(base + '/api/info')).json();
  assert.strictEqual(body.status, 'ok');
}));

test('GET /api/todos mengembalikan daftar', () => withServer(async (base) => {
  const body = await (await fetch(base + '/api/todos')).json();
  assert.strictEqual(body.length, 1);
}));

test('POST /api/todos tanpa title ditolak', () => withServer(async (base) => {
  const res = await fetch(base + '/api/todos', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
}));

test('POST /api/todos dengan title berhasil', () => withServer(async (base) => {
  const res = await fetch(base + '/api/todos', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'tes' }),
  });
  assert.strictEqual(res.status, 201);
}));
