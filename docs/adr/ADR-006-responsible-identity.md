# ADR-006 — Identidade mínima do responsável

- Status: Aceito
- Data: 2026-08-24
- Issue: [#26](https://github.com/AllyssonAkito/fantasia-learning-game/issues/26)

## Contexto

A plataforma precisa separar ações adultas da experiência infantil e associar perfis e progresso a um responsável. O MVP é local-first, não precisa de login remoto e não deve coletar dados pessoais apenas por conveniência futura.

Uma criança nunca terá credenciais próprias. Conta remota, recuperação por e-mail, cobrança e sincronização entre dispositivos permanecem fora do MVP.

## Decisão

Representar o responsável por uma identidade local mínima, criada no dispositivo e acessível apenas dentro de uma sessão adulta.

O registro contém somente:

| Campo | Finalidade |
|---|---|
| `id` | identificador opaco gerado localmente |
| `displayName` | nome curto opcional, fornecido pelo adulto |
| `createdAt` | auditoria local de criação |
| `updatedAt` | controle de atualização e persistência |
| `schemaVersion` | compatibilidade do registro |

O registro não contém e-mail, telefone, endereço, documento, data de nascimento, fotografia, contatos ou identificadores de terceiros.

## Fluxo

1. Sem identidade local, a área adulta oferece criar o responsável com nome opcional.
2. A criação gera um `id` local e abre uma sessão adulta no dispositivo.
3. Em uma visita posterior, a identidade pode ser restaurada do repositório local, mas configurações continuam atrás do acesso adulto.
4. Sair encerra somente a sessão; não apaga responsável, perfis ou progresso.
5. Excluir conta é uma operação separada, com confirmação adulta e impacto explicitado antes da execução.

## Estados seguros

- `anonymous`: nenhuma sessão adulta ativa; a área infantil continua utilizável quando possível;
- `loading`: restauração em andamento, sem controles adultos expostos;
- `authenticated`: identidade válida carregada;
- `error`: falha recuperável, com nova tentativa e sem apagar dados;
- `signedOut`: sessão encerrada, mantendo os registros locais;
- `deletionPending`: confirmação explícita ainda necessária.

Falha de persistência nunca cria uma identidade parcialmente válida. Falha de restauração não deve bloquear a tela infantil nem expor configurações. Mensagens voltadas à criança usam apoio visual e não atribuem culpa.

## Limite de acesso adulto

O bloqueio infantil reduz toques acidentais, mas não é apresentado como mecanismo de segurança forte. Operações sensíveis devem exigir um desafio adulto apropriado e nunca depender apenas de um botão pequeno ou escondido.

## Consequências

### Positivas

- minimiza coleta e superfície de vazamento;
- permite testar perfis e progresso sem backend;
- mantém a criança fora de fluxos de autenticação;
- preserva uma fronteira para um repositório remoto futuro.

### Negativas

- perda do armazenamento local pode perder a identidade no MVP;
- não existe recuperação entre dispositivos;
- o desafio adulto não equivale a autenticação criptográfica.

## Alternativas rejeitadas

### Conta obrigatória com e-mail e senha

Rejeitada no MVP por coletar dados que não são necessários para a brincadeira local, ampliar a superfície de segurança e exigir backend e recuperação de credenciais.

### Perfil infantil como conta autenticada

Rejeitada. A criança escolhe um perfil local; credenciais e consentimentos pertencem exclusivamente ao responsável.

### Identidade anônima sem responsável

Rejeitada como modelo único porque não oferece uma fronteira segura para criação, edição, arquivamento e exclusão de perfis.

## Revisão futura

Autenticação remota e sincronização exigem ADR específico, avaliação de privacidade infantil e plano de migração do identificador local.
