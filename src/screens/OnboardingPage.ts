import { BasePage } from "./BasePage";
import { swipeLeft, swipeRight } from "../helpers/gestures";

export class OnboardingPage extends BasePage {
  readonly screen = "~onboarding-screen";
  readonly nextButton = "~onboarding-next-button";
  readonly skipButton = "~onboarding-skip-button";
  readonly createAccountButton = "~onboarding-create-account-button";
  readonly loginLink = "~onboarding-login-link";
  readonly skipIntro = 'android=new UiSelector().text("Skip intro")';

  eyebrow = "~onboarding-eyebrow";
  title = "~onboarding-title";
  body = "~onboarding-body";

  dotAt(index: number) {
    return `~onboarding-dot-${index}`;
  }

  featureChipAt(index: number) {
    return `~onboarding-feature-chip-${index}`;
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async tapNext(index: number = 1) {
    for (let i = 0; i < index; i++) {
      await this.tap(this.nextButton);
    }
  }

  async isLoginLinkVisible(){
    return await this.visible(this.loginLink);
  }

  async isNextButtonVisible() {
    return await this.visible(this.nextButton);
  }

  async isSkipIntroVisible() {
    return await this.visible(this.skipIntro);
  }

  async isNextButtonNotVisible() {
    return await this.notVisible(this.nextButton);
  }

  async isSkipIntroNotVisible() {
    return await this.notVisible(this.skipIntro);
  }

  async tapSkip() {
    await this.tap(this.skipButton);
  }

  async tapCreateAccount() {
    await this.tap(this.createAccountButton);
  }

  async isCreateAccountButtonVisible() {
    return await this.visible(this.createAccountButton);
  }

  async tapLogin() {
    await this.tap(this.loginLink);
  }

  async swipeToNextSlide(index: number = 1) {
    for (let i = 0; i < index; i++) {
      await swipeLeft();
    }
  }

  async swipeToPreviousSlide(index: number = 1) {
    for (let i = 0; i < index; i++) {
      await swipeRight();
    }
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

  featureChipLabelAt(index: number) {
    return `android=new UiSelector().resourceId("onboarding-feature-chip-${index}").childSelector(new UiSelector().className("android.widget.TextView"))`;
  }

  async getFeatureChipText(index: number) {
    return this.read(this.featureChipLabelAt(index));
  }

  async getFeatureChipLocation(index: number) {
    const el = await this.waitFor(this.featureChipAt(index));
    return el.getLocation();
  }

  async getDotWidth(index: number) {
    const el = await this.waitFor(this.dotAt(index));
    const size = await el.getSize();
    return size.width;
  }

  async getAllDotWidths(count: number = 4) {
    const widths: number[] = [];
    for (let i = 0; i < count; i++) {
      widths.push(await this.getDotWidth(i));
    }
    return widths;
  }
}
