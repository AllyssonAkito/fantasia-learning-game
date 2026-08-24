# Sistema de motores de microjogos

## Princípio

Um motor define interação, validação e estados. Uma atividade fornece conteúdo. O mesmo motor executa centenas de configurações.

## Contrato comum

Os contratos executáveis ficam em `packages/engine-core`: `EngineRegistry` resolve motores por ID, `EvaluationResult` padroniza respostas e os utilitários de seed tornam sessões reproduzíveis.

Todo motor deve:

- receber conteúdo previamente validado;
- apresentar instrução textual e/ou sonora;
- aceitar resposta por toque e mouse;
- avaliar sem conhecer progresso global;
- expor acerto, erro e dados de tentativa;
- fornecer até três níveis de dica;
- suportar reinício;
- emitir eventos padronizados;
- informar conclusão à sessão;
- funcionar em viewport móvel.

## Estados padronizados

A máquina de estados executável inicial está em `packages/engine-core/src/activity-session.ts`. Transições inválidas falham explicitamente, erros podem voltar a `idle` por recuperação e a conclusão só é emitida uma vez.

```text
loading
ready
presenting
answering
evaluating
incorrect
hinting
correct
rewarding
complete
error
```

## Engines do MVP

As implementações executáveis e os schemas de definição ficam em `packages/engines`. Todos usam o mesmo contrato de avaliação e são registrados de uma vez por `registerAllEngines`, sem condicionais em telas.

### Engine 01 — Escolha

Pergunta com duas a quatro alternativas.

Exemplos:

- qual elemento é diferente;
- qual forma completa o grupo;
- qual animal vive na água.

### Engine 02 — Arrastar

Itens movidos para um ou mais destinos.

Exemplos:

- colocar o objeto no contorno;
- mover itens para posições corretas;
- completar uma composição.

### Engine 03 — Sequência

Selecionar o próximo elemento de um padrão.

Exemplos:

- `🔴 🔵 🔴 🔵 ?`;
- `1 2 1 2 ?`;
- alternância de tamanho ou direção.

### Engine 04 — Associação

Relacionar um item a uma opção ou par.

Exemplos:

- animal e habitat;
- objeto e uso;
- parte e todo.

### Engine 05 — Classificação

Distribuir itens entre categorias.

Exemplos:

- animais e objetos;
- grande e pequeno;
- quente e frio.

### Engine 06 — Memória

Ocultar e recuperar pares, posições ou sequências.

Exemplos:

- pares de cartas;
- sequência visual curta;
- posição de objetos após cobertura.

### Engine 07 — Comparação

Comparar quantidade, tamanho ou outra dimensão explícita.

Exemplos:

- qual grupo tem mais;
- qual objeto é maior;
- qual caminho é mais curto.

### Engine 08 — Montagem

Combinar peças em uma estrutura final.

Exemplos:

- montar personagem;
- completar padrão visual;
- encaixar partes de uma figura.

## Estratégia de erro e dica

```text
tentativa 1 → feedback neutro e nova tentativa
tentativa 2 → destaque visual da região relevante
tentativa 3 → demonstração da lógica ou redução do espaço de resposta
```

O conteúdo fornece mensagens e assets; o motor decide quando apresentar cada nível.

## Dificuldade

A propriedade `difficulty` varia de `1` a `10`. Cada motor deve documentar como a escala altera a experiência.

O core converte a escala nas faixas `intro`, `guided`, `practice`, `challenge` e `mastery`. O efeito específico continua declarado por motor: quantidade de opções/itens, proximidade dos distratores, extensão da sequência, quantidade de grupos ou peças e tempo até a dica. A dificuldade nunca remove acessibilidade nem transforma erro em punição.

Exemplo para Sequência:

| Faixa | Alteração |
|---|---|
| 1–2 | dois elementos, repetição simples |
| 3–4 | três elementos ou mudança de atributo |
| 5–6 | padrões de dois atributos |
| 7–8 | lacuna interna ou distratores próximos |
| 9–10 | regras compostas |

## Testes obrigatórios por motor

- definição mínima válida;
- definição inválida rejeitada;
- resposta correta;
- resposta incorreta;
- primeira, segunda e terceira dica;
- reinício;
- aleatoriedade reproduzível por seed;
- interação móvel;
- áudio indisponível;
- evento de conclusão emitido uma vez.
