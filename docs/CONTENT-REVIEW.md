# Revisão do conteúdo MVP

## Resultado

O catálogo contém 126 atividades publicadas: 21 em cada uma das áreas
Lógica, Atenção, Associação, Números, Formas e percepção e Memória. A matriz
executável relaciona área, habilidade, dificuldade e motor, cobrindo os oito
motores reutilizáveis.

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

| Nível      | Foco                           | Brincadeiras                                                                                          |
| ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Reconhecer | identificar uma característica | forma, uso, padrão AB, dois grupos, pequena quantidade e montagem do cachorrinho                      |
| Relacionar | ligar pistas e posições        | intruso, associação por arraste, padrão AAB, memória de três imagens, acima/abaixo e completar MELINA |
| Combinar   | considerar mais de uma regra   | dois atributos, três grupos, padrão ABC, três associações, tamanho/quantidade e ordenar MELINA        |

O nome MELINA aparece em dois dos três níveis como reconhecimento visual e
ordenação de peças, sempre com instrução em português brasileiro e apoio visual.

## Categorias da trilha inicial de Lógica

| Nível     | Regra principal              | Apresentação                                                                    |
| --------- | ---------------------------- | ------------------------------------------------------------------------------- |
| Padrões   | prever o próximo item        | sequência AB com lacuna final e capa derivada de cada tarefa                    |
| Montar    | ordenar partes               | três recortes do mesmo mascote                                                  |
| Descobrir | reconhecer o todo pela parte | respostas em coluna à esquerda e fragmento ampliado em preto e branco à direita |

Os três níveis não compartilham a mesma regra cognitiva. Reuso de motor é
permitido no catálogo geral, mas níveis vizinhos não podem ser diferenciados
apenas pelo texto ou pelos assets.

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

- o total sai da faixa de 120–150;
- alguma área sai da faixa de 18–24;
- uma definição não corresponde ao schema do motor;
- conteúdo deixa de estar publicado ou audível;
- um asset está ausente ou falha no checklist mínimo.
