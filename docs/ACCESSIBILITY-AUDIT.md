# Auditoria de acessibilidade do MVP

## Resultado

- alvos principais têm pelo menos 56 px;
- trilha, atividade e área adulta possuem nomes e regiões semânticas;
- foco é visível e a primeira navegação funciona por teclado;
- arrastar mantém alternativa por seleção nos contratos do motor;
- instrução fica na tela quando áudio ou TTS falha;
- feedback não depende apenas de vermelho;
- `prefers-reduced-motion` reduz mascote, feedback e celebração;
- layout não cria overflow horizontal em 393 px;
- estados de erro, vazio, bloqueio e conclusão possuem texto e ícone.

## Contraste revisado

Texto principal `#264d54` é usado sobre creme/branco; texto secundário
`#52757b` é reservado a texto grande ou de apoio sobre fundos claros. Foco usa
amarelo com contorno/offset e não depende somente da mudança de cor.

## Limites

A auditoria cobre WCAG aplicável à experiência existente, mas não é uma
certificação formal. Novos componentes precisam repetir teclado, leitor de tela,
contraste, áudio indisponível, movimento reduzido e viewport móvel.
