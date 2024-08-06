import { test, expect } from '@playwright/test';


test('Application is running', async ({ page }) => {
  await page.goto('http://localhost:8000');

  // Expect a title "to contain" a substring.
  expect(page.getByText(`This is my index route!`)).toBeTruthy();
});

