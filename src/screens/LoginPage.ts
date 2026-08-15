import { adminSuspendUserByEmail, loginAsAdmin } from "../helpers/api-client";
import { EmailCases, FieldCase } from "../helpers/constants";
import { BasePage } from "./BasePage";

const DEFAULT_TIMEOUT = 10_000;

export class LoginPage extends BasePage {
  readonly screen = "~login-screen";
  readonly emailInput = "~login-email-input";
  readonly passwordInput = "~login-password-input";
  readonly submitButton = "~login-submit-button";
  readonly registerLink = "~login-register-link";
  readonly errorMessage = "~login-error-message";
  readonly emailValidationError =
    'android=new UiSelector().text("Enter a valid email")';

  readonly passwordValidationError =
    'android=new UiSelector().text("Enter your password")';

  readonly passwordEyeToggle =
    'android=new UiSelector().resourceId("login-password-input").fromParent(new UiSelector().className("android.widget.Button"))';

  fieldError(field: string) {
    if (field === "email") return this.emailValidationError;
    return this.passwordValidationError;
  }

  async isLoaded() {
    return this.visible(this.screen, DEFAULT_TIMEOUT);
  }

  async enterEmail(email: string) {
    await this.type(this.emailInput, email);
  }

  async enterPassword(password: string) {
    await this.type(this.passwordInput, password);
  }

  async ensureElementVisible(selector: string): Promise<boolean> {
    return await this.visible(selector, DEFAULT_TIMEOUT);
  }

  async ensureEmailField() {
    return await this.ready(this.emailInput);
  }

  async ensurePasswordField() {
    return await this.ready(this.passwordInput);
  }

  async tapSubmit() {
    await this.tap(this.submitButton);
  }

  async tapCreateAccount() {
    await this.tap(this.registerLink);
  }

  async tapPasswordEyeToggle() {
    await this.tap(this.passwordEyeToggle);
  }

  async getErrorText() {
    return this.read(this.errorMessage);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.tapSubmit();
  }

  async getFieldErrorText(fieldName: string) {
    return this.read(this.fieldError(fieldName));
  }

  async clearInputField(selector: string) {
    return await this.clearTextField(selector);
  }

  async isEnabled(selector: string) {
    return await this.enabled(selector);
  }

  async passwordIsMasked() {
    const el = await this.waitFor(this.passwordInput);
    const isMasked = (await el.getAttribute("password")) === "true";
    return isMasked;
  }

  static readonly EMAIL_CASES: FieldCase[] = EmailCases;

  async checkFieldValidation(
    field: "firstName" | "lastName" | "email" | "password",
    value: string,
  ): Promise<string> {
    if (field === "email") await this.enterEmail(value);
    else await this.enterPassword(value);
    await this.tapSubmit();
    return this.getFieldErrorText(field).catch(() => "");
  }

  async waitForEl(selector: string) {
    return await this.waitFor(selector);
  }

  async suspendUser(email: string) {
    const adminTokens = await loginAsAdmin();
    console.log("admin login: ok, role:", adminTokens.user.role);

    const suspendResult = await adminSuspendUserByEmail(
      email,
      adminTokens.accessToken,
    );
    console.log(
      "suspend status:",
      suspendResult.status,
      "new status:",
      suspendResult.body.data?.status,
    );
  }
}
