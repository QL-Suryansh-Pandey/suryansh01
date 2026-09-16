const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
	testDir: './',
	testMatch: ['login/tests/**/*.spec.js', 'signup/tests/**/*.spec.js'],
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: [
		['list'],
		['html', { outputFolder: 'reports/html', open: 'never' }],
		['json', { outputFile: 'reports/results.json' }],
		['junit', { outputFile: 'reports/results.xml' }],
		['./scripts/extent-reporter.js', { outputFile: 'reports/extent/index.html' }],
	],
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:3000',
		trace: 'on-first-retry',
		screenshot: 'on',
		video: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
	],
});
