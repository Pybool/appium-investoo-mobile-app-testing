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

  const commonScript = async (data: {
    index: number;
    eyebrowText: string;
    title: string;
    isSwipeAction?: boolean;
  }) => {
    if (data.index > 0 && !data.isSwipeAction) {
      await onboardingPage.tapNext(data.index);
    }
    const eyeBrowText = await onboardingPage.getEyebrowText();
    const slideTitleText = await onboardingPage.getTitleText();
    expect(eyeBrowText).to.equal(data.eyebrowText);
    expect(slideTitleText).to.equal(data.title);
    onboardingPage.dotAt(data.index);
    if (data.index < 3) {
      let isNextButtonVisible = await onboardingPage.isNextButtonVisible();
      let isSkipIntroVisible = await onboardingPage.isSkipIntroVisible();
      expect(isNextButtonVisible).to.be.true;
      expect(isSkipIntroVisible).to.be.true;
    } else {
      let isNextButtonNotVisible =
        await onboardingPage.isNextButtonNotVisible();
      let isSkipIntroNotVisible = await onboardingPage.isSkipIntroNotVisible();
      const isCreateAccountButtonVisible =
        await onboardingPage.isCreateAccountButtonVisible();
      expect(isNextButtonNotVisible).to.be.true;
      expect(isSkipIntroNotVisible).to.be.true;
      expect(isCreateAccountButtonVisible).to.be.true;
    }
  };

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

    it("should toggle between light and dark mode", async () => {
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
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
    });

    it("should advance to the second slide when Next is tapped", async () => {
      await commonScript({
        index: 1,
        eyebrowText: "REAL BUSINESSES",
        title: "Back productive Nigerian businesses",
      });
    });

    it("should advance to the third slide when Next is tapped", async () => {
      await commonScript({
        index: 2,
        eyebrowText: "PROTECTED & TRANSPARENT",
        title: "Earn distributions, paid to your wallet",
      });
    });

    it("should advance to the fourth slide when Next is tapped", async () => {
      await commonScript({
        index: 3,
        eyebrowText: "EVERYTHING IN ONE PLACE",
        title: "Invest, vote, track, withdraw",
      });
    });

    it("should advance to the next slide when swiped left", async () => {
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
      await onboardingPage.swipeToNextSlide();
      await commonScript({
        index: 1,
        eyebrowText: "REAL BUSINESSES",
        title: "Back productive Nigerian businesses",
        isSwipeAction: true,
      });
      await onboardingPage.swipeToNextSlide(1);
      await commonScript({
        index: 2,
        eyebrowText: "PROTECTED & TRANSPARENT",
        title: "Earn distributions, paid to your wallet",
        isSwipeAction: true,
      });
      await onboardingPage.swipeToNextSlide(2);
      await commonScript({
        index: 3,
        eyebrowText: "EVERYTHING IN ONE PLACE",
        title: "Invest, vote, track, withdraw",
        isSwipeAction: true,
      });
    });

    it("should go back to the previous slide when swiped right", async () => {
      //take note that our slidding starts from index 0
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });

      await onboardingPage.swipeToNextSlide();

      await commonScript({
        index: 1,
        eyebrowText: "REAL BUSINESSES",
        title: "Back productive Nigerian businesses",
        isSwipeAction: true,
      });

      await onboardingPage.swipeToPreviousSlide();

      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
      //One slide pass completed i.e swipe from slide 0 to slide 1 and back sucvessfully

      await onboardingPage.swipeToNextSlide(1); //we ensure we can slide from the slide 1 to slide 2
      //( this slide command above just makes us start from slide 1, we havent started yet)

      await commonScript({
        index: 1,
        eyebrowText: "REAL BUSINESSES",
        title: "Back productive Nigerian businesses",
        isSwipeAction: true,
      });
      await onboardingPage.swipeToNextSlide();

      await commonScript({
        index: 2,
        eyebrowText: "PROTECTED & TRANSPARENT",
        title: "Earn distributions, paid to your wallet",
        isSwipeAction: true,
      });

      await onboardingPage.swipeToPreviousSlide();
      await commonScript({
        index: 1,
        eyebrowText: "REAL BUSINESSES",
        title: "Back productive Nigerian businesses",
        isSwipeAction: true,
      });
      //Another slide pass completed i.e swipe from slide 1 to slide 2 and back sucvessfully

      await onboardingPage.swipeToNextSlide(1); //we ensure we can slide from the slide 2 to slide 3
      //( this slide command above just makes us start from slide 2, we havent started yet bro)

      await commonScript({
        index: 2,
        eyebrowText: "PROTECTED & TRANSPARENT",
        title: "Earn distributions, paid to your wallet",
        isSwipeAction: true,
      });
      await onboardingPage.swipeToNextSlide();
      await commonScript({
        index: 3,
        eyebrowText: "EVERYTHING IN ONE PLACE",
        title: "Invest, vote, track, withdraw",
        isSwipeAction: true,
      });
      await onboardingPage.swipeToPreviousSlide();
      await commonScript({
        index: 2,
        eyebrowText: "PROTECTED & TRANSPARENT",
        title: "Earn distributions, paid to your wallet",
        isSwipeAction: true,
      });
    });

    it("should ensurre that users can swipe to the end and back in one pass for each case", async () => {
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
      await onboardingPage.swipeToNextSlide(3);
      await commonScript({
        index: 3,
        eyebrowText: "EVERYTHING IN ONE PLACE",
        title: "Invest, vote, track, withdraw",
        isSwipeAction: true,
      });
      await onboardingPage.swipeToPreviousSlide(3);
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
    });

    it("should hide the Skip button on the last slide", async () => {
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
      await onboardingPage.swipeToNextSlide(3);
      await commonScript({
        index: 3,
        eyebrowText: "EVERYTHING IN ONE PLACE",
        title: "Invest, vote, track, withdraw",
        isSwipeAction: true,
      });
      let isSkipIntroNotVisible = await onboardingPage.isSkipIntroNotVisible();
      expect(isSkipIntroNotVisible).to.be.true;
    });

    it("should update the active pagination dot as slides change", async () => {
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });

      for (let activeIndex = 0; activeIndex < 4; activeIndex++) {
        if (activeIndex > 0) {
          await onboardingPage.swipeToNextSlide();
          await driver.pause(400);
        }
        const widths = await onboardingPage.getAllDotWidths();
        const widestIndex = widths.indexOf(Math.max(...widths));
        expect(widestIndex).to.equal(
          activeIndex,
          `expected dot ${activeIndex} to be widest, widths were ${widths}`,
        );
      }
    });
  });

  describe("Slide content", () => {
    beforeEach(async () => {
      await resetApp();
      await landingPage.tapGetStarted();
    });

    it('slide 1: should show eyebrow "Start small"', async () => {
      const eyeBrowText = await onboardingPage.getEyebrowText();
      expect(eyeBrowText).to.equal("START SMALL");
    });

    it("slide 1: should show the minimum ticket amount in the title", async () => {
      const slideTitleText = await onboardingPage.getTitleText();
      expect(slideTitleText).to.contain("₦5,000");
    });

    it('slide 2: should show eyebrow "Real businesses"', async () => {
      await onboardingPage.tapNext(1);
      const eyeBrowText = await onboardingPage.getEyebrowText();
      expect(eyeBrowText).to.equal("REAL BUSINESSES");
    });

    it('slide 3: should show eyebrow "Protected & transparent"', async () => {
      await onboardingPage.tapNext(2);
      const eyeBrowText = await onboardingPage.getEyebrowText();
      expect(eyeBrowText).to.equal("PROTECTED & TRANSPARENT");
    });

    it('slide 4: should show eyebrow "Everything in one place"', async () => {
      await onboardingPage.tapNext(3);
      const eyeBrowText = await onboardingPage.getEyebrowText();
      expect(eyeBrowText).to.equal("EVERYTHING IN ONE PLACE");
    });

    it("slide 4: should display all 4 feature chips", async () => {
      await onboardingPage.tapNext(3);
      for (let i = 0; i < 4; i++) {
        const isVisible = await onboardingPage.isFeatureChipVisible(i);
        expect(isVisible).to.be.true;
      }
    });

    it("slide 4: feature chips should be arranged in a 2x2 grid (not stacked)", async () => {
      await onboardingPage.tapNext(3);
      const loc0 = await onboardingPage.getFeatureChipLocation(0);
      const loc1 = await onboardingPage.getFeatureChipLocation(1);
      const loc2 = await onboardingPage.getFeatureChipLocation(2);
      const loc3 = await onboardingPage.getFeatureChipLocation(3);
      expect(loc0.y).to.equal(loc1.y);
      expect(loc2.y).to.equal(loc3.y);
      expect(loc0.x).to.not.equal(loc1.x);
      expect(loc2.x).to.not.equal(loc3.x);
      expect(loc2.y).to.be.greaterThan(loc0.y);
    });

    it('slide 4: feature chip "Invest from ₦5,000" should be visible', async () => {
      await onboardingPage.tapNext(3);
      const text = await onboardingPage.getFeatureChipText(0);
      expect(text).to.equal("Invest from ₦5,000");
    });

    it('slide 4: feature chip "Vote on big decisions" should be visible', async () => {
      await onboardingPage.tapNext(3);
      const text = await onboardingPage.getFeatureChipText(1);
      expect(text).to.equal("Vote on big decisions");
    });

    it('slide 4: feature chip "Quarterly payouts" should be visible', async () => {
      await onboardingPage.tapNext(3);
      const text = await onboardingPage.getFeatureChipText(2);
      expect(text).to.equal("Quarterly payouts");
    });

    it('slide 4: feature chip "SEC-regulated SPVs" should be visible', async () => {
      await onboardingPage.tapNext(3);
      const text = await onboardingPage.getFeatureChipText(3);
      expect(text).to.equal("SEC-regulated SPVs");
    });
  });

  describe("Last slide CTAs", () => {
    beforeEach(async () => {
      await resetApp();
      await landingPage.tapGetStarted();
    });

    it("should display the Create free account button on the last slide", async () => {
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
      await onboardingPage.swipeToNextSlide(3);
      await commonScript({
        index: 3,
        eyebrowText: "EVERYTHING IN ONE PLACE",
        title: "Invest, vote, track, withdraw",
        isSwipeAction: true,
      });
      const isCreateAccountButtonVisible =
        await onboardingPage.isCreateAccountButtonVisible();
      expect(isCreateAccountButtonVisible).to.be.true;
    });

    it("should display the Log in link on the last slide", async () => {
      await commonScript({
        index: 0,
        eyebrowText: "START SMALL",
        title: "Grow wealth from just ₦5,000",
      });
      await onboardingPage.swipeToNextSlide(3);
      await commonScript({
        index: 3,
        eyebrowText: "EVERYTHING IN ONE PLACE",
        title: "Invest, vote, track, withdraw",
        isSwipeAction: true,
      });
      const isLoginLinkVisible = await onboardingPage.isLoginLinkVisible();
      expect(isLoginLinkVisible).to.be.true;
    });

    it("should navigate to the register screen when Create free account is tapped", async () => {
      await onboardingPage.swipeToNextSlide(4);
      await onboardingPage.tapCreateAccount();
      const isRegisterScreenLoaded = await registerPage.isLoaded();
      expect(isRegisterScreenLoaded).to.be.true;
    });

    it("should navigate to the login screen when Log in is tapped", async () => {
      await onboardingPage.swipeToNextSlide(4);
      await onboardingPage.tapLogin();
      const isloginScreenLoaded = await loginPage.isLoaded();
      expect(isloginScreenLoaded).to.be.true;
    });
  });

  describe("Skip behaviour", () => {
    beforeEach(async () => {
      await resetApp();
      await landingPage.tapGetStarted();
    });

    it("should navigate to the login screen when Skip is tapped on any slide", async () => {
      await onboardingPage.tapNext(2);
      await onboardingPage.tapSkip();
      const isLoaded = await loginPage.isLoaded();
      expect(isLoaded).to.be.true;
    });

    it("should skip from slide 1 directly", async () => {
      await onboardingPage.tapSkip();
      const isLoaded = await loginPage.isLoaded();
      expect(isLoaded).to.be.true;
    });

    it("should skip from slide 2 directly", async () => {
      await onboardingPage.tapNext(1);
      await onboardingPage.tapSkip();
      const isLoaded = await loginPage.isLoaded();
      expect(isLoaded).to.be.true;
    });
  });
});
