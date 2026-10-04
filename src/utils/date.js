/**
 * Formats a Date object or ISO date string into DD/MM/YYYY.
 * Returns empty string or fallback if invalid.
 */
export function formatDateDDMMYYYY(dateInput) {
  if (!dateInput) return '';
  let d;
  if (typeof dateInput === 'string') {
    // If format is YYYY-MM-DD
    const parts = dateInput.split('T')[0].split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      d = new Date(year, month, day);
    } else {
      d = new Date(dateInput);
    }
  } else if (dateInput instanceof Date) {
    d = dateInput;
  } else {
    d = new Date(dateInput);
  }

  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
