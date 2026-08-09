import { BasePage } from './BasePage';
import { pullToRefresh } from '../helpers/gestures';

export class HomePage extends BasePage {
  readonly screen = '~home-screen';
  readonly greeting = '~home-greeting';
  readonly walletBalance = '~home-wallet-balance';
  readonly opportunityList = '~home-opportunity-list';
  readonly notificationBell = '~home-notification-bell';
  readonly avatarButton = '~home-avatar-button';

  opportunityCard(id: string) {
    return `~home-opportunity-card-${id}`;
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async getGreetingText() {
    return this.read(this.greeting);
  }

  async getWalletBalanceText() {
    return this.read(this.walletBalance);
  }

  async tapOpportunityCard(id: string) {
    await this.tap(this.opportunityCard(id));
  }

  async tapNotificationBell() {
    await this.tap(this.notificationBell);
  }

  async tapAvatar() {
    await this.tap(this.avatarButton);
  }

  async refresh() {
    await pullToRefresh();
  }
}
