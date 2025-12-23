/**
 * Gets AQI level information based on US EPA AQI index
 * @param {number} aqi - Air Quality Index value
 * @returns {Object} Object with level name, color, and background color
 */
export const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' };
  if (aqi <= 100) return { level: 'Moderate', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
  if (aqi <= 200) return { level: 'Unhealthy', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' };
  return { level: 'Hazardous', color: '#991b1b', bg: 'rgba(153, 27, 27, 0.15)' };
};

