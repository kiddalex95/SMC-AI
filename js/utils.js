// js/utils.js

/**
 * Get current time in a specific timezone
 * @param {string} tz - Timezone string, e.g., "America/New_York"
 * @returns {string} - Formatted time HH:MM:SS
 */
export function getTimeInTimezone(tz) {
  try {
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz };
    return new Intl.DateTimeFormat([], options).format(new Date());
  } catch (err) {
    console.error("Timezone error:", err);
    return new Date().toLocaleTimeString();
  }
}

/**
 * Save data to localStorage
 * @param {string} key
 * @param {any} value
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("localStorage save error:", err);
  }
}

/**
 * Load data from localStorage
 * @param {string} key
 * @returns {any} Parsed object or null
 */
export function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("localStorage load error:", err);
    return null;
  }
}

/**
 * Format number with fixed decimals and optional commas
 * @param {number} num
 * @param {number} decimals
 * @param {boolean} comma
 * @returns {string}
 */
export function formatNumber(num, decimals = 5, comma = true) {
  if (!num && num !== 0) return "-";
  const fixed = num.toFixed(decimals);
  return comma ? Number(fixed).toLocaleString() : fixed;
}

/**
 * Session timer helper
 * @param {number} duration - seconds
 * @param {function} onTick - callback per second
 * @param {function} onEnd - callback when timer ends
 */
export function startSessionTimer(duration, onTick, onEnd) {
  let remaining = duration;
  const interval = setInterval(() => {
    remaining--;
    onTick && onTick(remaining);
    if (remaining <= 0) {
      clearInterval(interval);
      onEnd && onEnd();
    }
  }, 1000);
  return interval;
}