/**
 * Saudi Arabia Local Time Utilities (Asia/Riyadh — UTC+3)
 * All platform timestamps must be displayed in this timezone.
 * Format: DD/MM/YYYY HH:MM AM/PM
 */

const RIYADH_TZ = 'Asia/Riyadh';

/**
 * Format any date/string to Saudi local time.
 * Output: "16/05/2026 01:12 AM"
 */
export function formatSaudiTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';

  // Day / Month / Year
  const day   = d.toLocaleString('en-US', { timeZone: RIYADH_TZ, day:   '2-digit' });
  const month = d.toLocaleString('en-US', { timeZone: RIYADH_TZ, month: '2-digit' });
  const year  = d.toLocaleString('en-US', { timeZone: RIYADH_TZ, year:  'numeric' });

  // Hour:Minute AM/PM
  const time  = d.toLocaleString('en-US', {
    timeZone: RIYADH_TZ,
    hour:     '2-digit',
    minute:   '2-digit',
    hour12:   true,
  });

  return `${day}/${month}/${year} ${time}`;
}

/**
 * Format date only (no time): "16/05/2026"
 */
export function formatSaudiDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';

  const day   = d.toLocaleString('en-US', { timeZone: RIYADH_TZ, day:   '2-digit' });
  const month = d.toLocaleString('en-US', { timeZone: RIYADH_TZ, month: '2-digit' });
  const year  = d.toLocaleString('en-US', { timeZone: RIYADH_TZ, year:  'numeric' });

  return `${day}/${month}/${year}`;
}

/**
 * Returns start-of-today in Saudi time as a UTC ISO string.
 * Used to filter "daily" statistics.
 */
export function getSaudiTodayStart(): string {
  const now = new Date();
  // Get today's date components in Riyadh timezone
  const riyadhNow = new Date(now.toLocaleString('en-US', { timeZone: RIYADH_TZ }));
  riyadhNow.setHours(0, 0, 0, 0);
  // Convert back: Riyadh is UTC+3
  const utcMs = riyadhNow.getTime() - (3 * 60 * 60 * 1000);
  return new Date(utcMs).toISOString();
}

/**
 * Returns current Saudi time as ISO string.
 */
export function getSaudiNow(): string {
  return new Date().toISOString();
}
