# Backlog executável do MVP

## Convenções

- IDs locais serão substituídos pelos números reais das Issues após publicação.
- Prioridades: `P0` bloqueia o MVP; `P1` necessário; `P2` importante; `P3` posterior.
- Esforço: `XS`, `S`, `M`, `L`, `XL`.
- Nenhum item abaixo autoriza implementação enquanto não estiver em `Ready`.

## Mapa de Epics

| ID | Epic | Phase | Priority | Depends on |
|---|---|---|---|---|
| E01 | Fundação técnica | Foundation | P0 | — |
| E02 | Sistema de usuários | MVP | P1 | E01 |
| E03 | Perfil infantil | MVP | P1 | E02 |
| E04 | Estrutura pedagógica | Foundation | P0 | E01 |
| E05 | Game Engine | Core | P0 | E01, E04 |
| E06 | Progressão | Core | P0 | E03, E04, E05 |
| E07 | Recompensas | MVP | P1 | E06 |
| E08 | Mascote e feedback | Core | P1 | E05 |
| E09 | Áudio | Core | P1 | E01, E05 |
| E10 | Conteúdo inicial | MVP | P0 | E04, E05, E09 |
| E11 | Área dos responsáveis | MVP | P2 | E02, E03, E06, E12 |
| E12 | Telemetria e métricas | Core | P1 | E01, E05 |
| E13 | QA infantil | MVP | P0 | E08, E09, E10 |
| E14 | MVP Release | MVP | P0 | E01–E13 aplicáveis |

## E01 — Fundação técnica

Objetivo: criar uma base testável para shell, módulos, conteúdo e automação.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F01.1 | Feature | Definir stack técnica | P0 | S | — | ADR aprovado com alternativas, decisão e consequências |
| T01.1 | Task | Configurar workspace | P0 | M | F01.1 | instalação reproduzível e comando de desenvolvimento documentado |
| T01.2 | Task | Configurar lint e formatação | P0 | S | T01.1 | comandos locais e CI falham em violações |
| T01.3 | Task | Configurar testes unitários | P0 | S | T01.1 | teste de exemplo executa localmente e na CI |
| T01.4 | Task | Configurar testes de interface | P0 | M | T01.1 | fluxo mínimo automatizado em viewport móvel |
| T01.5 | Task | Criar pipeline de CI | P0 | M | T01.2, T01.3 | PR executa validação, testes e build |
| F01.2 | Feature | Criar App Shell | P0 | L | T01.1 | shell apresenta carregamento, erro e conteúdo vazio |
| T01.6 | Task | Definir configuração de ambientes | P1 | S | T01.1 | dev, test e produção documentados sem segredos no repo |
| T01.7 | Task | Definir política de dependências | P2 | XS | F01.1 | regra de atualização e revisão registrada |

## E02 — Sistema de usuários

Objetivo: representar um responsável e preparar acesso seguro sem ampliar escopo.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F02.1 | Feature | Definir identidade do responsável | P1 | M | F01.1 | fluxo e dados mínimos documentados em ADR |
| T02.1 | Task | Modelar conta do responsável | P1 | S | F02.1 | schema contém somente campos aprovados |
| T02.2 | Task | Criar repositório de usuário | P1 | M | T02.1 | contrato funciona com adapter local de teste |
| T02.3 | Task | Implementar sessão do responsável | P1 | L | T02.2 | entrada, restauração e saída possuem testes |
| T02.4 | Task | Criar tela segura de acesso adulto | P2 | M | T02.3 | criança não alcança configurações por toque acidental simples |
| T02.5 | Task | Documentar exclusão de conta | P1 | S | T02.1 | fluxo e impacto sobre perfis estão especificados |

## E03 — Perfil infantil

Objetivo: permitir múltiplos perfis vinculados a um responsável.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F03.1 | Feature | Modelo de perfil infantil | P1 | M | T02.1 | schema inclui idade/faixa, avatar e preferências mínimas |
| T03.1 | Task | Criar perfil | P1 | M | F03.1 | responsável cria perfil com validação |
| T03.2 | Task | Selecionar perfil | P1 | M | T03.1 | progresso e sessão usam o perfil ativo correto |
| T03.3 | Task | Editar perfil | P2 | S | T03.1 | alterações permitidas são persistidas |
| T03.4 | Task | Arquivar perfil | P2 | S | T03.1 | operação preserva histórico e exige confirmação adulta |
| T03.5 | Task | Escolher avatar | P2 | M | T03.1 | catálogo local acessível por toque |

