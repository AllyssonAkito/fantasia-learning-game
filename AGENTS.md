# Regras para agentes

Este arquivo define como agentes de desenvolvimento devem trabalhar neste repositório.

## Missão

Construir uma plataforma infantil de microjogos educativos orientada por conteúdo. O código deve permitir criar muitas atividades a partir de poucos motores reutilizáveis.

O jogo atual é um protótipo de experiência. Ele deve ser preservado até existir uma migração aprovada e coberta por Issue.

## Regra principal

Nenhuma mudança relevante deve começar sem uma Issue associada.

A Issue deve conter:

- objetivo;
- contexto;
- requisitos;
- critérios de aceite;
- fora de escopo;
- dependências;
- testes esperados.

## Fluxo obrigatório

1. Ler a Issue e as dependências.
2. Confirmar que a Issue está em `Ready`.
3. Criar branch com prefixo `codex/`.
4. Implementar apenas o escopo aprovado.
5. Executar os testes definidos.
6. Abrir Pull Request ligado à Issue.
7. Aguardar revisão.
8. Fazer merge apenas após aprovação.

## Restrições

- Não inventar funcionalidades além do escopo.
- Registrar ideias novas como `proposal` no Backlog.
- Não misturar conteúdo pedagógico com código do motor.
- Não codificar atividades diretamente em componentes de tela.
- Não introduzir IA no MVP.
- Não introduzir ranking global, temporadas ou economias complexas no MVP.
- Não coletar dados pessoais desnecessários de crianças.
- Não usar padrões de pressão, punição ou manipulação infantil.
- Não remover ou reescrever o protótipo atual sem ADR e Issue de migração.

## Arquitetura

- Motores recebem uma definição de atividade e produzem uma sessão jogável.
- Conteúdo é validado por schema antes de chegar ao motor.
- Feedback, áudio, progresso, recompensa e telemetria são serviços compartilhados.
- A interface infantil não deve expor a hierarquia interna completa.
- Toda atividade deve ser utilizável sem leitura autônoma, usando áudio ou apoio visual.

Leia antes de implementar:

- [`docs/PRODUCT.md`](docs/PRODUCT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/GAME-ENGINE.md`](docs/GAME-ENGINE.md)
- [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md)
- [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md)
- [`docs/ANALYTICS.md`](docs/ANALYTICS.md)

## Qualidade

Toda Feature precisa considerar:

- teclado, toque e mouse quando aplicável;
- áudio e alternativa visual;
- layout móvel;
- estados de carregamento, vazio, erro, acerto, dica e conclusão;
- comportamento após primeira, segunda e terceira tentativa incorreta;
- testes unitários da regra e teste de integração do fluxo;
- telemetria sem conteúdo sensível.

## Definição de pronto

Uma Issue só está pronta quando:

- todos os critérios de aceite foram atendidos;
- testes relevantes passaram;
- documentação afetada foi atualizada;
- não existem erros no console;
- houve verificação em viewport móvel;
- o PR referencia a Issue;
- não houve expansão silenciosa de escopo.
