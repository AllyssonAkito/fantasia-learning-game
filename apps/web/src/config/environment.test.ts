import { describe, expect, it } from 'vitest';

import { createEnvironment } from './environment';

describe('createEnvironment', () => {
  it.each(['development', 'test', 'production'] as const)(
    'aceita o ambiente %s sem habilitar telemetria infantil',
    (mode) => {
      expect(createEnvironment(mode)).toEqual({
        mode,
        isProduction: mode === 'production',
        telemetryEnabled: false,
      });
    },
  );

  it('recusa um ambiente desconhecido com erro explícito', () => {
    expect(() => createEnvironment('preview')).toThrow(
      'Modo de execução não suportado: preview',
    );
  });
});
