import { expect, test } from '@playwright/test';

//Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// Login 3 times sucessfully
test('Login multiple times successfully @c1', async ({ page }) => {
  await page.goto('/');

  // Open the Challenge 1 page (URL-verified)
  const challengeOneLink = page.locator('a[href="/challenge1.html"]');

  /* Promise.all 
    - Avoids race conditions, guarentees navigation on Challange 1 page
    - Ensures the test waits for the page to load before proceeding
  */
  await Promise.all([ 
    page.waitForURL('**/challenge1.html'),
    challengeOneLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge1\.html$/);

  // Locators (Should be moved to page class)
  const email = page.locator('#email');
  const password = page.locator('#password');
  const submit = page.locator('#submitButton');
  const success = page.locator('#successMessage');

  for (let i = 1; i <= 3; i++) {
    const emailVal = `test${i}@example.com`;
    const passwordVal = `password${i}`;

    // Ensure banner is hidden before starting the next attempt (prevents stale text)
    if (i > 1) {
      await expect(success, 'Wait for prior success banner to hide').toBeHidden();
    }

    // Fill and submit login form
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
    await email.fill(emailVal);
    await password.fill(passwordVal);
    await expect(submit).toBeEnabled();
    await submit.click();

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
test('Login animated form and logout sucessfully @c2', async ({ page }) => {
  await page.goto('/');

  // Set Locator for challenge 2 link
  const challengeTwoLink = page.locator('a[href="/challenge2.html"]'); // Move to page class

  /* Promise.all 
    - Avoids race conditions, guarentees navigation on Challange 2 page
    - Ensures the test waits for the page to load before proceeding
  */
  await Promise.all([ 
    page.waitForURL('**/challenge2.html'),
    challengeTwoLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge2\.html$/);

  // Cache the locators
  // Locators (Should be moved to page class)
  const email = page.locator('#email');
  const password = page.locator('#password');
  const submit = page.locator('#submitButton');
  const menuBtn = page.locator('#menuButton');
  const logoutOption = page.locator('#logoutOption');

  const emailVal = `test@example.com`;
  const passwordVal = `password`;

  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await email.fill(emailVal);
  await password.fill(passwordVal);
  await expect(submit).toBeVisible();

  await submit.evaluate(el =>
    Promise.all((el.getAnimations?.({ subtree: true }) ?? []).map(a => a.finished.catch(() => {})))
  );
  await submit.click();

  // Wait for menu button to be enabled and visible before clicking
  await expect(menuBtn).toBeVisible();
  await expect(menuBtn).toBeEnabled();

  // Wait for any menu button animation to finish before clicking
  await menuBtn.evaluate(el =>
    Promise.all((el.getAnimations?.({ subtree: true }) ?? []).map(a => a.finished.catch(() => {})))
  );
  await menuBtn.click();

  // Wait for logoutOption to become truly visible after menu opens (not just in DOM)
  await page.waitForFunction(() => {
    const el = document.querySelector('#logoutOption');
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none' && el.offsetParent !== null;
  });

  await expect(logoutOption).toBeVisible();
  await logoutOption.evaluate(el =>
    Promise.all((el.getAnimations?.({ subtree: true }) ?? []).map(a => a.finished.catch(() => {})))
  );
  await logoutOption.click();

  // Verify we’re logged out (e.g., login form back in view)
  await expect(email).toBeVisible();
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page }) => {
  await page.goto('/');

  // Navigate to Challenge 3 page
  const challengeThreeLink = page.getByRole('link', { name: /challenge 3/i });

    /* Promise.all 
    - Avoids race conditions, guarentees navigation on Challange 2 page
    - Ensures the test waits for the page to load before proceeding
  */
  await Promise.all([
    page.waitForURL('**/challenge3.html'),
    challengeThreeLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge3\.html$/);

  // Open forgot password form and wait for it to be visible
  await page.getByRole('button', { name: /forgot password/i }).click();
  const forgotForm = page.locator('form#mainForm');
  await expect(forgotForm).toBeVisible();

  // Wait for the event handler to be attached (matches setTimeout in app code)
  await page.waitForTimeout(150);

  // Wait for the email input to be visible and enabled (event handler should be attached)
  const emailInput = forgotForm.locator('#email');
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEnabled();
  // Fill email and ensure field is focused
  await emailInput.focus();
  await emailInput.fill('test1@example.com');

  // Submit the form by pressing Enter
  await emailInput.press('Enter');

  // Wait for the success message to appear
  const successMsg = page.locator('.success-message');
  await expect(successMsg.locator('h3')).toHaveText('Success!');
  await expect(successMsg).toContainText('Password reset link sent!');
  await expect(successMsg).toContainText('test1@example.com');
});


//Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
test('Login and logout @c4', async ({ page }) => {
  await page.goto('/');

  // Navigate to Challenge 4 page
  const challengeFourLink = page.getByRole('link', { name: /challenge 4/i });
  await Promise.all([
    page.waitForURL('**/challenge4.html'),
    challengeFourLink.click(),
  ]);
  await expect(page).toHaveURL(/challenge4\.html$/);

  // Wait for application ready state (global variable)
  await page.waitForFunction('window.isAppReady === true');

  // Login
  const email = page.locator('#email');
  const password = page.locator('#password');
  const submit = page.locator('#submitButton');
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await email.fill('test@example.com');
  await password.fill('password');
  await expect(submit).toBeEnabled();
  await submit.click();

  // Profile interaction
  const profileBtn = page.locator('#profileButton');
  await expect(profileBtn).toBeVisible();
  await profileBtn.click();

  // Logout
  const logoutOption = page.locator('#logoutOption');
  // Wait for the menu to be visible after clicking profile
  await expect(logoutOption).toBeVisible();
  await logoutOption.click();

  // Verify we’re logged out (login form back in view)
  await expect(email).toBeVisible();
});
