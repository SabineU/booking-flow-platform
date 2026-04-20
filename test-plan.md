# Test Plan: REM Waste Management Booking Flow

**Version:** 1.0
**Date:** 2026-04-20
**Author:** Sabine U.

## 1. Introduction

### 1.1. Application Under Test (AUT)

The AUT is a 4-step web application that allows users in the UK to book a skip for waste disposal. The core workflow involves entering a postcode, selecting a waste type, choosing a skip size, and reviewing/confirming the booking. The application is built with a modern frontend stack (React, TypeScript, Vite) and relies on a mock backend implemented with Mock Service Worker (MSW) to simulate API responses deterministically.

### 1.2. Test Objectives

The primary objectives of this testing effort are to:

- **Verify Functional Correctness:** Ensure the booking flow operates exactly as specified in the provided assessment requirements.
- **Validate UI/UX Richness:** Confirm the presence and correct behavior of multi-path flows, loading/empty/error states, and a detailed price breakdown.
- **Confirm Deterministic Behavior:** Validate that the application responds correctly to the mandated test fixtures (e.g., specific postcodes triggering defined outcomes).
- **Ensure Quality Attributes:** Evaluate the application's usability (responsiveness), accessibility, and performance.
- **Provide Evidence:** Generate comprehensive documentation, including this test plan, manual test cases, bug reports, and automation evidence, as required by the assessment.

## 2. Test Scope

### 2.1. In-Scope

The testing effort will focus exclusively on the following:

- **Functional Testing:** All four steps of the booking flow, including:
  - Step 1: UK postcode validation, address lookup (with mock API), and address selection/manual entry.
  - Step 2: Waste type selection and branching logic for plasterboard options.
  - Step 3: Skip size selection, including the display of 8+ options and correct disabling based on waste type.
  - Step 4: Review of booking details, price breakdown calculation, and confirmation (with double-submit prevention).
- **API Contract Validation:** Ensuring all frontend requests match the required contract and the mock API responds as defined in the assessment brief.
- **UI/UX Evidence:** Capturing screenshots (mobile/desktop), error/retry states, disabled skip visibility, and price breakdown.
- **Non-Functional Testing:** Performance (via Lighthouse), Accessibility (via axe-core), and Responsiveness (mobile/desktop).
- **Automated Testing:** Creation and execution of unit and end-to-end (E2E) tests.

### 2.2. Out-of-Scope

The following are explicitly out of scope for this assessment:

- Testing of a real backend or live database; all interactions are mocked.
- Security testing beyond basic frontend validations.
- Cross-browser compatibility testing (assumed to work on modern Chrome, Firefox, Edge).
- Performance testing under load (e.g., stress or volume testing).

## 3. Test Approach & Strategy

Testing will be conducted using a blended approach of manual and automated techniques across multiple test levels[reference:0].

### 3.1. Test Levels

| Level                | Description                                                               | Scope                                                                         | Tools                                     |
| :------------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------------- | :---------------------------------------- |
| **Component (Unit)** | Testing individual components, hooks, and utility functions in isolation. | Logic for validation, price calculation, and component rendering.             | Vitest, React Testing Library, MSW (node) |
| **Integration**      | Testing the interaction between components and the mock API.              | Verifying that components correctly fetch and display data from MSW handlers. | Vitest, MSW (browser), Playwright         |
| **System (E2E)**     | Testing the complete booking flow from the user's perspective.            | End-to-end user journeys through all four steps.                              | Playwright, Allure, MSW (browser)         |
| **Acceptance**       | Manual execution of the test cases defined in `manual-tests.md`.          | Verifying all functional and non-functional requirements are met.             | Manual, Browser DevTools                  |

### 3.2. Test Types & Techniques

- **Functional Testing:** Validating features against requirements. Techniques include equivalence partitioning (postcode validation), boundary value analysis, and state transition testing (booking flow progression).
- **UI/UX Testing:** Ensuring a responsive, accessible, and user-friendly interface across mobile and desktop viewports. Evidence will be captured using automated Playwright scripts.
- **API Testing:** The mock API will be tested implicitly through E2E and integration tests. The test suite will confirm that all API endpoints match the required contract.
- **E2E Test Automation:** A robust suite of automated tests using the Page Object Model (POM) will be developed. POM enhances test maintainability by separating test logic from UI selectors. These tests will cover primary user flows (General, Heavy, Plasterboard) and include assertions at each step.

