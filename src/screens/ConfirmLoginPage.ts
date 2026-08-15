import { BasePage } from "./BasePage";

const DEFAULT_TIMEOUT = 10_000;
export class ConfirmLoginPage extends BasePage {
  readonly screen = "~confirm-login-screen";
  readonly otpInput = "~confirm-login-otp-input";
  readonly submitButton = "~confirm-login-submit-button";
  readonly backButton = "~confirm-login-back-button";
  readonly emailLabel = "~confirm-login-email-label";
  readonly errorMessage = "~confirm-login-error-message";
  readonly mainHeaderText =
    'android=new UiSelector().text("Enter your login code")';

  readonly infoTextLabel =
    'android=new UiSelector().textContains("We sent a 6-digit code")';

  async isLoaded() {
    return this.visible(this.screen, DEFAULT_TIMEOUT);
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

  async getMainHeaderText() {
    return this.read(this.mainHeaderText);
  }

  async getInfoText() {
    return this.read(this.infoTextLabel);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }
  
  isMaskedEmail(email: string): boolean {
    if (!email) {
      return false;
    }

    const [localPart, domainPart] = email.split("@");

    if (!localPart || !domainPart) {
      return false;
    }

    const maskCharacterPattern = /[*xX•]/;
    const hasMaskCharacters = maskCharacterPattern.test(localPart);
    const unmaskedCandidate = email.replace(maskCharacterPattern, "a");
    const isStructurallyValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      unmaskedCandidate,
    );

    return hasMaskCharacters && isStructurallyValidEmail;
  }
}
