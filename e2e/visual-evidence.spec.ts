import { test, expect, Page } from '@playwright/test';

/**
 * This test suite captures UI/UX evidence for the assessment:
 * - Mobile and desktop screenshots of error states, disabled skips, price breakdown
 * - All screenshots are saved in the `screenshots/` directory.
 */

// Helper to resize viewport
async function setViewport(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
}

// Helper to complete Step 1 (postcode lookup)
async function completeStep1(page: Page, postcode = 'SW1A 1AA') {
  await page.fill('[data-testid="postcode-input"]', postcode);
  await page.click('[data-testid="find-address-button"]');
  await expect(page.locator('[data-testid="address-list"]')).toBeVisible();
  await page.click('[data-testid="address-list"] input[type="radio"] >> nth=0');
  await page.click('[data-testid="postcode-continue"]');
}

// Helper to complete Step 2 (waste type)
async function completeStep2(
  page: Page,
  wasteType: 'general' | 'heavy' | 'plasterboard',
  option?: string
) {
  await page.click(`[data-testid="waste-${wasteType}"]`);
  if (wasteType === 'plasterboard' && option) {
    await expect(page.locator('[data-testid="plasterboard-options"]')).toBeVisible();
    await page.click(`[data-testid="plasterboard-${option}"]`);
  }
  await page.click('[data-testid="waste-continue"]');
}

test.describe('Visual Evidence', () => {
  // We'll take screenshots at specific states; we don't need assertions.
  test('Capture error state and retry (BS1 4DJ)', async ({ page }) => {
    // Desktop view
    await setViewport(page, 1280, 720);
    await page.goto('/');
    await page.fill('[data-testid="postcode-input"]', 'BS1 4DJ');
    await page.click('[data-testid="find-address-button"]');
    await expect(page.locator('[data-testid="postcode-error"]')).toContainText(
      'Failed to fetch addresses'
    );
    await page.screenshot({ path: 'screenshots/desktop-error-retry.png', fullPage: true });

    // Mobile view
    await setViewport(page, 375, 667);
    await page.screenshot({ path: 'screenshots/mobile-error-retry.png', fullPage: true });
  });

  test('Capture empty address state (EC1A 1BB)', async ({ page }) => {
    await setViewport(page, 1280, 720);
    await page.goto('/');
    await page.fill('[data-testid="postcode-input"]', 'EC1A 1BB');
    await page.click('[data-testid="find-address-button"]');
    await expect(page.locator('[data-testid="postcode-error"]')).toContainText(
      'No addresses found'
    );
    await page.screenshot({ path: 'screenshots/desktop-empty-addresses.png', fullPage: true });

    await setViewport(page, 375, 667);
    await page.screenshot({ path: 'screenshots/mobile-empty-addresses.png', fullPage: true });
  });

  test('Capture disabled skips (heavy waste)', async ({ page }) => {
    await setViewport(page, 1280, 720);
    await page.goto('/');
    await completeStep1(page);
    await completeStep2(page, 'heavy');
    await expect(page.locator('[data-testid="heavy-waste-warning"]')).toBeVisible();
    await page.screenshot({ path: 'screenshots/desktop-disabled-skips.png', fullPage: true });

    await setViewport(page, 375, 667);
    await page.screenshot({ path: 'screenshots/mobile-disabled-skips.png', fullPage: true });
  });

  test('Capture price breakdown', async ({ page }) => {
    await setViewport(page, 1280, 720);
    await page.goto('/');
    await completeStep1(page);
    await completeStep2(page, 'general');
    await page
      .locator('[data-testid="skip-grid"] button:not([data-disabled="true"])')
      .first()
      .click();
    await page.click('[data-testid="skip-continue"]');
    await expect(page.locator('[data-testid="price-breakdown"]')).toBeVisible();
    await page.screenshot({ path: 'screenshots/desktop-price-breakdown.png', fullPage: true });

    await setViewport(page, 375, 667);
    await page.screenshot({ path: 'screenshots/mobile-price-breakdown.png', fullPage: true });
  });
});
