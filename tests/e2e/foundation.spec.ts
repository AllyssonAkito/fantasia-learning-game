import { expect, test } from '@playwright/test';

test('abre o App Shell em viewport móvel sem tela vazia', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Tudo pronto para crescer' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Fantasia — início' })).toBeVisible();
  await expect(page.locator('main')).toBeInViewport();
});
