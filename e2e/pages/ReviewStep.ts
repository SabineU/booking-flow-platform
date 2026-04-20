import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReviewStep extends BasePage {
  private readonly priceBreakdown = '[data-testid="price-breakdown"]';
  private readonly confirmButton = '[data-testid="confirm-button"]';
  private readonly successMessage = 'text=Thank you for your booking!';
  private readonly plasterboardFee = '[data-testid="plasterboard-fee"]';
  private readonly reviewAddress = '[data-testid="review-address"]';

  constructor(page: Page) {
    super(page);
  }

  async waitForLoad() {
    await expect(this.page.locator(this.priceBreakdown)).toBeVisible();
  }

  async confirmBooking() {
    await this.click(this.confirmButton);
  }

  async expectSuccess() {
    await expect(this.page.locator(this.successMessage)).toBeVisible({ timeout: 10000 });
  }

  async expectPlasterboardFeeVisible() {
    await expect(this.page.locator(this.plasterboardFee)).toBeVisible();
  }

  async expectAddressContains(text: string) {
    await expect(this.page.locator(this.reviewAddress)).toContainText(text);
  }
}
