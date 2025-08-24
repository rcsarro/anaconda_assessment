import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';

//Navigate to baseUrl before each test
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

//Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// Login 3 times sucessfully
test('Login multiple times successfully @c1', async ({ page, basePage, challengeOnePage }) => {

  /* Promise.all 
    - Avoids race conditions, guarentees navigation on Challange 1 page
    - Ensures the test waits for the page to load before proceeding
  */
  await Promise.all([ 
    page.waitForURL('**/challenge1.html'),
    basePage.challengeOneLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge1\.html$/);

  // Iterate through test1, test2 and test3
  for (let i = 1; i <= 3; i++) {
    const emailVal = `test${i}@example.com`;
    const passwordVal = `password${i}`;
    const success = challengeOnePage.success;

    // Ensure banner is hidden before starting the next attempt (prevents stale text)
    if (i > 1) {
      await expect(success, 'Wait for prior success banner to hide').toBeHidden();
    }

    // Fill and submit login form
    await expect(basePage.email).toBeVisible();
    await expect(basePage.password).toBeVisible();
    await basePage.email.fill(emailVal);
    await basePage.password.fill(passwordVal);
    await expect(basePage.submit).toBeEnabled();
    await basePage.submit.click();

    // Success message should appear for THIS attempt
    await expect(success).toBeVisible();

    // Assert the Success message reflects the current inputs in the correct order
    const pattern = new RegExp(
      [ //Used Regex101 to help build regex
        'Successfully submitted!',
        `Email:\\s*${emailVal.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}`,
        `Password:\\s*${passwordVal.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}`,
      ].join('[\\s\\S]*'),
      'i'
    );
    await expect(success).toHaveText(pattern); 
  }
});


// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout sucessfully @c2', async ({ page, basePage, challengeTwoPage }) => {

  /* Promise.all 
    - Avoids race conditions, guarentees navigation on Challange 2 page
    - Ensures the test waits for the page to load before proceeding
  */
  await Promise.all([ 
    page.waitForURL('**/challenge2.html'),
    basePage.challengeTwoLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge2\.html$/);

  //move to helper class later
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

  // Wait for menu button to be enabled and visible before clicking
  await expect(challengeTwoPage.menuBtn).toBeVisible();
  await expect(challengeTwoPage.menuBtn).toBeEnabled();

  // Wait for any menu button animation to finish before clicking
  await challengeTwoPage.menuBtn.evaluate(el =>
    Promise.all((el.getAnimations?.({ subtree: true }) ?? []).map(a => a.finished.catch(() => {})))
  );
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

  // Verify we’re logged out (e.g., login form back in view)
  await expect(challengeTwoPage.email).toBeVisible();
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page, basePage, challengeThreePage }) => {
    /* Promise.all 
    - Avoids race conditions, guarentees navigation on Challange 3 page
    - Ensures the test waits for the page to load before proceeding
  */
  await Promise.all([
    page.waitForURL('**/challenge3.html'),
    basePage.challengeThreeLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge3\.html$/);

  // Open forgot password form and wait for it to be visible
  await challengeThreePage.forgotPasswordBtn.click();
  const forgotForm = challengeThreePage.forgotForm;
  await expect(forgotForm).toBeVisible();

  // Wait for the event handler to be attached (matches setTimeout in app code)
  await page.waitForTimeout(150);

  // Wait for the email input to be visible and enabled (event handler should be attached)
  await expect(challengeThreePage.emailInput).toBeVisible();
  await expect(challengeThreePage.emailInput).toBeEnabled();
  // Fill email and ensure field is focused
  await challengeThreePage.emailInput.focus();
  await challengeThreePage.emailInput.fill('test1@example.com');

  // Submit the form by pressing Enter
  await challengeThreePage.emailInput.press('Enter');

  // Wait for the success message to appear
  await expect(challengeThreePage.successMsg.locator('h3')).toHaveText('Success!');
  await expect(challengeThreePage.successMsg).toContainText('Password reset link sent!');
  await expect(challengeThreePage.successMsg).toContainText('test1@example.com');
});


//Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
test('Login and logout @c4', async ({ page, basePage, challengeFourPage }) => {
    /* Promise.all 
    - Avoids race conditions, guarentees navigation on Challange 4 page
    - Ensures the test waits for the page to load before proceeding
  */
  await Promise.all([
    page.waitForURL('**/challenge4.html'),
    basePage.challengeFourLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge4\.html$/);

  // Wait for application ready state (global variable)
  await page.waitForFunction('window.isAppReady === true');

  // Login
  await expect(basePage.email).toBeVisible();
  await expect(basePage.password).toBeVisible();
  await basePage.email.fill('test@example.com');
  await basePage.password.fill('password');
  await expect(basePage.submit).toBeEnabled();
  await basePage.submit.click();

  // Profile interaction
  await expect(challengeFourPage.profileBtn).toBeVisible();
  await challengeFourPage.profileBtn.click();

  // Logout
  await expect(challengeFourPage.logoutOption).toBeVisible();
  await challengeFourPage.logoutOption.click();

  // Verify we’re logged out (login form back in view)
  await expect(challengeFourPage.email).toBeVisible();
});
