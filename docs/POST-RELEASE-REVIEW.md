# Revisão pós-release — MVP 1.0.0

## Janela inicial

A primeira revisão ocorre entre 24 e 72 horas após a publicação. Este documento começa com a linha de base do instante do deploy e deve ser atualizado somente com métricas agregadas e sem dados sensíveis.

## Linha de base

- erros bloqueantes conhecidos: 0;
- regressões abertas de P0/P1: 0;
- catálogo aprovado: 108 atividades;
- tamanho do build móvel: abaixo do limite de 450 kB;
- disponibilidade no smoke test inicial: HTTP 200 para página, assets, manifesto e fallback;
- dados de uso reais: ainda não disponíveis no instante da publicação.

## Monitoramento

- disponibilidade da URL pública e carregamento do HTML;
- erros de execução relatados pelo navegador, sem payload infantil;
- taxa agregada de conclusão de atividades;
- pedidos de dica por motor;
- abandono por etapa, sem diagnóstico individual;
- funcionamento de áudio e fallback visual em aparelhos-alvo.

## Decisões iniciais

- preservar o escopo do MVP durante a janela de estabilização;
- tratar bugs bloqueantes antes de ampliar conteúdo;
- manter a pesquisa com criança real na proposta #151 até existir consentimento e responsável disponível;
- registrar ideias novas como `proposal` no Backlog.

## Critério de estabilidade

O release é estável quando a URL permanece disponível, não há regressão P0/P1 e o core loop continua concluível em celular. A ausência inicial de telemetria não deve ser interpretada como sucesso pedagógico.
