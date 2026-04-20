import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object – provides common utilities for all pages.
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to the application root.
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Wait for an element to be visible and return its locator.
   */
  async waitForElement(selector: string): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible' });
    return locator;
  }

  /**
   * Click an element after ensuring it's visible.
   */
  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  /**
   * Fill an input field.
   */
  async fill(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }
}
