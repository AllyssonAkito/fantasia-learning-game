import { useState } from 'react';
import { AudioService, BrowserAudioBackend } from '@fantasia/audio';
import { engineExamples } from './examples';

const audio = new AudioService(new BrowserAudioBackend());

export function Harness() {
  const [results, setResults] = useState<Record<string, boolean>>({});
  return (
    <main>
      <header>
        <p>FERRAMENTA DE DESENVOLVIMENTO</p>
        <h1>Harness visual dos motores</h1>
        <span>
          Execute cada exemplo diretamente, sem entrar no produto infantil.
        </span>
      </header>
      <section aria-label="Exemplos de motores">
        {engineExamples.map((example) => (
          <article key={example.id}>
            <div aria-hidden="true" className="preview">
              {example.label.slice(0, 1)}
            </div>
            <h2>{example.label}</h2>
            <button
              aria-label={`Ouvir instrução de ${example.label}`}
              onClick={() =>
                void audio.repeatInstruction({ text: 'Exemplo visual' })
              }
              type="button"
            >
              <span aria-hidden="true">🔊</span> Ouvir de novo
            </button>
            <div className="actions">
              <button
                onClick={() =>
                  setResults((value) => ({
                    ...value,
                    [example.id]: example.run(true),
                  }))
                }
              >
                Executar acerto
              </button>
              <button
                onClick={() =>
                  setResults((value) => ({
                    ...value,
                    [example.id]: example.run(false),
                  }))
                }
              >
                Executar erro
              </button>
            </div>
            <output aria-live="polite">
              {results[example.id] === undefined
                ? 'Pronto para testar'
                : results[example.id]
                  ? 'Acerto ✓'
                  : 'Erro esperado — tente novamente'}
            </output>
          </article>
        ))}
      </section>
    </main>
  );
}
