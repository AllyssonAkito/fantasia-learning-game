# Exclusão da conta local

## Objetivo

Definir como o responsável remove seus dados locais sem criar exclusões acidentais nem deixar registros órfãos.

## Pré-condições

- sessão adulta ativa;
- acesso pela área do responsável, nunca pela trilha infantil;
- resumo do impacto exibido antes da confirmação;
- desafio adulto concluído;
- confirmação final separada da navegação comum.

## Impacto

Excluir a conta local remove, na mesma operação lógica:

- identidade do responsável;
- perfis infantis ativos e arquivados vinculados;
- progresso, sessões incompletas e preferências desses perfis;
- saldo local e inventário cosmético;
- fila local de telemetria ainda não enviada;
- consentimentos e configurações locais associados.

Conteúdo público do catálogo e assets do aplicativo não são dados da conta e permanecem instalados. Quando houver backend, a política de retenção e os comprovantes de exclusão exigirão ADR próprio.

## Fluxo seguro

1. Mostrar quais perfis e dados locais serão removidos.
2. Oferecer **Voltar** como ação de menor risco e visualmente dominante.
3. Exigir o desafio adulto novamente.
4. Pedir confirmação explícita em uma segunda etapa.
5. Executar a exclusão como transação: ou todos os repositórios concluem, ou nenhum é confirmado como apagado.
6. Limpar a sessão adulta e voltar ao estado inicial.
7. Mostrar confirmação neutra, sem pressão para criar nova conta.

Falha parcial mantém a sessão em estado de erro recuperável, não informa sucesso e permite tentar novamente. A aplicação não deve apagar automaticamente dados por inatividade, erro de sincronização ou ação infantil.

## Arquivar não é excluir

Arquivar um perfil apenas o remove da seleção infantil e preserva histórico. Excluir a conta remove também perfis arquivados. A interface deve usar textos e ícones distintos para as duas operações.

## Fora de escopo

- exclusão remota;
- prazo legal de retenção de um backend futuro;
- exportação de dados;
- recuperação depois de uma exclusão local confirmada.
