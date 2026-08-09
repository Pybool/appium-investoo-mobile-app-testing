import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly screen = '~profile-screen';
  readonly fullName = '~profile-full-name';
  readonly email = '~profile-email';
  readonly kycTierBadge = '~profile-kyc-tier-badge';
  readonly personalInfoRow = '~profile-personal-info-row';
  readonly kycRow = '~profile-kyc-row';
  readonly banksRow = '~profile-banks-row';
  readonly referralRow = '~profile-referral-row';
  readonly helpRow = '~profile-help-row';
  readonly termsRow = '~profile-terms-row';
  readonly logoutButton = '~profile-logout-button';
  readonly logoutConfirmButton = '~profile-logout-confirm-button';
  readonly logoutCancelButton = '~profile-logout-cancel-button';

  async isLoaded() {
    return this.visible(this.screen);
  }

  async getFullNameText() {
    return this.read(this.fullName);
  }

  async getEmailText() {
    return this.read(this.email);
  }

  async getKycTierText() {
    return this.read(this.kycTierBadge);
  }

  async tapPersonalInfo() {
    await this.tap(this.personalInfoRow);
  }

  async tapKyc() {
    await this.tap(this.kycRow);
  }

  async tapBanks() {
    await this.tap(this.banksRow);
  }

  async tapReferral() {
    await this.tap(this.referralRow);
  }

  async tapHelp() {
    await this.tap(this.helpRow);
  }

  async tapTerms() {
    await this.tap(this.termsRow);
  }

  async tapLogout() {
    await this.tap(this.logoutButton);
  }

  async confirmLogout() {
    await this.tap(this.logoutConfirmButton);
  }

  async cancelLogout() {
    await this.tap(this.logoutCancelButton);
  }
}
