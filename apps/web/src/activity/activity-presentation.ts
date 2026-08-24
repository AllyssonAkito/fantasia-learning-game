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
  pattern: string[];
  options: { id: string; label: string }[];
  evaluate: (answer: string) => boolean;
}

function assetLabel(id: string) {
  const asset = mvpAssetById.get(id);
  return asset ? `${asset.source} ${asset.alt}` : id;
}

export function createChoicePresentation(
  activity: Activity,
): ChoicePresentation {
  if (activity.engine === 'sequence') {
    const definition = activity.content as SequenceDefinition;
    return {
      prompt: definition.prompt,
      pattern: definition.pattern.map(assetLabel),
      options: definition.options,
      evaluate: (answer) => sequenceEngine.evaluate(definition, answer).correct,
    };
  }
  if (activity.engine === 'choice') {
    const definition = activity.content as ChoiceDefinition;
    return {
      prompt: definition.prompt,
      pattern: [],
      options: definition.options,
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
        label: `${assetLabel(id)} — ${value}`,
      })),
      evaluate: (answer) =>
        comparisonEngine.evaluate(definition, answer).correct,
    };
  }
  throw new Error(
    `A apresentação inicial não suporta o motor ${activity.engine}.`,
  );
}
