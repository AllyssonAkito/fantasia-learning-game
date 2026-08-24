# Arquitetura lógica

## Objetivo

Separar completamente a mecânica do microjogo do conteúdo pedagógico. A arquitetura descrita aqui é alvo; ela não autoriza reescrever o protótipo atual sem Issues de implementação.

## Visão de camadas

```text
┌──────────────────────────────────────────┐
│ Experiência infantil                    │
│ mundos, trilhas, atividade, recompensa  │
├──────────────────────────────────────────┤
│ Orquestração de sessão                  │
│ core loop, tentativas, dicas, progresso │
├──────────────────────────────────────────┤
│ Registro de motores                     │
│ escolha, sequência, memória, montagem   │
├──────────────────────────────────────────┤
│ Conteúdo validado                       │
│ cursos, habilidades, níveis, atividades │
├──────────────────────────────────────────┤
│ Serviços compartilhados                │
│ áudio, feedback, recompensa, telemetria │
├──────────────────────────────────────────┤
│ Persistência e infraestrutura           │
│ perfis, progresso, catálogo, métricas   │
└──────────────────────────────────────────┘
```

## Módulos alvo

### App Shell

Responsável por navegação, carregamento, recuperação de falhas e composição das telas.

A primeira implementação fica em `apps/web/src/app/AppShell.tsx`. Ela modela `loading`, `empty`, `error` e `ready` como estados explícitos, oferece recuperação no erro e recebe o conteúdo pronto sem conhecer atividades ou motores.

### Learning Path

Apresenta Curso → Trilha → Habilidade → Nível sem expor a taxonomia completa para a criança.

### Activity Session

Controla o ciclo de uma atividade:

```text
idle → presenting → answering → feedback → hint | reward → complete
```

### Engine Registry

Relaciona `activity.engine` a uma implementação. Nenhuma tela escolhe motor por condicionais espalhadas.

### Content Repository

Carrega, valida, versiona e consulta definições de conteúdo.

### Shared Services

- áudio e TTS (`packages/audio`), com fila, interrupção, mute, fallback visual e
  redução automática de efeitos durante a fala;
- feedback;
- dicas;
- recompensas;
- progresso;
- telemetria;
- feature flags.

### Profile Repository

Abstrai o armazenamento do responsável, perfis infantis e progresso. A primeira implementação pode ser local, preservando a possibilidade de backend futuro.

## Contratos principais

```ts
interface GameEngine<TContent, TAnswer> {
  id: string;
  supports(activity: ActivityDefinition): boolean;
  createSession(activity: TContent, context: SessionContext): EngineSession<TAnswer>;
}

interface EngineSession<TAnswer> {
  present(): PresentationModel;
  submit(answer: TAnswer): EvaluationResult;
  hint(attempt: number): HintModel;
  dispose(): void;
}
```

Os contratos são ilustrativos. Tipos finais dependem de uma Issue e de um ADR de stack técnica.

## Fluxo de dados

```text
Catálogo
  → validação de schema
  → seleção da atividade
  → Engine Registry
  → sessão
  → resposta
  → avaliação
  → feedback/dica
  → progresso/recompensa
  → evento analítico
```

## Estratégia de migração do protótipo

1. Congelar o protótipo como referência de UX.
2. Criar o shell e um motor vertical mínimo em paralelo.
3. Converter uma atividade atual em definição de conteúdo.
4. Validar paridade de interação e áudio.
5. Migrar somente mecânicas reutilizáveis.
6. Manter experiências específicas fora do core até haver justificativa.

## Requisitos não funcionais

- funcionamento responsivo;
- primeiro conteúdo interativo rápido em aparelhos móveis;
- tolerância a áudio indisponível;
- atividades recuperáveis após interrupção;
- acessibilidade por teclado quando aplicável;
- ausência de dependência de leitura autônoma;
- schemas versionados;
- telemetria desacoplada;
- testes determinísticos com fonte de aleatoriedade controlável.

## Stack aprovada

A fundação usa React, TypeScript estrito e Vite em um workspace pnpm. Regras de domínio e motores permanecem independentes do framework de interface; conteúdo e persistência são validados por schema antes de chegar às sessões. Testes usam Vitest e Testing Library nas camadas de unidade e integração, com Playwright para os fluxos de interface.

A decisão completa, suas alternativas e consequências estão em [ADR-005](adr/ADR-005-technical-stack.md).

## Decisões em aberto

- estratégia de backend;
- autenticação do responsável;
- formato definitivo do catálogo;
- hospedagem;
- política de sincronização entre dispositivos.

Essas decisões não devem ser tomadas incidentalmente dentro de uma Feature.
