import { test, expect } from '@playwright/test';
import { configDotenv } from 'dotenv';
configDotenv()

test.describe("Feature: Log in", () => {
    test.beforeEach(async ({ page, context }) => {
        await page.goto(process.env.STUDENT_URL!);
        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();
        await page.getByTestId('demo-login-button').last().click();
    });

    test('On every page of the site, should be able to see a User Menu Button in the upper-right corner that opens a drop-down menu when clicked', async ({ page }) => {
        await expect(page.getByTestId('user-menu-button')).toBeVisible();
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-menu-button')).toBeVisible();
        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
    });

    test("After a user successfully logs in, The user drop down menu contains the logged in user\'s first name as a greeting\: \'Hello, <first name>\'", async ({ page }) => {
        await expect(page.getByText('Hello, Demo', { exact: false })).toBeAttached({ attached: false });
        await expect(page.getByText('Hello, Demo', { exact: false })).toBeHidden();
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByText('Hello, Demo', { exact: false })).toBeAttached();
        await expect(page.getByText('Hello, Demo', { exact: false })).toBeVisible();
    });

    test("After a user successfully logs in, The user drop down menu contains the logged in user\'s email: \`<email>\`.", async ({ page }) => {
        await expect(page.getByText('demouser@example.com', { exact: false })).toBeAttached({ attached: false });
        await expect(page.getByText('demouser@example.com', { exact: false })).toBeHidden();
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByText('demouser@example.com', { exact: false })).toBeAttached();
        await expect(page.getByText('demouser@example.com', { exact: false })).toBeVisible();
    });

    test("After a user successfully logs in, The user drop down menu contains: a \"Log out\" Button as a menu option.", async ({ page }) => {
        await expect(page.getByText('Log Out', { exact: false })).toBeAttached({ attached: false });
        await expect(page.getByText('Log Out', { exact: false })).toBeHidden();
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByText('Log Out', { exact: false })).toBeAttached();
        await expect(page.getByText('Log Out', { exact: false })).toBeVisible();
    });

    test("After a user successfully logs in, the user menu does NOT contain the \"Log in \" or \"Sign up\" menu options.", async ({ page }) => {
        await expect(page.getByText('Log Out', { exact: false })).toBeAttached({ attached: false });
        await expect(page.getByText('Log Out', { exact: false })).toBeHidden();
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByText('Log Out', { exact: false })).toBeAttached();
        await expect(page.getByText('Log Out', { exact: false })).toBeVisible();
    });

    test("Upon clicking anywhere outside the User Menu (including on the User Menu Button), the menu drop down hides.", async ({ page }) => {
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached({ attached: false });
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached();

        await page.mouse.click(0, 0)

        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();
    });

    test("Upon clicking anywhere on the greeting or email inside the user drop down menu, the User Menu remains open.", async ({ page }) => {
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached({ attached: false });
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached();

        await page.getByText('demouser@example.com', { exact: false }).click()
        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached();

        await page.getByText('Hello, Demo', { exact: false }).click()
        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached();

    });

    //TODO Implement proper testing for the token being removed, presently cannot get the 'token' cookie though it is visible manually
    // test("Upon clicking the \"Log out\" menu option, it performs a log out where it will clear the session/cookie.", async ({ page, context }) => {
    //     let cookies = await context.cookies();
    //     console.log(cookies)
    //     let sessionCookie = cookies.find(cookie => cookie.name === 'token');
    //     await expect(sessionCookie).toBeTruthy();

    //     await page.getByTestId('user-menu-button').click();
    //     await page.getByText('log out', { exact: false }).click();

    //     cookies = await context.cookies();
    //     sessionCookie = cookies.find(cookie => cookie.name === 'token');
    //     await expect(sessionCookie).toBeUndefined();
    // });

    test("Upon clicking the \"Log out\" button, it performs a log out where it will close the user drop down menu.", async ({ page }) => {
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached({ attached: false });
        await expect(page.getByTestId('user-dropdown-menu')).toBeHidden();

        await page.getByTestId('user-menu-button').click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeVisible();
        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached();

        await page.getByText('log out', { exact: false }).click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached({ attached: false });
    });

    test("Upon clicking the \"Log Out\" button, it performs a log out where it will navigate the user to the home page (`/`).", async ({ page }) => {
        await page.getByTestId('user-menu-button').click();
        await page.getByText('View Events', { exact: false }).click();

        await page.getByText('log out', { exact: false }).click();

        await expect(page.getByTestId('user-dropdown-menu')).toBeAttached({ attached: false });
        await expect(page.url()).toBe(process.env.STUDENT_URL + '/')
    });

    //TODO create wireframe tests

});