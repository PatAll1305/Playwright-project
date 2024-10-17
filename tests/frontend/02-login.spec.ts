import { test, expect } from '@playwright/test';
import { configDotenv } from 'dotenv';
configDotenv()

test.describe("Feature: Log in", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.STUDENT_URL!);
    });

    test('On every page of the site, a Profile button must be at the top-right of the page.  It should have have the attribute: data-testid="user-menu-button"', async ({ page }) => {
        let profileButton = await page.getByTestId("user-menu-button");
        await expect(profileButton).toBeVisible();
    });

    test('The menu must contain both a "Sign up" and "Log in" menu option.', async ({ page }) => {
        await expect(page.getByTestId("login-menu-button")).toBeHidden();
        await expect(page.getByTestId("signup-menu-button")).toBeHidden();
        await page.getByTestId("user-menu-button").click();
        await expect(page.getByTestId("login-menu-button")).toBeVisible();
        await expect(page.getByTestId("signup-menu-button")).toBeVisible();
        await expect(page.getByTestId("login-menu-button")).toHaveText('Log In', { ignoreCase: false });
        await expect(page.getByTestId("signup-menu-button")).toHaveText('Sign Up', { ignoreCase: false });
    });

    test('Upon clicking the "Log in" menu option, it opens a modal pop-up that prompts the Username and Password input boxes and a "Log in" button.', async ({ page }) => {
        await expect(page.getByTestId("login-modal").last()).toBeHidden();
        await expect(page.getByTestId("credential-input").last()).toBeHidden();
        await expect(page.getByTestId("password-input").last()).toBeHidden();
        await expect(page.getByTestId("login-button").last()).toBeHidden();
        await page.getByTestId("user-menu-button").click();
        await page.getByText("Log in").click();
        await expect(page.getByTestId("login-modal").last()).toBeVisible();
        await expect(page.getByTestId("credential-input").last()).toBeVisible();
        await expect(page.getByTestId("password-input").last()).toBeVisible();
        await expect(page.getByTestId("login-button").last()).toBeVisible();
    });

    test('Within the modal, the "Log in" button must be disabled anytime the username is less than 4 characters or the password is less than 6 characters.', async ({ page }) => {
        await expect(page.getByTestId("login-menu-button")).toBeHidden();
        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();

        const loginButton = page.getByTestId("login-button").last();

        await expect(loginButton).toBeDisabled();
        await expect(page.getByText(/Username\sor\sEmail/, { exact: true })).toBeTruthy()
        await expect(page.getByText(/Password/, { exact: true })).toBeTruthy()

        await page.getByTestId("credential-input").last().fill("abc");
        await page.getByTestId("password-input").last().fill("12345");
        await expect(loginButton).toBeDisabled();

        await page.getByTestId("credential-input").last().fill("abcd");
        await expect(loginButton).toBeDisabled();

        await page.getByTestId("credential-input").last().fill("");
        await page.getByTestId("password-input").last().fill("123456");
        await expect(loginButton).toBeDisabled();

        await page.getByTestId("credential-input").last().fill("abcd");
        await expect(loginButton).toBeEnabled();
    });

    test('Attempting to log in with an invalid username or password must prompt the error message "The provided credentials were invalid".', async ({ page }) => {
        await expect(page.getByText("The provided credentials were invalid")).toBeHidden();
        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();
        await expect(page.getByText("The provided credentials were invalid")).toBeHidden();

        await page.getByTestId("credential-input").last().fill("invaliduser");
        await page.getByTestId("password-input").last().fill("invalidpass");
        await page.getByTestId("login-button").last().click();

        await expect(page.getByText("The provided credentials were invalid")).toBeVisible();
    });

    test("Upon logging in with a valid username and password, it must successfully log-in the user and sets their session cookie.", async ({ page, context }) => {
        let cookies = await context.cookies();
        let sessionCookie = cookies.find((cookie) => cookie.name === "XSRF-TOKEN");
        expect(sessionCookie).toBeUndefined();

        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();

        await page.getByTestId("credential-input").last().fill("demouser@example.com");
        await page.getByTestId("password-input").last().fill("password");
        await page.getByTestId("login-button").last().click();

        cookies = await context.cookies();
        sessionCookie = cookies.find((cookie) => cookie.name === "XSRF-TOKEN");
        expect(sessionCookie).toBeTruthy();
    });

    test('Upon logging in with a valid email and password, the "Log in" and "Sign up" buttons at the top of the page are hidden.', async ({ page }) => {
        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();

        await page.getByTestId("credential-input").last().fill("Demo-lition");
        await page.getByTestId("password-input").last().fill("password");
        await page.getByTestId("login-button").last().click();

        await page.getByTestId("user-menu-button").click();
        await expect(page.getByTestId("login-menu-button")).toBeAttached({ attached: false });
        await expect(page.getByTestId("signup-menu-button")).toBeAttached({ attached: false });
    });

    test("Upon logging in with a valid username and password, it shows the User Menu Button.", async ({ page }) => {
        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();

        await page.getByTestId("credential-input").last().fill("demouser@example.com");
        await page.getByTestId("password-input").last().fill("password");
        await page.getByTestId("login-button").last().click();

        await expect(page.getByTestId("user-menu-button")).toBeVisible();
    });

    test('In the log-in modal, an extra link or button is available with the label "Log in as Demo User". Upon clicking this "Log in as Demo User" button, it will log the user into the "demo" account.', async ({ page, context }) => {
        let cookies = await context.cookies();
        let sessionCookie = cookies.find((cookie) => cookie.name === "XSRF-TOKEN");
        await expect(sessionCookie).toBeUndefined()

        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();

        await expect(page.getByTestId('demo-login-button').last()).toBeVisible();
        await expect(page.getByTestId('demo-login-button').last()).toHaveText('Demo User', { ignoreCase: true });
        await page.getByTestId('demo-login-button').last().click();

        cookies = await context.cookies();
        sessionCookie = cookies.find((cookie) => cookie.name === "XSRF-TOKEN");

        await expect(sessionCookie).toBeTruthy();

        await expect(page.getByTestId("user-menu-button")).toBeVisible();
    });

    test("Upon closing the log-in modal, it resets errors and clears all data entered. When it reopens it will be in the default state (empty inputs and disabled button).", async ({ page }) => {
        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();
        await expect(page.getByText("The provided credentials were invalid")).toBeHidden();

        await page.getByTestId("credential-input").last().fill("invaliduser");
        await page.getByTestId("password-input").last().fill("invalidpass");
        await page.getByTestId("login-button").last().click();

        await expect(page.getByText("The provided credentials were invalid")).toBeVisible();

        await page.mouse.click(0, 0);
        await expect(page.getByTestId("login-modal")).toBeAttached({ attached: false });

        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();

        await expect(page.getByTestId("credential-input").last()).toHaveValue("");
        await expect(page.getByTestId("password-input").last()).toHaveValue("");
        await expect(page.getByTestId("login-button").last()).toBeDisabled();
        await expect(page.getByText("The provided credentials were invalid")).toBeHidden();
    });

    test("The layout and element positioning is equivalent to the wireframes.", async ({ page }) => {
        await page.getByTestId("user-menu-button").click();
        await page.getByTestId("login-menu-button").click();

        const loginModal = await page.getByTestId("login-modal").last();
        const usernameInput = await page.getByTestId("credential-input").last();
        const passwordInput = await page.getByTestId("password-input").last();
        const loginButton = await page.getByTestId("login-button").last();
        const errorMessage = await page.getByText("The provided credentials were invalid")
        const demoButton = await page.getByTestId('demo-login-button').last()

        await expect(loginModal).toBeVisible();

        const modalBoundingBox = await loginModal.boundingBox();
        const usernameBoundingBox = await usernameInput.boundingBox();
        const passwordBoundingBox = await passwordInput.boundingBox();
        const loginButtonBoundingBox = await loginButton.boundingBox();
        const demoButtonBoundingBox = await demoButton.boundingBox()

        await expect(usernameBoundingBox?.y).toBeLessThan(passwordBoundingBox?.y!);
        await expect(loginButtonBoundingBox?.y).toBeGreaterThan(passwordBoundingBox?.y!);
        await expect(demoButtonBoundingBox?.y).toBeGreaterThan(passwordBoundingBox?.y!);
        await expect(usernameBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);
        await expect(passwordBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);
        await expect(loginButtonBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);
        await expect(demoButtonBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);

        await page.getByTestId("credential-input").last().fill("invaliduser");
        await page.getByTestId("password-input").last().fill("invalidpass");
        await page.getByTestId("login-button").last().click();
        await expect(errorMessage).toBeVisible()

        await expect(usernameBoundingBox?.y).toBeLessThan(passwordBoundingBox?.y!);
        await expect(loginButtonBoundingBox?.y).toBeGreaterThan(passwordBoundingBox?.y!);
        await expect(usernameBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);
        await expect(passwordBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);
        await expect(loginButtonBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);
        await expect(demoButtonBoundingBox?.x).toBeGreaterThan(modalBoundingBox?.x!);
    });
});
