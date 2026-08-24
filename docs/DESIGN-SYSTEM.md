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
