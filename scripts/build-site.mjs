import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const source = resolve('apps/web/dist');
const target = resolve('dist');

await rm(target, { force: true, recursive: true });
await mkdir(resolve(target, 'server'), { recursive: true });
await cp(source, target, { recursive: true });

const index = await readFile(resolve(target, 'index.html'), 'utf8');
if (!index.includes('Fantasia — Microjogos educativos')) {
  throw new Error('O build público não contém os metadados esperados.');
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolute = resolve(directory, entry.name);
      return entry.isDirectory() ? listFiles(absolute) : [absolute];
    }),
  );
  return files.flat().sort();
}

const manifestEntries = await Promise.all(
  (await listFiles(target)).map(async (absolute) => {
    const contents = await readFile(absolute);
    return {
      path: absolute.slice(target.length + 1).replaceAll('\\', '/'),
      sha256: createHash('sha256').update(contents).digest('hex'),
      bytes: contents.byteLength,
    };
  }),
);

await writeFile(
  resolve(target, 'release-manifest.json'),
  `${JSON.stringify({ version: '1.0.1', files: manifestEntries }, null, 2)}\n`,
  'utf8',
);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const embeddedAssets = Object.fromEntries(
  await Promise.all(
    (await listFiles(target)).map(async (absolute) => {
      const relative = absolute.slice(target.length).replaceAll('\\', '/');
      const extension = relative.slice(relative.lastIndexOf('.'));
      const contents = await readFile(absolute);
      return [
        relative,
        {
          base64: contents.toString('base64'),
          contentType: contentTypes[extension] ?? 'application/octet-stream',
        },
      ];
    }),
  ),
);

const worker = `const assets = ${JSON.stringify(embeddedAssets)};

function decode(base64) {
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const requested = url.pathname === '/' ? '/index.html' : url.pathname;
    const asset = assets[requested] ?? assets['/index.html'];
    const immutable = requested.startsWith('/assets/');

    return new Response(request.method === 'HEAD' ? null : decode(asset.base64), {
      headers: {
        'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
        'content-type': asset.contentType,
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'referrer-policy': 'strict-origin-when-cross-origin',
      },
    });
  },
};
`;

await writeFile(resolve(target, 'server/index.js'), worker, 'utf8');

console.log(`Build do Sites preparado em ${target}`);
