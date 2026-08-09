import { expect } from "chai";
import { RegisterPage } from "../../screens/RegisterPage";
import { LoginPage } from "../../screens/LoginPage";
import { resetApp } from "../../helpers/driver";
import { LandingPage } from "../../screens/LandingPage";
import { recordIfBug } from "../../helpers/bugLogger";

const registerPage = new RegisterPage();
const loginPage = new LoginPage();
const landingPage = new LandingPage();

describe("Auth > Register", () => {
  beforeEach(async () => {
    await resetApp();
    await landingPage.skipLandingPage();
    await loginPage.tapCreateAccount();
    const isLoaded = await registerPage.isLoaded();
    if (!isLoaded) {
      throw new Error("Register page failed to load suvcessfully");
    }
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

    describe.only("password validation ", async () => {
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

    it("should require the terms checkbox to be checked before submitting", async () => {});
  });

  describe("Email uniqueness", () => {
    it("should show an error when the email is already registered", async () => {});
  });

  describe("@smoke Successful registration", () => {
    it("should navigate to email verification screen on valid submission", async () => {});
    it("should show the submitted email address on the verification screen", async () => {});
  });

  describe("Navigation", () => {
    it("should navigate to the login screen when the login link is tapped", async () => {});
  });
});
