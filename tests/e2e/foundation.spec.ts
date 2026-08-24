import { expect, test } from '@playwright/test';

test('abre a fundação em viewport móvel sem tela vazia', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Fantasia está crescendo' }),
  ).toBeVisible();
  await expect(page.locator('main')).toBeInViewport();
});
