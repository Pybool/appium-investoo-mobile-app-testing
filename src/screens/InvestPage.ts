import { BasePage } from './BasePage';
import { pullToRefresh, scrollDown } from '../helpers/gestures';

export class InvestPage extends BasePage {
  readonly screen = '~invest-screen';
  readonly searchInput = '~invest-search-input';
  readonly opportunityList = '~invest-opportunity-list';
  readonly emptyState = '~invest-empty-state';

  opportunityCard(id: string) {
    return `~invest-opportunity-card-${id}`;
  }

  sectorFilter(sector: string) {
    return `~invest-filter-sector-${sector}`;
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async search(query: string) {
    await this.type(this.searchInput, query);
  }

  async tapSectorFilter(sector: string) {
    await this.tap(this.sectorFilter(sector));
  }

  async tapOpportunityCard(id: string) {
    await this.tap(this.opportunityCard(id));
  }

  async isEmptyStateVisible() {
    return this.visible(this.emptyState);
  }

  async refresh() {
    await pullToRefresh();
  }

  async scrollToLoadMore() {
    await scrollDown(0.6);
  }
}
