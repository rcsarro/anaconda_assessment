// Page Object for Challenge 2
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChallengeTwoPage extends BasePage {
  readonly menuBtn: Locator;
  readonly logoutOption: Locator;

  constructor(page: Page) {
    super(page);
    this.menuBtn = page.locator('#menuButton');
    this.logoutOption = page.locator('#logoutOption');
  }
}
