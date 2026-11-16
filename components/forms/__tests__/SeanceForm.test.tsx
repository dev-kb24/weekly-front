import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeanceForm } from '@/components/forms/SeanceForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

describe('SeanceForm', () => {
  it('affiche les champs de base (date, titre)', () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Titre (optionnel)')).toBeInTheDocument();
  });

  it('affiche une partie simple par défaut avec ses champs', () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Mesure')).toBeInTheDocument();
    expect(screen.getByLabelText('Cadence')).toBeInTheDocument();
  });

  it('affiche le select zone cardiaque par défaut', () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText('Zone cardiaque')).toBeInTheDocument();
  });

  it('affiche les selects allure (min + sec) quand la cadence allure est sélectionnée', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.selectOptions(screen.getByLabelText('Cadence'), 'allure');
    expect(screen.getByLabelText('Allure min — min')).toBeInTheDocument();
    expect(screen.getByLabelText('Allure min — sec')).toBeInTheDocument();
    expect(screen.getByLabelText('Allure max — min')).toBeInTheDocument();
    expect(screen.getByLabelText('Allure max — sec')).toBeInTheDocument();
  });

  it("n'affiche pas zone cardiaque quand la cadence allure est sélectionnée", async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.selectOptions(screen.getByLabelText('Cadence'), 'allure');
    expect(screen.queryByLabelText('Zone cardiaque')).not.toBeInTheDocument();
  });

  it('affiche le champ distance quand la mesure distance est sélectionnée', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.selectOptions(screen.getByLabelText('Mesure'), 'distance');
    expect(screen.getByLabelText('Distance (km)')).toBeInTheDocument();
  });

  it("n'affiche pas durée quand la mesure distance est sélectionnée", async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.selectOptions(screen.getByLabelText('Mesure'), 'distance');
    expect(screen.queryByLabelText('Durée (min)')).not.toBeInTheDocument();
  });

  it('sélectionne les bonnes valeurs allure pour une valeur existante (270s = 4min 30s)', async () => {
    render(
      <SeanceForm
        onSubmit={jest.fn()}
        initialValues={{
          date: '2026-04-29',
          parties: [{
            order: 1,
            type: 'running' as never,
            durationUnit: 'time' as never,
            durationMinutes: 30,
            distanceKm: null,
            cadenceType: 'allure' as never,
            heartRateZone: null,
            allureMinMin: 270,
            allureMinMax: null,
            repetitions: 1,
            blockId: null,
          }],
        }}
      />,
    );
    expect(screen.getByLabelText('Allure min — min')).toHaveValue('4');
    expect(screen.getByLabelText('Allure min — sec')).toHaveValue('30');
  });

  it('peut ajouter une partie simple', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Partie simple' }));
    expect(screen.getAllByLabelText('Type')).toHaveLength(2);
  });

  it('peut supprimer une partie simple ajoutée', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Partie simple' }));
    expect(screen.getAllByLabelText('Type')).toHaveLength(2);
    const removeButtons = screen.getAllByRole('button', { name: 'Supprimer' });
    await userEvent.click(removeButtons[0]);
    expect(screen.getAllByLabelText('Type')).toHaveLength(1);
  });

  it('peut ajouter un bloc répété', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Bloc répété' }));
    expect(screen.getByText('Bloc')).toBeInTheDocument();
    expect(screen.getByLabelText('Répétitions')).toBeInTheDocument();
  });

  it('le bloc répété contient deux étapes par défaut', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Bloc répété' }));
    expect(screen.getByText('Étape 1')).toBeInTheDocument();
    expect(screen.getByText('Étape 2')).toBeInTheDocument();
  });

  it("peut changer le nombre de répétitions d'un bloc", async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Bloc répété' }));
    const repInput = screen.getByLabelText('Répétitions');
    fireEvent.change(repInput, { target: { value: '10' } });
    expect(repInput).toHaveValue(10);
  });

  it('peut ajouter une étape à un bloc répété', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Bloc répété' }));
    await userEvent.click(screen.getByRole('button', { name: '+ Ajouter une étape' }));
    expect(screen.getByText('Étape 3')).toBeInTheDocument();
  });

  it('peut réordonner les blocs avec les boutons fléchés', async () => {
    render(<SeanceForm onSubmit={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Partie simple' }));
    const downButtons = screen.getAllByRole('button', { name: 'Descendre' });
    expect(downButtons.length).toBeGreaterThanOrEqual(1);
    await userEvent.click(downButtons[0]);
    expect(screen.getAllByLabelText('Type')).toHaveLength(2);
  });

  it('appelle onCancel au clic sur Annuler quand la prop est fournie', async () => {
    const onCancel = jest.fn();
    render(<SeanceForm onSubmit={jest.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});


