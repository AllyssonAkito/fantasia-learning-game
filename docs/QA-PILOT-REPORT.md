# Rodada piloto — 24 de agosto de 2026

## Escopo

Foi executado um piloto técnico moderado do roteiro, usando o catálogo publicado
e restrições de uma criança de quatro anos: sem leitura autônoma presumida,
alvos por toque, repetição sonora, erro acolhedor e viewport pequeno. Esta rodada
valida o instrumento e a engenharia; não substitui uma sessão observacional com
crianças nem mede diversão empiricamente.

## Achados priorizados

| Pri | Achado | Decisão |
|---|---|---|
| P0 | O nível atual não iniciava uma atividade. | Bug #150, corrigido no mesmo ciclo: trilha → sequência → feedback → recompensa → avanço. |
| P1 | O teste antigo procurava o rótulo do catálogo de exemplo. | Regressão atualizada para o rótulo editorial “Padrões”. |
| P2 | Áudio do navegador pode estar indisponível ou bloqueado. | Instrução permanece visível e “Ouvir de novo” usa TTS/fallback seguro. |

Não foi encontrado outro P0/P1 após a correção. A sessão observacional externa
fica registrada como proposta pós-release e deve usar o consentimento e o
registro mínimo definidos no plano.

## Evidências técnicas

- fluxo móvel automatizado em Chromium;
- toque simples não libera a área adulta;
- navegação inicial por teclado possui foco visível;
- nenhum overflow horizontal em celular;
- movimento reduzido encurta a celebração;
- nenhuma mensagem de erro no console no core loop;
- bundle estático abaixo do orçamento de 450 kB sem compressão.
