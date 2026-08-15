import { expect } from "chai";
import { LoginPage } from "../../screens/LoginPage";
import { ConfirmLoginPage } from "../../screens/ConfirmLoginPage";
import { resetApp } from "../../helpers/driver";
import { LandingPage } from "../../screens/LandingPage";
import { recordIfBug } from "../../helpers/bugLogger";
import { RegisterPage } from "../../screens/RegisterPage";
import { RegisterPayload } from "../../helpers/api-client";

const loginPage = new LoginPage();
const landingPage = new LandingPage();
const registerPage = new RegisterPage();
const confirmPage = new ConfirmLoginPage();

async function reloadLoginPage() {
  await resetApp();
  await landingPage.skipLandingPage();
  const isLoaded = await loginPage.isLoaded();
  if (!isLoaded) {
    throw new Error("Login page failed to load suvcessfully");
  }
}

const data: RegisterPayload = {
  email: "",
  password: "Eko@1011",
  firstName: "Emma",
  lastName: "Eko",
  phone: "08100001235",
};

describe("Auth > Login", () => {
  beforeEach(async () => {
    await reloadLoginPage();
  });

  describe("Login form validation", () => {
    it("should display the login screen with email and password fields", async () => {
      const emailFieldDiplayedAndEnabled = await loginPage.ensureEmailField();
      const passwordFieldDiplayedAndEnabled =
        await loginPage.ensurePasswordField();
      expect(emailFieldDiplayedAndEnabled && passwordFieldDiplayedAndEnabled).to
        .be.true;
    });

    it("should show a validation error when email is empty on submit", async () => {
      await loginPage.enterPassword("@10111011qweQWE");
      await loginPage.tapSubmit();
      const isVisible = await loginPage.ensureElementVisible(
        loginPage.emailValidationError,
      );
      expect(isVisible).to.be.true;
    });

    it("should show a validation error when password is empty on submit", async () => {
      await loginPage.enterEmail("tester@example.com");
      await loginPage.tapSubmit();
      const isVisible = await loginPage.ensureElementVisible(
        loginPage.passwordValidationError,
      );
      expect(isVisible).to.be.true;
    });

    describe("Email", () => {
      for (const { label, value, expected, notes } of LoginPage.EMAIL_CASES) {
        it(`should show a validation error for an invalid email format "${label}"`, async () => {
          const actual = await loginPage.checkFieldValidation("email", value);
          recordIfBug({
            suite: "Login > email",
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

    it("should keep the submit button enabled while fields are empty", async () => {
      await loginPage.clearInputField(loginPage.emailInput);
      await loginPage.clearInputField(loginPage.passwordInput);
      const isSubmitEnabled = await loginPage.isEnabled(loginPage.submitButton);
      expect(isSubmitEnabled).to.be.true;
    });

    it("should mask the password field by default", async () => {
      await loginPage.enterPassword("@10111011qweQWE");
      const isMasked = await loginPage.passwordIsMasked();
      expect(isMasked).to.be.true;
    });

    it("should toggle password visibility when the eye icon is tapped", async () => {
      const el = await loginPage.waitForEl(loginPage.passwordEyeToggle);
      const labelBefore = await el.getAttribute("content-desc");

      await loginPage.enterPassword("@10111011qweQWE");
      let isMasked = await loginPage.passwordIsMasked();
      expect(isMasked).to.be.true;
      expect(labelBefore).to.equal("Show password");

      await loginPage.tapPasswordEyeToggle();

      const el2 = await loginPage.waitForEl(loginPage.passwordEyeToggle);
      const labelAfter = await el2.getAttribute("content-desc");

      isMasked = await loginPage.passwordIsMasked();
      expect(isMasked).to.be.false;
      expect(labelAfter).to.equal("Hide password");
    });
  });

  describe("Credentials rejection", () => {
    it("should show an error for a wrong password", async () => {
      const email = `user.qa.${Date.now()}@example.com`;
      data.email = email;
      const response = await registerPage.registerAndVerifyNewUser(data);
      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.contain("Email verified");
      await loginPage.login(email, "WRONG_pass@1011");
      const signInRejected = await loginPage.isErrorVisible();
      expect(signInRejected).to.be.true;
      const errText = await loginPage.getErrorText();
      expect(errText).to.equal("Invalid email or password");
    });

    it("should show an error for an email that does not exist", async () => {
      const email = `user.qa.${Date.now()}@example.com`;
      await loginPage.login(email, "pass@1011");
      const signInRejected = await loginPage.isErrorVisible();
      expect(signInRejected).to.be.true;
      const errText = await loginPage.getErrorText();
      expect(errText).to.equal("Invalid email or password");
    });

    it("should show an error for a suspended account", async () => {
      const email = `user.qa.${Date.now()}@example.com`;
      data.email = email;
      const response = await registerPage.registerAndVerifyNewUser(data);
      expect(response.status).to.equal(200);
      await loginPage.suspendUser(email);
      await loginPage.login(data.email, data.password);
      const signInRejected = await loginPage.isErrorVisible();
      expect(signInRejected).to.be.true;
      const errText = await loginPage.getErrorText();
      expect(errText).to.equal("Account is locked");
    });

    it("should not navigate away from the login screen on failed login", async () => {
      const email = `user.qa.${Date.now()}@example.com`;
      data.email = email;
      const response = await registerPage.registerAndVerifyNewUser(data);
      expect(response.status).to.equal(200);
      await loginPage.login(data.email, "wrong-password");
      let isLoaded = await confirmPage.isLoaded();
      if (isLoaded) {
        throw new Error("Failed login navigated to confirm page");
      }

      isLoaded = await loginPage.isLoaded();
      if (!isLoaded) {
        throw new Error("Failed login navigated away from page");
      }
    });
  });

  describe("Successful credential submission", () => {
    it("should navigate to the OTP confirm screen after valid credentials", async () => {
      const email = `user.qa.${Date.now()}@example.com`;
      data.email = email;
      const response = await registerPage.registerAndVerifyNewUser(data);
      expect(response.status).to.equal(200);
      await loginPage.login(data.email, data.password);

      let isLoaded = await confirmPage.isLoaded();
      if (!isLoaded) {
        throw new Error("Failed to navigate to confirm page");
      }

      isLoaded = await loginPage.isLoaded();
      if (isLoaded) {
        throw new Error("Failed to navigate away from login page");
      }

      const headerText = await confirmPage.getMainHeaderText();
      expect(headerText).to.equal("Enter your login code");
    });

    it("should display the masked email address on the confirm screen", async () => {
      const email = `user.qa.${Date.now()}@example.com`;
      data.email = email;
      const response = await registerPage.registerAndVerifyNewUser(data);
      expect(response.status).to.equal(200);
      await loginPage.login(data.email, data.password);

      let isLoaded = await confirmPage.isLoaded();
      if (!isLoaded) {
        throw new Error("Failed to navigate to confirm page");
      }

      isLoaded = await loginPage.isLoaded();
      if (isLoaded) {
        throw new Error("Failed to navigate away from login page");
      }

      const infoText = await confirmPage.getInfoText();
      const emailToTest = infoText.split("code to")?.[1];
      const maskedEmail = confirmPage.isMaskedEmail(emailToTest);
      expect(maskedEmail).to.be.true;
    });
  });

  describe("Navigation", () => {
    it("should navigate to the register screen when the register link is tapped", async () => {
      
    });
  });
});
