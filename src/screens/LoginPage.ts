import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly screen = '~login-screen';
  readonly emailInput = '~login-email-input';
  readonly passwordInput = '~login-password-input';
  readonly submitButton = '~login-submit-button';
  readonly registerLink = '~login-register-link';
  readonly errorMessage = '~login-error-message';

  async isLoaded() {
    return this.visible(this.screen);
  }

  async enterEmail(email: string) {
    await this.type(this.emailInput, email);
  }

  async enterPassword(password: string) {
    await this.type(this.passwordInput, password);
  }

  async tapSubmit() {
    await this.tap(this.submitButton);
  }

  async tapCreateAccount() {
    await this.tap(this.registerLink);
  }

  async getErrorText() {
    return this.read(this.errorMessage);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.tapSubmit();
  }
}
