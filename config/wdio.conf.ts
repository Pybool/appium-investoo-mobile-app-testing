import fs from 'fs';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';
import type { Options } from '@wdio/types';
import { enableDeviceProxy, disableDeviceProxy } from '../src/helpers/mitmProxy';

dotenvConfig();

export const config: Options.Testrunner = {
  runner: 'local',
  rootDir: path.resolve(__dirname, '..'),

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
  },

  hostname: process.env.APPIUM_HOST ?? '127.0.0.1',
  port: Number(process.env.APPIUM_PORT ?? 4723),
  path: '/',

  specs: ['./src/tests/**/*.test.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [],

  logLevel: 'warn',
  bail: 0,

  waitforTimeout: Number(process.env.DEFAULT_TIMEOUT ?? 10000),
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',

  reporters: [
    'spec',
    ['allure', {
      outputDir: './reports/allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
    retries: 0,
  },

  onPrepare: () => {
    fs.writeFileSync(path.resolve(__dirname, '../bugs.json'), '[]');
  },

  before: async () => {
    await enableDeviceProxy();
  },

  after: async () => {
    await disableDeviceProxy();
  },

  afterTest: async (test, context, { error }) => {
    if (error) {
      await browser.takeScreenshot();
    }
  },

  suites: {
    auth: [
      './src/tests/onboarding/onboarding.test.ts',
      './src/tests/auth/register.test.ts',
      './src/tests/auth/login.test.ts',
    ],
    invest: [
      './src/tests/home/home.test.ts',
      './src/tests/invest/browse.test.ts',
      './src/tests/invest/invest-flow.test.ts',
    ],
    wallet: [
      './src/tests/wallet/wallet.test.ts',
      './src/tests/wallet/fund.test.ts',
      './src/tests/wallet/withdraw.test.ts',
    ],
    profile: [
      './src/tests/profile/profile.test.ts',
      './src/tests/profile/kyc.test.ts',
    ],
  },
};
