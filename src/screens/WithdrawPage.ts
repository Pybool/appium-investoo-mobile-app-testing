import { BasePage } from './BasePage';

export class WithdrawPage extends BasePage {
  readonly screen = '~withdraw-screen';
  readonly amountInput = '~withdraw-amount-input';
  readonly bankPicker = '~withdraw-bank-picker';
  readonly accountNumberInput = '~withdraw-account-number-input';
  readonly pinInput = '~withdraw-pin-input';
  readonly submitButton = '~withdraw-submit-button';
  readonly backButton = '~withdraw-back-button';
  readonly errorMessage = '~withdraw-error-message';
  readonly successScreen = '~withdraw-success-screen';

  async isLoaded() {
    return this.visible(this.screen);
  }

  async enterAmount(amount: string) {
    await this.type(this.amountInput, amount);
  }

  async selectBank(bankName: string) {
    await this.tap(this.bankPicker);
  }

  async enterAccountNumber(accountNumber: string) {
    await this.type(this.accountNumberInput, accountNumber);
  }

  async enterPin(pin: string) {
    await this.type(this.pinInput, pin);
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

  async isSuccessVisible() {
    return this.visible(this.successScreen);
  }
}
