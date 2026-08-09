import { expect } from 'chai';
import { WalletPage } from '../../screens/WalletPage';
import { login, resetApp } from '../../helpers/driver';

const walletPage = new WalletPage();

describe('Wallet tab', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Balance card', () => {
    it('should display the wallet screen', async () => {});
    it('should display the wallet balance in Naira', async () => {});
    it('should hide the balance when the toggle button is tapped', async () => {});
    it('should reveal the balance when the toggle is tapped again', async () => {});
    it('should not display raw kobo values', async () => {});
    it('should show the virtual account number', async () => {});
    it('should copy the account number to clipboard when the copy button is tapped', async () => {});
    it('should show the bank name associated with the virtual account', async () => {});
  });

  describe('Quick action buttons', () => {
    it('should display the Add Money button', async () => {});
    it('should display the Withdraw button', async () => {});
    it('should navigate to the fund screen when Add Money is tapped', async () => {});
    it('should navigate to the withdraw screen when Withdraw is tapped', async () => {});
  });

  describe('Transaction history', () => {
    it('should display a list of transactions', async () => {});
    it('should show a WALLET_FUND entry with a down-arrow icon in green', async () => {});
    it('should show an INVESTMENT entry with an up-arrow icon in red', async () => {});
    it('should show a DISTRIBUTION entry with a coins icon in green', async () => {});
    it('should show a REFUND entry with a down-arrow icon in green', async () => {});
    it('should show debit amounts in red with a minus prefix', async () => {});
    it('should show credit amounts in green with a plus prefix', async () => {});
    it('should show the transaction date and time', async () => {});
    it('should show the transaction description or event type label', async () => {});
    it('should show an empty state when there are no transactions', async () => {});
  });

  describe('Pull to refresh', () => {
    it('should reload the balance on pull-to-refresh', async () => {});
    it('should reload the transaction list on pull-to-refresh', async () => {});
  });
});
