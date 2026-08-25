# Desenvolvimento local

## Harness visual dos motores

Execute `pnpm dev:harness` para abrir os oito exemplos de motor diretamente, sem navegar pelo produto infantil. Cada cartão permite simular acerto e erro por teclado, toque ou mouse e apresenta retorno visual em região anunciada por leitores de tela.

## Pré-requisitos

- Node.js 22.22 ou versão compatível com `>=22.12 <25`;
- pnpm 11.

As versões de referência ficam em `.node-version`, `package.json` e no lockfile. Não é necessário instalar serviços externos para executar a fundação.

## Instalação reproduzível

```bash
pnpm install --frozen-lockfile
```

Em uma alteração intencional de dependências, use `pnpm install` e versione o `pnpm-lock.yaml` resultante no mesmo Pull Request.

## Aplicação da plataforma

```bash
pnpm dev
```

O Vite informa no terminal a URL local. O comando aceita conexões da rede local para validação em celular ou tablet; não exponha essa porta diretamente na internet.

Enquanto a expansão #162 estiver em revisão, o modo `development` libera todos
os níveis da trilha para QA. O desbloqueio é definido por
`qaUnlockAllLevels`, não persiste progresso e permanece desligado em `test` e
`production`; portanto, nunca entra no site público.

Para gerar o artefato estático:

```bash
pnpm build
```

Para conferir os contratos TypeScript sem emitir arquivos:

```bash
pnpm typecheck
```

## Ambientes

O Vite fornece três modos aceitos pela aplicação:

| Modo | Uso | Dados e serviços |
|---|---|---|
| `development` | desenvolvimento local com atualização rápida | adaptadores locais; telemetria desligada |
| `test` | testes unitários, integração e interface | dados determinísticos; telemetria desligada |
| `production` | build estático publicado | serviços explicitamente configurados; sem segredos no cliente |

Use `.env.example` apenas como inventário de variáveis públicas. Qualquer variável com prefixo `VITE_` entra no bundle do navegador e, portanto, nunca pode conter segredos, credenciais ou dados pessoais. Arquivos `.env` locais não são versionados.

Um modo desconhecido gera erro explícito em vez de iniciar a experiência com configuração ambígua. Falhas de um serviço opcional devem cair em adaptadores seguros e não bloquear a criança.

## Qualidade e testes

```bash
pnpm lint
pnpm format:check
pnpm test
pnpm e2e
pnpm check
```

`pnpm check` executa lint, formatação, tipos, testes e build. O teste de interface usa Chromium em viewport móvel; instale o navegador uma vez com `pnpm exec playwright install chromium`.

## Protótipo preservado

O `index.html` da raiz, `game.js`, `styles.css` e os assets atuais continuam sendo o protótipo de referência. Eles não fazem parte do build da nova aplicação.

Para abrir o protótipo com servidor local:

```bash
pnpm dev:prototype
```

## Estrutura inicial

```text
apps/web/        aplicação infantil
packages/        contratos, motores, conteúdo e serviços compartilhados futuros
docs/            produto, arquitetura e operação
```

Cada pacote deve ter fronteiras explícitas. Conteúdo pedagógico não deve ser implementado diretamente em componentes React nem em regras de motor.
