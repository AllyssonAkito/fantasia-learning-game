# Checklist de release do MVP 1.0.0

## Escopo

Checklist operacional do Epic E14. A publicação inclui a plataforma orientada por conteúdo em `apps/web`; o protótipo histórico na raiz permanece preservado.

## Gates obrigatórios

- [x] Epics E01 a E13 concluídos ou com limitação explicitamente registrada.
- [x] Catálogo publicável com 108 atividades validado por schema.
- [x] Oito motores reutilizáveis cobertos pelo catálogo e pelo harness.
- [x] Core loop criança → atividade → feedback → recompensa → avanço validado.
- [x] Áudio com repetição, interrupção, mudo e fallback visual.
- [x] Fluxos por toque, mouse e teclado quando aplicável.
- [x] Viewport móvel de 393 × 851 sem overflow horizontal.
- [x] Orçamento móvel abaixo de 450 kB descompactados.
- [x] Estados de tentativa, dica, demonstração, acerto e conclusão cobertos.
- [x] Área do responsável protegida por desafio adulto.
- [x] Telemetria rejeita texto livre e identificadores pessoais.
- [x] Revisão de privacidade, segurança e retenção concluída.
- [x] Plano de rollback documentado.
- [x] Build reproduzível e pacote de hospedagem verificável.
- [x] URL pública responde com HTML, assets, manifesto e fallback de rota.

## Comandos de aprovação

1. `pnpm check`
2. `pnpm build:site`
3. empacotar `dist/` com o utilitário oficial de Sites;
4. publicar uma versão salva;
5. confirmar resposta HTTP de produção e fluxo principal no endereço público.

## Critério de go/no-go

O release é **go** quando todos os gates acima passam, o endereço público responde sem erro e existe uma versão anterior selecionável no provedor depois de uma atualização. Qualquer falha de catálogo, privacidade, build ou core loop é **no-go**.
