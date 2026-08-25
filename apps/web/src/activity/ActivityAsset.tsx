import { mvpAssetById } from '@fantasia/content';

export interface ActivityAssetProps {
  assetId: string;
  decorative?: boolean;
}

export function ActivityAsset({
  assetId,
  decorative = false,
}: ActivityAssetProps) {
  const asset = mvpAssetById.get(assetId);
  if (!asset) return <span aria-hidden="true">?</span>;

  if (asset.kind === 'letter-tile') {
    return (
      <span
        aria-hidden={decorative || undefined}
        className="activity-letter-tile"
        data-tone={asset.tone}
      >
        {asset.letter}
      </span>
    );
  }

  if (asset.kind === 'composite-image') {
    return (
      <span
        aria-hidden={decorative || undefined}
        className="activity-composite-image"
      >
        {asset.components?.map((component) => (
          <span
            className={`activity-composite-image__part activity-composite-image__part--${component.position}`}
            key={`${component.assetId}-${component.position}`}
          >
            <ActivityAsset assetId={component.assetId} decorative />
          </span>
        ))}
      </span>
    );
  }

  if (asset.crop) {
    return (
      <span
        aria-hidden={decorative || undefined}
        className="activity-asset-slice"
        data-crop={asset.crop}
      >
        <img
          alt={decorative ? '' : asset.alt}
          draggable={false}
          src={asset.source}
        />
      </span>
    );
  }

  return (
    <img
      alt={decorative ? '' : asset.alt}
      className="activity-asset"
      draggable={false}
      height={asset.height}
      src={asset.source!}
      width={asset.width}
    />
  );
}
