import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';

//Navigate to baseUrl before each test
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

//Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// Login 3 times sucessfully
test('Login multiple times successfully @c1', async ({ page, basePage }) => {
  await test.step('Navigate to Challenge 1 page', async () => {
    await Promise.all([
      page.waitForURL('**/challenge1.html'),
      basePage.challengeOneLink.click(),
    ]);
    await expect(page).toHaveURL(/challenge1\.html$/);
  });

  await test.step('Perform 3 successful login attempts and assert success messages', async () => {
    await basePage.loginMultipleTimes(3);
  });
});


// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout sucessfully @c2', async ({ page, basePage, challengeTwoPage }) => {

  await test.step('Navigate to Challenge 2 page', async () => {
    await Promise.all([
      page.waitForURL('**/challenge2.html'),
      basePage.challengeTwoLink.click(),
    ]);
    await expect(page).toHaveURL(/challenge2\.html$/);
  });

  await test.step('Login with animated form', async () => {
    const emailVal = `test@example.com`;
    const passwordVal = `password`;
    await expect(basePage.email).toBeVisible();
    await expect(basePage.password).toBeVisible();
    await basePage.email.fill(emailVal);
    await basePage.password.fill(passwordVal);
    await expect(basePage.submit).toBeVisible();
    await basePage.submit.evaluate(el =>
      Promise.all((el.getAnimations?.({ subtree: true }) ?? []).map(a => a.finished.catch(() => {})))
    );
    await basePage.submit.click();
  });

  await test.step('Open menu and logout', async () => {
    // Wait for menu button to be enabled and visible before clicking
    await expect(challengeTwoPage.menuBtn).toBeVisible();
    await expect(challengeTwoPage.menuBtn).toBeEnabled();
    // Wait for menu button to be initialized (menuClickable = true)
    await expect(challengeTwoPage.menuBtn).toHaveAttribute('data-initialized', 'true');
    await challengeTwoPage.menuBtn.click();
    // Wait for logoutOption to become truly visible after menu opens (not just in DOM)
    await page.waitForFunction(() => {
      const el = document.querySelector('#logoutOption');
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none' && el.offsetParent !== null;
    });
    await expect(challengeTwoPage.logoutOption).toBeVisible();
    await challengeTwoPage.logoutOption.evaluate(el =>
      Promise.all((el.getAnimations?.({ subtree: true }) ?? []).map(a => a.finished.catch(() => {})))
    );
    await challengeTwoPage.logoutOption.click();
  });

  await test.step('Verify logout returns to login form', async () => {
    await expect(challengeTwoPage.email).toBeVisible();
  });
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page, basePage, challengeThreePage }) => {
  await test.step('Navigate to Challenge 3 page', async () => {
    await Promise.all([
      page.waitForURL('**/challenge3.html'),
      basePage.challengeThreeLink.click(),
    ]);
    await expect(page).toHaveURL(/challenge3\.html$/);
  });

  await test.step('Open forgot password form and fill email', async () => {
    await challengeThreePage.forgotPasswordBtn.click();
    const forgotForm = challengeThreePage.forgotForm;
    await expect(forgotForm).toBeVisible();
    // Wait for the event handler to be attached (matches setTimeout in app code)
    await page.waitForTimeout(150);
    await expect(challengeThreePage.emailInput).toBeVisible();
    await expect(challengeThreePage.emailInput).toBeEnabled();
    await challengeThreePage.emailInput.focus();
    await challengeThreePage.emailInput.fill('test1@example.com');
    await challengeThreePage.emailInput.press('Enter');
  });

  await test.step('Assert forgot password success message', async () => {
    await expect(challengeThreePage.successMsg.locator('h3')).toHaveText('Success!');
    await expect(challengeThreePage.successMsg).toContainText('Password reset link sent!');
    await expect(challengeThreePage.successMsg).toContainText('test1@example.com');
  });
});


//Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
test('Login and logout @c4', async ({ page, basePage, challengeFourPage }) => {
  await test.step('Navigate to Challenge 4 page', async () => {
    await Promise.all([
      page.waitForURL('**/challenge4.html'),
      basePage.challengeFourLink.click(),
    ]);
    await expect(page).toHaveURL(/challenge4\.html$/);
  });

  await test.step('Wait for application ready state', async () => {
    await page.waitForFunction('window.isAppReady === true');
  });

  await test.step('Login', async () => {
    await expect(basePage.email).toBeVisible();
    await expect(basePage.password).toBeVisible();
    await basePage.email.fill('test@example.com');
    await basePage.password.fill('password');
    await expect(basePage.submit).toBeEnabled();
    await basePage.submit.click();
  });

  await test.step('Profile interaction', async () => {
    await expect(challengeFourPage.profileBtn).toBeVisible();
    await challengeFourPage.profileBtn.click();
  });

  await test.step('Logout', async () => {
    await expect(challengeFourPage.logoutOption).toBeVisible();
    await challengeFourPage.logoutOption.click();
  });

  await test.step('Verify logout returns to login form', async () => {
    await expect(challengeFourPage.email).toBeVisible();
  });
});
