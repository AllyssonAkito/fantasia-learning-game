# O Jardim da Cenoura

Jogo infantil de navegador criado especialmente para **Melina**, de 4 anos. O projeto combina exploração, lógica, reconhecimento visual, letras e primeiros sons da leitura em atividades curtas, coloridas e sem punição.

Os personagens foram desenvolvidos a partir dos brinquedos da família. Todo o jogo funciona localmente, sem cadastro, anúncios, compras ou envio de dados.

> Este código é o protótipo de experiência. O planejamento da futura plataforma de microjogos orientada por conteúdo está em [`docs/`](docs/README.md). A estratégia preserva o protótipo e não autoriza uma reescrita sem Issues aprovadas.

## Estado atual

- 9 atividades na trilha principal
- 5 personagens selecionáveis
- 5 quebra-cabeças de montagem
- 3 atividades de pré-alfabetização
- 1 fase de exploração com elementos aleatórios
- Interface responsiva para computador, tablet e celular
- Controles por toque, mouse e teclado
- Música, efeitos e narração em português

## Personagens

Antes da Caça às Cenouras, Melina pode escolher com qual personagem quer brincar. Somente o personagem escolhido aparece no cenário.

1. **Cachorrinho** — inspirado no brinquedo bege e marrom, com roupa azul e mangas listradas.
2. **Coelhinho** — inspirado no coelho branco de orelhas rosadas e cenoura.
3. **Amarelinho** — personagem amarelo em estilo chibi, com orelhas compridas e bochechas vermelhas.
4. **Polvinho Rosa** — lado rosa do bichinho reversível.
5. **Polvinho Azul** — lado azul do bichinho reversível, tratado como personagem independente.

As artes ficam em [`assets/characters/`](assets/characters/).

## Trilha de atividades

### 1. Caça às Cenouras

Fase de exploração em um jardim pseudo-isométrico.

- O jogador escolhe um dos cinco personagens.
- Existem 12 objetos interativos no cenário.
- 7 cenouras são escondidas aleatoriamente entre esses objetos.
- Os tipos e as posições dos esconderijos mudam a cada partida.
- Tocar em um objeto faz o personagem caminhar até ele e investigar.
- Objetos vazios apresentam uma resposta amigável; não existe perda de pontos.
- Depois de um período sem interação, uma dica visual e sonora destaca um esconderijo correto.
- Ao encontrar todas as cenouras, o jogo apresenta uma comemoração.

Também é possível caminhar usando as setas do teclado ou as teclas `W`, `A`, `S` e `D`.

### 2. Monte o Cachorrinho

Quebra-cabeça com três faixas horizontais do Cachorrinho.

### 3. Monte o Coelhinho

Quebra-cabeça com três faixas horizontais do Coelhinho.

### 4. Monte o Amarelinho

Quebra-cabeça com três faixas horizontais do Amarelinho.

### 5. Monte o Polvinho Rosa

Quebra-cabeça com três faixas horizontais do Polvinho Rosa.

### 6. Monte o Polvinho Azul

Quebra-cabeça com três faixas horizontais do Polvinho Azul.

### Regras das fases de montagem

- As três peças começam fora do quadro, em uma bandeja à esquerda.
- As peças são embaralhadas a cada tentativa.
- É possível arrastar uma peça com mouse ou dedo.
- Também é possível tocar na peça e depois tocar no espaço desejado.
- Uma peça já colocada pode ser tocada para voltar à bandeja.
- O jogo confere a resposta quando os três espaços estão preenchidos.
- Se a ordem estiver errada, todas as peças saltam para fora e a atividade recomeça.
- Se a ordem estiver correta, o personagem completo aparece com som e animação de comemoração.

### 7. Caça-Letras

Atividade de reconhecimento visual e auditivo das letras do nome **MELINA**.

- O jogo fala a letra que deve ser encontrada.
- Quatro letras grandes aparecem como opções.
- As posições e as letras incorretas são embaralhadas em cada rodada.
- A letra `M` aparece no início, reforçando a inicial de Melina.
- Uma resposta incorreta apresenta o nome da letra escolhida e repete o objetivo.
- Uma resposta correta produz som, animação e avança a barra de progresso.
- O botão **Ouvir de novo** repete a instrução.

