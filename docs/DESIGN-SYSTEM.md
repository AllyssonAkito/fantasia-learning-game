# Diretrizes de experiência e design

## Princípios

- a criança entende pela imagem, som e reação;
- uma ação principal por tela;
- alvos grandes e afastados;
- erro é parte da brincadeira;
- feedback acontece perto do objeto manipulado;
- animações são curtas e não bloqueiam o ritmo;
- o mascote substitui explicações longas;
- o produto não copia a identidade visual de referências de mercado.

## Linguagem visual

- formas arredondadas;
- profundidade leve, sem realismo excessivo;
- cores alegres com contraste verificável;
- personagens com expressão clara;
- fundos com menos contraste que os elementos interativos;
- ícones acompanhados de áudio ou rótulo quando necessário.

## Ilustrações de atividade

- objetos, formas, animais e personagens usam ilustrações infantis originais;
- emojis e glifos Unicode não são usados como arte final das atividades;
- a fonte canônica é `384 × 384 px`, WebP com transparência;
- a renderização recomendada fica entre `88 × 88 px` e `128 × 128 px`;
- a silhueta ocupa a maior parte do quadro, com volume suave e poucos detalhes;
- cada asset precisa de texto alternativo curto e metadados de origem;
- fundos e destinos não competem em contraste com a ilustração manipulável.

Nas atividades de montagem, os três recortes devem preservar escala e
alinhamento do mesmo personagem. As peças ficam na coluna esquerda e o quadro
de composição na direita, sem números, letras ou símbolos substituindo a
imagem. Arrastar e toque sequencial são alternativas equivalentes.

Letras usadas como objeto pedagógico aparecem em peças gráficas grandes, com
alto contraste e forma consistente. Elas não substituem ilustrações em jogos
de objetos ou mascotes. Cenas compostas, como “bola acima do quadrado”, usam
imagens do catálogo e nunca emojis do sistema operacional.

As ilustrações ficam desacopladas do motor. O conteúdo referencia um ID estável,
e a apresentação resolve arquivo, dimensões e alternativa textual pelo catálogo.

## Componentes fundamentais

- botão primário infantil;
- alternativa selecionável;
- peça arrastável;
- destino;
- carta de memória;
- indicador de progresso;
- trilha de níveis;
- balão do mascote;
- dica visual;
- celebração;
- controle de áudio;
- área segura para responsáveis.

## Estados

Todo componente interativo deve especificar:

- padrão;
- foco;
- pressionado;
- selecionado;
- correto;
- incorreto;
- dica;
- desabilitado;
- carregando.

## Interação infantil

- alvo recomendado mínimo de `56 × 56 px`;
- não depender de hover;
- evitar gestos ocultos;
- oferecer toque sequencial como alternativa a arrastar;
- não exigir precisão fina;
- permitir repetição da instrução;
- não usar vermelho sozinho como explicação de erro;
- não remover recompensas conquistadas.

## Mascote

O mascote pode:

- apresentar a instrução;
- reagir à primeira ação;
- comemorar;
- indicar região relevante;
- demonstrar uma solução após repetidas tentativas;
- apresentar novas áreas.

O mascote não deve interromper toda resposta com diálogos longos.

## Áudio

Cada atividade pode definir:

```json
{
  "instruction": "Qual deles é diferente?",
  "instructionAudio": "...",
  "hint": "Observe as cores.",
  "hintAudio": "...",
  "successAudio": "Muito bem!"
}
```

TTS é fallback aceitável. Áudio pré-gravado exige catálogo e revisão.

O serviço central tenta o arquivo revisado, usa TTS `pt-BR` quando ele falha e
mantém a instrução disponível para tecnologia assistiva quando nenhum áudio
existe. Efeitos usam os IDs
`success`, `attempt`, `hint` e `reward`; durante fala, seu volume é reduzido para
preservar a compreensão. Toda atividade expõe um botão de áudio sem texto
visível, com nome acessível “Ouvir a instrução novamente”.

## Movimento

- feedback de toque: até 150 ms;
- feedback de acerto: 400–900 ms;
- celebração de nível: até 2 s;
- respeitar `prefers-reduced-motion`;
- nunca piscar rapidamente;
- não mover o alvo durante a tentativa.

## Responsividade

Validar inicialmente:

- celular pequeno em retrato;
- celular grande;
- tablet em retrato;
- tablet em paisagem;
- desktop.

Áreas para responsáveis podem usar densidade maior que a interface infantil.

## Tom de voz

As frases aprovadas de produto ficam no catálogo central `packages/content/src/feedback-copy.ts`. Componentes recebem essas mensagens como conteúdo; não devem criar textos pedagógicos locais.

Usar frases curtas:

- “Toque no diferente.”
- “Muito bem!”
- “Vamos tentar de novo?”
- “Olhe com atenção.”

Evitar:

- “Você errou.”
- “Resposta incorreta.”
- comparações com outras crianças;
- urgência artificial;
- linguagem de culpa.
