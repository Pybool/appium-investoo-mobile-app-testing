import { expect } from 'chai';
import { ProfilePage } from '../../screens/ProfilePage';
import { login, resetApp } from '../../helpers/driver';

const profilePage = new ProfilePage();

describe('Profile > KYC', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('KYC status display', () => {
    it('should display the current KYC tier on the profile screen', async () => {});
    it('should display Tier 0 badge for an unverified user', async () => {});
    it('should show the investment limit for each tier', async () => {});
    it('should navigate to the KYC screen from the profile row', async () => {});
  });

  describe('KYC screen', () => {
    before(async () => {
      await profilePage.tapKyc();
    });

    it('should display the KYC screen', async () => {});
    it('should show which tiers are completed and which are pending', async () => {});
    it('should show Tier 1 (BVN) as the first step', async () => {});
    it('should show Tier 2 (ID + selfie) as the second step', async () => {});
    it('should show Tier 3 (full documents) as the third step', async () => {});
    it('should disable a tier step if the previous tier is not completed', async () => {});
  });

  describe('Tier 1 (BVN) submission', () => {
    it('should display the BVN input screen', async () => {});
    it('should show an error for an empty BVN field', async () => {});
    it('should show an error for a BVN that is not 11 digits', async () => {});
    it('should show an error for an invalid BVN that fails third-party verification', async () => {});
    it('should navigate to the IN_REVIEW state after a valid BVN is submitted', async () => {});
    it('should not re-submit if the BVN is already under review', async () => {});
  });

  describe('Tier 2 (ID + selfie) submission', () => {
    it('should display the ID type selection (NIN, Drivers Licence, etc.)', async () => {});
    it('should display the document upload step', async () => {});
    it('should display the selfie capture step', async () => {});
    it('should show an error if no document is uploaded', async () => {});
    it('should show an error if no selfie is captured', async () => {});
    it('should navigate to IN_REVIEW state after valid submission', async () => {});
  });

  describe('KYC status updates', () => {
    it('should show APPROVED status after a successful review', async () => {});
    it('should show REJECTED status with a reason after a failed review', async () => {});
    it('should allow resubmission after rejection', async () => {});
    it('should update the tier badge on the profile screen after approval', async () => {});
  });
});