## E04 — Estrutura pedagógica

Objetivo: representar Curso → Trilha → Habilidade → Nível → Atividade.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F04.1 | Feature | Definir taxonomia pedagógica | P0 | M | F01.1 | IDs, relações e versionamento aprovados |
| T04.1 | Task | Criar schemas das entidades | P0 | M | F04.1 | exemplos válidos e inválidos testados |
| T04.2 | Task | Criar catálogo em memória | P0 | M | T04.1 | consulta por curso, trilha, skill e nível funciona |
| T04.3 | Task | Validar integridade referencial | P0 | M | T04.2 | IDs ausentes ou duplicados impedem build |
| F04.2 | Feature | Navegação infantil por trilha | P0 | L | T04.2 | criança vê caminho, estado e bloqueios sem taxonomia interna |
| T04.4 | Task | Definir estados editoriais | P1 | S | T04.1 | draft, review, published e retired documentados |
| T04.5 | Task | Criar exemplos de cada área | P1 | M | T04.2 | seis áreas possuem estrutura mínima válida |

## E05 — Game Engine

Objetivo: implementar o registro de motores e os oito engines reutilizáveis.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F05.1 | Feature | Sessão base de atividade | P0 | L | E01, T04.1 | estados e transições possuem testes |
| T05.1 | Task | Criar Engine Registry | P0 | M | F05.1 | engine é resolvido por ID sem condicional de tela |
| T05.2 | Task | Criar contrato de avaliação | P0 | M | F05.1 | acerto, erro e metadados padronizados |
| T05.3 | Task | Criar serviço de dicas progressivas | P0 | M | T05.2 | três níveis são acionados por tentativa |
| F05.2 | Feature | Engine de Escolha | P0 | L | T05.1–T05.3 | 2–4 alternativas, dicas e testes completos |
| F05.3 | Feature | Engine de Arrastar | P0 | XL | T05.1–T05.3 | toque alternativo, múltiplos destinos e mobile |
| F05.4 | Feature | Engine de Sequência | P0 | L | T05.1–T05.3 | padrões configuráveis e avaliação sem hard-code |
| F05.5 | Feature | Engine de Associação | P0 | L | T05.1–T05.3 | um-para-um e item-para-categoria suportados |
| F05.6 | Feature | Engine de Classificação | P1 | XL | T05.1–T05.3 | itens distribuídos entre 2–4 grupos |
| F05.7 | Feature | Engine de Memória | P1 | XL | T05.1–T05.3 | pares, sequência e ocultação configuráveis |
| F05.8 | Feature | Engine de Comparação | P1 | L | T05.1–T05.3 | quantidade e tamanho suportados |
| F05.9 | Feature | Engine de Montagem | P1 | XL | T05.1–T05.3 | peças, ordem, encaixe e reset configuráveis |
| T05.4 | Task | Criar harness visual de engines | P1 | L | F05.2 | desenvolvedor executa exemplos sem navegar pelo produto |
| T05.5 | Task | Padronizar seed aleatória | P1 | S | F05.1 | sessões podem ser reproduzidas em teste |

## E06 — Progressão

Objetivo: registrar avanço do perfil pela hierarquia pedagógica.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F06.1 | Feature | Modelo de progresso | P0 | M | E03, E04 | estado por atividade, nível, skill e trilha definido |
| T06.1 | Task | Persistir conclusão de atividade | P0 | M | F06.1, F05.1 | conclusão idempotente e testada |
| T06.2 | Task | Calcular desbloqueios | P0 | M | T06.1 | regras configuráveis determinam próximo nível |
| T06.3 | Task | Exibir progresso na trilha | P0 | M | T06.2 | estados atualizam sem recarregar a aplicação |
| F06.2 | Feature | Dificuldade interna 1–10 | P1 | L | F06.1 | motores recebem dificuldade e documentam efeito |
| T06.4 | Task | Registrar histórico de tentativas | P1 | M | T06.1 | tempo, tentativas, dicas e resultado ficam associados à sessão |
| T06.5 | Task | Preparar estratégia adaptativa futura | P3 | S | F06.2 | proposta no Backlog sem algoritmo em produção |

## E07 — Recompensas

