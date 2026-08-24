# Configuração do GitHub Project

## Project

Nome: **Learning Game — Product Development**

Objetivo: concentrar Roadmap, Epics, Features, Tasks, Bugs e Pull Requests em uma única fonte de verdade.

- Repositório público: [AllyssonAkito/fantasia-learning-game](https://github.com/AllyssonAkito/fantasia-learning-game)
- Project público: [Learning Game — Product Development](https://github.com/users/AllyssonAkito/projects/2)
- Issue de fundação: [#1](https://github.com/AllyssonAkito/fantasia-learning-game/issues/1)
- Pull Request do planejamento: [#2](https://github.com/AllyssonAkito/fantasia-learning-game/pull/2)

## Hierarquia

```text
Roadmap
└── Epic
    └── Feature
        └── Task ou Bug
            └── Pull Request
```

Usar sub-issues e dependências nativas quando disponíveis.

## Campos

| Campo | Valores |
|---|---|
| Status | Backlog, Ready, In Progress, Review, Blocked, Done |
| Work Type | Epic, Feature, Task, Bug |
| Priority | P0, P1, P2, P3 |
| Area | Game, Content, UX, Backend, Parent, Infra |
| Phase | Foundation, Core, MVP, Later |
| Effort | XS, S, M, L, XL |
| Iteration | sprint atual |
| Target | MVP, Pós-MVP |

O GitHub reserva o nome `Type` em Projects. Por isso, o campo customizado foi publicado como `Work Type`. Ideias ainda não aprovadas continuam identificadas pela label `type:proposal`.

## Labels

- `type:epic`
- `type:feature`
- `type:task`
- `type:bug`
- `type:proposal`
- `priority:p0` a `priority:p3`
- `area:game`
- `area:content`
- `area:ux`
- `area:backend`
- `area:parent`
- `area:infra`
- `phase:foundation`
- `phase:core`
- `phase:mvp`
- `phase:later`
- `blocked`
- `needs-decision`
- `needs-pedagogy-review`
- `needs-child-qa`

## Views

### All Work

- visão completa, sem filtro;
- usada para manutenção dos campos e auditoria do plano.

### Roadmap

- filtro textual: `EPIC`;
- layout: roadmap;
- datas: início e fim da `Iteration`;
- exibe os 14 Epics publicados.

### Backlog

- filtro: `Status = Backlog`;
- ordenação: Priority, Area.

### Current

- filtro: `Status != Backlog AND Status != Done`;
- layout: board por Status;
- exibe Ready, In Progress, Review e Blocked.

### By Epic

- hierarquia visível;
- ordenação por título crescente, mantendo juntos os identificadores de Epic, Feature e Task.

### Game Engines

- filtro textual: `05`, correspondente ao Epic E05 e aos seus itens.

### Content

- filtro textual: `10`, correspondente ao Epic E10 e aos seus itens.

### Bugs

- filtro: `Work Type = Bug`;
- ordenação: Priority.

### Done

- filtro: `Status = Done`;
- ordenação: data de conclusão decrescente.

## Automações iniciais

- item adicionado → `Backlog`;
- Issue atribuída e iniciada → `In Progress`;
- PR aberta → `Review`;
- PR mergeada → `Done`;
- Issue fechada → `Done`;
- label `blocked` → `Blocked`.

Automações adicionais exigem Issue própria.

O Project foi criado a partir do modelo de desenvolvimento e mantém sete workflows habilitados. Qualquer alteração nas regras automáticas deve ser feita em Issue própria para evitar mudanças silenciosas no fluxo.

## Templates

O repositório contém templates para Epic, Feature, Task e Bug em [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/), além do template de Pull Request.

## Ordem de publicação

1. Criar ou conectar repositório remoto.
2. Criar Project.
3. Configurar campos.
4. Configurar views.
5. Criar Epics do [`BACKLOG.md`](BACKLOG.md).
6. Criar Features como sub-issues.
7. Criar Tasks com dependências.
8. Adicionar todos os itens ao Project.
9. Revisar prioridades e escopo.
10. Mover apenas o primeiro lote para `Ready`.

## Estado atual

Em 24 de agosto de 2026, o planejamento foi materializado publicamente no GitHub:

- 14 Epics;
- 105 Features e Tasks detalhadas;
- 120 Issues abertas no Project, contando a Issue de fundação;
- nove views salvas;
- campos de Status, Work Type, Priority, Area, Phase, Effort, Target e Iteration;
- Pull Request #2 aberto como draft, sem merge, aguardando revisão.

As Issues usam o prefixo do identificador no título e registram metadados e dependências no corpo. O preenchimento em massa dos campos customizados é uma etapa operacional posterior; a hierarquia documental continua sendo a fonte de verdade até a criação das relações nativas de sub-issue.
