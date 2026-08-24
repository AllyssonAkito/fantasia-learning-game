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

Cada entidade possui identificador estável, versão, título interno e estado editorial.

## Activity

```json
{
  "id": "logic.pattern.repeat.001",
  "version": 1,
  "status": "draft",
  "engine": "sequence",
  "course": "logic",
  "trail": "patterns",
  "skill": "recognize-repetition",
  "level": "patterns-01",
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
| `version` | evolução compatível do conteúdo |
| `status` | `draft`, `review`, `published`, `retired` |
| `engine` | motor registrado |
| `course` | área pedagógica |
| `trail` | agrupamento de habilidades |
| `skill` | habilidade treinada |
| `level` | posição na progressão |
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
