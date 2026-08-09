import { expect } from "chai";
import { LandingPage } from "../../screens/LandingPage";
import { OnboardingPage } from "../../screens/OnboardingPage";
import { LoginPage } from "../../screens/LoginPage";
import { RegisterPage } from "../../screens/RegisterPage";
import { resetApp } from "../../helpers/driver";

const landing = new LandingPage();
const onboarding = new OnboardingPage();
const loginPage = new LoginPage();
const registerPage = new RegisterPage();

describe("Onboarding", () => {
  before(async () => {
    await resetApp();
  });

  describe("Landing screen", () => {
    it.only("should display the landing screen on first launch", async () => {
      
    });
    it("should show the brand headline", async () => {});
    it("should show the Get Started button", async () => {});
    it("should show the Log in link for returning users", async () => {});
    it("should navigate to the onboarding carousel when Get Started is tapped", async () => {});
    it("should navigate to the login screen when Log in is tapped", async () => {});
    it("should toggle between light and dark mode", async () => {});
  });

  describe("Onboarding carousel navigation", () => {
    before(async () => {
      await landing.tapGetStarted();
    });

    it("should display the first slide on entry", async () => {});
    it("should advance to the second slide when Next is tapped", async () => {});
    it("should advance to the third slide when Next is tapped", async () => {});
    it("should advance to the fourth slide when Next is tapped", async () => {});
    it("should advance to the next slide when swiped left", async () => {});
    it("should go back to the previous slide when swiped right", async () => {});
    it("should hide the Skip button on the last slide", async () => {});
    it("should update the active pagination dot as slides change", async () => {});
  });

  describe("Slide content", () => {
    it('slide 1: should show eyebrow "Start small"', async () => {});
    it("slide 1: should show the minimum ticket amount in the title", async () => {});
    it('slide 2: should show eyebrow "Real businesses"', async () => {});
    it('slide 3: should show eyebrow "Protected & transparent"', async () => {});
    it('slide 4: should show eyebrow "Everything in one place"', async () => {});
    it("slide 4: should display all 4 feature chips", async () => {});
    it("slide 4: feature chips should be arranged in a 2x2 grid (not stacked)", async () => {});
    it('slide 4: feature chip "Invest from ₦5,000" should be visible', async () => {});
    it('slide 4: feature chip "Vote on big decisions" should be visible', async () => {});
    it('slide 4: feature chip "Quarterly payouts" should be visible', async () => {});
    it('slide 4: feature chip "SEC-regulated SPVs" should be visible', async () => {});
  });

  describe("Last slide CTAs", () => {
    it("should display the Create free account button on the last slide", async () => {});
    it("should display the Log in link on the last slide", async () => {});
    it("should navigate to the register screen when Create free account is tapped", async () => {});
    it("should navigate to the login screen when Log in is tapped", async () => {});
  });

  describe("Skip behaviour", () => {
    it("should navigate to the login screen when Skip is tapped on any slide", async () => {});
    it("should skip from slide 1 directly", async () => {});
    it("should skip from slide 2 directly", async () => {});
  });
});
