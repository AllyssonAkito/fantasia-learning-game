# Revisão de privacidade e segurança — MVP 1.0.0

## Resultado

O MVP está aprovado para publicação como experiência infantil local-first. Não há cadastro infantil remoto, anúncios, compras, chat, microfone, localização, câmera ou envio de texto livre.

## Dados tratados

- nome de exibição configurado no perfil local;
- progresso, sessões, preferências de áudio e recompensas no dispositivo;
- eventos técnicos versionados sem conteúdo sensível;
- métricas agregadas para a visão do responsável.

O nome usado nas atividades é conteúdo local da experiência. Ele não integra URL, logs de evento nem payload de hospedagem.

## Controles verificados

- schema de telemetria com lista fechada de campos;
- rejeição de e-mail, telefone, texto livre e chaves desconhecidas;
- retenção local limitada a 30 dias para eventos;
- exclusão em cascata documentada em `ACCOUNT-DELETION.md`;
- área adulta isolada por desafio e expiração de sessão;
- nenhuma credencial ou segredo no bundle do navegador;
- dependências fixadas por lockfile e validação estática no pipeline;
- hospedagem somente de artefatos gerados e sem listagem de diretório;
- conteúdo pedagógico validado antes da publicação.

## Riscos residuais

- o navegador pode oferecer uma voz de síntese diferente por sistema;
- o armazenamento do dispositivo pode ser apagado pelo navegador;
- o MVP não sincroniza dados entre dispositivos;
- controles parentais do sistema e supervisão do responsável continuam recomendados.

Esses riscos não introduzem coleta adicional. Qualquer backend, autenticação remota ou pesquisa com participantes exige nova Issue, revisão jurídica aplicável e consentimento explícito.
