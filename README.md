# investoo-tests

Appium + WebdriverIO end-to-end test suite for the Investoo mobile app (`investoo-mobile`), running against a real built APK on either a physical Android device or an emulator. Uses the Page Object Model, Mocha (BDD), and Allure reporting.

## Prerequisites

- Node.js + npm
- Java JDK (for Appium/UiAutomator2 and the Android SDK tooling)
- Android SDK platform-tools on `PATH` (`adb`)
- An Android device (physical, over USB or wireless ADB) or a running emulator
- The `investoo-server` backend running and reachable (see below)
- A built APK of `investoo-mobile` (see "Building the APK")

```bash
npm install
```

## Directory layout

```
config/
  wdio.conf.ts           # base WebdriverIO config — spec globs, suites, reporters, timeouts
  wdio.android.conf.ts   # Android/UiAutomator2 capabilities, reads device/app env vars
src/
  helpers/
    driver.ts            # element wait/scroll/read helpers, resetApp(), selector resolution
    gestures.ts           # swipe/scroll gesture helpers
    bugLogger.ts          # recordIfBug() — appends validation gaps to bugs.json
  screens/                # Page Object Model — one file per screen
  tests/                  # one folder per feature area, mirrors suites in wdio.conf.ts
    onboarding/, auth/, home/, invest/, wallet/, profile/
scripts/
  seed.ts                 # seeds a Postgres DB with fixture users/opportunities/wallets/etc.
data/
  investoo.apk             # built APK under test (gitignored, not committed)
bugs.json                  # auto-logged validation/behavior gaps found by the suite (gitignored)
reports/allure-results/    # Allure raw results (gitignored)
logs/appium.log            # Appium server log (gitignored)
```

## Environment variables (`.env`)

Create `investoo-tests/.env` (gitignored, never commit real values). Reference:

| Variable | Required | Purpose |
|---|---|---|
| `APPIUM_HOST` | no (default `127.0.0.1`) | Host the Appium server listens on |
| `APPIUM_PORT` | no (default `4723`) | Port the Appium server listens on |
| `ANDROID_DEVICE_NAME` | yes | Target device: USB serial, `<ip>:5555` for wireless ADB, or `emulator-5554` |
| `ANDROID_PLATFORM_VERSION` | no (default `13`) | Android version on the target device |
| `ANDROID_APP_PACKAGE` | no (default `com.investoo.app`) | App package under test |
| `ANDROID_APP_ACTIVITY` | no (default `com.investoo.app.MainActivity`) | Launch activity |
| `APP_PATH` | yes | Path to the built APK (see "Building the APK") |
| `API_BASE_URL` | yes | Backend URL the app under test talks to |
| `QA_POSTGRES_HOST` / `_PORT` / `_DB` / `_USER` / `_PASSWORD` | yes (for `npm run seed`) | DB backing whichever server `API_BASE_URL` points at |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | yes (for `npm run seed`) | Admin account `scripts/seed.ts` creates/uses |
| `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | yes | Default logged-in test user credentials (seeded) |
| `TEST_USER_OTP_OVERRIDE` | yes | OTP value the backend accepts unconditionally in place of a real emailed code |
| `DEFAULT_TIMEOUT` | no (default `10000`) | Default element-wait timeout, ms |
| `LONG_TIMEOUT` | no (default `30000`) | Longer timeout for slow operations, ms |

Example:

```bash
# Appium server
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723

# Device — see "Connecting a device" below
ANDROID_DEVICE_NAME=<serial-or-ip:5555-or-emulator-5554>
ANDROID_PLATFORM_VERSION=13
ANDROID_APP_PACKAGE=com.investoo.app
ANDROID_APP_ACTIVITY=com.investoo.app.MainActivity

# Built APK path
APP_PATH=./data/investoo.apk

# Backend the app under test talks to, and the DB behind it (for scripts/seed.ts)
API_BASE_URL=http://localhost:8080/api
QA_POSTGRES_HOST=127.0.0.1
QA_POSTGRES_PORT=5432
QA_POSTGRES_DB=investoo
QA_POSTGRES_USER=investoo
QA_POSTGRES_PASSWORD=investoo_dev

# Admin account created by scripts/seed.ts
ADMIN_EMAIL=admin@investoo.qa
ADMIN_PASSWORD=AdminPassword123!

# Default logged-in test user (seeded by scripts/seed.ts: tier 2 KYC, funded wallet)
TEST_USER_EMAIL=investor.funded@investoo.qa
TEST_USER_PASSWORD=TestPassword123!

# TokenStore.validateOtp() accepts this for every OTP purpose — see Known Issues
TEST_USER_OTP_OVERRIDE=000000

