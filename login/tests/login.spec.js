const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { getValidUser } = require('../utils/testData');

test('valid user can log in', async ({ page }) => {
  test.skip(!process.env.BASE_URL, 'Set BASE_URL to run against the application under test.');

  const user = getValidUser();
  test.skip(!user.username || !user.password, 'Set TEST_USERNAME and TEST_PASSWORD or update login/test-data/users.json.');

  const loginPage = new LoginPage(page);

  await test.step('Open login page', async () => {
    await loginPage.open();
  });

  await test.step('Submit credentials', async () => {
    await loginPage.login(user.username, user.password);
  });

  await test.step('Assert redirected away from login', async () => {
    await expect(page).not.toHaveURL(/login/i);
  });
});

test('invalid credentials show an error and stay on login', async ({ page }) => {
  test.skip(!process.env.BASE_URL, 'Set BASE_URL to run against the application under test.');

  const user = getValidUser();
  test.skip(!user.username, 'Set TEST_USERNAME and TEST_PASSWORD or update login/test-data/users.json.');

  const loginPage = new LoginPage(page);

  await test.step('Open login page', async () => {
    await loginPage.open();
  });

  await test.step('Submit wrong password', async () => {
    await loginPage.login(user.username, 'WrongPassword123!');
  });

  await test.step('Assert error shown and still on login', async () => {
    await expect(loginPage.errorToast).toBeVisible();
    await expect(page).toHaveURL(/login/i);
  });
});
