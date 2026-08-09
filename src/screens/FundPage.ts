import { BasePage } from './BasePage';

export class FundPage extends BasePage {
  readonly screen = '~fund-screen';
  readonly amountInput = '~fund-amount-input';
  readonly submitButton = '~fund-submit-button';
  readonly backButton = '~fund-back-button';
  readonly errorMessage = '~fund-error-message';

  presetAmount(amount: number) {
    return `~fund-preset-${amount}`;
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async enterAmount(amount: string) {
    await this.type(this.amountInput, amount);
  }

  async tapPreset(amount: number) {
    await this.tap(this.presetAmount(amount));
  }

  async tapSubmit() {
    await this.tap(this.submitButton);
  }

  async tapBack() {
    await this.tap(this.backButton);
  }

  async getErrorText() {
    return this.read(this.errorMessage);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }
}
