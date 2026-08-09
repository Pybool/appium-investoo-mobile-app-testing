import { BasePage } from './BasePage';
import { pullToRefresh, scrollDown } from '../helpers/gestures';

export class WalletPage extends BasePage {
  readonly screen = '~wallet-screen';
  readonly balance = '~wallet-balance';
  readonly balanceToggle = '~wallet-balance-toggle';
  readonly addMoneyButton = '~wallet-add-money-button';
  readonly transferButton = '~wallet-transfer-button';
  readonly withdrawButton = '~wallet-withdraw-button';
  readonly accountNumber = '~wallet-account-number';
  readonly copyAccountButton = '~wallet-copy-account-button';
  readonly transactionList = '~wallet-transaction-list';
  readonly emptyState = '~wallet-empty-state';
  readonly filterToggle = '~wallet-filter-toggle';
  readonly filterPanel = '~wallet-filter-panel';
  readonly filterFromDate = '~wallet-filter-from-date';
  readonly filterToDate = '~wallet-filter-to-date';
  readonly loadMoreButton = '~wallet-load-more-button';

  transactionRow(id: string) {
    return `~wallet-transaction-row-${id}`;
  }

  transactionAmount(id: string) {
    return `~wallet-transaction-amount-${id}`;
  }

  filterTypeChip(eventType: string) {
    return `~wallet-filter-type-${eventType}`;
  }

  filterDateChip(preset: 'ALL' | '7D' | '30D' | '90D' | 'CUSTOM') {
    return `~wallet-filter-date-${preset}`;
  }

  async tapFilterToggle() {
    await this.tap(this.filterToggle);
  }

  async isFilterPanelVisible() {
    return this.visible(this.filterPanel);
  }

  async tapFilterType(eventType: string) {
    await this.tap(this.filterTypeChip(eventType));
  }

  async tapFilterDate(preset: 'ALL' | '7D' | '30D' | '90D' | 'CUSTOM') {
    await this.tap(this.filterDateChip(preset));
  }

  async tapLoadMore() {
    await this.tap(this.loadMoreButton);
  }

  async isLoadMoreVisible() {
    return this.visible(this.loadMoreButton, 2000);
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async getBalanceText() {
    return this.read(this.balance);
  }

  async tapBalanceToggle() {
    await this.tap(this.balanceToggle);
  }

  async tapAddMoney() {
    await this.tap(this.addMoneyButton);
  }

  async tapTransfer() {
    await this.tap(this.transferButton);
  }

  async tapWithdraw() {
    await this.tap(this.withdrawButton);
  }

  async tapCopyAccount() {
    await this.tap(this.copyAccountButton);
  }

  async getAccountNumber() {
    return this.read(this.accountNumber);
  }

  async isEmptyStateVisible() {
    return this.visible(this.emptyState);
  }

  async refresh() {
    await pullToRefresh();
  }

  async scrollToTransactions() {
    await scrollDown(0.4);
  }
}
