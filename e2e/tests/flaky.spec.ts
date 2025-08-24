
import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';

// Load test user password from environment
const userPassword = process.env.USER_PASSWORD;

//Navigate to baseUrl before each test
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

//Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// Login 3 times sucessfully
test('Login multiple times successfully @c1', async ({ basePage }) => {
  await test.step('Navigate to Challenge 1 page', async () => {
    await basePage.gotoChallenge(basePage.challengeOneLink, /challenge1\.html$/);
  });

  await test.step('Perform 3 successful login attempts and assert success messages', async () => {
    await basePage.loginMultipleTimes(3, userPassword!);
  });
});


// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout sucessfully @c2', async ({ basePage, challengeTwoPage }) => {

  await test.step('Navigate to Challenge 2 page', async () => {
    await basePage.gotoChallenge(basePage.challengeTwoLink, /challenge2\.html$/);
  });

  await test.step('Login with animated form', async () => {
    await basePage.login('test@example.com', userPassword!);
  });

  await test.step('Open menu and logout', async () => {
    await expect(challengeTwoPage.menuBtn).toBeVisible();
    await expect(challengeTwoPage.menuBtn).toBeEnabled();
    await basePage.waitForMenuInitialized(challengeTwoPage.menuBtn);
    await challengeTwoPage.menuBtn.click();
    await expect(challengeTwoPage.logoutOption).toBeVisible();
    await basePage.logout(challengeTwoPage.logoutOption, challengeTwoPage.email);
  });

  await test.step('Verify logout returns to login form', async () => {
    await expect(challengeTwoPage.email).toBeVisible();
  });
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page, basePage, challengeThreePage }) => {
  await test.step('Navigate to Challenge 3 page', async () => {
    await basePage.gotoChallenge(basePage.challengeThreeLink, /challenge3\.html$/);
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
    await basePage.gotoChallenge(basePage.challengeFourLink, /challenge4\.html$/);
  });

  await test.step('Wait for application ready state', async () => {
    await page.waitForFunction('window.isAppReady === true');
  });

  await test.step('Login', async () => {
    await basePage.login('test@example.com', userPassword!);
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
