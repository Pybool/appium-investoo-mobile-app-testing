import { BasePage } from './BasePage';
import { scrollDown } from '../helpers/gestures';

export class OpportunityDetailPage extends BasePage {
  readonly screen = '~opportunity-detail-screen';
  readonly title = '~opportunity-title';
  readonly sectorBadge = '~opportunity-sector-badge';
  readonly targetAmount = '~opportunity-target-amount';
  readonly minTicket = '~opportunity-min-ticket';
  readonly projectedReturn = '~opportunity-projected-return';
  readonly tenor = '~opportunity-tenor';
  readonly deadline = '~opportunity-deadline';
  readonly fundingProgress = '~opportunity-funding-progress';
  readonly investButton = '~opportunity-invest-button';
  readonly backButton = '~opportunity-back-button';
  readonly statusBadge = '~opportunity-status-badge';

  async isLoaded() {
    return this.visible(this.screen);
  }

  async getTitle() {
    return this.read(this.title);
  }

  async getProjectedReturn() {
    return this.read(this.projectedReturn);
  }

  async tapInvest() {
    await this.tap(this.investButton);
  }

  async tapBack() {
    await this.tap(this.backButton);
  }

  async scrollToInvestButton() {
    await scrollDown(0.4);
  }

  async isInvestButtonEnabled() {
    const el = await this.waitFor(this.investButton);
    return el.isEnabled();
  }
}
