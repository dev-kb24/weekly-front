import { test, expect } from './fixtures/auth.fixture';

test.describe('Dashboard', () => {
  test('displays week view with navigation arrows', async ({ authenticatedPage: page }) => {
    // Week label is rendered by formatWeekLabel (e.g. "28 avr. – 4 mai 2026")
    await expect(page.getByLabel('Semaine précédente')).toBeVisible();
    await expect(page.getByLabel('Semaine suivante')).toBeVisible();
  });

  test('can navigate to previous and next week', async ({ authenticatedPage: page }) => {
    const weekLabel = page.locator('span.text-sm.font-semibold');
    const initialLabel = await weekLabel.textContent();

    await page.getByLabel('Semaine suivante').click();
    await expect(weekLabel).not.toHaveText(initialLabel ?? '');

    await page.getByLabel('Semaine précédente').click();
    await expect(weekLabel).toHaveText(initialLabel ?? '');
  });

  test('opens create seance modal on "Nouvelle séance" button click', async ({
    authenticatedPage: page,
  }) => {
    // The WeekView renders a "Nouvelle séance" button on desktop
    await page.getByRole('button', { name: 'Nouvelle séance' }).first().click();

    // Modal title appears
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole('heading', { name: 'Nouvelle séance' })).toBeVisible();
  });

  test('creates a new seance and closes the modal', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    // Open the modal
    await page.getByRole('button', { name: 'Nouvelle séance' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    // Fill in the date field
    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);

    // Fill in the title
    await page.getByRole('dialog').getByLabel('Titre').fill('Séance E2E');

    // Fill in the required duration field (default partie is TIME, durationMinutes required)
    await page.getByRole('dialog').getByLabel('Durée (min)').fill('20');

    // Submit
    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();

    // Modal closes
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });
  });
});
