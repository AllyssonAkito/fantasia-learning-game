# Telemetria e métricas

## Objetivo

Entender se o core loop funciona e onde a criança precisa de apoio, coletando o mínimo de dados necessário.

## Princípios

- privacidade infantil desde o desenho;
- nenhum conteúdo de voz no MVP;
- nenhum texto livre da criança;
- IDs pseudônimos;
- eventos sem nome completo, endereço ou localização precisa;
- finalidade documentada para cada campo;
- retenção definida antes da produção;
- telemetria não bloqueia a atividade;
- área dos responsáveis usa dados agregados.

## Eventos essenciais

| Evento | Quando |
|---|---|
| `session_started` | entrada na plataforma |
| `trail_opened` | abertura de trilha |
| `activity_started` | início de microjogo |
| `answer_submitted` | envio de resposta |
| `hint_shown` | exibição de dica |
| `activity_completed` | conclusão |
| `activity_abandoned` | saída antes da conclusão |
| `reward_granted` | concessão de estrela/moeda |
| `audio_repeated` | repetição de instrução |
| `runtime_error` | falha técnica tratada |

## Envelope comum

```json
{
  "event": "answer_submitted",
  "eventVersion": 1,
  "occurredAt": "2026-08-24T12:00:00Z",
  "sessionId": "random-session-id",
  "childProfileId": "pseudonymous-id",
  "activityId": "logic.pattern.repeat.001",
  "activityVersion": 1,
  "engine": "sequence",
  "difficulty": 2,
  "attempt": 1,
  "elapsedMs": 4200,
  "result": "correct"
}
```

## Métricas do MVP

- taxa de início → conclusão;
- atividades concluídas por sessão;
- tempo mediano por atividade;
- tentativas até conclusão;
- uso de primeira, segunda e terceira dica;
- abandono por motor;
- repetição de áudio;
- retorno em dias diferentes;
- erros técnicos por sessão.

## Leituras para responsáveis

- tempo utilizado;
- atividades concluídas;
- dias com atividade;
- desempenho por área;
- habilidades que recebem mais dicas;
- evolução por intervalo.

Não apresentar diagnósticos, rótulos ou comparação pública entre crianças.

## Fora de escopo inicial

- gravação de voz;
- publicidade;
- rastreamento entre sites;
- venda de dados;
- ranking infantil;
- inferência médica ou psicológica;
- modelos adaptativos automatizados.

## Pendências antes de produção

- revisão jurídica e de privacidade;
- consentimento e controle do responsável;
- política de retenção;
- exportação e exclusão de dados;
- definição de backend e jurisdição;
- auditoria dos eventos implementados.
