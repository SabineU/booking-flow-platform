import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WasteTypeStep extends BasePage {
  private readonly generalOption = '[data-testid="waste-general"]';
  private readonly heavyOption = '[data-testid="waste-heavy"]';
  private readonly plasterboardOption = '[data-testid="waste-plasterboard"]';
  private readonly plasterboardOptionsContainer = '[data-testid="plasterboard-options"]';
  private readonly continueButton = '[data-testid="waste-continue"]';

  constructor(page: Page) {
    super(page);
  }

  async selectGeneral() {
    await this.click(this.generalOption);
  }

  async selectHeavy() {
    await this.click(this.heavyOption);
  }

  async selectPlasterboard(handlingOption: 'recycle' | 'landfill' | 'bagging') {
    await this.click(this.plasterboardOption);
    await expect(this.page.locator(this.plasterboardOptionsContainer)).toBeVisible();
    await this.click(`[data-testid="plasterboard-${handlingOption}"]`);
  }

  async continue() {
    await this.click(this.continueButton);
  }

  /**
   * Complete Step 2 with the given waste type.
   */
  async complete(wasteType: 'general' | 'heavy' | 'plasterboard', plasterboardOption?: string) {
    switch (wasteType) {
      case 'general':
        await this.selectGeneral();
        break;
      case 'heavy':
        await this.selectHeavy();
        break;
      case 'plasterboard':
        await this.selectPlasterboard(plasterboardOption as 'recycle' | 'landfill' | 'bagging');
        break;
    }
    await this.continue();
  }
}
