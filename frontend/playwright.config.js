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

  webServer: {
    command: 'node src/app.js', 
    url: 'http://localhost:3000/painel/entregas',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    cwd: '../', // ISSO AQUI RESOLVE O ERRO: Força o servidor a rodar na raiz para ler o .env
  },
});