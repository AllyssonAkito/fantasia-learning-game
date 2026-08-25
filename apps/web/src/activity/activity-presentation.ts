import type { Activity } from '@fantasia/content';
import { mvpAssetById } from '@fantasia/content';
import {
  choiceEngine,
  comparisonEngine,
  sequenceEngine,
  type ChoiceDefinition,
  type ComparisonDefinition,
  type SequenceDefinition,
} from '@fantasia/engines';

export interface ChoicePresentation {
  prompt: string;
  clue?: {
    assetId: string;
    label: string;
    focusX: 'left' | 'center' | 'right';
    focusY: 'top' | 'center' | 'bottom';
  };
  pattern: { id: string; label: string }[];
  options: {
    id: string;
    label: string;
    assetId: string;
    quantity?: number;
    scale?: number;
  }[];
  evaluate: (answer: string) => boolean;
}

function assetLabel(id: string) {
  const asset = mvpAssetById.get(id);
  return asset?.alt ?? id;
}

function assetItem(id: string) {
  return { id, label: assetLabel(id), assetId: id };
}

export function createChoicePresentation(
  activity: Activity,
): ChoicePresentation {
  if (activity.engine === 'sequence') {
    const definition = activity.content as SequenceDefinition;
    return {
      prompt: definition.prompt,
      pattern: definition.pattern.map(assetItem),
      options: definition.options.map(({ id }) => assetItem(id)),
      evaluate: (answer) => sequenceEngine.evaluate(definition, answer).correct,
    };
  }
  if (activity.engine === 'choice') {
    const definition = activity.content as ChoiceDefinition;
    return {
      prompt: definition.prompt,
      clue: definition.clue
        ? {
            ...definition.clue,
            label: assetLabel(definition.clue.assetId),
          }
        : undefined,
      pattern: [],
      options: definition.options.map(({ id }) => assetItem(id)),
      evaluate: (answer) => choiceEngine.evaluate(definition, answer).correct,
    };
  }
  if (activity.engine === 'comparison') {
    const definition = activity.content as ComparisonDefinition;
    return {
      prompt: definition.prompt,
      pattern: [],
      options: definition.candidates.map(({ id, value }) => ({
        id,
        label: `${assetLabel(id)}, quantidade ${value}`,
        assetId: id,
        quantity:
          definition.dimension === 'quantity'
            ? Math.min(5, Math.max(1, Math.round(value)))
            : undefined,
        scale:
          definition.dimension === 'size'
            ? Math.min(1, 0.45 + value * 0.12)
            : undefined,
      })),
      evaluate: (answer) =>
        comparisonEngine.evaluate(definition, answer).correct,
    };
  }
  throw new Error(
    `A apresentação inicial não suporta o motor ${activity.engine}.`,
  );
}
