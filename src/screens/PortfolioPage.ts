import { BasePage } from './BasePage';
import { pullToRefresh } from '../helpers/gestures';

export class PortfolioPage extends BasePage {
  readonly screen = '~portfolio-screen';
  readonly totalInvested = '~portfolio-total-invested';
  readonly totalValue = '~portfolio-total-value';
  readonly totalReturn = '~portfolio-total-return';
  readonly holdingsList = '~portfolio-holdings-list';
  readonly emptyState = '~portfolio-empty-state';

  holdingCard(id: string) {
    return `~portfolio-holding-card-${id}`;
  }

  holdingTitle(id: string) {
    return `~portfolio-holding-title-${id}`;
  }

  holdingAmount(id: string) {
    return `~portfolio-holding-amount-${id}`;
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async getTotalInvestedText() {
    return this.read(this.totalInvested);
  }

  async getTotalValueText() {
    return this.read(this.totalValue);
  }

  async isEmptyStateVisible() {
    return this.visible(this.emptyState);
  }

  async tapHoldingCard(id: string) {
    await this.tap(this.holdingCard(id));
  }

  async refresh() {
    await pullToRefresh();
  }
}
