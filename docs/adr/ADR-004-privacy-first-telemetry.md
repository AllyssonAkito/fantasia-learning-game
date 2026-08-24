# ADR-004 — Telemetria com privacidade infantil

- Status: Aceito
- Data: 2026-08-24

## Contexto

Tentativas, tempo e dicas ajudam a avaliar aprendizagem, mas o público infantil exige minimização de dados e controle do responsável.

## Decisão

Eventos usarão IDs pseudônimos e payloads fechados. O MVP não gravará voz, texto livre, localização precisa ou identificadores não aprovados. Retenção, exclusão e consentimento serão definidos antes de produção.

## Consequências

- menor risco e superfície de dados;
- métricas suficientes para validar o core loop;
- algumas análises avançadas ficam indisponíveis;
- qualquer novo campo analítico exige revisão de privacidade.
