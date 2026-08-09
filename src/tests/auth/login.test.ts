import { expect } from 'chai';
import { LoginPage } from '../../screens/LoginPage';
import { ConfirmLoginPage } from '../../screens/ConfirmLoginPage';
import { HomePage } from '../../screens/HomePage';
import { resetApp } from '../../helpers/driver';

const loginPage = new LoginPage();
const confirmPage = new ConfirmLoginPage();
const homePage = new HomePage();

const VALID_EMAIL = process.env.TEST_USER_EMAIL ?? '';
const VALID_PASSWORD = process.env.TEST_USER_PASSWORD ?? '';

describe('Auth > Login', () => {
  beforeEach(async () => {
    await resetApp();
  });

  describe('Login form validation', () => {
    it('should display the login screen with email and password fields', async () => {});
    it('should show a validation error when email is empty on submit', async () => {});
    it('should show a validation error when password is empty on submit', async () => {});
    it('should show a validation error for an invalid email format', async () => {});
    it('should keep the submit button enabled while fields are empty', async () => {});
    it('should mask the password field by default', async () => {});
    it('should toggle password visibility when the eye icon is tapped', async () => {});
  });

  describe('Credentials rejection', () => {
    it('should show an error for a wrong password', async () => {});
    it('should show an error for an email that does not exist', async () => {});
    it('should show an error for a suspended account', async () => {});
    it('should not navigate away from the login screen on failed login', async () => {});
  });

  describe('Successful credential submission', () => {
    it('should navigate to the OTP confirm screen after valid credentials', async () => {});
    it('should display the masked email address on the confirm screen', async () => {});
  });

  describe('OTP confirmation', () => {
    beforeEach(async () => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    });

    it('should display the OTP input field', async () => {});
    it('should show an error for an incorrect OTP', async () => {});
    it('should show an error for an expired OTP', async () => {});
    it('should show a validation error when OTP field is empty on submit', async () => {});
    it('should navigate to the home tab after a correct OTP', async () => {});
    it('should navigate back to the login screen when Use a different account is tapped', async () => {});
  });

  describe('Navigation', () => {
    it('should navigate to the register screen when the register link is tapped', async () => {});
  });
});
