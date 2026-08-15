import { expect } from "chai";
import { LoginPage } from "../../screens/LoginPage";
import { ConfirmLoginPage } from "../../screens/ConfirmLoginPage";
import { HomePage } from "../../screens/HomePage";
import { RegisterPayload } from "../../helpers/api-client";
import { RegisterPage } from "../../screens/RegisterPage";
import { resetApp } from "../../helpers/driver";
import { LandingPage } from "../../screens/LandingPage";
import { waitForRequest } from "../../helpers/mitmLog";
import { recordIfBug } from "../../helpers/bugLogger";

const homePage = new HomePage();
const landingPage = new LandingPage();
const loginPage = new LoginPage();
const registerPage = new RegisterPage();
const confirmPage = new ConfirmLoginPage();

const data: RegisterPayload = {
  email: "",
  password: "Eko@1011",
  firstName: "Emma",
  lastName: "Eko",
  phone: "08100001235",
};

async function reloadLoginPage() {
  await resetApp();
  await landingPage.skipLandingPage();
  const isLoaded = await loginPage.isLoaded();
  if (!isLoaded) {
    throw new Error("Login page failed to load suvcessfully");
  }
}

describe("OTP confirmation", () => {
  beforeEach(async () => {
    reloadLoginPage();
    const email = `user.qa.${Date.now()}@example.com`;
    data.email = email;
    const response = await registerPage.registerAndVerifyNewUser(data);
    expect(response.status).to.equal(200);
    await loginPage.login(data.email, data.password);
  });

  it("should display the OTP input field", async () => {
    const isvisible = await confirmPage.ensureElementVisible(
      confirmPage.otpInput,
    );
    expect(isvisible).to.be.true;
  });

  it("should show an error for an incorrect OTP", async () => {
    await confirmPage.enterOtp("123456");
    await confirmPage.tapSubmit();
    const errorVisible = await confirmPage.isErrorVisible();
    expect(errorVisible).to.be.true;
    const errorText = await confirmPage.getErrorText();
    expect(errorText).to.equal("Invalid or expired login code");
  });

  it("should show an error for an expired OTP", async () => {
    await confirmPage.enterOtp("090000");
    await confirmPage.tapSubmit();
    const errorVisible = await confirmPage.isErrorVisible();
    expect(errorVisible).to.be.true;
    const errorText = await confirmPage.getErrorText();
    expect(errorText).to.equal("Invalid or expired login code");
  });

  it("should not be able to submit when OTP field is empty", async () => {
    const submitEnabled = await confirmPage.submitEnabled();
    expect(submitEnabled).to.be.false;
  });

  it("should navigate to the home tab after a correct OTP", async () => {
    await confirmPage.enterOtp("000000");
    await confirmPage.tapSubmit();
    const homePageLoaded = await homePage.isLoaded();
    console.log("homePageLoaded => ", homePageLoaded);
    expect(homePageLoaded).to.be.true;
  });

  it("should navigate back to the login screen when Use a different account is tapped", async () => {
    await confirmPage.tapBack();
    const isLoaded = await loginPage.isLoaded();
    if (!isLoaded) {
      throw new Error("Failed to navigate to login page");
    }
  });

  it.only("should be able to resend otp code and countdown should begin", async () => {
    await confirmPage.tapResend();
    const resendOtpCall = await waitForRequest(
      "POST",
      "/api/auth/resend-verification", // this is even wrong sha o, we havent made an endpoint for this, maybe latwr
    );
    console.log("resendOtpCall ==> ",resendOtpCall)
    recordIfBug({
      suite: "Auth > OTP confirmation",
      field: "resendOtp",
      scenario: "tap Resend code on login OTP screen",
      input: "tapResend()",
      expected: "200",
      actual: resendOtpCall ? String(resendOtpCall.status) : "no request sent",
      notes:
        "clicking the 'Resend otp' button never calls the backend, it just resets the local countdown and shows a success toast claiming a new code was sent. There is also no dedicated login-OTP-resend endpoint in AuthController at all, only /auth/resend-verification which is gated on !user.isEmailVerified() and belongs to the registration/email-verification flow.",
    });
    expect(resendOtpCall).to.not.be.undefined;
    expect(resendOtpCall?.status).to.equal(200);

    const isEnabled = await confirmPage.resendButtonEnabled();
    const resendButtonText1 = await confirmPage.getResendButtonText();
    expect(isEnabled).to.be.false;
    expect(resendButtonText1).to.contain('Resend code in');
    await driver.pause(1000);
    const resendButtonText2 = await confirmPage.getResendButtonText();
    expect(resendButtonText1).to.not.equal(resendButtonText2);
  });
});
