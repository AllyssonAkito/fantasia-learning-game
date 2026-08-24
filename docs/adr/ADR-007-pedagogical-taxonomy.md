# ADR-007 — Taxonomia pedagógica e identidade de conteúdo

- Status: Aceito
- Data: 2026-08-24
- Issue: [#37](https://github.com/AllyssonAkito/fantasia-learning-game/issues/37)

## Contexto

Motores reutilizáveis precisam receber atividades sem conhecer a organização editorial. Ao mesmo tempo, navegação, progressão e validação precisam de relações estáveis entre curso, trilha, habilidade, nível e atividade.

## Decisão

Adotar a hierarquia editorial:

```text
Course → Trail → Skill → Level → Activity
```

Cada entidade possui:

- `id` global, estável e opaco para a interface infantil;
- `schemaVersion` inteiro positivo para o formato do registro;
- `contentVersion` em SemVer para a revisão editorial;
- `status` editorial;
- `title` interno para autoria e revisão;
- referência explícita ao pai, exceto `Course`.

## Identificadores

IDs seguem segmentos em minúsculas separados por ponto e não são traduzidos. O prefixo identifica o tipo:

| Entidade | Formato | Exemplo |
|---|---|---|
| Course | `course.<slug>` | `course.logic` |
| Trail | `trail.<course>.<slug>` | `trail.logic.patterns` |
| Skill | `skill.<course>.<slug>` | `skill.logic.repeat-pattern` |
| Level | `level.<course>.<slug>.<nn>` | `level.logic.patterns.01` |
| Activity | `activity.<course>.<slug>.<nnn>` | `activity.logic.repeat.001` |

O ID nunca inclui nome da criança, texto exibido, dificuldade mutável ou versão. Uma entidade publicada mantém seu ID durante toda a vida editorial.

## Relações

- uma `Trail` referencia exatamente um `Course`;
- uma `Skill` referencia exatamente uma `Trail`;
- um `Level` referencia exatamente uma `Skill`;
- uma `Activity` referencia exatamente um `Level` e declara um motor registrado;
- listas de ordem usam IDs sem duplicação;
- toda referência deve existir no mesmo catálogo antes do build;
- ciclos e relações cruzadas fora da hierarquia são inválidos.

## Versionamento

- `schemaVersion` muda quando o formato exige parser ou migração diferente;
- `contentVersion` patch corrige texto ou asset sem mudar o objetivo pedagógico;
- minor adiciona variação compatível ou ajusta dificuldade mantendo a habilidade;
- major muda objetivo, resposta ou significado pedagógico;
- conteúdo `published` é imutável; qualquer mudança cria uma nova revisão;
- sessões persistem `activityId` e `contentVersion` executados.

## Separação entre autoria e criança

A taxonomia completa pertence a conteúdo, validação e progresso. A interface infantil recebe um modelo de apresentação reduzido com caminho visual, estado e próximo destino; não exibe IDs, versões, nomes internos ou estados editoriais.

## Estados seguros

- catálogo ausente ou vazio produz estado vazio recuperável;
- registro inválido ou referência ausente impede publicação e build;
- atividade incompatível não entra em uma sessão;
- conteúdo retirado não apaga histórico concluído;
- nenhum erro editorial é apresentado à criança como falha dela.

## Consequências

### Positivas

- referências podem ser validadas antes da execução;
- progresso permanece estável entre revisões compatíveis;
- conteúdo e motores evoluem com contratos explícitos;
- navegação infantil pode ocultar detalhes editoriais.

### Negativas

- autores precisam manter IDs e versões conscientemente;
- renomear conceitos internos não altera automaticamente os IDs;
- validação do catálogo passa a ser etapa obrigatória do build.

## Alternativas rejeitadas

- usar títulos como chaves;
- aninhar todo o catálogo em um único arquivo sem IDs globais;
- definir ordem e dependências diretamente em componentes React;
- reutilizar o mesmo registro publicado por mutação.