### 8. Meu nome é Melina

Atividade personalizada para reconhecimento e ordenação do próprio nome.

- As letras `M`, `E`, `L`, `I`, `N` e `A` começam embaralhadas.
- A criança toca em uma letra e depois no espaço correspondente.
- A sequência correta permanece visível como apoio.
- Se uma letra for colocada no espaço errado, o jogo informa gentilmente qual letra pertence ali.
- Uma letra colocada pode ser devolvida para fora.
- Ao terminar, o jogo soletra e pronuncia “Melina”.

### 9. Qual é a primeira?

Atividade de associação entre imagens, palavras e sons iniciais.

- Uma figura familiar aparece na tela.
- A palavra é narrada em português.
- A primeira letra fica escondida, por exemplo: `_ENOURA`.
- A criança escolhe entre três letras grandes.
- As alternativas mudam a cada rodada.
- A palavra **MELINA** sempre aparece na atividade.
- Outras palavras incluem cenoura, urso, polvinho, coelho, sol e bola.
- Respostas incorretas repetem a palavra e convidam a escutar o primeiro som.

## Princípios infantis adotados

O jogo foi pensado para uma criança de 4 anos e segue estes princípios:

- atividades curtas e com um objetivo por vez;
- botões grandes e legíveis;
- associação entre fala, letra, palavra e imagem;
- repetição sem pressão;
- nenhuma contagem regressiva;
- nenhuma tela de derrota;
- orientação positiva depois de erros;
- progressão visual simples;
- personagens familiares como guias;
- comemoração imediata depois de cada conquista;
- uso periódico do nome próprio para aumentar identificação e interesse.

