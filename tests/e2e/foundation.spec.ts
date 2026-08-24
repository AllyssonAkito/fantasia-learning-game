import { expect, test } from '@playwright/test';

test('abre a trilha infantil em viewport móvel com estado atual', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Lógica' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Fantasia — início' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: /vamos brincar.*pronto para brincar/i }),
  ).toBeEnabled();
  await expect(page.locator('main')).toBeInViewport();
});
