import { config as dotenvConfig } from 'dotenv';
import { PNG } from 'pngjs';
import { expect } from "chai";


dotenvConfig();

export const DEFAULT_TIMEOUT = Number(process.env.DEFAULT_TIMEOUT ?? 10000);
export const LONG_TIMEOUT = Number(process.env.LONG_TIMEOUT ?? 30000);

export function resolveSelector(selector: string): string {
  if (selector.startsWith('~') && driver.isAndroid) {
    const testId = selector.slice(1);
    return `android=new UiSelector().resourceId("${testId}")`;
  }
  return selector;
}

export async function waitForElement(selector: string, timeout = DEFAULT_TIMEOUT) {
  const el = await $(resolveSelector(selector));
  await el.waitForExist({ timeout });
  return el;
}

export async function waitForElementGone(selector: string, timeout = DEFAULT_TIMEOUT) {
  const el = await $(resolveSelector(selector));
  await el.waitForExist({ timeout, reverse: true });
}

export async function scrollIntoView(selector: string) {
  if (!driver.isAndroid) {
    const el = await $(resolveSelector(selector));
    await el.scrollIntoView();
    return;
  }
  const resolved = resolveSelector(selector);
  const { width, height } = await driver.getWindowSize();
  const gesture = (direction: 'down' | 'up', percent: number) =>
    driver.execute('mobile: scrollGesture', {
      left: Math.round(width * 0.1),
      top: Math.round(height * 0.2),
      width: Math.round(width * 0.8),
      height: Math.round(height * 0.6),
      direction,
      percent,
    });
  const isFound = async () => {
    const el = await $(resolved);
    return (await el.isExisting()) && (await el.isDisplayed());
  };

  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (await isFound()) return;
    await gesture('down', 0.8);
  }
  const maxRecoveryAttempts = 4;
  for (let attempt = 0; attempt < maxRecoveryAttempts; attempt++) {
    if (await isFound()) return;
    await gesture('up', 0.3);
  }
}

export async function ensureVisible(selector: string, timeout = DEFAULT_TIMEOUT) {
  try {
    await scrollIntoView(selector);
  } catch {
  }
  return waitForElement(selector, timeout);
}

export async function tap(selector: string) {
  const el = await ensureVisible(selector);
  await el.click();
}

export async function clearField(selector: string){
  const el = await ensureVisible(selector);
  await el.clearValue();
  return el;
}

export async function typeText(selector: string, text: string) {
  const el = await clearField(selector);
  await el.setValue(text);
}

export async function getText(selector: string): Promise<string> {
  const el = await waitForElement(selector);
  return el.getText();
}

export async function getAccessibleLabel(selector: string): Promise<string> {
  const el = await waitForElement(selector);
  return el.getAttribute('content-desc');
}

export async function isDisplayed(selector: string, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  try {
    const el = await $(resolveSelector(selector));
    await el.waitForExist({ timeout });
    return true;
  } catch {
    return false;
  }
}

export async function isNotDisplayed(selector: string, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  try {
    const el = await $(resolveSelector(selector));
    await el.waitForExist({ reverse: true });
    return true;
  } catch {
    return false;
  }
}

export async function isInViewport(selector: string, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  const el = await waitForElement(selector, timeout);
  return el.isDisplayed();
}

export async function isEnabled(selector: string, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  const el = await waitForElement(selector, timeout);
  return el.isEnabled();
}

export async function isFieldReady(selector: string, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  try {
    try {
      await scrollIntoView(selector);
    } catch {
    }
    const el = await waitForElement(selector, timeout);
    const inViewport = await el.isDisplayed();
    const enabled = await isEnabled(selector, timeout);
    return inViewport && enabled;
  } catch {
    return false;
  }
}

export async function hideKeyboard() {
  try {
    await driver.hideKeyboard();
  } catch {
  }
}

export async function resetApp() {
  const pkg = process.env.ANDROID_APP_PACKAGE ?? 'com.investoo.app';
  await driver.terminateApp(pkg, {});
  await driver.execute('mobile: clearApp', { appId: pkg });
  await driver.activateApp(pkg);
  await driver.pause(2500);
}

export async function login(email?: string, password?: string) {
  const e = email ?? process.env.TEST_USER_EMAIL ?? '';
  const p = password ?? process.env.TEST_USER_PASSWORD ?? '';
  const otp = process.env.TEST_USER_OTP_OVERRIDE ?? '';

  await typeText('~login-email-input', e);
  await typeText('~login-password-input', p);
  await hideKeyboard();
  await tap('~login-submit-button');

  await waitForElement('~confirm-login-otp-input', LONG_TIMEOUT);

  if (otp) {
    await typeText('~confirm-login-otp-input', otp);
    await tap('~confirm-login-submit-button');
  }
}

export async function takeScreenshot(name: string) {
  const base64 = await browser.takeScreenshot();
  return base64;
}

export async function waitForLoadingGone(timeout = LONG_TIMEOUT) {
  await waitForElementGone('~loading-indicator', timeout);
}

export async function getPixel(x: number, y: number) {
  const base64 = await browser.takeScreenshot();
  const buffer = Buffer.from(base64, 'base64');
  const png = PNG.sync.read(buffer);
  const idx = (png.width * y + x) << 2;
  return {
    r: png.data[idx],
    g: png.data[idx + 1],
    b: png.data[idx + 2],
  };
}

export async function expectNotDisplayed(
  element: ChainablePromiseElement,
  timeout = 2000
): Promise<void> {
  await browser.waitUntil(
    async () => !(await element.isDisplayed()),
    {
      timeout,
      interval: 100,
      timeoutMsg: 'Element is still displayed',
    }
  );

  expect(await element.isDisplayed()).to.be.false;
}

export function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
