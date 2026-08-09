import { expect } from 'chai';
import { WalletPage } from '../../screens/WalletPage';
import { WithdrawPage } from '../../screens/WithdrawPage';
import { login, resetApp } from '../../helpers/driver';

const walletPage = new WalletPage();
const withdrawPage = new WithdrawPage();

describe('Wallet > Withdraw', () => {
  before(async () => {
    await resetApp();
    await login();
  });

  describe('Withdrawal screen', () => {
    before(async () => {
      await walletPage.tapWithdraw();
    });

    it('should display the withdrawal screen', async () => {});
    it('should display the amount input field', async () => {});
    it('should display the bank selection field', async () => {});
    it('should display the account number input field', async () => {});
    it('should display the PIN input field', async () => {});
  });

  describe('Field validation', () => {
    it('should show an error when amount is empty', async () => {});
    it('should show an error when amount is 0 or negative', async () => {});
    it('should show an error when amount exceeds wallet balance', async () => {});
    it('should show an error when no bank is selected', async () => {});
    it('should show an error when account number is empty', async () => {});
    it('should show an error when account number is not 10 digits', async () => {});
    it('should show an error when PIN is empty', async () => {});
    it('should show an error for an incorrect PIN', async () => {});
  });

  describe('Bank selection', () => {
    it('should open a bank picker modal when the bank field is tapped', async () => {});
    it('should filter banks by name in the picker', async () => {});
    it('should populate the bank field after selection', async () => {});
  });

  describe('Successful withdrawal', () => {
    it('should show a success screen after a valid withdrawal is submitted', async () => {});
    it('should deduct the amount from the wallet balance', async () => {});
    it('should create a DEBIT transaction in the wallet transaction list', async () => {});
    it('should allow the user to navigate back to the wallet after success', async () => {});
  });

  describe('Navigation', () => {
    it('should navigate back to the wallet screen when the back button is tapped', async () => {});
  });
});
