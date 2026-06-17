import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

// No seu frontend/playwright.config.js
  webServer: {
    command: 'node --env-file=.env src/app.js', // O Node garante a injeção do .env na raiz
    url: 'http://localhost:3000/painel/entregas',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    cwd: '../', // Mantém a execução a partir da raiz do projeto
  },
});