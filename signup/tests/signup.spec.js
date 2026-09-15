const { test } = require('@playwright/test');
const { SignupPage } = require('../pages/SignupPage');
const { getNewUser } = require('../utils/testData');

test('new user can sign up', async ({ page }) => {
  test.skip(!process.env.BASE_URL, 'Set BASE_URL to run against the application under test.');

  const user = getNewUser();
  test.skip(
    !user.firstName || !user.lastName || !user.email || !user.password,
    'Set signup test data through environment variables or signup/test-data/users.json.',
  );

  const signupPage = new SignupPage(page);
  await signupPage.open();
  await signupPage.signup(user);
});
