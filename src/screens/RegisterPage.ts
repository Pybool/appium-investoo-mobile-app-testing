import { BasePage } from "./BasePage";

export type FieldCase = {
  label: string;
  value: string;
  expected: string;
  notes?: string;
};
export type NameCase = {
  label: string;
  value: string;
  shouldError: boolean;
  notes?: string;
};

export class RegisterPage extends BasePage {
  readonly screen = "~register-screen";
  readonly firstNameInput = "~register-firstname-input";
  readonly lastNameInput = "~register-lastname-input";
  readonly emailInput = "~register-email-input";
  readonly passwordInput = "~register-password-input";
  readonly phoneInput = "~register-phone-input";
  readonly termsCheckbox = "~register-terms-checkbox";
  readonly acceptTermsErrorText = "~register-field-error-agree";
  readonly submitButton = "~register-submit-button";
  readonly loginLink = "~register-login-link";
  readonly errorMessage = "~register-error-message";

  fieldError(field: string) {
    return `~register-field-error-${field}`;
  }

  private get requiredFields() {
    return [
      { name: "firstNameInput", selector: this.firstNameInput },
      { name: "lastNameInput", selector: this.lastNameInput },
      { name: "emailInput", selector: this.emailInput },
      { name: "passwordInput", selector: this.passwordInput },
      { name: "phoneInput", selector: this.phoneInput },
      { name: "termsCheckbox", selector: this.termsCheckbox },
      { name: "submitButton", selector: this.submitButton },
    ];
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async isFieldReady(selector: string) {
    return this.ready(selector);
  }

  async areAllFieldsReady(): Promise<boolean> {
    let allReady = true;
    for (const { name, selector } of this.requiredFields) {
      const ready = await this.ready(selector);
      console.log(`  [areAllFieldsReady] ${name}:`, ready);
      if (!ready) allReady = false;
    }
    return allReady;
  }

  async enterFirstName(value: string) {
    await this.type(this.firstNameInput, value);
  }

  async enterLastName(value: string) {
    await this.type(this.lastNameInput, value);
  }

  async enterEmail(value: string) {
    await this.type(this.emailInput, value);
  }

  async enterPassword(value: string) {
    await this.type(this.passwordInput, value);
  }

  async enterPhone(value: string) {
    await this.type(this.phoneInput, value);
  }

  async acceptTerms() {
    await this.tap(this.termsCheckbox);
  }

  async tapSubmit() {
    await this.tap(this.submitButton);
  }

  async tapLoginLink() {
    await this.tap(this.loginLink);
  }

  async ensureLoginLink() {
    return await this.ready(this.loginLink);
  }

  async ensureTermsCheckBox() {
    return await this.ready(this.termsCheckbox);
  }

  async getLoginLinkText() {
    return this.readLabel(this.loginLink);
  }

  async getTermsAndConditionsText() {
    return this.readLabel(this.termsCheckbox);
  }

  async getErrorText() {
    return this.read(this.errorMessage);
  }

  async isErrorVisible() {
    return this.visible(this.errorMessage);
  }


  async getFieldErrorText(fieldName: string) {
    return this.read(this.fieldError(fieldName));
  }

  static readonly EMAIL_CASES: FieldCase[] = [
    { label: "empty string", value: "", expected: "Enter a valid email" },
    {
      label: "no @ or domain",
      value: "plainaddress",
      expected: "Enter a valid email",
    },
    {
      label: "missing local part",
      value: "@missinglocal.com",
      expected: "Enter a valid email",
    },
    {
      label: "missing domain",
      value: "missingdomain@",
      expected: "Enter a valid email",
    },
    {
      label: "missing TLD",
      value: "missingtld@domain",
      expected: "Enter a valid email",
    },
    {
      label: "double @",
      value: "two@@symbols.com",
      expected: "Enter a valid email",
    },
    {
      label: "multiple @",
      value: "user@domain@domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "space in local part",
      value: "user name@domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "space in domain",
      value: "user@domain .com",
      expected: "Enter a valid email",
    },
    {
      label: "leading space",
      value: " user@domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "trailing space",
      value: "user@domain.com ",
      expected: "Enter a valid email",
    },
    {
      label: "consecutive dots in local part",
      value: "user..name@domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "leading dot in local part",
      value: ".user@domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "trailing dot before @",
      value: "user.@domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "domain starts with hyphen",
      value: "user@-domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "domain segment ends with hyphen",
      value: "user@domain-.com",
      expected: "Enter a valid email",
      notes:
        'A leading hyphen in the domain is correctly rejected ("user@-domain.com"), but a trailing hyphen before the dot is not ("user@domain-.com"). Likely an asymmetric quirk in Zod v3\'s built-in email() regex (app/(auth)/register.tsx), not custom validation logic in this codebase.',
    },
    {
      label: "consecutive dots in domain",
      value: "user@domain..com",
      expected: "Enter a valid email",
    },
    {
      label: "domain starts with dot",
      value: "user@.domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "comma instead of dot",
      value: "user@domain,com",
      expected: "Enter a valid email",
    },
    {
      label: "angle brackets / injection-shaped input",
      value: "user<script>@domain.com",
      expected: "Enter a valid email",
    },
    {
      label: "emoji in local part",
      value: "😀@domain.com",
      expected: "Enter a valid email",
    },
    ...[254, 255, 256].map((total) => {
      const domain = "@example.com";
      const local = "a".repeat(total - domain.length);
      return {
        label: `${total}-character email`,
        value: local + domain,
        expected: "",
        notes:
          "Neither the client Zod schema nor the backend RegisterRequest enforce a max email length, despite users.email being VARCHAR(255) in the DB. An email this long passes both validation layers and would only fail at the DB with a truncation/constraint error, not a clean 400.",
      };
    }),
  ];

  static readonly NAME_CASES: NameCase[] = [
    { label: "empty string", value: "", shouldError: true },
    { label: "single character", value: "A", shouldError: true },
    {
      label: "exactly 2 characters (minimum valid length)",
      value: "Jo",
      shouldError: false,
    },
    {
      label: "two spaces (whitespace-only)",
      value: "  ",
      shouldError: false,
      notes:
        "Zod's min(2) checks raw string length before the onSubmit handler's own .trim() runs, so whitespace-only input passes client validation, then gets trimmed to '' right before hitting the backend, which DOES reject blank names (@NotBlank on RegisterRequest) — the user clears client validation and then hits a less-friendly server error.",
    },
    {
      label: "101 characters",
      value: "A".repeat(101),
      shouldError: false,
      notes:
        "The client has no upper bound at all, while the backend caps at 100 chars (@Size(max=100)) — a long name passes client-side and is only caught server-side with no upfront client feedback.",
    },
    {
      label: "contains a digit",
      value: "John3",
      shouldError: true,
      notes:
        "The 'no special characters' requirement is not enforced anywhere: the client schema (min(2) only) and the backend (@NotBlank @Size(min=2,max=100)) have no character-restriction regex.",
    },
    {
      label: "contains a symbol (!)",
      value: "John!",
      shouldError: true,
      notes:
        "Same gap as the digit case — no character-type restriction on name fields.",
    },
    {
      label: "contains an @ symbol",
      value: "John@Doe",
      shouldError: true,
      notes:
        "Same gap as the digit case — no character-type restriction on name fields.",
    },
    {
      label: "contains an underscore",
      value: "John_Doe",
      shouldError: true,
      notes:
        "Same gap as the digit case — no character-type restriction on name fields.",
    },
    {
      label: "contains angle brackets / injection-shaped input",
      value: "<script>",
      shouldError: true,
      notes:
        "Same gap as the digit case — no character-type restriction on name fields; also worth confirming this is not a stored-XSS concern if ever rendered unescaped elsewhere.",
    },
    {
      label: "contains an emoji",
      value: "😀ohn",
      shouldError: true,
      notes:
        "Same gap as the digit case — no character-type restriction on name fields.",
    },
    {
      label: 'hyphenated name (e.g. "Mary-Jane")',
      value: "Mary-Jane",
      shouldError: false,
    },
    {
      label: 'name with an apostrophe (e.g. "O\'Brien")',
      value: "O'Brien",
      shouldError: false,
    },
  ];

  static readonly PASSWORD_CASES: FieldCase[] = [
    { label: "empty string", value: "", expected: "At least 8 characters" },
    {
      label: "7 characters (one below minimum)",
      value: "Pass12x",
      expected: "At least 8 characters",
    },
    {
      label: "no uppercase letter",
      value: "password1",
      expected: "Add one uppercase letter",
    },
    { label: "no digit", value: "NoDigitsHere", expected: "Add one number" },
    {
      label: "exactly 8 characters (minimum valid length)",
      value: "Pass123x",
      expected: "",
    },
    {
      label: 'no lowercase letter (e.g. "PASSWORD1")',
      value: "PASSWORD1",
      expected: "",
      notes:
        "The backend requires lowercase AND uppercase AND digit (RegisterRequest.java regex), but the client only checks for uppercase and digit — never lowercase. An all-uppercase password with a digit passes client-side and would only be rejected server-side.",
    },
    {
      label: "129 characters (exceeds backend max 128)",
      value: "Aa1" + "x".repeat(126),
      expected: "",
      notes:
        "The client has no upper bound, while the backend caps at 128 chars (@Size(max=128)) — no client-side cap.",
    },
  ];

  private async fillValidDefaultsExcept(
    field: "firstName" | "lastName" | "email" | "password",
  ): Promise<void> {
    if (field !== "firstName") await this.enterFirstName("Test");
    if (field !== "lastName") await this.enterLastName("User");
    if (field !== "email")
      await this.enterEmail(`valid.${Date.now()}@example.com`);
    if (field !== "password") await this.enterPassword("ValidPass123");
  }

  async checkFieldValidation(
    field: "firstName" | "lastName" | "email" | "password",
    value: string,
  ): Promise<string> {
    await this.fillValidDefaultsExcept(field);
    if (field === "firstName") await this.enterFirstName(value);
    else if (field === "lastName") await this.enterLastName(value);
    else if (field === "email") await this.enterEmail(value);
    else await this.enterPassword(value);
    await this.tapSubmit();
    return this.getFieldErrorText(field).catch(() => "");
  }

  async getText(selector: string) {
    return this.read(selector);
  }

  async fillFields(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    await this.enterFirstName(data.firstName);
    await this.enterLastName(data.lastName);
    await this.enterEmail(data.email);
    await this.enterPassword(data.password);
    if (data.phone) await this.enterPhone(data.phone);
  }

  async fillAndSubmit(
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone?: string;
    },
    acceptTerms: boolean = true,
  ) {
    await this.fillFields(data);
    if (acceptTerms) {
      await this.acceptTerms();
    }
    await this.tapSubmit();
  }
}
