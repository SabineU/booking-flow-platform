import { test, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import type { Flags } from 'lighthouse';

test.describe('Lighthouse Audit', () => {
  test('Performance and accessibility scores meet thresholds', async ({ page }) => {
    // Wait for the app to be fully loaded
    await page.goto('/');
    await expect(page.locator('[data-testid="postcode-input"]')).toBeVisible();

    const url = page.url();

    // Use Playwright's Chromium executable path
    const chromePath = chromium.executablePath();

    // Launch Chrome with Lighthouse using the Playwright Chromium binary
    const chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: ['--headless=new'],
    });

    const options: Flags = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse(url, options);

    const performanceScore = runnerResult?.lhr.categories.performance.score ?? 0;
    const accessibilityScore = runnerResult?.lhr.categories.accessibility.score ?? 0;

    console.log(`Performance score: ${performanceScore}`);
    console.log(`Accessibility score: ${accessibilityScore}`);

    expect(performanceScore).toBeGreaterThanOrEqual(0.5);
    expect(accessibilityScore).toBeGreaterThanOrEqual(0.95);

    // Save the HTML report
    const reportHtml = runnerResult?.report;
    const reportDir = path.join(process.cwd(), 'lighthouse-report');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    fs.writeFileSync(path.join(reportDir, 'report.html'), reportHtml as string);

    // Gracefully kill Chrome – ignore Windows EPERM cleanup error
    try {
      await chrome.kill();
    } catch (error: any) {
      // On Windows, chrome-launcher sometimes fails to delete temp dir with EPERM.
      // The test has already passed, so we can safely ignore this error.
      if (error.code === 'EPERM' || error.message.includes('EPERM')) {
        console.warn('Ignoring Windows EPERM error during Chrome cleanup.');
      } else {
        throw error;
      }
    }
  });
});