As fases de alfabetização foram inspiradas em padrões presentes no [Duolingo ABC](https://abc.duolingo.com/), [Khan Academy Kids](https://www.khanacademy.org/kids/ela) e [Google Read Along](https://support.google.com/readalong/answer/12288821?hl=pt-BR): fonética em lições curtas, reconhecimento de letras, montagem de palavras e recompensas amigáveis.

## Áudio

O áudio é criado diretamente no navegador.

- música ambiente leve;
- passos do personagem;
- sons de toque e busca;
- efeitos diferentes para tentativa, acerto e coleta;
- dicas sonoras;
- comemorações musicais;
- narração com `SpeechSynthesis` em português do Brasil;
- botão global para ligar ou desligar música, efeitos e voz.

A narração depende das vozes instaladas no navegador ou no sistema operacional. O jogo não grava a voz da criança e não solicita acesso ao microfone.

## Aleatoriedade

Para que as partidas não sejam sempre iguais:

- as 7 cenouras são sorteadas entre 12 objetos;
- os tipos de objetos do jardim são embaralhados;
- as peças dos quebra-cabeças mudam de ordem;
- as alternativas das atividades de letras mudam de posição;
- a ordem das letras do nome é embaralhada;
- as palavras adicionais da atividade de som inicial são sorteadas.

## Acessibilidade e segurança

- Uso de elementos HTML semânticos e rótulos ARIA.
- Instruções faladas e escritas.
- Alternativa por toque para interações de arrastar.
- Compatibilidade com teclado na fase de exploração.
- Suporte a `prefers-reduced-motion` para reduzir animações.
- Sem anúncios, links comerciais dentro da interface ou compras.
- Sem login, cookies de perfil ou armazenamento de informações pessoais.
- Sem dependências externas durante a execução.

## Como executar

### Opção simples

Abra [`index.html`](index.html) em um navegador moderno.

### Servidor local

Um servidor local evita restrições que alguns navegadores aplicam a arquivos abertos diretamente:

```powershell
python -m http.server 8000
```

Depois, acesse:

```text
http://localhost:8000
```

O projeto não exige instalação de pacotes, compilação ou conexão com a internet.

## Estrutura do projeto

```text
Fantasia/
├── index.html
├── styles.css
├── game.js
├── README.md
└── assets/
    └── characters/
        ├── cachorrinho-chibi.png
        ├── coelhinho-chibi.png
        ├── amarelinho-chibi.svg
        ├── polvinho-rosa-chibi.png
        └── polvinho-azul-chibi.png
```

### Arquivos principais

- [`index.html`](index.html) — estrutura das telas, trilha, botões e áreas das atividades.
- [`styles.css`](styles.css) — identidade visual, responsividade, animações e estados interativos.
- [`game.js`](game.js) — regras, sorteios, movimento, quebra-cabeças, alfabetização, áudio e desenho do jardim.
- [`assets/characters/`](assets/characters/) — imagens finais dos personagens.

## Tecnologia

- HTML5
- CSS3
- JavaScript puro
- Canvas 2D
- Pointer Events
- Web Audio API
- Web Speech API (`SpeechSynthesis`)

Não são utilizados frameworks ou bibliotecas de terceiros.

## Histórico do desenvolvimento

1. Criação do jardim pseudo-isométrico e da Caça às Cenouras.
2. Personalização dos primeiros personagens a partir do Cachorrinho e do Coelhinho.
3. Inclusão da escolha de personagem, garantindo que somente o escolhido apareça na fase.
4. Adição de 12 objetos e sorteio dos 7 esconderijos a cada partida.
5. Criação da trilha vertical de atividades.
6. Implementação dos quebra-cabeças de três partes.
7. Transferência das peças para fora do quadro, em uma bandeja lateral.
8. Inclusão de arrastar, tocar para selecionar e devolução completa após ordem incorreta.
9. Adição do Amarelinho e de sua fase de montagem.
10. Separação do brinquedo reversível em Polvinho Rosa e Polvinho Azul, com duas fases próprias.
11. Ampliação da trilha para nove atividades.
12. Criação das três fases educativas: Caça-Letras, Meu nome é Melina e Qual é a primeira?.
13. Validação das atividades em navegador, incluindo tentativas corretas, incorretas e layout móvel.

## Testes realizados

- validação sintática do JavaScript;
- verificação de carregamento de todas as artes;
- escolha individual dos cinco personagens;
- movimento e busca no jardim;
- aleatoriedade dos esconderijos;
- arrastar e tocar nos quebra-cabeças;
- expulsão das peças após ordem incorreta;
- conclusão das cinco montagens;
- tentativa incorreta e conclusão da Caça-Letras;
- tentativa incorreta e montagem completa de MELINA;
- tentativa incorreta e conclusão da atividade de sons iniciais;
- marcação visual das atividades concluídas;
- verificação sem erros no console;
- teste responsivo em tela de `390 × 700` pixels.

## Possíveis próximas evoluções

- salvar o progresso apenas no dispositivo;
- criar um painel opcional para responsáveis;
- adicionar novas palavras e famílias silábicas;
- incluir atividades de traçado das letras;
- criar pequenas histórias narradas com os personagens;
- configurar níveis de dificuldade;
- adicionar mais nomes de familiares sem retirar o foco principal em Melina.

## Planejamento da plataforma

- [Repositório público](https://github.com/AllyssonAkito/fantasia-learning-game)
- [Project público — Learning Game — Product Development](https://github.com/users/AllyssonAkito/projects/2)
- [Issue de fundação #1](https://github.com/AllyssonAkito/fantasia-learning-game/issues/1)
- [Pull Request de planejamento #2](https://github.com/AllyssonAkito/fantasia-learning-game/pull/2)

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — visão, escopo e critérios do MVP.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — fases e gates de entrega.
- [`docs/BACKLOG.md`](docs/BACKLOG.md) — 14 Epics e decomposição executável.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — camadas e contratos lógicos.
- [`docs/GAME-ENGINE.md`](docs/GAME-ENGINE.md) — oito motores reutilizáveis.
- [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md) — schema e fluxo editorial.
- [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) — regras de experiência infantil.
- [`docs/ANALYTICS.md`](docs/ANALYTICS.md) — métricas com privacidade.
- [`docs/GITHUB-PROJECT.md`](docs/GITHUB-PROJECT.md) — campos, views e automações.
- [`docs/adr/`](docs/adr/README.md) — decisões arquiteturais.
- [`AGENTS.md`](AGENTS.md) — regras obrigatórias para agentes.

---

Projeto familiar criado para aprender brincando.
