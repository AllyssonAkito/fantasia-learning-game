# Modelo de conteúdo

## Objetivo

Permitir criar e revisar atividades sem alterar os motores.

Os schemas executáveis iniciais ficam em `packages/content/src/schemas.ts`. A identidade do responsável e outros contratos não pedagógicos pertencem a `packages/domain`.

## Hierarquia

```text
Course
└── Trail
    └── Skill
        └── Level
            └── Activity
```

Cada entidade possui identificador estável, versão de schema, versão editorial, título interno e estado editorial. A decisão normativa está em [ADR-007](adr/ADR-007-pedagogical-taxonomy.md).

## Identidade e relações

| Entidade   | Prefixo de ID | Relação obrigatória  |
| ---------- | ------------- | -------------------- |
| `Course`   | `course.`     | raiz                 |
| `Trail`    | `trail.`      | `courseId`           |
| `Skill`    | `skill.`      | `trailId`            |
| `Level`    | `level.`      | `skillId`            |
| `Activity` | `activity.`   | `levelId` e `engine` |

Todos os IDs são globais, em minúsculas, separados por ponto e não carregam textos exibidos. Referências ausentes, IDs duplicados, ciclos ou relações fora da hierarquia invalidam o catálogo antes do build.

Curso, trilha e nível podem declarar `presentation` com rótulo curto e ícone destinados à criança. O modelo de navegação recebe somente esses campos, o destino opaco e o estado `current`, `locked` ou `completed`; títulos internos e nomes da taxonomia não são renderizados.

A visão da trilha pode incluir uma `cover` derivada da primeira atividade do
nível. A capa expõe somente os IDs necessários para uma prévia de sequência,
montagem ou pista parcial; respostas e regras de avaliação não chegam ao
componente de navegação.

`schemaVersion` é um inteiro positivo. `contentVersion` usa SemVer e identifica a revisão executada. Conteúdo publicado é imutável; correções geram nova revisão sem reescrever o histórico.

## Activity

```json
{
  "id": "activity.logic.repeat.001",
  "schemaVersion": 1,
  "contentVersion": "1.0.0",
  "status": "draft",
  "engine": "sequence",
  "levelId": "level.logic.patterns.01",
  "difficulty": 2,
  "instruction": {
    "text": "O que vem depois?",
    "audio": "audio/instructions/what-next.mp3"
  },
  "content": {
    "sequence": ["red-circle", "blue-circle", "red-circle", "blue-circle"],
    "options": ["red-circle", "blue-circle", "yellow-circle"],
    "correctAnswer": "red-circle"
  },
  "hints": [
    { "type": "highlight-pattern" },
    { "type": "dim-invalid-options" },
    { "type": "demonstrate" }
  ],
  "reward": {
    "stars": 1,
    "coins": 2
  },
  "assets": ["red-circle", "blue-circle", "yellow-circle"],
  "analytics": {
    "concept": "AB-pattern"
  }
}
```

## Campos comuns obrigatórios

| Campo            | Finalidade                                |
| ---------------- | ----------------------------------------- |
| `id`             | identidade permanente                     |
| `schemaVersion`  | versão do formato do registro             |
| `contentVersion` | revisão editorial em SemVer               |
| `status`         | `draft`, `review`, `published`, `retired` |
| `engine`         | motor registrado                          |
| `levelId`        | nível e caminho pedagógico relacionados   |
| `difficulty`     | escala interna de 1 a 10                  |
| `instruction`    | texto e áudio                             |
| `content`        | payload específico do motor               |
| `hints`          | progressão de ajuda                       |
| `reward`         | estrelas e moedas                         |
| `assets`         | recursos necessários                      |

## Assets visuais

O catálogo resolve a apresentação visual por ID; atividades e motores não
incluem emojis, caminhos de arquivo ou marcação de imagem em seus payloads.

```json
{
  "id": "asset.symbol.rabbit",
  "kind": "raster-image",
  "source": "/assets/activity/rabbit.webp",
  "alt": "coelhinho",
  "width": 384,
  "height": 384,
  "license": "Original project artwork",
  "licenseUrl": "/docs/ASSET-LICENSES.md#ilustracoes-de-atividade",
  "legibility": "verified-at-96px"
}
```

Os IDs `asset.symbol.*` permanecem estáveis por compatibilidade editorial,
embora o tipo de apresentação seja uma imagem rasterizada. A interface usa o
texto alternativo como nome acessível e não exibe texto nas escolhas infantis.

Recortes de montagem usam IDs `asset.character.<personagem>.<parte>` e podem
declarar `crop` como `top`, `middle` ou `bottom`. As três partes de uma
atividade sempre apontam para a mesma ilustração original; o recorte é uma
decisão de apresentação e não duplica a mecânica no conteúdo.

As atividades de alfabetização inicial usam `letter-tile`: uma peça gráfica
com uma única letra, cor editorial e nome acessível. Cenas espaciais simples
usam `composite-image`, que combina assets já licenciados sem colocar marcação
de tela dentro do conteúdo. Esses tipos continuam sendo resolvidos pelo mesmo
catálogo e não transformam letras ou composições em lógica do motor.

O motor de escolha pode receber uma `clue` opcional com `assetId`, `focusX` e
`focusY`. A apresentação amplia apenas essa região da ilustração; o conteúdo
continua declarando a resposta em `correctOptionId`. Esse recurso diferencia
reconhecimento por fragmento de uma sequência incompleta.

## Regras

- `content` é validado pelo schema do motor.
- `correctAnswer` não deve estar duplicado em lógica de UI.
- todo asset possui ID, tipo, dimensões e texto alternativo quando aplicável;
- emojis e glifos Unicode não são aceitos como arte final de atividades;
- instrução sonora é obrigatória ou deve ter fallback TTS;
- atividades publicadas são imutáveis; correções geram nova versão;
- IDs não carregam textos exibidos para a criança;
- conteúdo pedagógico precisa de revisão antes de `published`.

## Pacotes por motor

Cada motor deve manter:

```text
engine/
├── schema
├── parser
├── evaluator
├── presentation adapter
├── examples
└── tests
```

## Fluxo editorial futuro

```text
Draft → Pedagogical Review → UX Review → QA → Published → Retired
```

Os estados executáveis são:

| Estado      | Pode editar | Próximos estados     |
| ----------- | ----------- | -------------------- |
| `draft`     | sim         | `review`             |
| `review`    | sim         | `draft`, `published` |
| `published` | não         | `retired`            |
| `retired`   | não         | nenhum               |

Um item nunca salta diretamente de `draft` para `published`. Retirar conteúdo impede novas sessões, mas não altera histórico. As transições ficam em `packages/content/src/editorial.ts`.

O CMS não faz parte do primeiro ciclo. Inicialmente, arquivos versionados no repositório podem cumprir o papel de catálogo.

O catálogo executável fica em `packages/content/src/mvp-catalog.ts` e possui
126 atividades após a primeira expansão de três níveis variados. Sua matriz e
seus checklists estão registrados em
[`CONTENT-REVIEW.md`](CONTENT-REVIEW.md); `validatePublishableCatalog` faz a
validação de quantidade, cobertura, schema de motor, áudio e assets no CI.

## Compatibilidade

- schemas têm versão;
- motores declaram versões suportadas;
- conteúdo incompatível falha antes de iniciar a atividade;
- sessões registram versão da atividade executada;
- migrações nunca alteram histórico já registrado.
