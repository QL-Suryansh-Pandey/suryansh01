const { test, expect } = require('@playwright/test');
const { SignupPage } = require('../pages/SignupPage');
const { getNewUser } = require('../utils/testData');

test('new user can sign up', async ({ page }) => {
  test.skip(!process.env.BASE_URL, 'Set BASE_URL to run against the application under test.');

  const user = getNewUser();
  const signupPage = new SignupPage(page);

  await test.step('Open signup page', async () => {
    await signupPage.open();
  });

  await test.step('Fill and submit workspace signup form', async () => {
    await signupPage.signup(user);
  });

  await test.step('Assert redirected to OTP verification', async () => {
    await expect(page).toHaveURL(/otp-verification/i, { timeout: 15000 });
  });
});

test('weak password shows a validation error and stays on signup', async ({ page }) => {
  test.skip(!process.env.BASE_URL, 'Set BASE_URL to run against the application under test.');

  const user = { ...getNewUser(), password: 'weak' };
  const signupPage = new SignupPage(page);

  await test.step('Open signup page', async () => {
    await signupPage.open();
  });

  await test.step('Submit form with a weak password', async () => {
    await signupPage.signup(user);
  });

  await test.step('Assert validation error and still on signup', async () => {
    await expect(signupPage.passwordError).toBeVisible();
    await expect(page).toHaveURL(/signup/i);
  });
});
