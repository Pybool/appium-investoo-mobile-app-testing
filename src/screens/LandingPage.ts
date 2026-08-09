import { BasePage } from "./BasePage";
import { waitForElement, LONG_TIMEOUT } from "../helpers/driver";

export class LandingPage extends BasePage {
  readonly getStartedButton = "~landing-get-started-button";
  readonly skipIntro = 'android=new UiSelector().text("Skip intro")';
  readonly loginLink = "~landing-login-link";
  readonly screen = "~landing-screen";
  readonly headline = "~landing-headline";
  readonly themeToggle = "~landing-theme-toggle";

  async isLoaded() {
    return this.visible(this.screen);
  }

  async tapGetStarted() {
    const el = await waitForElement(this.getStartedButton, LONG_TIMEOUT);
    await el.click();
  }

  async tapSkipInto() {
    const skipIntroBtn = await waitForElement(this.skipIntro, this.defaultTimeout);
    await skipIntroBtn.click();
  }

  async skipLandingPage() {
    await this.tapGetStarted();
    await this.tapSkipInto();
  }

  async tapLogin() {
    await this.tap(this.loginLink);
  }

  async tapThemeToggle() {
    await this.tap(this.themeToggle);
  }

  async getHeadlineText() {
    return this.read(this.headline);
  }
}
