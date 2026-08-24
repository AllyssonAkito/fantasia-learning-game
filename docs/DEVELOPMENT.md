# Desenvolvimento local

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

Para gerar o artefato estático:

```bash
pnpm build
```

Para conferir os contratos TypeScript sem emitir arquivos:

```bash
pnpm typecheck
```

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
