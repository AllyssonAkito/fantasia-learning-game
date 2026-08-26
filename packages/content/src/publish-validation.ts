import { engineDefinitionSchemas } from '@fantasia/engines';
import type { ContentCatalogSeed } from './catalog';
import type { ContentAsset } from './mvp-assets';
import { validateCatalogIntegrity } from './integrity';

export class PublishValidationError extends Error {
  constructor(readonly issues: readonly string[]) {
    super(`Catálogo não publicável: ${issues.join('; ')}`);
    this.name = 'PublishValidationError';
  }
}

export function validatePublishableCatalog(
  seed: ContentCatalogSeed,
  assets: readonly ContentAsset[],
) {
  validateCatalogIntegrity(seed);
  const issues: string[] = [];
  const activities = seed.activities ?? [];
  const assetIds = new Set(assets.map((asset) => asset.id));
  const counts = new Map<string, number>();

  if (activities.length < 120) {
    issues.push(
      `quantidade mínima esperada 120; recebida ${activities.length}`,
    );
  }

  for (const activity of activities) {
    const area = activity.id.split('.')[1] ?? 'unknown';
    counts.set(area, (counts.get(area) ?? 0) + 1);
    if (activity.status !== 'published')
      issues.push(`${activity.id} não publicado`);
    if (!activity.instruction.audio && !activity.instruction.ttsFallback) {
      issues.push(`${activity.id} sem instrução audível`);
    }
    const validation = engineDefinitionSchemas[activity.engine].safeParse(
      activity.content,
    );
    if (!validation.success)
      issues.push(`${activity.id} incompatível com ${activity.engine}`);
    for (const assetId of activity.assets) {
      if (!assetIds.has(assetId))
        issues.push(`${activity.id} referencia asset ausente ${assetId}`);
    }
  }

  for (const area of [
    'logic',
    'attention',
    'association',
    'numbers',
    'shapes',
    'memory',
  ]) {
    const count = counts.get(area) ?? 0;
    if (count < 18)
      issues.push(
        `${area} precisa de no mínimo 18 atividades; recebeu ${count}`,
      );
  }

  for (const asset of assets) {
    if (
      !asset.alt ||
      !asset.licenseUrl ||
      asset.width < 56 ||
      asset.height < 56
    ) {
      issues.push(`${asset.id} falhou no checklist de asset`);
    }
  }

  if (issues.length > 0) throw new PublishValidationError(issues);
  return {
    activities: activities.length,
    areas: counts.size,
    assets: assets.length,
  };
}
