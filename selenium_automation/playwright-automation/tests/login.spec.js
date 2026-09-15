const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { getValidUser } = require('../utils/testData');

test('valid user can log in', async ({ page }) => {
	test.skip(!process.env.BASE_URL, 'Set BASE_URL to run against the application under test.');

	const user = getValidUser();
	test.skip(!user.username || !user.password, 'Set TEST_USERNAME and TEST_PASSWORD or update test-data/users.json.');

	const loginPage = new LoginPage(page);
	const dashboardPage = new DashboardPage(page);

	await loginPage.open();
	await loginPage.login(user.username, user.password);
	await dashboardPage.expectLoaded();
});
