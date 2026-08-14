import { BasePage } from './BasePage';

export class VerifyEmailPage extends BasePage {
  readonly screen = '~verify-email-screen';
  readonly emailLabel = '~verify-email-email-label';
  readonly otpInput = '~verify-email-otp-input';
  readonly submitButton = '~verify-email-submit-button';
  readonly resendButton = '~verify-email-resend-button';
  readonly changeEmailLink = '~verify-email-change-email-link';
  readonly errorMessage = '~verify-email-error-message';

  async isLoaded() {
    return this.visible(this.screen);
  }

  async getDisplayedEmail() {
    return this.read(this.emailLabel);
  }

  async isOtpInputEnabled() {
    return await this.enabled(this.otpInput);
  }

  async isOtpSubmitEnabled() {
    return await this.enabled(this.submitButton);
  }

  async enterOtp(otp: string) {
    await this.enabled(this.otpInput);
    await this.type(this.otpInput, otp);
  }

  async tapSubmit() {
    await this.tap(this.submitButton);
  }

  async tapResend() {
    await this.tap(this.resendButton);
  }

  async tapChangeEmail() {
    await this.tap(this.changeEmailLink);
  }

  async getErrorText() {
    return this.read(this.errorMessage);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }
}
