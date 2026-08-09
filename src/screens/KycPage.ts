import { BasePage } from './BasePage';

export class KycPage extends BasePage {
  readonly screen = '~kyc-screen';
  readonly tier1Row = '~kyc-tier1-row';
  readonly tier2Row = '~kyc-tier2-row';
  readonly tier3Row = '~kyc-tier3-row';
  readonly tier1StartButton = '~kyc-tier1-start-button';
  readonly tier2StartButton = '~kyc-tier2-start-button';
  readonly tier3StartButton = '~kyc-tier3-start-button';
  readonly bvnInput = '~kyc-bvn-input';
  readonly bvnSubmitButton = '~kyc-bvn-submit-button';
  readonly bvnErrorMessage = '~kyc-bvn-error-message';
  readonly idTypePicker = '~kyc-id-type-picker';
  readonly documentUploadButton = '~kyc-document-upload-button';
  readonly selfieButton = '~kyc-selfie-button';
  readonly successScreen = '~kyc-submission-success-screen';
  readonly statusBadge = '~kyc-status-badge';
  readonly rejectionReason = '~kyc-rejection-reason';

  tierStatus(tier: number) {
    return `~kyc-tier-status-${tier}`;
  }

  async isLoaded() {
    return this.visible(this.screen);
  }

  async tapStartTier1() {
    await this.tap(this.tier1StartButton);
  }

  async tapStartTier2() {
    await this.tap(this.tier2StartButton);
  }

  async tapStartTier3() {
    await this.tap(this.tier3StartButton);
  }

  async enterBvn(bvn: string) {
    await this.type(this.bvnInput, bvn);
  }

  async tapBvnSubmit() {
    await this.tap(this.bvnSubmitButton);
  }

  async getBvnErrorText() {
    return this.read(this.bvnErrorMessage);
  }

  async isBvnErrorVisible() {
    return this.visible(this.bvnErrorMessage);
  }

  async getTierStatusText(tier: number) {
    return this.read(this.tierStatus(tier));
  }

  async isSuccessVisible() {
    return this.visible(this.successScreen);
  }

  async getStatusBadgeText() {
    return this.read(this.statusBadge);
  }

  async getRejectionReasonText() {
    return this.read(this.rejectionReason);
  }
}
