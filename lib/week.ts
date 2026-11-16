const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DAYS_FULL_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function cloneDay(date: Date, offsetDays = 0): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (offsetDays !== 0) d.setDate(d.getDate() + offsetDays);
  return d;
}

export function getMonday(date: Date): Date {
  const d = cloneDay(date);
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff);
  return d;
}

export function weekDays(startOfWeek: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => cloneDay(startOfWeek, i));
}

export function formatSeanceDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getISOWeek(date: Date): string {
  const d = cloneDay(date, 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNumber =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
    );
  return `${d.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

export function prevWeek(date: Date): Date {
  return getMonday(cloneDay(date, -7));
}

export function nextWeek(date: Date): Date {
  return getMonday(cloneDay(date, 7));
}

export function prevDay(date: Date): Date {
  return cloneDay(date, -1);
}

export function nextDay(date: Date): Date {
  return cloneDay(date, 1);
}

export function formatDayLabel(date: Date): string {
  return `${DAYS_FR[date.getDay()]} ${date.getDate()}`;
}

export function formatWeekLabel(startOfWeek: Date): string {
  const end = new Date(startOfWeek);
  end.setDate(end.getDate() + 6);
  const startMonth = MONTHS_FR[startOfWeek.getMonth()];
  const endMonth = MONTHS_FR[end.getMonth()];
  if (startMonth === endMonth) {
    return `${startOfWeek.getDate()} – ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
  }
  return `${startOfWeek.getDate()} ${startMonth} – ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
}

export function formatDayFullLabel(date: Date): string {
  return `${DAYS_FULL_FR[date.getDay()]} ${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
