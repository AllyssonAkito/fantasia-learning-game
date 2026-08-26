# Revisão do conteúdo MVP

## Resultado

O catálogo contém 132 atividades publicadas: 27 em Lógica e 21 em cada uma das
áreas Atenção, Associação, Números, Formas e percepção e Memória. A matriz
executável relaciona área, habilidade, dificuldade e motor, cobrindo os oito
motores reutilizáveis. Os limites automatizados são mínimos de cobertura, para
permitir a expansão gradual sem invalidar áreas já ampliadas.

## Checklist pedagógico aplicado

- objetivo único e observável por atividade;
- instrução curta, com apoio visual e fallback TTS;
- resposta correta declarada somente na definição do motor;
- dificuldade de 1 a 6 no primeiro catálogo;
- três níveis de ajuda: encorajar, destacar e demonstrar;
- erro sem perda de pontos, culpa ou comparação;
- recompensa proporcional e sem economia manipulativa;
- vocabulário e figuras concretas adequados ao público inicial.

Esta revisão é editorial de produto, não diagnóstico nem certificação clínica.
Uma revisão pedagógica externa futura deve gerar nova versão editorial, sem
reescrever o histórico da versão `1.0.0`.

## Primeira expansão progressiva

Cada nível contém seis tarefas e combina pelo menos quatro motores e três áreas.
As escolhas evoluem de duas para três e quatro alternativas quando o motor
permite, sem exigir leitura autônoma.

| Nível        | Foco                           | Brincadeiras                                                                                          |
| ------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Reconhecer 1 | identificar uma característica | forma, uso, padrão AB, dois grupos, pequena quantidade e montagem do cachorrinho                      |
| Relacionar 1 | ligar pistas e posições        | intruso, associação por arraste, padrão AAB, memória de três imagens, acima/abaixo e completar MELINA |
| Combinar 1   | considerar mais de uma regra   | dois atributos, três grupos, padrão ABC, três associações, tamanho/quantidade e ordenar MELINA        |

O nome MELINA aparece em dois dos três níveis como reconhecimento visual e
ordenação de peças, sempre com instrução em português brasileiro e apoio visual.

## Categorias da trilha inicial de Lógica

| Nível               | Regra principal                                  | Apresentação                                                                    |
| ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Padrões 1           | prever o próximo item                            | sequência AB com lacuna final, capa derivada e paleta suave                     |
| Montar 1            | ordenar partes                                   | três recortes do mesmo mascote                                                  |
| Descobrir 1         | reconhecer o todo pela parte                     | respostas em coluna à esquerda e fragmento ampliado em preto e branco à direita |
| O que não encaixa 1 | identificar a figura que não compartilha a regra | quatro imagens grandes em grade 2 × 2 e posição da resposta variada             |

Os três níveis não compartilham a mesma regra cognitiva. Reuso de motor é
permitido no catálogo geral, mas níveis vizinhos não podem ser diferenciados
apenas pelo texto ou pelos assets.

## O que não encaixa 1 — 4–5 anos

A fase introduz seis desafios originais de escolha visual. Cada tarefa apresenta
quatro imagens e uma única resposta inequívoca; a instrução falada explicita a
regra sem depender de leitura autônoma.

| Tarefa | Regra observada        | Conjunto visual                     | Posição da resposta |
| ------ | ---------------------- | ----------------------------------- | ------------------- |
| 1      | pertencimento ao grupo | três animais e uma cenoura          | 4                   |
| 2      | atributo geométrico    | três formas básicas e uma flor      | 3                   |
| 3      | formato arredondado    | três figuras redondas e uma estrela | 2                   |
| 4      | origem natural         | três itens que crescem e uma bola   | 1                   |
| 5      | categoria de alimento  | três alimentos e um coração         | 3                   |
| 6      | presença de ponta      | três figuras pontudas e um círculo  | 4                   |

As capas da fase e de cada tarefa são derivadas do próprio conteúdo. A resposta
correta não recebe destaque antecipado, e todos os assets pertencem ao catálogo
original do projeto.

## Categorias da área Atenção

| Nível      | Regra principal                  | Apresentação                                                    |
| ---------- | -------------------------------- | --------------------------------------------------------------- |
| Procurar 1 | localizar uma figura indicada    | três ilustrações grandes com posição do alvo variada            |
| Detalhes 1 | observar e repetir uma sequência | duas a quatro figuras, com tempo de observação progressivo      |
| Separar 1  | agrupar por característica       | figuras móveis à esquerda e dois exemplos visuais como destinos |

As 18 tarefas de Atenção usam conteúdo curado, instrução em português
brasileiro e capas derivadas de cada atividade. A grade não usa emojis como
substituto das ilustrações.

## Checklist de assets aplicado

- origem e licença registradas;
- alternativa textual não ambígua;
- legibilidade verificada no alvo mínimo de 56 px;
- dimensões lógicas registradas;
- nenhuma dependência de cor isolada para comunicar resposta;
- referência ausente bloqueia a suíte de testes.

O catálogo usa ilustrações originais, recortes de mascotes, composições visuais e
peças tipográficas próprias conforme o catálogo em
`packages/content/src/mvp-assets.ts`. Fotografias familiares continuam no
protótipo preservado e não são distribuídas pelo novo catálogo.

## Validação automatizada

`validatePublishableCatalog` bloqueia o CI quando:

- o total fica abaixo de 120 atividades;
- alguma área fica abaixo de 18 atividades;
- uma definição não corresponde ao schema do motor;
- conteúdo deixa de estar publicado ou audível;
- um asset está ausente ou falha no checklist mínimo.
