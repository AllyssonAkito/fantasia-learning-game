import { describe, expect, it } from 'vitest';

import { InMemoryContentCatalog } from './catalog';
import { exampleCatalogSeed } from './examples';

describe('exampleCatalogSeed', () => {
  it('contém estrutura mínima válida para as seis áreas do MVP', () => {
    expect(exampleCatalogSeed.courses).toHaveLength(6);
    expect(exampleCatalogSeed.trails).toHaveLength(6);
    expect(exampleCatalogSeed.skills).toHaveLength(6);
    expect(exampleCatalogSeed.levels).toHaveLength(6);
    expect(exampleCatalogSeed.activities).toHaveLength(6);
    expect(() => new InMemoryContentCatalog(exampleCatalogSeed)).not.toThrow();
  });
});
