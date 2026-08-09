import { expect } from 'chai';
import { InvestPage } from '../../screens/InvestPage';
import { OpportunityDetailPage } from '../../screens/OpportunityDetailPage';
import { InvestConfirmPage } from '../../screens/InvestConfirmPage';
import { WalletPage } from '../../screens/WalletPage';
import { login, resetApp } from '../../helpers/driver';

const investPage = new InvestPage();
const detailPage = new OpportunityDetailPage();
const confirmPage = new InvestConfirmPage();
const walletPage = new WalletPage();

describe('Invest tab > Investment flow', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Invest button access', () => {
    it('should show the Invest button on a LIVE opportunity', async () => {});
    it('should not show the Invest button on a FUNDED opportunity', async () => {});
    it('should not show the Invest button for a user with insufficient wallet balance', async () => {});
    it('should prompt the user to fund wallet if balance is 0', async () => {});
  });

  describe('Amount entry', () => {
    it('should display the minimum ticket amount as a placeholder', async () => {});
    it('should show a live unit count preview as the user types', async () => {});
    it('should reject an amount below the minimum ticket', async () => {});
    it('should reject an amount that is not a whole multiple of the unit price', async () => {});
    it('should reject an amount greater than the wallet balance', async () => {});
    it('should reject an amount greater than the remaining units x unit price', async () => {});
    it('should accept an amount equal to the minimum ticket', async () => {});
    it('should accept an amount equal to the wallet balance (exact)', async () => {});
  });

  describe('OTP confirmation', () => {
    it('should request OTP when the investment amount exceeds 50,000', async () => {});
    it('should not request OTP for amounts at or below 50,000', async () => {});
    it('should show an error for a wrong OTP', async () => {});
    it('should not proceed if the OTP field is empty', async () => {});
  });

  describe('Successful investment', () => {
    it('should show a success screen with the amount invested and units acquired', async () => {});
    it('should deduct the invested amount from the wallet balance', async () => {});
    it('should create a new holding in the portfolio tab', async () => {});
    it('should create a DEBIT transaction in the wallet transaction list', async () => {});
    it('should allow the user to navigate back to the home screen after success', async () => {});
  });

  describe('Cancellation', () => {
    it('should cancel the investment and return to opportunity detail when Back is tapped', async () => {});
    it('should not affect wallet balance on cancellation', async () => {});
  });
});
