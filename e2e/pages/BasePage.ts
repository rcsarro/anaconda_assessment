// BasePage for all challenge pages
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  //NAVIGATION
  readonly challengeOneLink: Locator;
  readonly challengeTwoLink: Locator;
  readonly challengeThreeLink: Locator;
  readonly challengeFourLink: Locator;
  //COMMON ELEMENTS
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
   readonly success: Locator;

  constructor(page: Page) {
    this.page = page;
    //NAVIGATION
    this.challengeOneLink = page.locator('a[href="/challenge1.html"]');
    this.challengeTwoLink = page.locator('a[href="/challenge2.html"]');
    this.challengeThreeLink = page.locator('a[href="/challenge3.html"]');
    this.challengeFourLink = page.locator('a[href="/challenge4.html"]');
    //COMMON ELEMENTS
    this.email = page.locator('#email');
    this.password = page.locator('#password');
    this.submit = page.locator('#submitButton');
    this.success = page.locator('#successMessage');
  }
  // Common methods or properties for all pages can go here
  //navigate to a specific challenge page
  async goto(url: string) {
    await this.page.goto(url);
  }
}
