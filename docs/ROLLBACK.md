# Plano de rollback

## Objetivo

Restaurar rapidamente a última versão pública conhecida como estável sem alterar dados locais da criança.

## Gatilhos

- página pública indisponível;
- erro de console bloqueando o core loop;
- regressão de áudio ou acessibilidade que impeça jogar;
- catálogo inválido em produção;
- exposição acidental de dado ou segredo;
- degradação relevante do orçamento móvel.

## Procedimento

1. Interromper novas publicações e registrar uma Issue `bug` P0/P1.
2. Identificar no histórico do Sites a última versão com smoke test aprovado.
3. Republicar essa versão salva, sem reconstruí-la.
4. Confirmar a página inicial, uma atividade completa, áudio e área adulta.
5. Verificar que a URL pública continua a mesma.
6. Comunicar o incidente e manter a correção em branch separada.

## Ensaio

O procedimento é considerado testável porque versões do Sites são imutáveis e o deploy aceita um `version_id` já salvo. No ensaio do MVP, o artefato local foi reconstruído, empacotado e teve seu manifesto inspecionado; uma atualização deve manter ao menos duas versões salvas para permitir o retorno operacional.

## RTO e dados

Meta de recuperação: 30 minutos após confirmação do incidente. Como o progresso permanece no dispositivo, o rollback do front-end não apaga nem migra dados locais. Mudanças futuras de schema local exigirão plano de compatibilidade específico.
