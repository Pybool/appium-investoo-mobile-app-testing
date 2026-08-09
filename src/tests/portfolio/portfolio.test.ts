import { expect } from 'chai';
import { PortfolioPage } from '../../screens/PortfolioPage';
import { login, resetApp } from '../../helpers/driver';

const portfolioPage = new PortfolioPage();

describe('Portfolio tab', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Screen structure', () => {
    it('should display the portfolio tab', async () => {});
    it('should show total invested amount at the top', async () => {});
    it('should show total current value at the top', async () => {});
    it('should show total return (gain/loss) at the top', async () => {});
  });

  describe('Holdings list', () => {
    it('should display a holding card for each confirmed investment', async () => {});
    it('should show the opportunity name on each holding card', async () => {});
    it('should show the amount invested on each holding card', async () => {});
    it('should show the number of units held on each holding card', async () => {});
    it('should show the current value on each holding card', async () => {});
    it('should show the expected return percentage on each holding card', async () => {});
    it('should show the investment status badge on each card', async () => {});
    it('should show an empty state when the user has no holdings', async () => {});
  });

  describe('Holding detail', () => {
    it('should navigate to the holding detail screen when a holding card is tapped', async () => {});
    it('should display the full opportunity title on the detail screen', async () => {});
    it('should display the investment date', async () => {});
    it('should display units held at the time of the distribution snapshot', async () => {});
    it('should display the expected maturity date', async () => {});
    it('should display distributions received so far', async () => {});
    it('should navigate back to the portfolio list when Back is tapped', async () => {});
  });

  describe('Pull to refresh', () => {
    it('should reload portfolio data on pull-to-refresh', async () => {});
  });

  describe('Money display', () => {
    it('should display amounts in Naira (not kobo)', async () => {});
    it('should format amounts with comma-separated thousands', async () => {});
    it('should show positive returns in green', async () => {});
  });
});
