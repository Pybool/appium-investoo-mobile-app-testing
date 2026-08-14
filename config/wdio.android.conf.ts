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
      'appium:waitForIdleTimeout': 0,
    } as WebdriverIO.Capabilities,
    
  ],
};
