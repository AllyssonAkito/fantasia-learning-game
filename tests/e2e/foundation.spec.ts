import { expect, test } from '@playwright/test';

test('percorre o core loop em viewport móvel sem overflow ou erro', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Lógica' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Fantasia — início' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /padrões.*pronto para brincar/i }),
  ).toBeEnabled();
  await expect(page.locator('main')).toBeInViewport();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await page
    .getByRole('button', { name: /padrões.*pronto para brincar/i })
    .click();
  await expect(
    page.getByRole('button', { name: /atividade 1.*pronta/i }),
  ).toBeEnabled();
  await expect(page.getByRole('button', { name: /atividade \d/i })).toHaveCount(
    6,
  );
  await page.getByRole('button', { name: /atividade 1.*pronta/i }).click();
  await expect(
    page.getByRole('heading', { name: 'O que vem depois?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '💜 coração roxo' }).click();
  await expect(
    page.getByRole('heading', { name: 'Você conseguiu!' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(
    page.getByRole('button', { name: /atividade 1.*concluída/i }),
  ).toBeEnabled();
  await expect(
    page.getByRole('button', { name: /atividade 2.*pronta/i }),
  ).toBeEnabled();
  expect(consoleErrors).toEqual([]);
});

test('protege a área adulta e funciona por teclado', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Fantasia — início' }),
  ).toBeFocused();

  await page
    .getByRole('button', { name: 'Abrir acesso do responsável' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Segure por 2 segundos' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('respeita movimento reduzido na celebração', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page
    .getByRole('button', { name: /padrões.*pronto para brincar/i })
    .click();
  await page.getByRole('button', { name: /atividade 1.*pronta/i }).click();
  await page.getByRole('button', { name: '💜 coração roxo' }).click();
  const duration = await page
    .locator('.reward-celebration')
    .evaluate((element) => getComputedStyle(element).animationDuration);
  expect(duration).toBe('0.001s');
});
