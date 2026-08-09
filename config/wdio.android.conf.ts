/* config/wdio.android.conf.ts
 * Android-specific WebdriverIO config. Spreads the base config and adds
 * UiAutomator2 capabilities. Run: npm run test:android
 * The APK must be built before running tests:
 *   cd ../investoo-mobile && eas build --platform android --profile preview
 * Place the downloaded APK in the data/ folder and update APP_PATH in .env.
 */
import { config as dotenvConfig } from 'dotenv';
import { config as base } from './wdio.conf';
import type { Options } from '@wdio/types';

dotenvConfig();

export const config: Options.Testrunner = {
  ...base,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'emulator-5554',
      'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION ?? '13',
      'appium:app': process.env.APP_PATH ?? '',
      'appium:appPackage': process.env.ANDROID_APP_PACKAGE ?? 'com.investoo.app',
      'appium:appActivity': process.env.ANDROID_APP_ACTIVITY ?? 'com.investoo.app.MainActivity',
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 240,
      'appium:autoGrantPermissions': true,
      'appium:disableIdLocatorAutocompletion': true,
      // UiAutomator2 waits for the device to report zero layout/animation activity ("idle")
      // before responding to any command. This RN app has continuous animation (e.g. Button's
      // Animated.spring press feedback), so the idle check was never satisfied quickly and
      // every single action (click, clearApp, terminateApp — even unrelated ones queued behind
      // it, since Appium serializes commands per session) was eating its full wait budget,
      // observed in logs/appium.log as 11-31s per command regardless of USB vs wireless ADB.
      'appium:waitForIdleTimeout': 0,
    } as WebdriverIO.Capabilities,
    
  ],
};
