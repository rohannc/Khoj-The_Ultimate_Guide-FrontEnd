/**
 * 7-Day Shift Details Helper for Affiliations
 * Conforms strictly to backend OpenAPI AffiliationRequestDTO and AffiliationUpdateDTO:
 * Map<String, String> with keys 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'.
 * Active days format: 'HH:mm - HH:mm' (e.g. '09:00 - 17:00'). Off days format: 'OFF'.
 */

export const WEEKDAYS = [
  { key: 'MONDAY', label: 'Monday', short: 'Mon' },
  { key: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { key: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { key: 'FRIDAY', label: 'Friday', short: 'Fri' },
  { key: 'SATURDAY', label: 'Saturday', short: 'Sat' },
  { key: 'SUNDAY', label: 'Sunday', short: 'Sun' }
];

export const getDefaultShiftSchedule = () => ({
  MONDAY: '09:00 - 17:00',
  TUESDAY: '09:00 - 17:00',
  WEDNESDAY: '09:00 - 17:00',
  THURSDAY: '09:00 - 17:00',
  FRIDAY: '09:00 - 17:00',
  SATURDAY: '10:00 - 14:00',
  SUNDAY: 'Off'
});

/**
 * Creates default reactive structured shift model
 */
export const getDefaultStructuredShifts = () => ({
  MONDAY: { isOff: false, startTime: '09:00', endTime: '17:00' },
  TUESDAY: { isOff: false, startTime: '09:00', endTime: '17:00' },
  WEDNESDAY: { isOff: false, startTime: '09:00', endTime: '17:00' },
  THURSDAY: { isOff: false, startTime: '09:00', endTime: '17:00' },
  FRIDAY: { isOff: false, startTime: '09:00', endTime: '17:00' },
  SATURDAY: { isOff: false, startTime: '10:00', endTime: '14:00' },
  SUNDAY: { isOff: true, startTime: '09:00', endTime: '17:00' }
});

/**
 * Parse an incoming shift string into { isOff, startTime, endTime }
 */
export const parseDayShift = (val) => {
  if (!val || ['off', 'closed', 'none', 'false'].includes(String(val).trim().toLowerCase())) {
    return { isOff: true, startTime: '09:00', endTime: '17:00' };
  }
  const parts = String(val).split('-').map(s => s.trim());
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { isOff: false, startTime: parts[0], endTime: parts[1] };
  }
  return { isOff: false, startTime: '09:00', endTime: '17:00' };
};

/**
 * Serialize { isOff, startTime, endTime } into string format expected by API ('HH:mm - HH:mm' or 'Off')
 */
export const serializeDayShift = (dayObj) => {
  if (!dayObj || dayObj.isOff) {
    return 'Off';
  }
  const start = dayObj.startTime || '09:00';
  const end = dayObj.endTime || '17:00';
  return `${start} - ${end}`;
};

export const formatShiftSummary = (shiftDetails) => {
  if (!shiftDetails) return 'No schedule provided';
  if (typeof shiftDetails === 'string') return shiftDetails;
  
  if (typeof shiftDetails === 'object') {
    const activeDays = [];
    WEEKDAYS.forEach(day => {
      const val = shiftDetails[day.key] || shiftDetails[day.key.toLowerCase()];
      if (val && !['off', 'closed', 'none', 'false'].includes(String(val).toLowerCase())) {
        activeDays.push(day.short);
      }
    });

    if (activeDays.length === 0) return 'No active shifts';
    if (activeDays.length === 7) return 'All Days (Mon - Sun)';
    if (activeDays.length === 5 && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].every(d => activeDays.includes(d))) {
      return `Mon - Fri (${shiftDetails.MONDAY || '09:00 - 17:00'})`;
    }
    return activeDays.join(', ');
  }
  return 'Flexible hours';
};
