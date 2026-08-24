# Revisão do conteúdo MVP

## Resultado

O catálogo `1.0.0` contém 108 atividades publicadas: 18 em cada uma das áreas
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

## Checklist de assets aplicado

- origem e licença registradas;
- alternativa textual não ambígua;
- legibilidade verificada no alvo mínimo de 56 px;
- dimensões lógicas registradas;
- nenhuma dependência de cor isolada para comunicar resposta;
- referência ausente bloqueia a suíte de testes.

O MVP usa apenas símbolos Unicode licenciados conforme o catálogo em
`packages/content/src/mvp-assets.ts`. Fotografias familiares continuam no
protótipo preservado e não são distribuídas pelo novo catálogo.

## Validação automatizada

`validatePublishableCatalog` bloqueia o CI quando:

- o total sai da faixa de 100–120;
- alguma área sai da faixa de 15–20;
- uma definição não corresponde ao schema do motor;
- conteúdo deixa de estar publicado ou audível;
- um asset está ausente ou falha no checklist mínimo.
