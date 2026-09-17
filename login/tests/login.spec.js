const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { getValidUser } = require('../utils/testData');

function skipUnlessConfigured(user, { needsPassword }) {
  test.skip(!process.env.BASE_URL, 'Set BASE_URL to run against the application under test.');
  test.skip(
    !user.username || (needsPassword && !user.password),
    'Set TEST_USERNAME and TEST_PASSWORD or update login/test-data/users.json.',
  );
}

test('valid user can log in', async ({ page }) => {
  const user = getValidUser();
  skipUnlessConfigured(user, { needsPassword: true });

  const loginPage = new LoginPage(page);

  await test.step('Open login page', () => loginPage.open());
  await test.step('Submit credentials', () => loginPage.login(user.username, user.password));
  await test.step('Assert redirected away from login', () => expect(page).not.toHaveURL(/login/i));
});

test('invalid credentials show an error and stay on login', async ({ page }) => {
  const user = getValidUser();
  skipUnlessConfigured(user, { needsPassword: false });

  const loginPage = new LoginPage(page);

  await test.step('Open login page', () => loginPage.open());
  await test.step('Submit wrong password', () => loginPage.login(user.username, 'WrongPassword123!'));
  await test.step('Assert error shown and still on login', async () => {
    await expect(loginPage.errorToast).toBeVisible();
    await expect(page).toHaveURL(/login/i);
  });
});
