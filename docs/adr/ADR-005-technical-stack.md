# ADR-005 — Stack técnica da plataforma

- Status: Aceito
- Data: 2026-08-24
- Issue: [#18](https://github.com/AllyssonAkito/fantasia-learning-game/issues/18)

## Contexto

O protótipo atual comprovou a direção visual e algumas mecânicas, mas a plataforma precisa suportar muitos microjogos a partir de poucos motores reutilizáveis. A fundação também precisa oferecer contratos tipados, validação de conteúdo, testes determinísticos, execução em navegadores móveis e uma migração gradual que preserve o protótipo.

A primeira versão não precisa de renderização no servidor, autenticação remota ou backend próprio. Ela precisa funcionar como aplicação web estática, inclusive quando áudio, rede ou persistência não estiverem disponíveis.

## Decisão

Adotar uma aplicação web estática organizada como workspace, com os seguintes elementos:

| Área | Escolha |
|---|---|
| Runtime de desenvolvimento | Node.js 22 LTS |
| Gerenciador de pacotes | pnpm com lockfile versionado |
| Interface | React com TypeScript em modo `strict` |
| Build e servidor local | Vite |
| Estilos | CSS Modules e tokens CSS, sem biblioteca visual genérica no MVP |
| Estado | estado local, reducers e contextos React; regras de sessão permanecem em TypeScript independente do framework |
| Schemas | Zod na fronteira de entrada do catálogo e da persistência |
| Testes unitários e de integração | Vitest, Testing Library e ambiente DOM simulado |
| Testes de interface | Playwright, cobrindo ao menos Chromium e um viewport móvel |
| Qualidade de código | ESLint com configuração plana e Prettier |
| Integração contínua | GitHub Actions |
| Persistência inicial | adaptadores locais atrás de interfaces de repositório |
| Entrega | artefatos estáticos, preparados para CDN ou hospedagem equivalente |

O workspace deve separar, no mínimo:

- aplicação infantil;
- contratos e regras de domínio;
- motores de atividade;
- conteúdo validado;
- serviços compartilhados;
- testes e ferramentas de qualidade.

O protótipo existente continua sendo referência de experiência e não será removido nem reescrito por esta decisão. A migração acontecerá por fatias verticais aprovadas em Issues próprias.

## Restrições da decisão

- componentes de tela não podem conter atividades codificadas diretamente;
- motores não podem depender de React para avaliar respostas;
- conteúdo externo só chega a uma sessão depois de validado por schema;
- aleatoriedade deve aceitar uma semente controlável;
- áudio deve ter alternativa visual e falhas de áudio não podem impedir a atividade;
- persistência e telemetria devem ser substituíveis e não podem coletar dados pessoais desnecessários de crianças;
- bibliotecas novas exigem justificativa, manutenção ativa e revisão de impacto no bundle.

## Estados seguros e falhas

A fundação deve prever estados explícitos para:

- carregamento do catálogo;
- catálogo vazio;
- conteúdo inválido;
- erro recuperável da atividade;
- áudio indisponível;
- persistência indisponível;
- navegador sem algum recurso opcional;
- conclusão emitida uma única vez.

Falhas de conteúdo, áudio, telemetria ou persistência devem resultar em uma interface infantil compreensível e recuperável, nunca em tela em branco ou perda silenciosa da sessão.

## Consequências

### Positivas

- contratos tipados e validação em runtime reduzem divergências entre conteúdo e motores;
- Vite e Vitest compartilham resolução e transformação de módulos;
- motores podem ser testados sem renderizar a interface;
- React facilita compor os estados visuais e acessíveis exigidos pelo produto;
- a entrega estática reduz infraestrutura, superfície de dados e custo no MVP;
- adaptadores permitem adicionar backend futuro sem acoplar o domínio.

### Negativas

- o projeto passa a exigir etapa de instalação e build;
- a equipe precisa manter limites claros entre React, domínio e conteúdo;
- validação em runtime adiciona código ao bundle;
- recursos que dependam de sincronização entre dispositivos ficam adiados até uma decisão de backend.

## Alternativas consideradas

### Manter HTML, CSS e JavaScript sem build

Rejeitada como fundação da plataforma. É adequada ao protótipo e continua preservada como referência, mas aumenta o risco de contratos implícitos, duplicação de mecânicas e testes frágeis quando o catálogo crescer.

### Next.js ou outro framework full-stack

Adiada. Oferece roteamento, renderização no servidor e backend integrado, mas essas capacidades não são necessárias para o primeiro fluxo infantil estático. A escolha aumentaria a infraestrutura e tomaria decisões prematuras sobre servidor e dados.

### Biblioteca visual pronta

Rejeitada no MVP. Os componentes infantis exigem alvos grandes, resposta multimodal, movimento controlado e identidade própria. Tokens CSS e componentes locais oferecem controle maior com menos peso.

### Gerenciador de estado global

Adiado. As sessões têm contratos explícitos e podem ser modeladas com reducers e serviços. Uma biblioteca global só deverá ser adotada quando um caso transversal real justificar o custo.

## Evidências e referências

- [React — Using TypeScript](https://react.dev/learn/typescript)
- [Vite — Getting Started](https://vite.dev/guide/)
- [Vitest — Guide](https://vitest.dev/guide/)
- [Playwright — Running and debugging tests](https://playwright.dev/docs/running-tests)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Revisão futura

Backend, autenticação do responsável, sincronização entre dispositivos e hospedagem definitiva continuam decisões em aberto. Cada uma exige ADR e Issue próprios quando entrar no roadmap.
