import { test, expect } from './fixtures/auth.fixture';

const API = 'http://127.0.0.1:3000';

// ─── Helpers ──────────────────────────────────────────────────────────────

type PartiePayload = {
  order: number;
  type: string;
  durationUnit: string;
  durationMinutes: number | null;
  distanceKm: number | null;
  cadenceType: string;
  heartRateZone: number | null;
  allureMinMin: number | null;
  allureMinMax: number | null;
  repetitions: number;
  blockId: string | null;
};

async function createSeance(
  accessToken: string,
  overrides: {
    date?: string;
    title?: string | null; // null = ne pas envoyer le champ title
    notes?: string;
    parties?: PartiePayload[];
  } = {},
): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const defaultPartie: PartiePayload = {
    order: 1,
    type: 'echauffement',
    durationUnit: 'time',
    durationMinutes: 10,
    distanceKm: null,
    cadenceType: 'zone',
    heartRateZone: 2,
    allureMinMin: null,
    allureMinMax: null,
    repetitions: 1,
    blockId: null,
  };
  // null = pas de titre, undefined = titre par défaut
  const title = overrides.title === null ? undefined : (overrides.title ?? 'Séance test E2E');
  const res = await fetch(`${API}/seances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      date: overrides.date ?? today,
      ...(title != null && { title }),
      ...(overrides.notes != null && { notes: overrides.notes }),
      parties: overrides.parties ?? [defaultPartie],
    }),
  });
  if (!res.ok) throw new Error(`Create seance failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { data: { id: string } };
  return json.data.id;
}

// ─── Détail / édition / suppression ──────────────────────────────────────

