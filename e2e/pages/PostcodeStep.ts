import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Step 1 – Postcode and address selection.
 */
export class PostcodeStep extends BasePage {
  // Selectors
  private readonly postcodeInput = '[data-testid="postcode-input"]';
  private readonly findAddressButton = '[data-testid="find-address-button"]';
  private readonly addressList = '[data-testid="address-list"]';
  private readonly manualEntryButton = '[data-testid="manual-entry-button"]';
  private readonly manualAddressInput = '[data-testid="manual-address-input"]';
  private readonly continueButton = '[data-testid="postcode-continue"]';
  private readonly errorMessage = '[data-testid="postcode-error"]';
  private readonly retryButton = '[data-testid="retry-button"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill the postcode input.
   */
  async enterPostcode(postcode: string) {
    await this.fill(this.postcodeInput, postcode);
  }

  /**
   * Click "Find Address" and wait for results.
   */
  async lookupAddress() {
    await this.click(this.findAddressButton);
  }

  /**
   * Select the first address from the list.
   */
  async selectFirstAddress() {
    await expect(this.page.locator(this.addressList)).toBeVisible();
    await this.page.locator(`${this.addressList} input[type="radio"]`).first().click();
  }

  /**
   * Click "Enter address manually" and fill the textarea.
   */
  async enterManualAddress(address: string) {
    await this.click(this.manualEntryButton);
    await this.fill(this.manualAddressInput, address);
  }

  /**
   * Click Continue to proceed to Step 2.
   */
  async continue() {
    await this.click(this.continueButton);
  }

  /**
   * Complete the step with a valid postcode and first address.
   */
  async completeWithFirstAddress(postcode: string = 'SW1A 1AA') {
    await this.enterPostcode(postcode);
    await this.lookupAddress();
    await this.selectFirstAddress();
    await this.continue();
  }

  /**
   * Get the error message text.
   */
  async getErrorMessage(): Promise<string> {
    const error = this.page.locator(this.errorMessage);
    await error.waitFor({ state: 'visible' });
    return (await error.textContent()) || '';
  }

  /**
   * Click the Retry button (visible after a failed lookup).
   */
  async retry() {
    await this.click(this.retryButton);
  }
}