## 4. Test Case Specification

The detailed manual test cases are documented in a separate file: [`manual-tests.md`](./manual-tests.md). Each test case includes the following columns as per best practices[reference:1]:
| Column | Description |
| :--- | :--- |
| **Req** | Requirement ID being tested. |
| **TC Id** | A unique identifier for the test case. |
| **Test Condition** | A brief description of what is being verified. |
| **Categories** | Classifies the test (e.g., Negative, Edge, Functional). |
| **Importance** | The criticality of the test (Critical, High, Medium, Low). |
| **Potential Severity (1-5)** | The potential impact if this test were to fail (5=highest). |
| **Time Required** | Estimated time to execute the test. |
| **Pre-Condition** | The required state before test execution. |
| **Test Data** | Any specific data needed for the test. |
| **Test Steps** | A clear, numbered list of actions to perform. |
| **Expected Results** | The expected outcome after completing the steps. |
| **Actual Result** | (To be filled during execution) |
| **Status** | (To be filled during execution, e.g., Pass/Fail) |
| **Comment** | Any additional notes or observations. |

## 5. Bug Reporting Guidelines

Any discrepancies found during testing will be documented in [`bug-reports.md`](./bug-reports.md) using the following standardized format:
| Column | Description |
| :--- | :--- |
| **Bug ID** | A unique identifier (e.g., BUG-001). |
| **Bug Title** | A concise summary of the issue. |
| **Bug Description** | A detailed explanation of the problem. |
| **Steps to Reproduce** | Clear, numbered steps to reliably reproduce the bug. |
| **Expected Result** | What the system should have done. |
| **Media** | Reference to an attached screenshot or video (e.g., `bug-reports/double-submit.png`). |
| **Priority** | The urgency of fixing the bug (e.g., High, Medium, Low). |
| **Severity** | The impact of the bug on the system (e.g., High, Medium, Low). |
| **Environment** | The browser/OS combination where the bug was found. |
| **Test Case** | The ID of the related test case (e.g., N10). |

## 6. Entry and Exit Criteria

### 6.1. Entry Criteria

Formal testing will commence when the following conditions are met[reference:2]:

- The test environment is set up and accessible (local dev server).
- The application code is deployed to the test environment and is stable.
- All required test data (MSW fixtures) are configured.
- The test plan and test cases (`manual-tests.md`) have been reviewed and approved.
- All necessary testing tools are installed and configured.

### 6.2. Exit Criteria

Testing will be considered complete when the following conditions are satisfied[reference:3]:

- All planned manual test cases (100%) in `manual-tests.md` have been executed.
- All functional requirements have been met with a pass rate of 95% or higher.
- All critical severity defects have been fixed and verified.
- All automated E2E and unit tests are passing in the CI/CD pipeline.
- All required deliverables (test plan, test cases, bug reports, test summary report) have been completed and approved.
- Code coverage meets a predefined threshold (e.g., >75%).

## 7. Suspension and Resumption Criteria

### 7.1. Suspension Criteria

Testing activities may be temporarily suspended if[reference:4]:

- A critical defect (e.g., Severity 1 - Crash/Blocker) is encountered that prevents further progress on a major part of the application.
- The test environment becomes unstable or unavailable.
- A significant, unplanned change to the application's core functionality is introduced.

### 7.2. Resumption Criteria

Testing can be resumed once:

- The critical defect has been fixed, deployed, and smoke-tested to confirm the fix.
- The test environment is restored and verified to be stable.
- The impact of the unplanned change has been assessed, and the test plan/cases have been updated accordingly.

## 8. Roles and Responsibilities

Due to the nature of this assessment project, all QA responsibilities are consolidated into a single role:
| Role | Responsibility |
| :--- | :--- |
| **QA Automation Engineer (Process Owner)** | The individual responsible for all testing activities, including planning, design, execution (manual & automated), defect reporting, and final reporting. |

## 9. Defect Management

### 9.1. Bug Life Cycle

The following workflow will be used to manage defects:

