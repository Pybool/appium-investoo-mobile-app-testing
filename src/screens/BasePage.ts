import {
  waitForElement,
  tap,
  typeText,
  getText,
  getAccessibleLabel,
  isDisplayed,
  isNotDisplayed,
  isInViewport,
  isEnabled,
  isFieldReady,
  scrollIntoView,
  clearField,
  waitForElementGone,
} from '../helpers/driver';

export abstract class BasePage {
  protected readonly defaultTimeout: number;

  constructor(timeout = Number(process.env.DEFAULT_TIMEOUT ?? 10000)) {
    this.defaultTimeout = timeout;
  }

  protected async waitFor(selector: string, timeout = this.defaultTimeout) {
    return waitForElement(selector, timeout);
  }

  protected async waitForGone(selector: string, timeout = this.defaultTimeout) {
    return waitForElementGone(selector, timeout);
  }

  protected async tap(selector: string) {
    return tap(selector);
  }

  protected async type(selector: string, text: string) {
    return typeText(selector, text);
  }

  protected async clearTextField(selector: string){
    return clearField(selector);
  }

  protected async read(selector: string) {
    return getText(selector);
  }

  protected async readLabel(selector: string) {
    return getAccessibleLabel(selector);
  }

  protected async visible(selector: string, timeout?: number) {
    return isDisplayed(selector, timeout);
  }

  protected async notVisible(selector: string, timeout?: number) {
    return isNotDisplayed(selector, timeout);
  }

  protected async inView(selector: string, timeout?: number) {
    return isInViewport(selector, timeout);
  }

  protected async enabled(selector: string, timeout?: number) {
    return isEnabled(selector, timeout);
  }

  protected async scrollTo(selector: string) {
    return scrollIntoView(selector);
  }

  protected async ready(selector: string, timeout?: number) {
    return isFieldReady(selector, timeout);
  }

  abstract isLoaded(): Promise<boolean>;
}
