# Modelo de conteúdo

## Objetivo

Permitir criar e revisar atividades sem alterar os motores.

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

| Entidade | Prefixo de ID | Relação obrigatória |
|---|---|---|
| `Course` | `course.` | raiz |
| `Trail` | `trail.` | `courseId` |
| `Skill` | `skill.` | `trailId` |
| `Level` | `level.` | `skillId` |
| `Activity` | `activity.` | `levelId` e `engine` |

Todos os IDs são globais, em minúsculas, separados por ponto e não carregam textos exibidos. Referências ausentes, IDs duplicados, ciclos ou relações fora da hierarquia invalidam o catálogo antes do build.

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

| Campo | Finalidade |
|---|---|
| `id` | identidade permanente |
| `schemaVersion` | versão do formato do registro |
| `contentVersion` | revisão editorial em SemVer |
| `status` | `draft`, `review`, `published`, `retired` |
| `engine` | motor registrado |
| `levelId` | nível e caminho pedagógico relacionados |
| `difficulty` | escala interna de 1 a 10 |
| `instruction` | texto e áudio |
| `content` | payload específico do motor |
| `hints` | progressão de ajuda |
| `reward` | estrelas e moedas |
| `assets` | recursos necessários |

## Regras

- `content` é validado pelo schema do motor.
- `correctAnswer` não deve estar duplicado em lógica de UI.
- todo asset possui ID, tipo, dimensões e texto alternativo quando aplicável;
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

O CMS não faz parte do primeiro ciclo. Inicialmente, arquivos versionados no repositório podem cumprir o papel de catálogo.

## Compatibilidade

- schemas têm versão;
- motores declaram versões suportadas;
- conteúdo incompatível falha antes de iniciar a atividade;
- sessões registram versão da atividade executada;
- migrações nunca alteram histórico já registrado.
