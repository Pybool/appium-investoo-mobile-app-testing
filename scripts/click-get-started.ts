/* scripts/click-get-started.ts
 * Standalone one-off script — no Mocha, no wdio test runner, no Page Object.
 * Opens a raw WebdriverIO session directly against Appium and taps the landing
 * screen's Get Started button, using the confirmed-working UiAutomator2 resourceId
 * selector (testID surfaces as an unprefixed resource-id on this build, not
 * content-desc — see helpers/driver.ts for the full explanation).
 * Run: npx ts-node scripts/click-get-started.ts
 */
import path from 'path';
import { remote } from 'webdriverio';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

async function main() {
  const appPath = path.resolve(__dirname, '..', process.env.APP_PATH ?? './data/investoo.apk');

  const browser = await remote({
    hostname: process.env.APPIUM_HOST ?? '127.0.0.1',
    port: Number(process.env.APPIUM_PORT ?? 4723),
    path: '/',
    logLevel: 'warn',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'emulator-5554',
      'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION ?? '13',
      'appium:app': appPath,
      'appium:appPackage': process.env.ANDROID_APP_PACKAGE ?? 'com.investoo.app',
      'appium:appActivity': process.env.ANDROID_APP_ACTIVITY ?? 'com.investoo.app.MainActivity',
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 240,
      'appium:autoGrantPermissions': true,
      'appium:disableIdLocatorAutocompletion': true,
    } as WebdriverIO.Capabilities,
  });

  try {
    console.log('Session started. Looking for Get Started button...');
    const el = await browser.$('android=new UiSelector().resourceId("landing-get-started-button")');
    await el.waitForDisplayed({ timeout: 10000 });
    console.log('Button found. Clicking...');
    await el.click();
    console.log('Clicked successfully.');
  } finally {
    await browser.deleteSession();
  }
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
