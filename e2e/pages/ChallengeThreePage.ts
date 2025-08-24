// Page Object for Challenge 3
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChallengeThreePage extends BasePage {
  readonly forgotPasswordBtn: Locator;
  readonly forgotForm: Locator;
  readonly emailInput: Locator;
  readonly successMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.forgotPasswordBtn = page.getByRole('button', { name: /forgot password/i });
    this.forgotForm = page.locator('form#mainForm');
    this.emailInput = this.forgotForm.locator('#email');
    this.successMsg = page.locator('.success-message');
  }

  // async goto() {
  //   await this.page.goto('/challenge3.html');
  // }
}
