# Visão do produto

## Produto

Plataforma infantil de microjogos educativos rápidos e progressivos, inspirada no conceito de aprendizagem por jogos curtos, sem copiar identidade visual, conteúdo ou propriedade intelectual de outros produtos.

## Objetivo do MVP

Provar que crianças gostam da experiência, entendem o ciclo de interação e querem continuar jogando.

O MVP deve validar:

- clareza do fluxo;
- reutilização dos motores;
- engajamento infantil;
- progressão compreensível;
- feedback acolhedor;
- capacidade de produzir conteúdo sem alterar código.

As atividades usam ilustrações grandes, infantis e originais. Emojis não fazem
parte da linguagem visual final dos objetos selecionáveis; áudio, imagem e
reação comunicam o objetivo sem exigir leitura autônoma.

## Público inicial

- crianças em idade pré-escolar e início da educação básica;
- responsáveis que desejam acompanhar evolução de forma simples;
- equipe de conteúdo que precisa criar exercícios por configuração.

## Escopo pedagógico do MVP

1. **Lógica** — padrões, sequências e dedução.
2. **Atenção** — diferenças, exceções e busca visual.
3. **Associação** — relações, categorias e usos.
4. **Números** — contagem, quantidade e comparação básica.
5. **Formas e percepção** — cores, posições, tamanhos e relações espaciais.
6. **Memória** — pares, sequência visual e memória espacial.

Alfabetização, leitura, escrita, fonética, inglês e ciências ficam fora do conteúdo do primeiro MVP da plataforma. O protótipo atual possui experiências de letras, mas elas não definem o escopo pedagógico inicial do novo motor.

## Proposta de valor

- atividades curtas e variadas;
- experiência que não exige leitura autônoma;
- dificuldade progressiva;
- feedback sem punição agressiva;
- mascote como guia;
- conteúdo expansível;
- visão futura de evolução para responsáveis.

## Core loop

```text
Entrar
  ↓
Escolher trilha
  ↓
Jogar microjogo
  ↓
Responder
  ↓
Receber feedback
  ↓
Receber recompensa
  ↓
Próximo desafio
  ↓
Visualizar progresso
```

## Estrutura pedagógica

```text
Curso
└── Trilha
    └── Habilidade
        └── Nível
            └── Atividade
```

A criança vê mundos, caminhos e desafios. A taxonomia completa é interna.

## Feedback

### Acerto

- animação curta;
- efeito sonoro;
- reação do mascote;
- estrela e moeda;
- avanço sem interrupção longa.

### Erro

1. primeira tentativa: convite para tentar novamente;
2. segunda tentativa: dica visual;
3. terceira tentativa: demonstração da lógica;
4. nunca retirar pontos ou constranger a criança.

## Dificuldade

- escala interna de `1` a `10`;
- rótulos externos simples, quando necessários;
- arquitetura preparada para adaptação futura;
- adaptação automática não faz parte da primeira entrega.

## Gamificação do MVP

```text
Atividade → estrelas → moedas → itens simples
```

Itens futuros podem personalizar mascote, roupas, acessórios, quarto ou cenário.

Ficam fora do MVP:

- ranking global;
- temporadas;
- passe;
- múltiplas moedas;
- compras ou sistemas competitivos complexos.

## Perfil infantil

Modelo futuro previsto:

```text
Responsável
├── Criança A
├── Criança B
└── Criança C
```

Cada perfil poderá conter idade, avatar, progresso, habilidades, nível, conquistas e histórico. O MVP deve coletar apenas o mínimo necessário.

## Área dos responsáveis

Preparar arquitetura para exibir futuramente:

- tempo utilizado;
- atividades concluídas;
- área mais forte;
- área com dificuldade;
- evolução;
- dias jogados.

O painel completo não é pré-requisito do primeiro ciclo do motor.

O MVP oferece um resumo local protegido com tempo em atividades concluídas,
dias de uso, quantidade concluída e sinais descritivos por área. A linguagem e
o cálculo estão documentados em [`RESPONSIBLE-AREA.md`](RESPONSIBLE-AREA.md).

## Meta de conteúdo

- 6 áreas;
- 8 motores;
- 18 a 24 exercícios por área após a primeira expansão;
- 126 atividades configuradas, incluindo três níveis variados de seis tarefas.

## Fora de escopo inicial

O catálogo inicial de itens cosméticos é conquistado apenas por conclusão de atividades. Não há compra, preço, raridade, prazo, escassez ou loja infantil no MVP.

- IA em produção;
- CMS completo;
- currículo completo de alfabetização; a primeira expansão limita-se a
  reconhecer e ordenar as letras do nome MELINA;
- conteúdo de terceiros;
- ranking e competição global;
- monetização complexa;
- funcionalidades não registradas no Backlog.

## Indicadores de validação

- criança inicia uma atividade sem ajuda textual;
- entende o objetivo em poucos segundos;
- conclui o core loop;
- solicita ou inicia outro desafio;
- responsáveis compreendem o progresso básico;
- equipe adiciona uma atividade sem alterar o motor.
