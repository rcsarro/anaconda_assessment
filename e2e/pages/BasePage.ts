  import { expect, Page, Locator } from '@playwright/test';

  // BasePage for all common challenge pages elements
  export class BasePage {
    readonly page: Page;
    // NAVIGATION
    readonly challengeOneLink: Locator;
    readonly challengeTwoLink: Locator;
    readonly challengeThreeLink: Locator;
    readonly challengeFourLink: Locator;
    // COMMON ELEMENTS
    readonly email: Locator;
    readonly password: Locator;
    readonly submit: Locator;
    readonly success: Locator;

    constructor(page: Page) {
      this.page = page;
      // NAVIGATION
      this.challengeOneLink = page.locator('a[href="/challenge1.html"]');
      this.challengeTwoLink = page.locator('a[href="/challenge2.html"]');
      this.challengeThreeLink = page.locator('a[href="/challenge3.html"]');
      this.challengeFourLink = page.locator('a[href="/challenge4.html"]');
      // COMMON ELEMENTS
      this.email = page.locator('#email');
      this.password = page.locator('#password');
      this.submit = page.locator('#submitButton');
      this.success = page.locator('#successMessage');
    }

    // Navigate to a specific URL
    async goto(url: string) {
      await this.page.goto(url);
    }

    // Navigate to a challenge page by clicking its link and waiting for the URL
    async gotoChallenge(link: Locator, urlPattern: RegExp | string) {
      await Promise.all([
        this.page.waitForURL(urlPattern),
        link.click(),
      ]);
      await expect(this.page).toHaveURL(urlPattern);
    }

    // Wait for all CSS animations on the given element to finish
    async waitForAnimations(element: Locator) {
      await element.evaluate(el =>
        Promise.all((el.getAnimations?.({ subtree: true }) ?? []).map(a => a.finished.catch(() => {})))
      );
    }

    // Wait for a menu button to have data-initialized="true" (menuClickable = true)
    async waitForMenuInitialized(menuBtn: Locator) {
      await expect(menuBtn).toHaveAttribute('data-initialized', 'true');
    }

    // Login with the given credentials and optionally assert success
    async login(email: string, password: string, expectSuccess: boolean = false) {
      await expect(this.email).toBeVisible();
      await expect(this.password).toBeVisible();
      await this.email.fill(email);
      await this.password.fill(password);
      await expect(this.submit).toBeVisible();
      await this.waitForAnimations(this.submit);
      await this.submit.click();
      if (expectSuccess) {
        await expect(this.success).toBeVisible();
      }
    }

    // Perform the login flow multiple times, asserting the success message each time
    async loginMultipleTimes(iterations: number, password: string) {
      for (let i = 1; i <= iterations; i++) {
        const emailVal = `test${i}@example.com`;
        const passwordVal = `${password}${i}`;
        if (i > 1) {
          await expect(this.success, 'Wait for prior success banner to hide').toBeHidden();
        }
        await expect(this.email).toBeVisible();
        await expect(this.password).toBeVisible();
        await this.email.fill(emailVal);
        await this.password.fill(passwordVal);
        await expect(this.submit).toBeEnabled();
        await this.submit.click();
        await expect(this.success).toBeVisible();
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

    // Generic logout: clicks a logout option and waits for the email field to be visible again
    async logout(logoutOption: Locator, emailField: Locator) {
      await expect(logoutOption).toBeVisible();
      await this.waitForAnimations(logoutOption);
      await logoutOption.click();
      await expect(emailField).toBeVisible();
    }
  }
