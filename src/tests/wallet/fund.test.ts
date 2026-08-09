import { expect } from 'chai';
import { WalletPage } from '../../screens/WalletPage';
import { FundPage } from '../../screens/FundPage';
import { login, resetApp } from '../../helpers/driver';

const walletPage = new WalletPage();
const fundPage = new FundPage();

describe('Wallet > Fund', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Fund screen', () => {
    before(async () => {
      await walletPage.tapAddMoney();
    });

    it('should display the fund screen', async () => {});
    it('should display the amount input field', async () => {});
    it('should display preset amount quick-select buttons', async () => {});
    it('should populate the amount field when a preset is tapped', async () => {});
    it('should show an error for an amount of 0', async () => {});
    it('should show an error for a negative amount', async () => {});
    it('should show an error when the amount field is empty on submit', async () => {});
    it('should accept amounts in whole Naira (will be converted to kobo server-side)', async () => {});
  });

  describe('Payment handoff', () => {
    it('should open the Paystack payment page when the fund button is tapped', async () => {});
    it('should return to the wallet screen after payment is cancelled', async () => {});
    it('should return to the wallet screen after payment is completed', async () => {});
    it('should show a success toast when the wallet is credited after payment', async () => {});
    it('should reflect the new balance on the wallet screen after a successful payment', async () => {});
  });

  describe('Navigation', () => {
    it('should navigate back to the wallet screen when the back button is tapped', async () => {});
  });
});
