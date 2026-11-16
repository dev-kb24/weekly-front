import { test, expect } from '@playwright/test';

const API = 'http://127.0.0.1:3000';

async function registerAndLogin(email: string, password: string) {
  await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName: 'Test', lastName: 'User' }),
  });
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return (await res.json()) as { accessToken: string; refreshToken: string };
}

test.describe('Authentication', () => {
  test('redirects unauthenticated user from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Adresse e-mail').fill('nobody@e2e.test');
    await page.getByLabel('Mot de passe').fill('WrongPass!');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    // NestJS returns 'Invalid credentials' — displayed as plain text by LoginForm
    // Wrap in a p.text-sm element, wait for API response
    await expect(page.getByText('Email ou mot de passe incorrect.')).toBeVisible({ timeout: 8_000 });
  });

  test('registers via UI and lands on dashboard', async ({ page }) => {
    const email = `reg-${Date.now()}@e2e.test`;

    await page.goto('/register');
    await page.getByLabel('Prénom').fill('Test');
    await page.getByLabel('Nom', { exact: true }).fill('User');
    await page.getByLabel('Adresse e-mail').fill(email);
    await page.getByLabel('Mot de passe').fill('Password123!');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('logs in via UI and lands on dashboard', async ({ page }) => {
    const email = `login-${Date.now()}@e2e.test`;
    const password = 'Password123!';
    await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName: 'Test', lastName: 'User' }),
    });

    await page.goto('/login');
    await page.getByLabel('Adresse e-mail').fill(email);
    await page.getByLabel('Mot de passe').fill(password);
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('logs out and redirects to /login', async ({ page }) => {
    const email = `logout-${Date.now()}@e2e.test`;
    const password = 'Password123!';
    const { accessToken, refreshToken } = await registerAndLogin(email, password);

    await page.goto('/login');
    await page.evaluate(
      ({ at, rt }) => {
        localStorage.setItem('accessToken', at);
        localStorage.setItem('refreshToken', rt);
      },
      { at: accessToken, rt: refreshToken },
    );
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    await page.getByRole('button', { name: 'Déconnexion' }).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});

test.describe('Landing page redirect', () => {
  test('redirige vers /dashboard si un token valide existe en localStorage', async ({ page }) => {
    const email = `landing-${Date.now()}@e2e.test`;
    const password = 'Password123!';
    const { accessToken, refreshToken } = await registerAndLogin(email, password);

    // Seed tokens before visiting the landing page
    await page.goto('/login');
    await page.evaluate(
      ({ at, rt }) => {
        localStorage.setItem('accessToken', at);
        localStorage.setItem('refreshToken', rt);
      },
      { at: accessToken, rt: refreshToken },
    );

    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('reste sur la page d\'accueil si aucun token n\'est présent', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('http://localhost:3001/', { timeout: 5_000 });
    await expect(page.getByRole('link', { name: 'Connexion' })).toBeVisible();
  });
});
