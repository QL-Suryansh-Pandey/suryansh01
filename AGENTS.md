# Repository Guidance

## Active Project

- The root project is a JavaScript Playwright test suite. Use [package.json](package.json) and [playwright.config.js](playwright.config.js) as the authoritative entry points.
- Root test discovery is limited to [login/tests](login/tests) and [signup/tests](signup/tests). The `selenium_automation/playwright-automation` directory is a separate, incomplete copy and is not included by the root configuration.
- Organize new application modules like `login` and `signup`, with module-local `pages`, `tests`, `utils`, `test-data`, and `reports` directories. Update [playwright.config.js](playwright.config.js) when adding a module so its tests are discovered.
- Keep page interactions in the page objects under [login/pages](login/pages) and [signup/pages](signup/pages); keep test cases focused on setup and assertions.

## Commands

- Install dependencies with `npm install` when needed.
- List discovered tests with `npx playwright test --list`.
- Run the suite with `npm test`; use `npm run test:headed` for headed debugging.
- Run one slice with `npx playwright test login/tests/login.spec.js` or `npx playwright test signup/tests/signup.spec.js`.
- Open the generated report with `npm run report:open`.
- Send a report with `npm run report:email` only after configuring the SMTP environment variables expected by [scripts/email-report.js](scripts/email-report.js).

## Environment And Test Data

- The config uses `BASE_URL`, defaulting to `http://localhost:3000`; it does not start an application server. Set `BASE_URL` explicitly when testing a deployed or locally running application.
- Login data can come from `TEST_USERNAME` and `TEST_PASSWORD` or [login/test-data/users.json](login/test-data/users.json). Signup data can come from `TEST_FIRST_NAME`, `TEST_LAST_NAME`, `TEST_EMAIL`, and `TEST_PASSWORD` or [signup/test-data/users.json](signup/test-data/users.json).
- Tests skip when required environment or fixture data is absent. Treat a green run with skipped tests as incomplete coverage and inspect the output before reporting success.
- Never add real credentials, SMTP passwords, tokens, or other secrets to tracked fixture files. Prefer environment variables and replace any exposed values immediately.

## Change Conventions

- Preserve the existing CommonJS style and Playwright APIs.
- Prefer accessible selectors such as roles and labels for new page-object locators. Change XPath selectors only when the application contract requires them.
- Every new user-flow test should assert the resulting state, not only that a submit action completed. Keep account creation data isolated when tests run in parallel.
- Run the narrowest relevant Playwright test first, then run `npm test` for changes affecting shared configuration, fixtures, or reporting.
- Generated output belongs in `reports/` and `test-results/`; do not hand-edit report artifacts.