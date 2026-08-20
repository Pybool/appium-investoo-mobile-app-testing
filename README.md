# investoo-tests

Appium + WebdriverIO tests for the mobile app. Runs against a real built APK, either on a physical Android device or an emulator. Page Object Model, Mocha, Allure for reports.

## Setup

You'll need:

- Node + npm
- Java JDK (for Appium/UiAutomator2)
- Android SDK platform-tools on PATH (adb)
- A device or emulator
- investoo-server running somewhere reachable
- A built APK (see below)

```bash
npm install
```

## Layout

```
config/           wdio configs (base + android capabilities)
src/
  helpers/        driver.ts (wait/scroll/read helpers), gestures.ts, bugLogger.ts
  screens/        page objects, one file per screen
  tests/          specs, grouped by feature area
scripts/seed.ts   seeds fixture data into postgres
data/             apk goes here, gitignored
bugs.json         validation gaps found by the suite, gitignored
```

## .env

Copy the vars below into `investoo-tests/.env` and fill them in. Never commit it.

```bash
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723

ANDROID_DEVICE_NAME=          # usb serial, <ip>:5555 for wireless adb, or emulator-5554
ANDROID_PLATFORM_VERSION=13
ANDROID_APP_PACKAGE=com.investoo.app
ANDROID_APP_ACTIVITY=com.investoo.app.MainActivity

APP_PATH=./data/investoo.apk

API_BASE_URL=http://localhost:8080/api
QA_POSTGRES_HOST=127.0.0.1
QA_POSTGRES_PORT=5432
QA_POSTGRES_DB=investoo
QA_POSTGRES_USER=investoo
QA_POSTGRES_PASSWORD=

ADMIN_EMAIL=admin@investoo.qa
ADMIN_PASSWORD=

TEST_USER_EMAIL=investor.funded@investoo.qa
TEST_USER_PASSWORD=

TEST_USER_OTP_OVERRIDE=000000   # backend accepts this instead of a real otp, see below

DEFAULT_TIMEOUT=20000
LONG_TIMEOUT=30000
```

The postgres vars need to point at whatever DB the server behind API_BASE_URL is actually using, otherwise `npm run seed` writes data the app can't see.

## Running the backend

```bash
cd ../investoo-server
bash dev-start.sh --build   # or just dev-start.sh if the jar is already built
curl http://localhost:8080/api/actuator/health   # should say UP
```

## Seeding data

```bash
npm run seed
```

Creates an admin, a handful of investor users at different KYC tiers, some opportunities, wallet balances with matching ledger entries, one investment, a few notifications. Safe to run more than once, it reuses existing rows instead of erroring. Prints the full user/password list when it's done.

## Getting the APK

```bash
cd ../investoo-mobile
eas build --platform android --profile preview
```

Grab the download link EAS prints and drop the file at `data/investoo.apk`. Heads up: `EXPO_PUBLIC_API_URL` gets baked into the build at compile time, not read at runtime, so make sure `eas.json`'s preview profile points at a URL the phone can actually reach before building.

## Connecting a device

**Emulator**

```bash
"C:\Android\emulator\emulator.exe" -avd Pixel_API33
adb devices   # should show emulator-5554
adb -s emulator-5554 install ./data/investoo.apk
```

`ANDROID_DEVICE_NAME=emulator-5554`

**Physical device, wireless adb**

```bash
adb kill-server && adb start-server && adb devices -l   # plug in over usb first

adb shell ip addr show wlan0 | grep "inet "   # get the phone's wifi ip

adb tcpip 5555
adb connect <phone-ip>:5555
adb devices -l   # unplug usb once you see it listed
```

Set `ANDROID_DEVICE_NAME=<phone-ip>:5555`.

A couple things that have bitten us before:
- if `adb connect` just hangs forever with no error, it's usually not actually a network problem, adb.exe on Windows doesn't respond to Git Bash's timeout/kill the way you'd expect. Kill it from PowerShell instead (`Get-Process adb | Stop-Process -Force`) and start over.
- if the phone and PC are on the same subnet but still can't reach each other, and `arp -a` shows no entry for the phone's IP at all, that's router client isolation, not us. Restarting the phone and router has fixed it every time so far.
- phone's IP changes fairly often (dhcp), so if the device suddenly looks offline, just re-check the IP and reconnect.

## Running tests

Two terminals: one for appium, one for the actual test run.

```bash
npm run appium
```

```bash
npm run test:android
npm run test:suite:auth
npm run test:suite:invest
npm run test:suite:wallet
npm run test:suite:profile
```

or a single spec:

```bash
npx wdio run config/wdio.android.conf.ts --spec ./src/tests/auth/register.test.ts
npx wdio run config/wdio.android.conf.ts --spec ./src/tests/auth/onboarding.test.ts
```

Screenshots get taken automatically on failure. Allure results land in `reports/allure-results/`.

## Intercepting network calls (mitmproxy)

A couple of specs (the register smoke test) need to check the app actually hit the
backend and got a real 200 back, not just that the UI looked right. WebdriverIO
can't see network calls on its own, so we run mitmproxy as a real proxy between
the phone and the server and log what goes through.

Install mitmproxy, generate the CA cert, and install it as trusted on the test
device, standard setup, nothing project-specific about that part, mitmproxy's own
docs cover it fine (mitmproxy.org). Two things worth knowing going in: on Windows,
port 8080 is often reserved by Hyper-V/WSL, so pick something else like 8899, and
Android won't let you install the CA cert silently via adb, it's a manual step on
the device.

Day to day, once that's done:

```bash
cd investoo-tests
mitmdump --listen-port 8899 -s mitm/logger.py
```

`mitm/logger.py` only logs requests to the ngrok backend, not every app on the
phone. `wdio.conf.ts` turns the phone's proxy on/off automatically around each
test session (`before`/`after` hooks), so you don't need to touch adb yourself
for normal test runs. If a run crashes hard and the proxy gets left on, clear it
manually:

```bash
adb shell settings put global http_proxy :0
```

Tests read the captured traffic from `src/helpers/mitmLog.ts`'s `waitForRequest()`.
One thing to remember: the logged `path` includes the `/api` prefix (Spring's
context-path), so it's `waitForRequest("POST", "/api/auth/verify-email")`, not
`/auth/verify-email` — easy to get bitten by this once.

## bugs.json

A few specs (register field validation mainly) don't stop at the first failed case, they log every mismatch to `bugs.json` via `recordIfBug()` and keep going, so one run surfaces everything at once instead of one bug per run. Worth checking after any run touching those specs.

## Known gaps

- The OTP override (`000000`) is accepted for every OTP purpose on the backend with no env check. Fine for testing, not something that should ship as-is.
- firstName/lastName accept basically anything right now, digits, symbols, emoji, even `<script>`. No character check client or server side. Already in bugs.json.
