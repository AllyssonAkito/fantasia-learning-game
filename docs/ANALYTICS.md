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

## Implementação do MVP

O pacote `packages/telemetry` valida eventos na entrada, oferece adapter local
sem backend, garante emissão única de início/conclusão/abandono e agrega as
métricas acima de forma reproduzível. O schema estrito rejeita nome, e-mail,
texto livre, localização, gravação, stack trace e qualquer campo não aprovado.

## Retenção e exclusão

- retenção local máxima: 30 dias;
- limpeza por data ocorre ao iniciar a aplicação e antes de gerar resumos;
- exclusão/arquivamento de perfil remove todos os eventos daquele ID;
- exclusão da conta limpa o adapter inteiro;
- não há transmissão para backend no MVP;
- não há cookies de publicidade nem rastreamento entre sites.

Uma futura sincronização exige nova Issue, consentimento verificável do
responsável, revisão de jurisdição e atualização desta política antes de ser
habilitada.

## Auditoria de dados sensíveis

Permitidos: IDs pseudônimos, IDs/versionamento de atividade, motor,
dificuldade, tentativa, nível de dica, duração, resultado e valores de
recompensa. Proibidos: nome da criança, data de nascimento, voz, resposta em
texto livre, endereço, localização, e-mail, IP persistido ou identificadores de
publicidade.
