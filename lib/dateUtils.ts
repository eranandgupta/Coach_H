/**
 * Convert an arbitrary date value to a `yyyy-mm-dd` string for <input type="date">.
 *
 * Safari's `new Date()` is stricter than Chrome's: a non-ISO string (e.g. a MySQL
 * "2026-07-09 00:00:00") yields an Invalid Date, and calling `.toISOString()` on it
 * throws a RangeError — which, inside a form-populating effect, silently aborts the
 * whole populate and leaves fields blank. This guards against that.
 */
export function toDateInputValue(value: string | number | Date | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  // Use local date parts (not toISOString, which shifts to UTC and can land on the previous day).
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
