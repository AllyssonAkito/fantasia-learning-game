# Plano de QA infantil do MVP

## Objetivo e limites

Observar se a criança entende o core loop, se diverte, encontra apoio e consegue
parar sem pressão. O estudo não mede inteligência, desenvolvimento, saúde ou
desempenho escolar. Nenhum dado é usado para diagnóstico.

## Consentimento e minimização

- participação voluntária, com autorização ativa do responsável;
- explicar em linguagem simples que a criança pode parar quando quiser;
- não gravar voz, rosto, nome completo, endereço ou tela com notificações;
- registrar apenas faixa etária, aparelho, tarefas observadas e achados;
- não registrar a resposta concreta escolhida;
- apagar notas brutas após consolidar achados sem identificação;
- interromper imediatamente em caso de desconforto, cansaço ou recusa.

## Matriz de aparelhos-alvo

| Classe          | Referência de viewport | Orientação | Gate        |
| --------------- | ---------------------: | ---------- | ----------- |
| celular pequeno |              360 × 640 | retrato    | obrigatório |
| celular grande  |              393 × 851 | retrato    | obrigatório |
| tablet          |             768 × 1024 | retrato    | obrigatório |
| tablet          |             1024 × 768 | paisagem   | obrigatório |
| desktop         |             1366 × 768 | paisagem   | regressão   |

Browser alvo inicial: Chromium moderno com toque quando disponível. O conteúdo
deve continuar compreensível quando TTS, arquivo gravado ou efeitos falharem.

## Roteiro moderado do core loop

1. Entregar o aparelho na trilha, sem explicar os botões.
2. Perguntar: “O que você acha que dá para fazer aqui?”
3. Observar se inicia “Padrões 1” em até 10 segundos.
4. Não ensinar a resposta; se pedir ajuda, dizer apenas: “Você pode olhar e
   tentar do seu jeito.”
5. Observar se identifica a sequência, toca uma alternativa e percebe o
   feedback.
6. Após uma escolha não esperada, observar se tenta novamente e entende a dica.
7. Observar se conclui e usa “Continuar”.
8. Perguntar: “O que aconteceu?”, “O que foi mais divertido?” e “Quer brincar
   de novo ou parar?”
9. Pedir ao responsável para abrir o resumo e explicar com suas próprias
   palavras o que cada número significa.

## Roteiro complementar de Atenção

1. Na entrada do Nível 1, observar se diferencia os cartões Lógica e Atenção.
2. Abrir Atenção e observar se inicia Procurar 1 sem instrução textual do adulto.
3. Confirmar que a instrução falada identifica a figura procurada.
4. Em Detalhes 1, observar se espera as figuras serem encobertas antes de tocar.
5. Em Separar 1, testar arrastar e depois repetir usando somente toque.
6. Voltar à escolha de área e confirmar que o progresso continua visível.

## Roteiro complementar de O que não encaixa

1. Abrir “O que não encaixa 1” sem explicar a regra com texto adicional.
2. Confirmar que a criança percebe quatro imagens grandes em uma grade 2 × 2.
3. Observar se a instrução falada basta para iniciar a primeira escolha.
4. Após uma escolha não esperada, verificar se o feedback convida a tentar de
   novo sem expor a resposta imediatamente.
5. Percorrer tarefas com a resposta em posições diferentes e observar se a
   criança considera a regra, em vez de repetir uma posição.
6. Confirmar que a capa de cada tarefa antecipa suas quatro figuras sem marcar a
   alternativa correta.
7. Ao acertar, observar se a imagem escolhida cresce sobre a atividade sem
   provocar rolagem e se a recompensa aparece somente após a animação.
8. Repetir com movimento reduzido ativado e confirmar que a criança não fica
   presa na celebração.

## Registro de observação

Usar apenas: tarefa, compreendeu sem ajuda (`sim/parcial/não`), tempo em faixa
(`<10 s`, `10–30 s`, `>30 s`), pedido de ajuda (`sim/não`), sinal de diversão ou
frustração observado, problema técnico e citação curta opcional sem nome.