Objetivo: reforçar conclusão sem criar economia complexa.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F07.1 | Feature | Estrelas por atividade | P1 | M | T06.1 | concessão idempotente segue definição de conteúdo |
| F07.2 | Feature | Moedas simples | P1 | M | F07.1 | saldo é consistente e auditável |
| T07.1 | Task | Criar animação de recompensa | P1 | M | F07.1 | dura menos de 2 s e respeita movimento reduzido |
| T07.2 | Task | Criar inventário mínimo | P2 | L | F07.2 | itens obtidos aparecem por perfil |
| T07.3 | Task | Definir catálogo inicial de itens | P2 | M | T07.2 | catálogo revisado sem compras ou raridade manipulativa |
| F07.3 | Feature | Equipar item no mascote | P2 | L | T07.2 | item equipado persiste por perfil |

## E08 — Mascote e feedback

Objetivo: usar personagem como guia da experiência.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F08.1 | Feature | Componente de mascote | P1 | L | F01.2 | estados neutro, instrução, dica e celebração |
| T08.1 | Task | Integrar mascote à sessão | P1 | M | F08.1, F05.1 | reações respondem aos estados padronizados |
| T08.2 | Task | Criar feedback de acerto | P1 | M | T08.1 | som, animação e texto curto sem bloquear fluxo |
| T08.3 | Task | Criar feedback de erro | P0 | M | T08.1, T05.3 | três tentativas seguem política pedagógica |
| T08.4 | Task | Criar fallback sem animação | P1 | S | F08.1 | experiência funciona com movimento reduzido |
| T08.5 | Task | Revisar tom de voz | P1 | S | T08.2, T08.3 | frases aprovadas em catálogo central |

## E09 — Áudio

Objetivo: permitir uso sem depender de leitura.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F09.1 | Feature | Serviço central de áudio | P1 | L | E01 | reprodução, fila, interrupção e mute testados |
| T09.1 | Task | Implementar TTS como fallback | P1 | M | F09.1 | instrução funciona sem arquivo gravado |
| T09.2 | Task | Criar botão repetir instrução | P1 | S | F09.1 | disponível em todos os motores |
| T09.3 | Task | Definir catálogo de efeitos | P2 | M | F09.1 | IDs de sucesso, tentativa, dica e recompensa |
| T09.4 | Task | Tratar áudio indisponível | P1 | S | F09.1 | atividade continua com apoio visual |
| T09.5 | Task | Validar volume e sobreposição | P1 | M | T09.3 | fala permanece compreensível sobre efeitos |

## E10 — Conteúdo inicial

Objetivo: produzir 100–120 atividades nas seis áreas usando os motores.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F10.1 | Feature | Matriz de cobertura do conteúdo | P0 | M | E04, E05 | área × habilidade × dificuldade × engine mapeada |
| F10.2 | Feature | Pacote Lógica | P0 | XL | F10.1, engines aplicáveis | 15–20 atividades publicáveis e revisadas |
| F10.3 | Feature | Pacote Atenção | P0 | XL | F10.1, engines aplicáveis | 15–20 atividades publicáveis e revisadas |
| F10.4 | Feature | Pacote Associação | P0 | XL | F10.1, engines aplicáveis | 15–20 atividades publicáveis e revisadas |
| F10.5 | Feature | Pacote Números | P0 | XL | F10.1, engines aplicáveis | 15–20 atividades publicáveis e revisadas |
| F10.6 | Feature | Pacote Formas e percepção | P0 | XL | F10.1, engines aplicáveis | 15–20 atividades publicáveis e revisadas |
| F10.7 | Feature | Pacote Memória | P0 | XL | F10.1, engines aplicáveis | 15–20 atividades publicáveis e revisadas |
| T10.1 | Task | Criar checklist pedagógico | P0 | S | F10.1 | revisão verifica objetivo, idade, dica e resposta |
| T10.2 | Task | Criar checklist de assets | P1 | S | F10.1 | licença, legibilidade, tamanho e alt definidos |
| T10.3 | Task | Automatizar validação do catálogo | P0 | M | T04.3 | CI bloqueia conteúdo inconsistente |

Cada pacote deve ser dividido em Issues menores de 3–5 atividades no momento de publicação, evitando PRs gigantes.

## E11 — Área dos responsáveis

Objetivo: oferecer leitura simples de uso e evolução.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F11.1 | Feature | Entrada protegida para responsáveis | P2 | M | T02.4 | criança não acessa por interação casual |
| F11.2 | Feature | Resumo de uso | P2 | L | E12 | tempo, dias e atividades concluídas corretos |
| F11.3 | Feature | Resumo por área | P2 | L | E06, E12 | forças e dificuldades são descritivas, não diagnósticas |
| T11.1 | Task | Criar seletor de perfil | P2 | S | F11.1, E03 | responsável alterna perfis sem misturar dados |
| T11.2 | Task | Criar explicação das métricas | P2 | S | F11.2 | cada número possui definição acessível |
| T11.3 | Task | Validar linguagem não diagnóstica | P1 | S | F11.3 | revisão de produto e privacidade aprovada |

