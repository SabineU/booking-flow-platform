# Booking Flow Platform

A 4‑step skip (dumpster) booking flow with full QA automation. Built for a QA Engineer assessment at REM Waste Management.

## 🚀 Live Demo

- **Production (main branch):** [https://booking-flow-platform.vercel.app](https://booking-flow-platform.vercel.app)
- **Staging (develop branch):** [https://booking-flow-platform-git-develop-sabineus-projects.vercel.app](https://booking-flow-platform-git-develop-sabineus-projects.vercel.app)

> **Note for reviewers:** The app uses Mock Service Worker (MSW) to simulate API responses. All functionality works exactly as in the assessment brief.

---

## 🧰 Tech Stack

| Area               | Technologies                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| Frontend           | React 19, TypeScript, Vite, CSS (BEM)                                    |
| API Mocking        | MSW (Mock Service Worker)                                                |
| Unit Tests         | Vitest + React Testing Library + MSW (node)                              |
| E2E Tests          | Playwright (Page Object Model) + Allure reporting                        |
| Accessibility      | axe‑core (Playwright integration)                                        |
| Performance        | Lighthouse (programmatic via Playwright)                                 |
| CI/CD              | GitHub Actions, CircleCI (lint, format, unit tests, E2E tests, coverage) |
| Deployment         | Vercel (auto‑deploy on push to main/develop)                             |
| Linting/Formatting | ESLint (flat config), Prettier, Husky, lint‑staged                       |

---

## 📁 Project Structure

```text
booking-flow-platform/
├── .github/workflows/         # GitHub Actions CI
├── .circleci/                 # CircleCI config
├── e2e/                       # Playwright E2E tests
│   ├── pages/                 # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── PostcodeStep.ts
│   │   ├── WasteTypeStep.ts
│   │   ├── SkipSelectionStep.ts
│   │   └── ReviewStep.ts
│   ├── booking-flow.spec.ts
│   ├── accessibility.spec.ts
│   ├── visual-evidence.spec.ts
│   └── lighthouse.spec.ts
├── public/                    # Static assets (including MSW worker)
├── src/
│   ├── components/            # React components (Step1–Step4)
│   ├── hooks/                 # Custom hooks (usePostcodeLookup, useSkips)
│   ├── mocks/                 # MSW handlers and browser setup
│   ├── utils/                 # Validation, price calculation
│   └── App.tsx
├── screenshots/               # Auto‑generated UI evidence
├── lighthouse-report/         # Lighthouse HTML report
├── bug-reports.md             # Verified bugs with evidence
├── manual-tests.md            # Test cases (35+ cases)
└── README.md
```

---

## ⚙️ Setup & Local Development

```bash
git clone https://github.com/SabineU/booking-flow-platform.git
cd booking-flow-platform
npm install
npm run dev
```

The app will be available at http://localhost:5173. MSW starts automatically in development mode.

---

## 🧪 Running Tests

### Unit Tests (Vitest)

```bash
npm run test:unit          # Run once
npm run test:unit:ui       # Interactive UI
npm run test:coverage      # With coverage report (output in /coverage)
```

### E2E Tests (Playwright)

| Command                          | Description                                                                |
| :------------------------------- | :------------------------------------------------------------------------- |
| `npm run test:e2e`               | Run all E2E suites (booking, accessibility, visual, lighthouse)            |
| `npm run test:e2e:booking`       | Run main booking flow tests only (uses Page Object Model)                  |
| `npm run test:e2e:accessibility` | Run axe‑core accessibility audit                                           |
| `npm run test:e2e:visual`        | Capture UI screenshots (mobile/desktop, error states, price breakdown)     |
| `npm run test:e2e:lighthouse`    | Run Lighthouse and generate HTML report (threshold: perf ≥0.5, a11y ≥0.95) |
| `npm run test:e2e:ui`            | Open Playwright UI mode for debugging                                      |

#### Allure Reporting

```bash
npm run test:e2e:allure     # Run E2E tests and generate Allure report
npm run allure:generate     # Generate report from existing results
npm run allure:open         # Open Allure report
```

---

## 🔬 Mocking Strategy

The assessment requires deterministic fixtures for specific postcodes. MSW handles this in src/mocks/handlers.ts:

| Postcode      | Behavior                                     |
| :------------ | :------------------------------------------- |
| `SW1A 1AA`    | Returns 14 addresses (richness gate)         |
| `EC1A 1BB`    | Returns 0 addresses (empty state)            |
| `M1 1AE`      | Simulates 2‑second latency                   |
| `BS1 4DJ`     | First call returns 500 error; retry succeeds |
| `Heavy waste` | Disables 2‑yard and 4‑yard skips             |

All API endpoints match the contract provided in the assessment brief.

---

## 📸 UI/UX Evidence

The assessment requires screenshots, a flow video, and Lighthouse/accessibility reports.

**Screenshots**: Run `npm run test:e2e:visual` – output saved in `/screenshots`.

**Flow video**: Playwright records video automatically (enabled in playwright.config.js). Videos are saved in `/test-results`. A trimmed 60‑120s video is available upon request.

**Lighthouse report**: Run `npm run test:e2e:lighthouse` – report saved in `/lighthouse-report/report.html`.

**Accessibility audit**: Run `npm run test:e2e:accessibility` – uses axe‑core; currently 0 violations.

---

## 🐛 Test Plan, Manual Cases and Bug Reports

**test-plan.md**:

**manual-tests.md**: Comprehensive test cases (35+ cases) in strict markdown table format.

**bug-reports.md**: Documented bugs with severity, priority, steps, and evidence (table format).

---

## 🐳 Docker Support

You can run the app in a Docker container. The Dockerfile builds the production bundle and serves it with Vite preview, keeping MSW active.

Build and start with Docker Compose

```bash
docker-compose up --build
```

Or build and run manually

```bash
docker build -t booking-flow .
docker run -p 3000:3000 booking-flow
```

The app will be available at http://localhost:3000.

**Note**:
The Docker container uses port 3000 to avoid conflicts with the dev server (5173).

---

## 📦 CI/CD

The project includes both GitHub Actions and CircleCI pipelines that run:

- Linting & formatting checks
- Unit tests with coverage
- E2E tests with Playwright
- Allure report generation

All checks must pass before merging to `main` or `develop`.

---

## 👤 Reviewer Notes

- The app is fully functional and matches all requirements in the assessment brief.
- MSW ensures deterministic behavior for all required fixtures.
- The double‑submit prevention is implemented using a synchronous ref lock (see useConfirmBooking hook).
- E2E tests follow the Page Object Model for maintainability.
- All quality gates (linting, formatting, unit tests, E2E tests) are enforced in CI.
- UI/UX evidence is generated automatically via Playwright scripts.

For any questions, please contact the repository owner via E‑Mail.

---
