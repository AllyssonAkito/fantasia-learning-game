# Origem e uso dos assets

## Ilustrações de atividade

As 12 ilustrações em `apps/web/public/assets/activity/` foram geradas
especificamente para o projeto Fantasia com o gerador de imagens da OpenAI em
24 de agosto de 2026, no escopo da Issue #160. Não foram usados arquivos de
terceiros como arte final.

Prompt-base: ilustração 2D original para aplicativo infantil, formas
arredondadas, profundidade suave, leve textura artesanal de pelúcia, silhueta
grande e legível, objeto central ocupando aproximadamente 80% do quadro, fundo
alfa transparente, sem texto, sem emoji, sem marca-d'água e sem objetos extras.

Assets: estrela, coração, círculo, quadrado, triângulo, coelhinho, cachorrinho,
peixinho, cenoura, maçã, bola colorida e flor.

Os arquivos distribuídos pelo aplicativo são WebP de `384 × 384 px` com canal
alfa. A origem, o texto alternativo e as dimensões também ficam registrados no
catálogo `packages/content/src/mvp-assets.ts`.

## Recortes de personagens na montagem

As atividades de montagem reutilizam, por recorte visual, as ilustrações
originais `cachorrinho-chibi.png` e `coelhinho-chibi.png` do catálogo de
personagens do projeto. As cópias distribuídas foram otimizadas para WebP de
`512 × 512 px`; nenhuma imagem de terceiros foi adicionada.

## Peças de letras e cenas compostas

As peças M, E, L, I, N e A e as cenas espaciais da expansão #162 são
composições gráficas produzidas pelo próprio aplicativo. Elas reutilizam
tipografia, cores e ilustrações já registradas no catálogo e não incorporam
arte, emoji ou arquivo de terceiros.
