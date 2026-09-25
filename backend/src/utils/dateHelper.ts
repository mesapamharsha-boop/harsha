/**
 * Utilities for timezone-safe date formatting.
 * Never passes date-only strings into UTC converters that shift calendar dates.
 */

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Formats a date string into a clean, human-readable format like "15 October 2026".
 * Uses purely numerical/regex string splitting to avoid any timezone day-shifting.
 */
export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();
  if (!trimmed) return '';

  // Already formatted as "15 October 2026" or "1 October 2026"
  const alreadyFormattedMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (alreadyFormattedMatch) {
    const day = parseInt(alreadyFormattedMatch[1], 10);
    const month = alreadyFormattedMatch[2];
    const year = alreadyFormattedMatch[3];
    // Capitalize month properly if needed
    const properMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    return `${day} ${properMonth} ${year}`;
  }

  // Match YYYY-MM-DD (e.g. "2026-10-15" or "2026-10-15T14:30:00Z")
  const ymdMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const monthIndex = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${MONTH_NAMES[monthIndex]} ${year}`;
    }
  }

  // Match DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthIndex = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${MONTH_NAMES[monthIndex]} ${year}`;
    }
  }

  return trimmed;
}

/**
 * Formats a time string into 12-hour format with AM/PM (e.g., "14:00" -> "2:00 PM").
 */
export function formatDisplayTime(timeStr?: string | null): string {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const trimmed = timeStr.trim();
  if (!trimmed) return '';

  const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return trimmed;
}

/**
 * Converts any date format to ISO "YYYY-MM-DD" for HTML5 <input type="date"> without timezone shifts.
 */
export function toIsoDateOnly(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();
  if (!trimmed) return '';

  // Already YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    return `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
  }

  // "15 October 2026"
  const textMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (textMatch) {
    const day = textMatch[1].padStart(2, '0');
    const monthStr = textMatch[2].toLowerCase();
    const idx = MONTH_NAMES.findIndex((m) => m.toLowerCase().startsWith(monthStr.slice(0, 3)));
    if (idx !== -1) {
      const month = String(idx + 1).padStart(2, '0');
      return `${textMatch[3]}-${month}-${day}`;
    }
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  return '';
}
