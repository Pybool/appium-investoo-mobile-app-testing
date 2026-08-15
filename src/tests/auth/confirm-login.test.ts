describe("OTP confirmation", () => {
  beforeEach(async () => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
  });

  it("should display the OTP input field", async () => {});
  it("should show an error for an incorrect OTP", async () => {});
  it("should show an error for an expired OTP", async () => {});
  it("should show a validation error when OTP field is empty on submit", async () => {});
  it("should navigate to the home tab after a correct OTP", async () => {});
  it("should navigate back to the login screen when Use a different account is tapped", async () => {});
});

describe("Navigation", () => {
  it("should navigate to the register screen when the register link is tapped", async () => {});
});
