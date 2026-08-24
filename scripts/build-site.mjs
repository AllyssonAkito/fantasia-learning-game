import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const source = resolve('apps/web/dist');
const target = resolve('dist');

await rm(target, { force: true, recursive: true });
await mkdir(resolve(target, 'server'), { recursive: true });
await cp(source, target, { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || request.method !== 'GET') {
      return response;
    }

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};
`;

await writeFile(resolve(target, 'server/index.js'), worker, 'utf8');

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
  `${JSON.stringify({ version: '1.0.0', files: manifestEntries }, null, 2)}\n`,
  'utf8',
);

console.log(`Build do Sites preparado em ${target}`);