1.  **Bug Found:** QA identifies a defect during testing.
2.  **Bug Logged:** The defect is documented in `bug-reports.md` with all required information.
3.  **Bug Triage:** (Simulated) The bug's priority and severity are assigned based on the definitions in Section 9.2.
4.  **Developer Fixes:** (Simulated) The developer is assigned the bug and works on a fix.
5.  **Bug Marked as Fixed:** The developer marks the bug as resolved.
6.  **QA Retests:** QA re-tests the functionality in the new build to confirm the fix.
7.  **Bug Verified/Closed:** If the fix is successful, the bug is closed. If not, it is reopened and assigned back to the developer.

### 9.2. Bug Severity and Priority Definition

#### Severity Levels (Impact)

| Severity ID | Severity Level | Description                                                                                               |
| :---------- | :------------- | :-------------------------------------------------------------------------------------------------------- |
| 1           | Critical       | The application crashes, data is corrupted, or a core function is completely unusable with no workaround. |
| 2           | High           | A major feature is unusable or incorrect. A workaround exists but is inconvenient.                        |
| 3           | Medium         | A component or feature has incorrect functionality. A simple workaround exists.                           |
| 4           | Minor          | Cosmetic issues, typos, or documentation errors.                                                          |

#### Priority Levels (Urgency)

| Priority ID | Priority Level     | Description                                                                             |
| :---------- | :----------------- | :-------------------------------------------------------------------------------------- |
| 1           | Must Fix           | Must be fixed immediately; the application cannot be considered complete with this bug. |
| 2           | Should Fix         | Important problem that should be fixed as soon as possible.                             |
| 3           | Fix When Have Time | Should be fixed within available time if it does not delay the project.                 |
| 4           | Low Priority       | Not important at this time; can be addressed after all higher-priority bugs.            |

## 10. Risk Analysis and Mitigation

| Risk                                 | Impact | Probability | Mitigation Strategy                                                                                    |
| :----------------------------------- | :----- | :---------- | :----------------------------------------------------------------------------------------------------- |
| Incomplete test coverage             | High   | Medium      | Review test cases against all requirements in the assessment brief. Use a traceability matrix.         |
| Time constraints                     | Medium | Medium      | Prioritize testing of critical and high-importance features. Use risk-based testing to focus efforts.  |
| Changes in assessment requirements   | High   | Low         | Regularly re-read the assessment brief. If a change occurs, immediately assess impact and adjust plan. |
| False positives from automated tests | Low    | Medium      | Ensure selectors are stable (`data-testid`). Regularly review and maintain the test suite.             |
| Docker environment issues            | Medium | Low         | The application is also deployable to Vercel, providing a reliable fallback for demonstration.         |

## 11. Test Reporting

Testing progress and results will be communicated through:

- **Daily Status Reports:** (Simulated) A brief summary of progress, issues, and plan for the next day.
- **Bug Summary Report:** A summary of all bugs found, categorized by severity and priority, can be derived from `bug-reports.md`.
- **Test Summary Report:** A final report at the conclusion of testing, summarizing all activities and providing metrics on test execution, defect distribution, and overall quality assessment. This report will answer whether the exit criteria have been met and if the application is ready for release.

## 12. Tools and Configuration Management

### 12.1. Testing Tools

| Tool                          | Purpose                                                       |
| :---------------------------- | :------------------------------------------------------------ |
| **Vitest**                    | Unit and component testing framework.                         |
| **React Testing Library**     | Utility for testing React components in a user-centric way.   |
| **Playwright**                | End-to-end test automation framework.                         |
| **Allure**                    | Generating interactive and visually rich test reports.        |
| **MSW**                       | Mocking API requests for deterministic testing.               |
| **Axe-core**                  | Automated accessibility testing engine.                       |
| **Lighthouse**                | Performance, accessibility, and best practices auditing tool. |
| **Husky/lint-staged**         | Pre-commit hooks to maintain code quality.                    |
| **GitHub Actions / CircleCI** | Continuous Integration and Delivery pipelines.                |

### 12.2. Configuration Management

- **Test Code:** All test automation code (unit and E2E) is stored alongside the application source code in a Git repository (`booking-flow-platform`).
- **Test Documentation:** All test documentation (`test-plan.md`, `manual-tests.md`, `bug-reports.md`, etc.) is maintained in the root directory of the same Git repository.
- **Version Control:** Git is used to manage all changes, ensuring a complete history of the test assets is maintained.
