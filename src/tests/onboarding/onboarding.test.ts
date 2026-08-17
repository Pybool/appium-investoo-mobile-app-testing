import { expect } from "chai";
import { LandingPage } from "../../screens/LandingPage";
import { OnboardingPage } from "../../screens/OnboardingPage";
import { LoginPage } from "../../screens/LoginPage";
import { RegisterPage } from "../../screens/RegisterPage";
import { getPixel, resetApp } from "../../helpers/driver";

const landingPage = new LandingPage();
const onboardingPage = new OnboardingPage();
const loginPage = new LoginPage();
const registerPage = new RegisterPage();

describe("Onboarding", () => {
  before(async () => {
    await resetApp();
  });

  describe("Landing screen", () => {
    it("should display the landing screen on first launch", async () => {
      const isloaded = await landingPage.isLoaded();
      expect(isloaded).to.be.true;
    });

    it("should show the brand headline", async () => {
      const headlineVisible = await landingPage.elementVisible(
        landingPage.headline,
      );
      expect(headlineVisible).to.be.true;
      const headlineText = await landingPage.getHeadlineText();
      expect(headlineText).to.contain("Own a piece of");
      expect(headlineText).to.contain("real businesses");
    });

    it("should show the Get Started button", async () => {
      const getStartedBtnVisible = await landingPage.elementVisible(
        landingPage.getStartedButton,
      );
      expect(getStartedBtnVisible).to.be.true;
      const getStartedButtonText = await landingPage.getGetStartedButtonText();
      expect(getStartedButtonText).to.equal("Get started");
      const getStartedButtonInnerText =
        await landingPage.getGetStartedButtonInnerText();
      expect(getStartedButtonInnerText).to.equal("Get started");
    });

    it("should show the Log in link for returning users", async () => {
      const loginLinkVisible = await landingPage.elementVisible(
        landingPage.loginLink,
      );
      expect(loginLinkVisible).to.be.true;
      const loginLinkText = await landingPage.getLoginLinkText();
      expect(loginLinkText).to.equal("I already have an account  Log in");
    });

    it("should navigate to the onboarding carousel when Get Started is tapped", async () => {
      await landingPage.tapGetStarted();
      const isloaded = await onboardingPage.isLoaded();
      expect(isloaded).to.be.true;
    });

    it("should navigate to the login screen when Log in is tapped", async () => {
      await landingPage.tapLogin();
      const isloaded = await loginPage.isLoaded();
      expect(isloaded).to.be.true;
    });

    it.only("should toggle between light and dark mode", async () => {
      // const before = await getPixel(20, 20);
      // await landingPage.tapThemeToggle();
      // await driver.pause(500); // let the re-render settle
      // const after = await getPixel(20, 20);
      // console.log("Before ==> ", before, "After ==> ", after)

      // expect(before).to.not.deep.equal(after); 


    });
  });

  describe("Onboarding carousel navigation", () => {
    before(async () => {
      await landingPage.tapGetStarted();
    });

    it("should display the first slide on entry", async () => {
      
    });
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
