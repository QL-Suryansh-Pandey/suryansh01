# Playwright Automation

End-to-end tests for the Nexon.ai login and signup flows, built with Playwright.

## Setup

```bash
npm install
cp .env.example .env   # fill in BASE_URL and any credentials you have
```

## Running tests

```bash
npx playwright test --list              # list discovered tests
npm test                                 # run the full suite
npx playwright test login/tests/login.spec.js
npx playwright test signup/tests/signup.spec.js
npm run test:headed                      # headed, for local debugging
```

Tests read `BASE_URL`, `TEST_USERNAME`, and `TEST_PASSWORD` from the environment
(see `.env.example`). Without `BASE_URL` set, the suite skips rather than
running against `localhost:3000` unintentionally. The signup test needs no
fixture data — it generates a unique name/email/company and a compliant
password on every run.

## Reports

Every run produces, under `reports/`:
- `html/` — Playwright's built-in HTML report (`npm run report:open`)
- `results.json`, `results.xml` — machine-readable results
- `extent/index.html` — a dashboard-style summary (pass/fail donuts, pass
  percentage, environment info, per-test table), built for a non-technical
  audience like a project manager

To email the dashboard (rendered to PDF so it displays correctly in any mail
client, including Gmail's attachment preview) plus the other report formats:

```bash
npm run report:email
```

Requires `REPORT_TO` and either `EMAIL_SERVICE=gmail` + `SMTP_USER` +
`SMTP_PASSWORD` (a Gmail App Password), or a raw `SMTP_HOST`/`SMTP_PORT`
server. See `.env.example`.

## CI

- **GitHub Actions** (`.github/workflows/playwright-report.yml`) runs the
  suite on every push to `main` and on pull requests, using repo secrets for
  `BASE_URL`/`TEST_USERNAME`/`TEST_PASSWORD`, and uploads the reports as a
  build artifact.
- **Jenkins** (`Jenkinsfile`) runs the same suite via a declarative pipeline.
  It expects a `BASE_URL` build parameter and a Jenkins "Username with
  password" credential named `login-test-user`.

## Known limitations

- **Signup test accounts accumulate.** Every run of `signup/tests/signup.spec.js`
  creates a real workspace/account on `BASE_URL` (staging). The app currently
  has no delete-account API or admin panel to clean these up, so there's no
  automated teardown. Generated accounts are identifiable by their `QA Test `
  full-name prefix, `qa.<suffix>@quokkalabs.com` email, and `Quokka Labs `
  company-name prefix (see `signup/utils/testData.js`), which at least makes
  them easy to find for a manual/periodic purge once deletion is possible.
  Revisit this once the app exposes a way to delete a workspace.

## Project layout

Each app module (`login`, `signup`) is self-contained: `pages/` (page
objects), `tests/` (specs), `utils/` (test-data helpers), `test-data/`
(gitignored fixtures). See `AGENTS.md` for the fuller set of conventions
(selector style, change process, etc.) used across this repo.
