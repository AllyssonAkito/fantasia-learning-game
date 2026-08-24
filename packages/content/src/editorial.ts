import type { EditorialStatus } from './schemas';

export const editorialTransitions: Readonly<
  Record<EditorialStatus, readonly EditorialStatus[]>
> = {
  draft: ['review'],
  review: ['draft', 'published'],
  published: ['retired'],
  retired: [],
};

export function canTransitionEditorialStatus(
  current: EditorialStatus,
  next: EditorialStatus,
): boolean {
  return editorialTransitions[current].includes(next);
}

export function canEditEditorialContent(status: EditorialStatus): boolean {
  return status === 'draft' || status === 'review';
}
