import { BasePage } from './BasePage';

export class ConfirmLoginPage extends BasePage {
  readonly screen = '~confirm-login-screen';
  readonly otpInput = '~confirm-login-otp-input';
  readonly submitButton = '~confirm-login-submit-button';
  readonly backButton = '~confirm-login-back-button';
  readonly emailLabel = '~confirm-login-email-label';
  readonly errorMessage = '~confirm-login-error-message';

  async isLoaded() {
    return this.visible(this.screen);
  }

  async enterOtp(otp: string) {
    await this.type(this.otpInput, otp);
  }

  async tapSubmit() {
    await this.tap(this.submitButton);
  }

  async tapBack() {
    await this.tap(this.backButton);
  }

  async getDisplayedEmail() {
    return this.read(this.emailLabel);
  }

  async getErrorText() {
    return this.read(this.errorMessage);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }
}
