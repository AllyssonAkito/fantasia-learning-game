export type AppMode = 'development' | 'test' | 'production';

export interface AppEnvironment {
  mode: AppMode;
  isProduction: boolean;
  telemetryEnabled: boolean;
}

const supportedModes: ReadonlySet<string> = new Set([
  'development',
  'test',
  'production',
]);

export function createEnvironment(mode: string): AppEnvironment {
  if (!supportedModes.has(mode)) {
    throw new Error(`Modo de execução não suportado: ${mode}`);
  }

  const normalizedMode = mode as AppMode;

  return {
    mode: normalizedMode,
    isProduction: normalizedMode === 'production',
    telemetryEnabled: false,
  };
}

export const environment = createEnvironment(import.meta.env.MODE);
