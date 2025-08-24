// Page Object for Challenge 4
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChallengeFourPage extends BasePage {

  readonly profileBtn: Locator;
  readonly logoutOption: Locator;

  constructor(page: Page) {
    super(page);
    this.profileBtn = page.locator('#profileButton');
    this.logoutOption = page.locator('#logoutOption');
  }

  // async goto() {
  //   await this.page.goto('/challenge4.html');
  // }
}
