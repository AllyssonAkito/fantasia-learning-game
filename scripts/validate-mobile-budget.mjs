import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../apps/web/dist/', import.meta.url));
const limits = { '.html': 20_000, '.css': 60_000, '.js': 350_000 };
const totalLimit = 450_000;

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? files(path) : Promise.resolve([path]);
      }),
    )
  ).flat();
}

const artifacts = await files(output);
let total = 0;
for (const artifact of artifacts) {
  const extension = Object.keys(limits).find((suffix) =>
    artifact.endsWith(suffix),
  );
  if (!extension) continue;
  const size = (await stat(artifact)).size;
  total += size;
  if (size > limits[extension]) {
    throw new Error(`${artifact} excedeu ${limits[extension]} bytes: ${size}`);
  }
}
if (total > totalLimit) {
  throw new Error(`Bundle web excedeu ${totalLimit} bytes: ${total}`);
}
console.log(`Orçamento móvel aprovado: ${total} / ${totalLimit} bytes.`);
