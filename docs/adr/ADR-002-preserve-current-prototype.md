# ADR-002 — Preservar o protótipo atual durante a fundação

- Status: Aceito
- Data: 2026-08-24

## Contexto

O repositório já contém uma experiência funcional com personagens, caça, montagem e letras. A nova estratégia exige arquitetura diferente e exclui alfabetização do primeiro conteúdo da plataforma.

## Decisão

Tratar a implementação atual como protótipo de UX e referência. Não reescrever nem remover suas funcionalidades durante a fase de planejamento. A migração ocorrerá motor por motor, após Issues e critérios de paridade.

## Consequências

- trabalho existente permanece demonstrável;
- arquitetura pode evoluir sem big bang;
- algumas atividades do protótipo não entrarão no catálogo inicial;
- haverá período temporário com protótipo e plataforma em paralelo.

## Condição para migração

Uma atividade só migra quando schema, engine, testes, áudio, feedback e layout móvel estiverem definidos.
