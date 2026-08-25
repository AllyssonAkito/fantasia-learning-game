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

  return (
    <img
      alt={decorative ? '' : asset.alt}
      className="activity-asset"
      draggable={false}
      height={asset.height}
      src={asset.source}
      width={asset.width}
    />
  );
}
