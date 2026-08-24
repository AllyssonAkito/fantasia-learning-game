# Configuração do GitHub Project

## Project

Nome: **Learning Game — Product Development**

Objetivo: concentrar Roadmap, Epics, Features, Tasks, Bugs e Pull Requests em uma única fonte de verdade.

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
| Type | Epic, Feature, Task, Bug, Proposal |
| Priority | P0, P1, P2, P3 |
| Area | Game, Content, UX, Backend, Parent, Infra |
| Phase | Foundation, Core, MVP, Later |
| Effort | XS, S, M, L, XL |
| Iteration | sprint atual |
| Target | MVP, Pós-MVP |

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

### Roadmap

- filtro: `Type = Epic`;
- layout: timeline;
- agrupamento: Phase.

### Backlog

- filtro: `Status = Backlog`;
- ordenação: Priority, Area.

### Current

- filtro: `Status = Ready OR In Progress OR Review OR Blocked`;
- layout: board por Status.

### By Epic

- agrupamento: parent issue;
- exibir Features e Tasks.

### Game Engines

- filtro: `Area = Game`;
- agrupamento: Engine ou Epic.

### Content

- filtro: `Area = Content`;
- agrupamento: área pedagógica.

### Bugs

- filtro: `Type = Bug AND Status != Done`;
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

Em 24 de agosto de 2026, este diretório não possui remoto GitHub configurado e o ambiente não possui o cliente `gh`. Portanto, o planejamento remoto ainda não foi materializado. O backlog local é a fonte preparada para publicação após conexão.
