import { test, expect } from '@playwright/test';


test.describe('Groups route is correct', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/api/groups');
    })
    test('Groups main page is correct', async ({ page }) => {

        console.log(page)
        // await expect(page.)
    })
})