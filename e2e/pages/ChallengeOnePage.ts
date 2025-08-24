// Page Object for Challenge 1
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChallengeOnePage extends BasePage {
  // readonly challengeOneLink: Locator;
  readonly success: Locator;

  constructor(page: Page) {
    super(page);
    this.success = page.locator('#successMessage');
  }


  // async login(email: string, password: string) {
  //   await this.email.fill(email);
  //   await this.password.fill(password);
  //   await this.submit.click();
  // }
}