test.describe('Détail / édition / suppression de séance', () => {
  let seanceId: string;

  test.beforeEach(async ({ testUser }) => {
    seanceId = await createSeance(testUser.accessToken, { notes: 'Notes de test' });
  });

  test('affiche les détails de la séance sur la page de détail', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);

    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Notes de test')).toBeVisible();
  });

  test('affiche la liste des parties avec type et durée', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText(/Parties \(\d+\)/)).toBeVisible();
    await expect(page.getByText('Échauffement')).toBeVisible();
    await expect(page.getByText('10 min')).toBeVisible();
  });

  test('affiche le numéro d\'ordre des parties sur le détail', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText('Partie 1')).toBeVisible();
  });

  test('une séance sans titre affiche la date formatée comme titre sur la page de détail', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    const today = new Date().toISOString().slice(0, 10);
    const formatted = new Date(today + 'T00:00:00').toLocaleDateString('fr-FR');
    const id = await createSeance(testUser.accessToken, { title: null });
    await page.goto(`/seances/${id}`);

    // The <h1> should contain the formatted date since no title was given
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(formatted, { timeout: 10_000 });
    // The DetailRow for Date should also show the same value
    await expect(page.getByText(formatted).first()).toBeVisible();
  });

  test('le bouton retour quitte la page de détail', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard');
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: '← Retour' }).click();

    // Should leave the detail page
    await expect(page).not.toHaveURL(new RegExp(`/seances/${seanceId}$`), { timeout: 5_000 });
  });

  test('peut modifier le titre de la séance via la modale', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const titleInput = page.getByRole('dialog').getByLabel('Titre (optionnel)');
    await titleInput.clear();
    await titleInput.fill('Séance modifiée E2E');

    await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer les modifications' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Séance modifiée E2E')).toBeVisible({ timeout: 5_000 });
  });

  test('peut modifier les notes de la séance via la modale', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const notesTextarea = page.getByRole('dialog').getByPlaceholder('Ressenti, conditions, remarques…');
    await notesTextarea.clear();
    await notesTextarea.fill('Notes mises à jour');

    await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer les modifications' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Notes mises à jour')).toBeVisible({ timeout: 5_000 });
  });

  test('annuler la modale de modification ne change pas la séance', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const titleInput = page.getByRole('dialog').getByLabel('Titre (optionnel)');
    await titleInput.clear();
    await titleInput.fill('Titre qui ne sera pas sauvegardé');

    await page.getByRole('dialog').getByRole('button', { name: 'Annuler' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 });
    await expect(page.getByText('Séance test E2E')).toBeVisible();
    await expect(page.getByText('Titre qui ne sera pas sauvegardé')).not.toBeVisible();
  });

  test('peut ajouter une partie via la modale de modification', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Parties (1)')).toBeVisible();

    await page.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    await page.getByRole('dialog').getByRole('button', { name: '+ Partie simple' }).click();

    // Fill required field for new partie
    const durationInputs = page.getByRole('dialog').getByLabel('Durée (min)');
    await durationInputs.nth(1).fill('15');

    await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer les modifications' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Parties (2)')).toBeVisible({ timeout: 5_000 });
  });

  test('modifier la durée d\'une partie ne change pas l\'ordre des parties', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    const id = await createSeance(testUser.accessToken, {
      title: 'Séance ordre parties',
      parties: [
        { order: 1, type: 'echauffement', durationUnit: 'time', durationMinutes: 10, distanceKm: null, cadenceType: 'zone', heartRateZone: 2, allureMinMin: null, allureMinMax: null, repetitions: 1, blockId: null },
        { order: 2, type: 'running', durationUnit: 'time', durationMinutes: 20, distanceKm: null, cadenceType: 'zone', heartRateZone: 3, allureMinMin: null, allureMinMax: null, repetitions: 1, blockId: null },
      ],
    });
    await page.goto(`/seances/${id}`);
    await expect(page.getByText('Séance ordre parties')).toBeVisible({ timeout: 10_000 });

    // Verify initial order: Partie 1 = Échauffement, Partie 2 = Running
    await expect(page.locator('div').filter({ hasText: /\bPartie 1\b/ }).filter({ hasText: 'Échauffement' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /\bPartie 2\b/ }).filter({ hasText: 'Running' }).first()).toBeVisible();

    // Open edit modal and change only the duration of the first partie
    await page.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const durationInputs = page.getByRole('dialog').getByLabel('Durée (min)');
    await durationInputs.nth(0).clear();
    await durationInputs.nth(0).fill('15');

    await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer les modifications' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    // Order must be preserved: Partie 1 = Échauffement, Partie 2 = Running
    await expect(page.locator('div').filter({ hasText: /\bPartie 1\b/ }).filter({ hasText: 'Échauffement' }).first()).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('div').filter({ hasText: /\bPartie 2\b/ }).filter({ hasText: 'Running' }).first()).toBeVisible();
    // Updated duration is reflected
    await expect(page.getByText('15 min')).toBeVisible();
  });

  test('modifier une partie dans un bloc répété ne change pas l\'ordre du bloc', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    const sharedBlockId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const id = await createSeance(testUser.accessToken, {
      title: 'Séance ordre bloc',
      parties: [
        { order: 1, type: 'running', durationUnit: 'time', durationMinutes: 5, distanceKm: null, cadenceType: 'zone', heartRateZone: 3, allureMinMin: null, allureMinMax: null, repetitions: 3, blockId: sharedBlockId },
        { order: 2, type: 'recuperation', durationUnit: 'time', durationMinutes: 2, distanceKm: null, cadenceType: 'zone', heartRateZone: 1, allureMinMin: null, allureMinMax: null, repetitions: 3, blockId: sharedBlockId },
      ],
    });
    await page.goto(`/seances/${id}`);
    await expect(page.getByText('Séance ordre bloc')).toBeVisible({ timeout: 10_000 });

    // Verify initial order: Partie 1 = Running, Partie 2 = Récupération
    await expect(page.locator('div').filter({ hasText: /\bPartie 1\b/ }).filter({ hasText: 'Running' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /\bPartie 2\b/ }).filter({ hasText: 'Récupération' }).first()).toBeVisible();

    // Open edit modal and change only the duration of the first partie in the bloc
    await page.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const durationInputs = page.getByRole('dialog').getByLabel('Durée (min)');
    await durationInputs.nth(0).clear();
    await durationInputs.nth(0).fill('7');

    await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer les modifications' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    // Order within the bloc must be unchanged: Partie 1 = Running, Partie 2 = Récupération
    await expect(page.locator('div').filter({ hasText: /\bPartie 1\b/ }).filter({ hasText: 'Running' }).first()).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('div').filter({ hasText: /\bPartie 2\b/ }).filter({ hasText: 'Récupération' }).first()).toBeVisible();
    // Updated duration is reflected
    await expect(page.getByText('7 min')).toBeVisible();
  });

  test('modifier le contenu d\'un bloc répété ne déplace pas sa position parmi les autres parties', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    // Layout: [Partie 1: échauffement] [Partie 2+3: running+récupération bloc×2] [Partie 4: échauffement]
    const blocId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const id = await createSeance(testUser.accessToken, {
      title: 'Séance position bloc',
      parties: [
        { order: 1, type: 'echauffement', durationUnit: 'time', durationMinutes: 10, distanceKm: null, cadenceType: 'zone', heartRateZone: 2, allureMinMin: null, allureMinMax: null, repetitions: 1, blockId: null },
        { order: 2, type: 'running',      durationUnit: 'time', durationMinutes: 5,  distanceKm: null, cadenceType: 'zone', heartRateZone: 3, allureMinMin: null, allureMinMax: null, repetitions: 2, blockId: blocId },
        { order: 3, type: 'recuperation', durationUnit: 'time', durationMinutes: 2,  distanceKm: null, cadenceType: 'zone', heartRateZone: 1, allureMinMin: null, allureMinMax: null, repetitions: 2, blockId: blocId },
        { order: 4, type: 'echauffement', durationUnit: 'time', durationMinutes: 8,  distanceKm: null, cadenceType: 'zone', heartRateZone: 2, allureMinMin: null, allureMinMax: null, repetitions: 1, blockId: null },
      ],
    });

    await page.goto(`/seances/${id}`);
    await expect(page.getByText('Séance position bloc')).toBeVisible({ timeout: 10_000 });

    // Verify initial layout
    await expect(page.locator('div').filter({ hasText: /\bPartie 1\b/ }).filter({ hasText: 'Échauffement' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /\bPartie 2\b/ }).filter({ hasText: 'Running' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /\bPartie 3\b/ }).filter({ hasText: 'Récupération' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /\bPartie 4\b/ }).filter({ hasText: 'Échauffement' }).first()).toBeVisible();

    // Edit only the duration of the Running partie inside the bloc — no reordering
    await page.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const durationInputs = page.getByRole('dialog').getByLabel('Durée (min)');
    await durationInputs.nth(1).clear();  // Running (index 1 after échauffement at 0)
    await durationInputs.nth(1).fill('9');

    await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer les modifications' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    // The bloc must not have shifted: Partie 1 still échauffement, bloc still at 2-3, Partie 4 still échauffement
    await expect(page.locator('div').filter({ hasText: /\bPartie 1\b/ }).filter({ hasText: 'Échauffement' }).first()).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('div').filter({ hasText: /\bPartie 2\b/ }).filter({ hasText: 'Running' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /\bPartie 3\b/ }).filter({ hasText: 'Récupération' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /\bPartie 4\b/ }).filter({ hasText: 'Échauffement' }).first()).toBeVisible();
    // Updated duration is visible
    await expect(page.getByText('9 min')).toBeVisible();
  });

  test('annuler la modale de suppression conserve la séance', async ({ authenticatedPage: page }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Supprimer' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    // Click cancel (closes the confirm modal)
    await page.getByRole('dialog').getByRole('button', { name: 'Annuler' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 });
    // Still on the same page with the seance visible
    await expect(page.getByText('Séance test E2E')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/seances/${seanceId}`));
  });

  test('peut supprimer une séance et est redirigé vers le dashboard', async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`/seances/${seanceId}`);
    await expect(page.getByText('Séance test E2E')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Supprimer' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    await page.getByRole('dialog').getByRole('button', { name: 'Supprimer' }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });
});

// ─── Création depuis le dashboard ────────────────────────────────────────

test.describe('Création de séance depuis le dashboard', () => {
  async function openCreateModal(page: Parameters<Parameters<typeof test>[1]>[0]) {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Nouvelle séance' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  }

  test('crée une séance sans titre (repli sur la date)', async ({
    authenticatedPage: page,
  }) => {
    await openCreateModal(page);

    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);
    // Leave title empty
    await page.getByRole('dialog').getByLabel('Durée (min)').fill('30');

    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    // The date should appear somewhere on the WeekView as fallback title
    const formatted = new Date(today + 'T00:00:00').toLocaleDateString('fr-FR');
    await expect(page.getByText(formatted).first()).toBeVisible({ timeout: 5_000 });
  });

  test('crée une séance avec notes et les vérifie sur la page de détail', async ({
    authenticatedPage: page,
  }) => {
    await openCreateModal(page);

    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);
    await page.getByRole('dialog').getByLabel('Titre (optionnel)').fill('Séance avec notes');
    await page.getByRole('dialog').getByLabel('Durée (min)').fill('20');
    await page.getByRole('dialog').getByPlaceholder('Ressenti, conditions, remarques…').fill('Bonne séance');

    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    // Navigate to detail via the card link
    await page.getByText('Séance avec notes').first().click();
    await expect(page.getByText('Bonne séance')).toBeVisible({ timeout: 5_000 });
  });

  test('crée une séance avec l\'unité distance', async ({ authenticatedPage: page }) => {
    await openCreateModal(page);

    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);
    await page.getByRole('dialog').getByLabel('Titre (optionnel)').fill('Séance distance');

    // Switch measurement to Distance
    await page.getByRole('dialog').getByLabel('Mesure').selectOption('distance');

    await page.getByRole('dialog').getByLabel('Distance (km)').fill('10');

    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    await page.getByText('Séance distance').first().click();
    await expect(page.getByText('10 km')).toBeVisible({ timeout: 5_000 });
  });

  test('crée une séance avec le type de cadence allure', async ({ authenticatedPage: page }) => {
    await openCreateModal(page);

    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);
    await page.getByRole('dialog').getByLabel('Titre (optionnel)').fill('Séance allure');
    await page.getByRole('dialog').getByLabel('Durée (min)').fill('25');

    // Switch cadence to Allure
    await page.getByRole('dialog').getByLabel('Cadence').selectOption('allure');

    // Set allure min: 5 min 30 s
    await page.getByRole('dialog').getByLabel('Allure min — min').selectOption('5');
    await page.getByRole('dialog').getByLabel('Allure min — sec').selectOption('30');

    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    await page.getByText('Séance allure').first().click();
    await expect(page.getByText(/5'30"/)).toBeVisible({ timeout: 5_000 });
  });

  test('crée une séance avec un bloc répété (visible comme × N en vue jour)', async ({
    authenticatedPage: page,
  }) => {
    await openCreateModal(page);

    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);
    await page.getByRole('dialog').getByLabel('Titre (optionnel)').fill('Séance bloc répété');

    // Fill existing single partie
    await page.getByRole('dialog').getByLabel('Durée (min)').fill('10');

    // Add a repeat bloc
    await page.getByRole('dialog').getByRole('button', { name: '+ Bloc répété' }).click();

    // Set repetitions to 4
    await page.getByRole('dialog').getByLabel('Répétitions').fill('4');

    // Fill required fields in the new bloc (Running + Récupération)
    const durationInputs = page.getByRole('dialog').getByLabel('Durée (min)');
    await durationInputs.nth(1).fill('3');
    await durationInputs.nth(2).fill('1');

    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    // Verify the card is in WeekView
    await expect(page.getByText('Séance bloc répété')).toBeVisible({ timeout: 5_000 });

    // Navigate to DayView (click today's day column) to see the × 4 bloc display
    const todayDayNum = new Date().getDate().toString();
    await page.getByRole('button', { name: new RegExp(`\\b${todayDayNum}\\b`) }).first().click();

    // SeanceDayCard in DayView groups the bloc and shows × N
    await expect(page.getByText('× 4')).toBeVisible({ timeout: 5_000 });
  });

  test('crée une séance avec plusieurs parties et affiche le bon compteur', async ({
    authenticatedPage: page,
  }) => {
    await openCreateModal(page);

    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);
    await page.getByRole('dialog').getByLabel('Titre (optionnel)').fill('Multi parties');

    // Fill initial partie
    await page.getByRole('dialog').getByLabel('Durée (min)').fill('10');

    // Add two more parties
    await page.getByRole('dialog').getByRole('button', { name: '+ Partie simple' }).click();
    const durationInputs = page.getByRole('dialog').getByLabel('Durée (min)');
    await durationInputs.nth(1).fill('20');

    await page.getByRole('dialog').getByRole('button', { name: '+ Partie simple' }).click();
    await durationInputs.nth(2).fill('5');

    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    await page.getByText('Multi parties').first().click();
    await expect(page.getByText('Parties (3)')).toBeVisible({ timeout: 5_000 });
  });

  test('annuler la modale de création ne crée pas de séance', async ({
    authenticatedPage: page,
  }) => {
    await openCreateModal(page);

    await page.getByRole('dialog').getByLabel('Titre (optionnel)').fill('Séance annulée');

    await page.getByRole('dialog').getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 });

    await expect(page.getByText('Séance annulée')).not.toBeVisible();
  });

  test('la séance créée apparaît dans la vue semaine pour aujourd\'hui', async ({
    authenticatedPage: page,
  }) => {
    await openCreateModal(page);

    const today = new Date().toISOString().slice(0, 10);
    await page.getByRole('dialog').getByLabel('Date').fill(today);
    await page.getByRole('dialog').getByLabel('Titre (optionnel)').fill('Visible en semaine');
    await page.getByRole('dialog').getByLabel('Durée (min)').fill('20');

    await page.getByRole('dialog').getByRole('button', { name: 'Créer la séance' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 });

    await expect(page.getByText('Visible en semaine')).toBeVisible({ timeout: 5_000 });
  });
});

// ─── Navigation semaine / jour ────────────────────────────────────────────

test.describe('Visibilité de séance en vue jour', () => {
  test('une séance créée aujourd\'hui est visible en vue jour', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    const today = new Date().toISOString().slice(0, 10);
    await createSeance(testUser.accessToken, { date: today, title: 'Visible en jour' });

    await page.goto('/dashboard');
    await expect(page.getByText('Visible en jour')).toBeVisible({ timeout: 10_000 });

    // Switch to day view by clicking today's day column button
    const todayDayNum = new Date().getDate().toString();
    await page.getByRole('button', { name: new RegExp(`\\b${todayDayNum}\\b`) }).first().click();

    await expect(page.getByText('Visible en jour')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole('button', { name: '← Vue semaine' })).toBeVisible();
  });

  test('le bouton "← Vue semaine" revient à la vue semaine depuis la vue jour', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/dashboard');

    // Navigate to day view via the ViewToggle
    await page.getByRole('button', { name: 'Jour' }).click();

    await expect(page.getByRole('button', { name: '← Vue semaine' })).toBeVisible({ timeout: 5_000 });

    await page.getByRole('button', { name: '← Vue semaine' }).click();

    await expect(page.getByLabel('Semaine précédente')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole('button', { name: '← Vue semaine' })).not.toBeVisible();
  });
});
