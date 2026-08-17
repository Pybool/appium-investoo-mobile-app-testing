import { BasePage } from "./BasePage";
import { waitForElement, LONG_TIMEOUT } from "../helpers/driver";

export class LandingPage extends BasePage {
  readonly getStartedButton = "~landing-get-started-button";
  readonly getStartedButtonLabel =
    'android=new UiSelector().resourceId("landing-get-started-button").childSelector(new UiSelector().className("android.widget.TextView"))';
  readonly skipIntro = 'android=new UiSelector().text("Skip intro")';
  readonly loginLink = "~landing-login-link";
  readonly loginLinkLabel =
    'android=new UiSelector().resourceId("landing-login-link").childSelector(new UiSelector().className("android.widget.TextView"))';
  readonly screen = "~landing-screen";
  readonly headline = "~landing-headline";
  readonly themeToggle = "~landing-theme-toggle";

  async isLoaded() {
    return this.visible(this.screen);
  }

  async elementVisible(selector: string){
    return this.visible(selector)
  }

  async tapGetStarted() {
    const el = await waitForElement(this.getStartedButton, LONG_TIMEOUT);
    await el.click();
  }

  async getGetStartedButtonText(){
    return this.readLabel(this.getStartedButton);
  }

  async getGetStartedButtonInnerText(){
    return this.read(this.getStartedButtonLabel);
  }

  async getLoginLinkText(){
    return this.read(this.loginLinkLabel);
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
