import { expect } from 'chai';
import { HomePage } from '../../screens/HomePage';
import { OpportunityDetailPage } from '../../screens/OpportunityDetailPage';
import { ProfilePage } from '../../screens/ProfilePage';
import { login, resetApp } from '../../helpers/driver';

const homePage = new HomePage();
const opportunityDetail = new OpportunityDetailPage();
const profilePage = new ProfilePage();

describe('Home tab', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Screen structure', () => {
    it('should display the home screen after login', async () => {});
    it('should show a personalised greeting with the user first name', async () => {});
    it('should display the wallet balance card', async () => {});
    it('should show the notification bell icon in the header', async () => {});
    it('should show the avatar / ME button in the header', async () => {});
  });

  describe('Stats section', () => {
    it('should display the total AUM stat card', async () => {});
    it('should display the average return stat card', async () => {});
    it('should display the active investors stat card', async () => {});
  });

  describe('Opportunities list', () => {
    it('should display a list of live investment opportunities', async () => {});
    it('should show the opportunity title on each card', async () => {});
    it('should show the projected return on each card', async () => {});
    it('should show the funding progress bar on each card', async () => {});
    it('should show the days remaining on each card', async () => {});
    it('should navigate to opportunity detail when a card is tapped', async () => {});
    it('should show an empty state when there are no live opportunities', async () => {});
  });

  describe('Pull to refresh', () => {
    it('should refresh the opportunity list on pull-to-refresh', async () => {});
    it('should refresh the wallet balance on pull-to-refresh', async () => {});
  });

  describe('Header actions', () => {
    it('should navigate to notifications when the bell is tapped', async () => {});
    it('should navigate to the profile tab when the avatar is tapped', async () => {});
    it('should show an unread badge on the bell when there are unread notifications', async () => {});
  });
});
