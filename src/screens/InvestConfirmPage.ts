import { BasePage } from './BasePage';

export class InvestConfirmPage extends BasePage {
  readonly screen = '~invest-confirm-screen';
  readonly amountInput = '~invest-confirm-amount-input';
  readonly unitsPreview = '~invest-confirm-units-preview';
  readonly totalLabel = '~invest-confirm-total-label';
  readonly submitButton = '~invest-confirm-submit-button';
  readonly backButton = '~invest-confirm-back-button';
  readonly errorMessage = '~invest-confirm-error-message';
  readonly pinInput = '~invest-confirm-pin-input';

  async isLoaded() {
    return this.visible(this.screen);
  }

  async enterAmount(amount: string) {
    await this.type(this.amountInput, amount);
  }

  async getUnitsPreview() {
    return this.read(this.unitsPreview);
  }

  async tapSubmit() {
    await this.tap(this.submitButton);
  }

  async tapBack() {
    await this.tap(this.backButton);
  }

  async enterPin(pin: string) {
    await this.type(this.pinInput, pin);
  }

  async isPinRequired() {
    return this.visible(this.pinInput, 2000);
  }

  async getErrorText() {
    return this.read(this.errorMessage);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }
}