# Timeouts (ms)
DEFAULT_TIMEOUT=20000
LONG_TIMEOUT=30000
```

`QA_POSTGRES_*` can point at either an isolated QA database or the native dev database — `scripts/seed.ts` is idempotent either way (see below). Whichever DB it points at must be the same one `investoo-server` (at `API_BASE_URL`) is actually using, since the app under test talks to that server over the network.

## Running the backend

The app (and therefore the tests) needs `investoo-server` up and reachable at `API_BASE_URL`, with Postgres and Redis running behind it. From `investoo-server/`:

```bash
# Native Postgres/Redis (no Docker) — see investoo-server/.env for which mode is active
bash dev-start.sh --build   # rebuilds the JAR then starts it
# or, if already built:
bash dev-start.sh
```

Confirm it's healthy before running tests:

```bash
curl http://localhost:8080/api/actuator/health
```

See the root [`COMMANDS.txt`](../COMMANDS.txt) for the Docker-based QA Postgres alternative and other server startup variants.

## Seeding test data

```bash
npm run seed
```

Seeds an admin, 8 investor users covering various KYC tiers/statuses, 6 opportunities (one FUNDED, one at 85% subscribed), wallet balances with matching double-entry ledger rows, one confirmed investment, and a handful of notifications. Safe to re-run — it looks up existing rows (by email/slug) and skips or reuses them instead of erroring on conflicts. Full list of seeded users and passwords is printed at the end of the run.

## Building the APK

```bash
cd ../investoo-mobile
eas build --platform android --profile preview
```

Download the resulting APK from the link EAS prints and place it at `investoo-tests/data/investoo.apk` (path must match `APP_PATH` in `.env`). The `preview` profile bakes in `EXPO_PUBLIC_API_URL` from `investoo-mobile/eas.json` at build time — that must point at a URL the device can actually reach (e.g. an ngrok tunnel to `investoo-server`) since it's fixed at build time, not runtime.

## Connecting a device

### Emulator

```bash
"C:\Android\emulator\emulator.exe" -avd Pixel_API33
adb devices                       # expect: emulator-5554   device
adb -s emulator-5554 install ./data/investoo.apk
```

Set `ANDROID_DEVICE_NAME=emulator-5554` in `.env` (this is also the default if the var is unset).

### Physical device — wireless ADB

Full step-by-step setup and troubleshooting (including the AP/client-isolation and adb-hang failure modes we've hit) lives in the root [`COMMANDS.txt`](../COMMANDS.txt), section 12. Quick version:

```bash
# 1. Plug in via USB, confirm authorized
adb kill-server && adb start-server && adb devices -l

# 2. Get the phone's current Wi-Fi IP (re-check every time — it can change)
adb shell ip addr show wlan0 | grep "inet "

# 3. Switch to TCP/IP mode (still over USB)
adb tcpip 5555

# 4. Connect over Wi-Fi, then unplug USB
adb connect <PHONE_IP>:5555
adb devices -l                    # expect: <PHONE_IP>:5555   device
```

Then set `ANDROID_DEVICE_NAME=<PHONE_IP>:5555` in `.env`. If `adb tcpip`/`adb connect` hangs, or the phone's IP is unreachable despite being on the same subnet, see the Troubleshooting section in `COMMANDS.txt` section 12 before assuming it's a code/config issue.

## Running tests

Start Appium in one terminal, run tests in another:

```bash
npm run appium
```

```bash
npm run test:android              # everything under src/tests/**/*.test.ts
npm run test:suite:auth           # onboarding + register + login
npm run test:suite:invest         # home + browse + invest flow
npm run test:suite:wallet         # wallet + fund + withdraw
npm run test:suite:profile        # profile + kyc
```

Suite membership is defined in `config/wdio.conf.ts`'s `suites` block. To run a single spec file directly:

```bash
npx wdio run config/wdio.android.conf.ts --spec ./src/tests/auth/register.test.ts
```

Allure results are written to `reports/allure-results/`; a screenshot is auto-captured on any test failure (`afterTest` hook in `wdio.conf.ts`).

## Bug logging (`bugs.json`)

Some specs (e.g. `register.test.ts`'s field-validation cases) don't hard-fail on every gap — they call `recordIfBug()` (`src/helpers/bugLogger.ts`), which appends an entry to `bugs.json` only when actual output differs from expected, alongside a note on the likely root cause. This lets a single data-driven run surface every validation gap in one pass instead of stopping at the first mismatch. Check `bugs.json` after a run for anything new.

## Known issues

- `TokenStore.validateOtp()` on the backend accepts `000000` as a valid OTP for every purpose (email verify, login confirm, password reset) with no environment gating — convenient for tests, but flagged as a security concern for anything beyond local/QA use.
- Name fields (`firstName`/`lastName`) have no character-class validation on either the client (Zod, `min(2)` only) or backend (`@NotBlank @Size(min=2,max=100)`, no regex) — digits, symbols, `@`, underscores, angle brackets, and emoji are all currently accepted. Logged in `bugs.json`.
