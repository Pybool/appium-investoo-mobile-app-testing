import { expect } from 'chai';
import { InvestPage } from '../../screens/InvestPage';
import { OpportunityDetailPage } from '../../screens/OpportunityDetailPage';
import { login, resetApp } from '../../helpers/driver';

const investPage = new InvestPage();
const detailPage = new OpportunityDetailPage();

describe('Invest tab > Browse', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Screen structure', () => {
    it('should display the Invest tab with a list of opportunities', async () => {});
    it('should show the header with the notification bell and avatar', async () => {});
  });

  describe('Opportunity cards', () => {
    it('should display at least one opportunity card when data is available', async () => {});
    it('should show the sector badge on each card', async () => {});
    it('should show the projected return range on each card', async () => {});
    it('should show the minimum ticket amount on each card', async () => {});
    it('should show the funding progress percentage', async () => {});
    it('should show the time remaining before subscription closes', async () => {});
    it('should show a "Almost full" badge when funding is above 80%', async () => {});
    it('should disable the invest button on a FUNDED opportunity', async () => {});
  });

  describe('Search', () => {
    it('should filter the list as the user types in the search field', async () => {});
    it('should show an empty state when no opportunities match the search query', async () => {});
    it('should clear the search and restore the full list when the input is cleared', async () => {});
  });

  describe('Sector filter', () => {
    it('should filter the list to HEALTHCARE opportunities only', async () => {});
    it('should filter the list to PHARMA opportunities only', async () => {});
    it('should return to all opportunities when the active filter is tapped again', async () => {});
  });

  describe('Opportunity detail', () => {
    it('should navigate to the opportunity detail screen when a card is tapped', async () => {});
    it('should display the full opportunity title', async () => {});
    it('should display the target raise amount', async () => {});
    it('should display the minimum ticket amount', async () => {});
    it('should display the projected return', async () => {});
    it('should display the tenor in months', async () => {});
    it('should display the subscription deadline', async () => {});
    it('should display the operator name and location', async () => {});
    it('should display the opportunity description', async () => {});
    it('should display the funding progress bar', async () => {});
    it('should navigate back to the invest list when Back is tapped', async () => {});
  });

  describe('Pull to refresh', () => {
    it('should reload the opportunities list on pull-to-refresh', async () => {});
  });
});
