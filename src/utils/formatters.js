/**
 * Formats a number as USD currency
 * @param {number} value - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

/**
 * Formats a number as USD currency with decimals
 * @param {number} value - The amount to format
 * @returns {string} Formatted currency string with decimals
 */
export const formatCurrencyWithDecimals = (value) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  });

