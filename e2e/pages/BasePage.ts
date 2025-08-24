import { expect, Page, Locator } from '@playwright/test';
// BasePage for all challenge pages
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
  /**
   * Perform the login flow multiple times, asserting the success message each time.
   * @param iterations Number of login attempts
   */
  async loginMultipleTimes(iterations: number) {
    for (let i = 1; i <= iterations; i++) {
      const emailVal = `test${i}@example.com`;
      const passwordVal = `password${i}`;
      // Ensure banner is hidden before starting the next attempt
      if (i > 1) {
        await expect(this.success, 'Wait for prior success banner to hide').toBeHidden();
      }
      // Fill and submit login form
      await expect(this.email).toBeVisible();
      await expect(this.password).toBeVisible();
      await this.email.fill(emailVal);
      await this.password.fill(passwordVal);
      await expect(this.submit).toBeEnabled();
      await this.submit.click();
      // Success message should appear for THIS attempt
      await expect(this.success).toBeVisible();
      // Assert the Success message reflects the current inputs in the correct order
      const pattern = new RegExp(
        [
          'Successfully submitted!',
          `Email:\\s*${emailVal.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`,
          `Password:\\s*${passwordVal.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`,
        ].join('[\\s\\S]*'),
        'i'
      );
      await expect(this.success).toHaveText(pattern);
    }
  }

  //navigate to a specific challenge page
  async goto(url: string) {
    await this.page.goto(url);
  }
}
