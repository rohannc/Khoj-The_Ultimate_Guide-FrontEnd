/**
 * Format address object or components into a cleanly joined string.
 * Filters out missing/empty/null/undefined parts to prevent leading or trailing commas
 * like ", Mumbai, Maharashtra".
 * 
 * Supports both:
 * 1. Flat object: { street, city, state, pinCode / pincode, country }
 * 2. Nested address object: { address: { street, city, state, pincode } }
 * 3. Individual arguments or array of parts.
 *
 * @param {Object|string|Array} addr - Address object or first address segment
 * @param {Object} [options] - Formatting options
 * @param {string} [options.fallback='Location not available'] - Fallback text when all fields are empty
 * @returns {string} Formatted address string
 */
export function formatAddress(addr, options = {}) {
  const fallback = options.fallback !== undefined ? options.fallback : 'Location not available';

  if (!addr) {
    return fallback;
  }

  // If a string was directly passed
  if (typeof addr === 'string') {
    const trimmed = addr.trim().replace(/^,\s*|\s*,$/g, '');
    return trimmed || fallback;
  }

  // If array of parts was passed
  if (Array.isArray(addr)) {
    const cleaned = addr
      .map(part => (typeof part === 'string' ? part.trim() : part))
      .filter(part => part !== null && part !== undefined && part !== '');
    return cleaned.length > 0 ? cleaned.join(', ') : fallback;
  }

  // Handle nested address object if present (e.g., clinic.address or patient.address)
  const source = addr.address && typeof addr.address === 'object' ? addr.address : addr;

  const street = source.street ? String(source.street).trim() : '';
  const city = source.city ? String(source.city).trim() : '';
  const state = source.state ? String(source.state).trim() : '';
  const pinCode = source.pinCode || source.pincode || source.zipCode || source.postalCode
    ? String(source.pinCode || source.pincode || source.zipCode || source.postalCode).trim()
    : '';
  const country = source.country ? String(source.country).trim() : '';

  // Format state & pincode together if both exist, e.g. "Maharashtra 400001" or just "Maharashtra"
  let stateWithPin = '';
  if (state && pinCode) {
    stateWithPin = `${state} ${pinCode}`;
  } else if (state) {
    stateWithPin = state;
  } else if (pinCode) {
    stateWithPin = pinCode;
  }

  const parts = [street, city, stateWithPin, country].filter(Boolean);

  if (parts.length === 0) {
    return fallback;
  }

  return parts.join(', ');
}
