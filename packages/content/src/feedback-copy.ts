export const feedbackCopyCatalog = Object.freeze({
  mascot: {
    neutral: 'Estou aqui com você.',
    instruction: 'Vamos descobrir juntos?',
    correct: 'Muito bem!',
    safeError: 'A brincadeira fez uma pausa. Podemos tentar de novo.',
  },
  attempts: {
    first: 'Quase! Vamos tentar de novo?',
    second: 'Olhe com atenção para a parte iluminada.',
    third: 'Veja como podemos fazer juntos.',
  },
  completion: {
    activity: 'Você conseguiu!',
    level: 'Uma nova aventura apareceu!',
  },
} as const);

export type FeedbackCopyCatalog = typeof feedbackCopyCatalog;