## E12 — Telemetria e métricas

Objetivo: medir o core loop com privacidade.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F12.1 | Feature | Schema de eventos | P1 | M | E01, F05.1 | eventos versionados e validados |
| T12.1 | Task | Instrumentar sessão | P1 | M | F12.1 | início, conclusão e abandono emitidos uma vez |
| T12.2 | Task | Instrumentar respostas e dicas | P1 | M | F12.1, T05.3 | tentativas e níveis de dica são registrados |
| T12.3 | Task | Criar adapter local | P1 | M | F12.1 | desenvolvimento funciona sem backend |
| F12.2 | Feature | Pipeline de métricas | P2 | XL | T12.1–T12.3 | agregações essenciais são reproduzíveis |
| T12.4 | Task | Definir retenção e exclusão | P0 | M | F12.1 | política aprovada antes de produção |
| T12.5 | Task | Auditar dados sensíveis | P0 | S | F12.1 | nenhum evento contém PII não aprovada |

## E13 — QA infantil

Objetivo: validar compreensão, diversão, acessibilidade e segurança.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F13.1 | Feature | Plano de teste infantil | P0 | M | E10 | protocolo, consentimento e perguntas definidos |
| T13.1 | Task | Definir aparelhos-alvo | P0 | S | F13.1 | matriz inclui celular, tablet e desktop |
| T13.2 | Task | Criar roteiro do core loop | P0 | S | F13.1 | observa compreensão sem ensinar a resposta |
| T13.3 | Task | Executar rodada piloto | P0 | L | T13.1, T13.2 | achados registrados sem dados desnecessários |
| T13.4 | Task | Priorizar achados | P0 | M | T13.3 | cada problema vira Bug ou Proposal |
| F13.2 | Feature | Auditoria de acessibilidade | P1 | L | E05, E08, E09 | teclado, contraste, áudio e movimento revisados |
| T13.5 | Task | Teste de desempenho móvel | P0 | M | E10 | metas definidas e atendidas nos aparelhos-alvo |

## E14 — MVP Release

Objetivo: preparar e publicar uma versão validável do produto.

| ID | Type | Título | Pri | Effort | Depends | Critério de aceite |
|---|---|---|---|---|---|---|
| F14.1 | Feature | Definir checklist de release | P0 | S | E01–E13 | produto, engenharia, conteúdo e privacidade cobertos |
| T14.1 | Task | Criar ambiente de homologação | P0 | M | E01 | build imutável e acessível à equipe |
| T14.2 | Task | Executar regressão completa | P0 | L | E10, E13 | cenários críticos passam sem P0/P1 aberto |
| T14.3 | Task | Validar catálogo publicado | P0 | M | E10 | 100–120 atividades válidas e revisadas |
| T14.4 | Task | Revisar privacidade e segurança | P0 | M | E02, E03, E12 | aprovação registrada |
| T14.5 | Task | Preparar plano de rollback | P0 | S | T14.1 | reversão testada e documentada |
| T14.6 | Task | Publicar MVP | P0 | M | T14.2–T14.5 | versão, notas e monitoramento ativos |
| T14.7 | Task | Conduzir revisão pós-release | P1 | S | T14.6 | métricas e decisões seguintes registradas |

## Primeira sequência recomendada

Somente estes itens devem entrar em `Ready` após revisão:

1. F01.1 — Definir stack técnica.
2. F04.1 — Definir taxonomia pedagógica.
3. T04.1 — Criar schemas das entidades.
4. T01.1 — Configurar workspace.
5. T01.2 — Configurar lint e formatação.
6. T01.3 — Configurar testes unitários.
7. F05.1 — Sessão base de atividade.
8. T05.1 — Engine Registry.
9. F05.2 — Engine de Escolha.
10. F04.2 — Navegação infantil por trilha.

## Gate antes de implementar

O dono do produto deve revisar:

- quais engines entram realmente no MVP;
- stack técnica;
- aparelhos-alvo;
- política de perfil e privacidade;
- nível de área dos responsáveis;
- quantidade final de conteúdo por área.
