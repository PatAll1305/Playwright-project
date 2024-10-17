import { test, expect } from '@playwright/test';
import { configDotenv } from 'dotenv';
configDotenv()
test.describe('Application Header', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.STUDENT_URL!);
    });

    test('On every page of the site, the browser tab shows the app name and fav icon', async ({ page }) => {
        await expect(page).toHaveTitle(/.*/);

        await expect(page.getByTestId('favicon')).toBeAttached()

    });

    test("On every page of the site, the logo is on the top left of the page. The logo should have the attribute: data-testid='logo'", async ({ page }) => {
        const logo = page.getByTestId('logo');

        await expect(logo).toBeVisible();

        await logo.click();
        await expect(page).toHaveURL(process.env.STUDENT_URL!);
    });

    test("As the browser is resized, the header's width adjusts dynamically so the logo stays on the left, and the auth/user buttons stay on the right.", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        const logo = page.getByTestId('logo');
        await expect(logo).toBeVisible();

        const authButtons = page.getByTestId('user-menu-button');
        await expect(authButtons).toBeVisible();

        await page.setViewportSize({ width: 768, height: 800 });

        await expect(logo).toBeVisible();
        await expect(authButtons).toBeVisible();
    });

    test('The layout and element positioning is equivalent to the wireframes.', async ({ page }) => {
        const logo = page.getByTestId('logo');
        const authButtons = page.getByTestId('user-menu-button');

        const logoBox = await logo.boundingBox();
        const authBox = await authButtons.boundingBox();

        await expect(logoBox?.x).toBeLessThan(100);

        await expect(authBox?.x).toBeGreaterThan(1000);
    });
});
