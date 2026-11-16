import { test as base, type Page } from '@playwright/test';

const API_URL = 'http://127.0.0.1:3000';

export type AuthFixtures = {
  authenticatedPage: Page;
  testUser: { email: string; password: string; accessToken: string; refreshToken: string };
};

/**
 * Registers a fresh user, logs in via the API directly, then seeds the tokens
 * into localStorage so every page load is already authenticated.
 */
export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use) => {
    const email = `test-${Date.now()}@e2e.test`;
    const password = 'Password123!';

    // Register
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName: 'Test', lastName: 'User' }),
    });
    if (!registerRes.ok) {
      const body = await registerRes.text();
      throw new Error(`Register failed (${registerRes.status}): ${body}`);
    }

    // Login
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!loginRes.ok) {
      const body = await loginRes.text();
      throw new Error(`Login failed (${loginRes.status}): ${body}`);
    }
    const { accessToken, refreshToken } = (await loginRes.json()) as {
      accessToken: string;
      refreshToken: string;
    };

    await use({ email, password, accessToken, refreshToken });
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Navigate to root once to establish origin for localStorage
    await page.goto('http://localhost:3001/login');

    // Seed tokens into localStorage
    await page.evaluate(
      ({ accessToken, refreshToken }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      },
      { accessToken: testUser.accessToken, refreshToken: testUser.refreshToken },
    );

    await page.goto('http://localhost:3001/dashboard');

    await use(page);
  },
});

export { expect } from '@playwright/test';
