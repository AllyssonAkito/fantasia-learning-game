# Política de dependências

## Princípios

- Preferir APIs da plataforma web e código de domínio próprio quando a abstração for pequena.
- Adicionar uma biblioteca somente quando ela reduzir risco ou manutenção de forma mensurável.
- Evitar dependências que coletem dados, injetem publicidade ou exijam conta infantil.
- Manter dependências de interface fora dos pacotes de domínio e motores.
- Fixar versões diretas e versionar o lockfile.
- Usar o catálogo do workspace para versões compartilhadas.

## Avaliação obrigatória

Toda nova dependência deve registrar no Pull Request:

1. problema que resolve;
2. alternativa sem a dependência;
3. licença e manutenção recente;
4. impacto esperado no bundle ou na execução;
5. comportamento offline e riscos de privacidade;
6. plano de remoção ou substituição quando for infraestrutura crítica.

Dependências que executem código remoto em produção, coletem telemetria própria ou processem dados infantis exigem ADR e revisão específica de privacidade.

## Atualizações

- Patches podem ser agrupados quando os testes passam e não alteram contratos públicos.
- Minor versions precisam de leitura do changelog e validação dos fluxos afetados.
- Major versions exigem Issue própria, plano de migração e rollback.
- Atualizações de segurança críticas têm prioridade, mas continuam passando por build e testes.
- O campo `minimumReleaseAge` do workspace cria uma janela mínima antes da adoção automática de versões recém-publicadas; exceções ficam explícitas e devem ser removidas depois da estabilização.

## Revisão e lockfile

- `pnpm-lock.yaml` é obrigatório e só muda junto com uma alteração declarada de dependências.
- O revisor deve observar pacotes transitivos novos, scripts de instalação e mudanças inesperadas de integridade.
- A integração contínua instala com `pnpm install --frozen-lockfile`.
- Dependências sem uso devem ser removidas no mesmo Epic em que forem identificadas, desde que isso não amplie silenciosamente o escopo.
