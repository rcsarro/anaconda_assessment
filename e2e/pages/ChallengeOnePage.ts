// Page Object for Challenge 1
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChallengeOnePage extends BasePage {


  constructor(page: Page) {
    super(page);

  }
}