# Hospedagem

## Ambiente

- provedor: OpenAI Sites;
- projeto: `fantasia-melina`;
- acesso pretendido: público;
- artefato: build estático de `apps/web` com Worker de fallback para rotas;
- configuração versionada: `.openai/hosting.json`;
- conteúdo persistente: nenhum;
- segredos de runtime: nenhum.

## Produção

- URL pública: <https://fantasia-melina.allyssonakito.chatgpt.site>
- smoke test: HTTP 200 para HTML, bundle JavaScript, manifesto e fallback de rota;
- cabeçalhos verificados: `nosniff` e bloqueio de frames;
- primeira publicação: 24 de agosto de 2026.

## Promoção

O mesmo artefato aprovado pela regressão é salvo como versão imutável e promovido para produção. O arquivo `dist/release-manifest.json` registra SHA-256 e tamanho de cada arquivo do cliente publicado.

## Saúde

O smoke test confirma resposta HTTP, título do produto, assets com hash e carregamento do core loop. A URL final de produção é registrada nas notas de release após o primeiro deploy bem-sucedido.
