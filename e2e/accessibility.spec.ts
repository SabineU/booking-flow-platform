import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    // Wait for the main landmark to appear (ensures React has rendered)
    await expect(page.locator('main')).toBeVisible();

    // Also wait for the visually-hidden h1 to be present
    await expect(page.locator('h1')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
