import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SkipSelectionStep extends BasePage {
  private readonly skipGrid = '[data-testid="skip-grid"]';
  private readonly heavyWarning = '[data-testid="heavy-waste-warning"]';
  private readonly continueButton = '[data-testid="skip-continue"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Wait for the skip grid to be visible.
   */
  async waitForLoad() {
    await expect(this.page.locator(this.skipGrid)).toBeVisible();
  }

  /**
   * Select the first enabled skip.
   */
  async selectFirstEnabledSkip() {
    const enabledSkip = this.page
      .locator(`${this.skipGrid} button:not([data-disabled="true"])`)
      .first();
    await enabledSkip.click();
  }

  /**
   * Verify that a specific skip size is disabled.
   */
  async expectSkipDisabled(size: string) {
    await expect(this.page.locator(`[data-testid="skip-${size}"]`)).toHaveAttribute(
      'data-disabled',
      'true'
    );
  }

  /**
   * Verify the heavy waste warning is visible.
   */
  async expectHeavyWarningVisible() {
    await expect(this.page.locator(this.heavyWarning)).toBeVisible();
  }

  async continue() {
    await this.click(this.continueButton);
  }

  /**
   * Complete Step 3 – select first enabled skip and continue.
   */
  async complete() {
    await this.waitForLoad();
    await this.selectFirstEnabledSkip();
    await this.continue();
  }
}
