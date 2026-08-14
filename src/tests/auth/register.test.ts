import { expect } from "chai";
import { RegisterPage } from "../../screens/RegisterPage";
import { LoginPage } from "../../screens/LoginPage";
import { resetApp } from "../../helpers/driver";
import { LandingPage } from "../../screens/LandingPage";
import { recordIfBug } from "../../helpers/bugLogger";
import { VerifyEmailPage } from "../../screens/VerifyEmailPage";
import { clearMitmLog, waitForRequest } from "../../helpers/mitmLog";

const registerPage = new RegisterPage();
const loginPage = new LoginPage();
const landingPage = new LandingPage();
const verifyEmailPage = new VerifyEmailPage();

const DEFAULT_TIMEOUT = 10000;

async function reloadRegisterPage() {
  await resetApp();
  await landingPage.skipLandingPage();
  await loginPage.tapCreateAccount();
  const isLoaded = await registerPage.isLoaded();
  if (!isLoaded) {
    throw new Error("Register page failed to load suvcessfully");
  }
}

describe("Auth > Register", () => {
  beforeEach(async () => {
    await reloadRegisterPage();
  });

  describe("Form display", () => {
    it("should display the registration screen with all required fields", async () => {
      const allFieldsReady = await registerPage.areAllFieldsReady();
      expect(allFieldsReady).to.be.true;
    });

    it("should display a clickable and enabled link to the login screen for existing users", async () => {
      const loginLinkExist = await registerPage.ensureLoginLink();
      const loginLinkText = await registerPage.getLoginLinkText();
      const isClickable = await registerPage.isFieldReady(
        registerPage.loginLink,
      );

      expect(isClickable).to.be.true;
      expect(loginLinkExist).to.be.true;
      expect(loginLinkText).to.equal("Already have an account?  Log in");
    });

    it("should display the terms and conditions checkbox", async () => {
      const termsCheckBoxExist = await registerPage.ensureTermsCheckBox();
      const termsText = await registerPage.getTermsAndConditionsText();

      expect(termsCheckBoxExist).to.be.true;
      expect(termsText).to.equal(
        "I agree to Investoo's Terms of Use and Privacy Policy.",
      );
    });
  });

  describe("Field validation", () => {
    describe("Email", () => {
      for (const {
        label,
        value,
        expected,
        notes,
      } of RegisterPage.EMAIL_CASES) {
        it(`should validate email "${label}"`, async () => {
          const actual = await registerPage.checkFieldValidation(
            "email",
            value,
          );
          recordIfBug({
            suite: "Register > email",
            field: "email",
            scenario: label,
            input: value,
            expected,
            actual,
            notes: notes ?? "",
          });
          expect(actual).to.equal(expected);
        });
      }
    });

    describe("password validation ", async () => {
      for (const field of ["firstName", "lastName"] as const) {
        describe(field, () => {
          const expectedErrorMessage =
            field === "firstName"
              ? "Enter your first name"
              : "Enter your last name";

          for (const {
            label,
            value,
            shouldError,
            notes,
          } of RegisterPage.NAME_CASES) {
            it(`should validate ${field} "${label}"`, async () => {
              const expected = shouldError ? expectedErrorMessage : "";
              const actual = await registerPage.checkFieldValidation(
                field,
                value,
              );
              recordIfBug({
                suite: `Register > ${field}`,
                field,
                scenario: label,
                input: value,
                expected,
                actual,
                notes: notes ?? "",
              });
              expect(actual).to.equal(expected);
            });
          }
        });
      }
    });

    describe("Password", () => {
      for (const {
        label,
        value,
        expected,
        notes,
      } of RegisterPage.PASSWORD_CASES) {
        it(`should validate password "${label}"`, async () => {
          const actual = await registerPage.checkFieldValidation(
            "password",
            value,
          );
          recordIfBug({
            suite: "Register > password",
            field: "password",
            scenario: label,
            input: value,
            expected,
            actual,
            notes: notes ?? "",
          });
          expect(actual).to.equal(expected);
        });
      }
    });

    it("should require the terms checkbox to be checked before submitting", async () => {
      const email = `terms.gap.${Date.now()}@example.com`;
      const password = "Eko@1011";
      await registerPage.fillFields({
        firstName: "Emmanuel",
        lastName: "Eko",
        email,
        password,
        phone: "08100000012",
      });
      const termsCheckBoxExist = await registerPage.ensureTermsCheckBox();
      await registerPage.tapSubmit();
      const acceptTermsErrorText =
        await registerPage.getFieldErrorText("agree");
      expect(termsCheckBoxExist).to.be.true;
      expect(acceptTermsErrorText).to.equal(
        "Please accept the terms to continue",
      );

      const stillOnRegisterScreen = await registerPage.isLoaded();
      expect(stillOnRegisterScreen).to.be.true;

      await registerPage.tapLoginLink();
      const loginLoaded = await loginPage.isLoaded();
      expect(loginLoaded).to.be.true;

      await loginPage.login(email, password);
      const loginRejected = await loginPage.isErrorVisible();
      expect(loginRejected).to.be.true;

      const verifyEmailHeading = await $(
        'android=new UiSelector().text("Check your email")',
      );
      let appeared = true;
      try {
        await verifyEmailHeading.waitForExist({ timeout: DEFAULT_TIMEOUT });
      } catch {
        appeared = false;
      }
      expect(appeared).to.be.false;
    });
  });

  describe("Email uniqueness", () => {
    it("should show an error when the email is already registered", async () => {
      const email = `terms.gap.${Date.now()}@example.com`;
      let password = "Eko@1011";
      await registerPage.fillFields({
        firstName: "Emmanuel",
        lastName: "Eko",
        email,
        password,
        phone: "08100000012",
      });
      const termsCheckBoxExist = await registerPage.ensureTermsCheckBox();
      expect(termsCheckBoxExist).to.be.true;

      await registerPage.acceptTerms();
      await registerPage.tapSubmit();

      // const isLoaded = await verifyEmailPage.isLoaded();
      // if (!isLoaded) {
      //   throw new Error("Verify Email page failed to load suvcessfully");
      // }

      const verifyEmailHeading = await $(
        'android=new UiSelector().text("Check your email")',
      );
      let appeared = true;
      try {
        await verifyEmailHeading.waitForExist({ timeout: DEFAULT_TIMEOUT });
      } catch {
        appeared = false;
      }
      expect(appeared).to.be.true;

      await reloadRegisterPage();

      password = "Emeka@1011";
      await registerPage.fillFields({
        firstName: "Emeka",
        lastName: "Obi",
        email,
        password,
        phone: "08100000013",
      });
      const termsCheckBoxExistOnSecondPass =
        await registerPage.ensureTermsCheckBox();
      expect(termsCheckBoxExistOnSecondPass).to.be.true;

      await registerPage.acceptTerms();
      await registerPage.tapSubmit();

      const signUpRejected = await registerPage.isErrorVisible();
      expect(signUpRejected).to.be.true;
    });
  });

  describe("@smoke Successful registration", () => {
    it("user should be able navigate to email verification screen on valid submission and verify account to complete signup sucessfully", async () => {
      const email = `terms.gap.${Date.now()}@example.com`;
      let password = "Eko@1011";
      await registerPage.fillFields({
        firstName: "Emmanuel",
        lastName: "Eko",
        email,
        password,
        phone: "08100000012",
      });
      const termsCheckBoxExist = await registerPage.ensureTermsCheckBox();
      expect(termsCheckBoxExist).to.be.true;

      await registerPage.acceptTerms();
      await registerPage.tapSubmit();

      const verifyEmailHeading = await $(
        'android=new UiSelector().text("Check your email")',
      );
      let appeared = true;
      try {
        await verifyEmailHeading.waitForExist({ timeout: DEFAULT_TIMEOUT });
      } catch {
        appeared = false;
      }
      expect(appeared).to.be.true;

      const verifyEmailText = await $(
        `android=new UiSelector().textContains("${email}")`,
      );
      let emailAppeared = true;
      try {
        await verifyEmailText.waitForExist({ timeout: DEFAULT_TIMEOUT });
      } catch {
        emailAppeared = false;
      }
      expect(emailAppeared).to.be.true;

      // Verifyy email via otp

      const isOtpInputEnabled = await verifyEmailPage.isOtpInputEnabled();

      expect(isOtpInputEnabled).to.be.true;

      await verifyEmailPage.enterOtp("000000");

      const isOtpSubmitEnabled = await verifyEmailPage.isOtpSubmitEnabled();

      expect(isOtpSubmitEnabled).to.be.true;

      // clearMitmLog();
      await verifyEmailPage.tapSubmit();

      const verifyEmailCall = await waitForRequest("POST", "/api/auth/verify-email");
      expect(verifyEmailCall).to.not.be.undefined;
      expect(verifyEmailCall?.status).to.equal(200);
    });
  });

  describe("Navigation", () => {
    it("should navigate to the login screen when the login link is tapped", async () => {
      const hasLoginLink = await registerPage.ensureLoginLink();
      expect(hasLoginLink).to.be.true;
      await registerPage.tapLoginLink();
      const isLoaded = await loginPage.isLoaded();
      expect(isLoaded).to.be.true;
    });
  });
});
