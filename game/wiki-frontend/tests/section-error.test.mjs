import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('a failed section displays a localized retry action', async () => {
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: Boundary } = await server.ssrLoadModule('/src/SectionErrorBoundary.tsx');
    assert.deepEqual(Boundary.getDerivedStateFromError(new Error('failed')), { failed: true });
    for (const [language, label] of [['es', 'Reintentar'], ['en', 'Try again']]) {
      const boundary = new Boundary({ language, children: React.createElement('p', null, 'ready') });
      boundary.state = { failed: true };
      const html = renderToStaticMarkup(boundary.render());
      assert.match(html, /role="alert"/);
      assert.ok(html.includes(label));
    }
  } finally { await server.close(); }
});
