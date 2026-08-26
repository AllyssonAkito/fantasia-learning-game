# Roadmap de Lógica por faixa etária

## Ordem aprovada

1. 4–5 anos — faixa ativa;
2. 2–3 anos;
3. 6 anos;
4. 7–8 anos.

As faixas são bandas editoriais para organizar tamanho do desafio, vocabulário,
quantidade de distratores e apoio visual. Elas não são diagnóstico de
desenvolvimento e deverão passar por revisão pedagógica e teste infantil
supervisionado antes de uma publicação considerada final.

## Famílias de referência para Lógica

O inventário recebido será confirmado gradualmente e convertido em conteúdo
original. Ele inclui: O que não encaixa, Adivinhe a imagem, Monte a imagem,
Caixas, O que está faltando, Combine por cor, Combine os pares, Desafios de QI,
Comparações, Superlativos, Esconde-esconde, Casinhas coloridas, ordem de tamanho,
analogias de imagens e animais fantásticos. Uma família permanece com o nome
encoberto no material e não será inferida sem nova evidência.

O material externo serve somente para abstrair objetivos, regras, progressão e
volume. Marca, personagens, ilustrações, áudios, textos, respostas, código e
composição de tela de terceiros não entram no produto.

## Entrega ativa: O que não encaixa 1

A primeira família para 4–5 anos possui 16 tarefas originais e reutiliza o
motor de escolha:

| Variação           | Habilidade               | Progressão inicial                |
| ------------------ | ------------------------ | --------------------------------- |
| camuflagem visual  | reconhecer pertencimento | três árvores e cachorrinho oculto |
| função do objeto   | relacionar uso cotidiano | três cadeados e uma chave         |
| atributo visual    | comparar cor dominante   | planetas lilases e um amarelo     |
| categoria concreta | classificar              | peixes e estrela-do-mar           |
| categoria concreta | classificar              | pássaros e borboleta              |
| categoria concreta | classificar              | peixes e polvinho azul            |
| categoria concreta | classificar              | sapatos e chapéu                  |
| função do objeto   | relacionar uso cotidiano | bolas e alvo                      |
| categoria concreta | classificar              | leques e guarda-chuva             |
| categoria concreta | classificar              | chaleiras e coco                  |
| função do objeto   | relacionar uso cotidiano | instrumentos e raquete            |
| categoria concreta | classificar              | frutas e lata                     |
| função do objeto   | relacionar uso cotidiano | chaves e chave de boca            |
| categoria concreta | classificar              | livros e borracha                 |
| categoria concreta | classificar              | pedras e flor                     |
| categoria concreta | classificar              | peixes e gaivota                  |

Cada tarefa usa quatro ilustrações em grade 2 × 2, instrução e repetição sonora
em português brasileiro, posição variada da resposta correta, feedback sem
punição e capas derivadas do próprio conteúdo.

O feedback de sucesso isola a alternativa correta e a amplia do ponto de toque
até preencher a viewport. A recompensa aparece somente depois desse movimento.
Essa sequência reproduz a regra funcional observada, mantendo composição,
paleta, assets e identidade próprios do Fantasia.

O Jogo 1 foi implementado pela Issue #181 como uma cena dirigida: quatro árvores
surgem em sequência, uma delas contém o cachorrinho, o erro produz uma reação
breve e gentil e o acerto termina com o mascote escondendo-se novamente. A Issue
#186 especializa as tarefas 2–6 com arte original e microanimações temáticas,
mantendo uma única máquina de estados reutilizável. A Issue #188 usa essa mesma
máquina para as tarefas 7–12 e acrescenta seis cenas originais.
A Issue #190 completa a família com as tarefas 13–16, preservando o mesmo motor
e adicionando quatro agrupamentos originais.

## Estado das próximas famílias

As demais famílias permanecem como propostas de inventário. Cada uma precisa de
Issue em estado `Ready`, definição de objetivo e progressão, mapeamento para
motor, conteúdo original, critérios de aceite e testes antes da implementação.
Produção em massa começa somente após aprovação da matriz da respectiva família.

## Ciclo de entrega

Uma família como “O que não encaixa”, com 16 tarefas, requer conteúdo,
integração, testes automatizados, revisão visual e aprovação. A implementação
jogável pode ficar pronta antes; o ciclo inclui a
revisão humana necessária para declará-la concluída. Identidade visual definitiva
e outras faixas etárias são entregas separadas.
