# ADR-001 — Separar motores e conteúdo

- Status: Aceito
- Data: 2026-08-24

## Contexto

Programar cada exercício como um jogo independente torna a produção de 100–120 atividades lenta, inconsistente e difícil de testar.

## Decisão

Implementar oito motores reutilizáveis. Atividades serão definições de conteúdo validadas por schema e executadas pelo motor indicado em `activity.engine`.

## Consequências

### Positivas

- conteúdo cresce sem duplicar mecânica;
- regras e acessibilidade são corrigidas uma vez por motor;
- atividades podem ser criadas por equipe não técnica;
- CMS futuro torna-se possível;
- testes podem cobrir motor e conteúdo separadamente.

### Negativas

- maior investimento inicial em contratos e schemas;
- motores precisam suportar variações sem virar componentes genéricos demais;
- versionamento de conteúdo torna-se obrigatório.

## Alternativas rejeitadas

- um componente por atividade;
- conteúdo embutido em telas;
- geração dinâmica por IA no primeiro MVP.
