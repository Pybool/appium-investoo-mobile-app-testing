import { BasePage } from './BasePage';
import { swipeLeft, swipeRight } from '../helpers/gestures';

export class OnboardingPage extends BasePage {
  readonly screen = '~onboarding-screen';
  readonly nextButton = '~onboarding-next-button';
  readonly skipButton = '~onboarding-skip-button';
  readonly createAccountButton = '~onboarding-create-account-button';
  readonly loginLink = '~onboarding-login-link';

  eyebrow = '~onboarding-eyebrow';
  title = '~onboarding-title';
  body = '~onboarding-body';

  dotAt(index: number) {
    return `~onboarding-dot-${index}`;
  }

  featureChipAt(index: number) {
    return `~onboarding-feature-chip-${index}`;
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async tapNext() {
    await this.tap(this.nextButton);
  }

  async tapSkip() {
    await this.tap(this.skipButton);
  }

  async tapCreateAccount() {
    await this.tap(this.createAccountButton);
  }

  async tapLogin() {
    await this.tap(this.loginLink);
  }

  async swipeToNextSlide() {
    await swipeLeft();
  }

  async swipeToPreviousSlide() {
    await swipeRight();
  }

  async getEyebrowText() {
    return this.read(this.eyebrow);
  }

  async getTitleText() {
    return this.read(this.title);
  }

  async isFeatureChipVisible(index: number) {
    return this.visible(this.featureChipAt(index));
  }
}
