import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load the backend test env so the NestJS server inherits DB_DATABASE=weekly_back_test
dotenv.config({ path: path.resolve(__dirname, '../weekly-back/.env.test'), override: true });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'node dist/main',
      cwd: path.resolve(__dirname, '../weekly-back'),
      url: 'http://127.0.0.1:3000/api',
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env as Record<string, string>,
      },
      timeout: 30_000,
    },
    {
      command: 'npx next dev -p 3001',
      cwd: path.resolve(__dirname, '.'),
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
