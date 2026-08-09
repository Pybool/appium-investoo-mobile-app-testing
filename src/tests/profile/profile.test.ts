import { expect } from 'chai';
import { ProfilePage } from '../../screens/ProfilePage';
import { LoginPage } from '../../screens/LoginPage';
import { login, resetApp } from '../../helpers/driver';

const profilePage = new ProfilePage();
const loginPage = new LoginPage();

describe('Profile tab', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Screen structure', () => {
    it('should display the profile screen', async () => {});
    it('should display the user full name', async () => {});
    it('should display the user email address', async () => {});
    it('should display the KYC tier badge', async () => {});
    it('should display the avatar initials or photo', async () => {});
  });

  describe('Profile menu rows', () => {
    it('should display the Personal Information row', async () => {});
    it('should display the KYC Verification row', async () => {});
    it('should display the Linked Banks row', async () => {});
    it('should display the Referral row', async () => {});
    it('should display the Help & Support row', async () => {});
    it('should display the Terms & Privacy row', async () => {});
    it('should navigate to the personal info screen when tapped', async () => {});
    it('should navigate to the KYC screen when tapped', async () => {});
    it('should navigate to linked banks when tapped', async () => {});
  });

  describe('Logout', () => {
    it('should show a logout confirmation dialog when the logout button is tapped', async () => {});
    it('should stay on the profile screen when Cancel is tapped in the dialog', async () => {});
    it('should navigate to the login screen when Confirm is tapped', async () => {});
    it('should clear the stored auth token after logout', async () => {});
    it('should not show the home screen after logging out and relaunching', async () => {});
  });
});
