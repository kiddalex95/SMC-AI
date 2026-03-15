// lib/twelvedata.js

const TWELVEDATA_API_KEY = "12a7f147a2974054a8fa2ad8213cf727";

/**
 * Fetch real-time price for a symbol
 * @param {string} symbol - Forex pair (e.g., "EUR/USD")
 * @returns {Promise<number>} - Latest price
 */
async function fetchRealTimePrice(symbol) {
  try {
    const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${TWELVEDATA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.price) {
      return parseFloat(data.price);
    } else {
      console.error("TwelveData price error:", data);
      return null;
    }
  } catch (err) {
    console.error("TwelveData fetch error:", err);
    return null;
  }
}

/**
 * Fetch historical candles for top-down analysis
 * @param {string} symbol - Forex pair (e.g., "EUR/USD")
 * @param {string} interval - "1min", "15min", "1h", "1D", etc.
 * @param {number} outputCount - Number of candles to fetch
 * @returns {Promise<Array>} - Array of candle objects
 */
async function fetchCandleData(symbol, interval = "15min", outputCount = 100) {
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputCount}&apikey=${TWELVEDATA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.values) {
      // Each candle: {datetime, open, high, low, close, volume}
      return data.values.map(candle => ({
        datetime: candle.datetime,
        open: parseFloat(candle.open),
        high: parseFloat(candle.high),
        low: parseFloat(candle.low),
        close: parseFloat(candle.close),
        volume: parseFloat(candle.volume),
      })).reverse(); // Reverse to chronological order
    } else {
      console.error("TwelveData candle error:", data);
      return [];
    }
  } catch (err) {
    console.error("TwelveData fetch error:", err);
    return [];
  }
}

/**
 * Calculate simple market trend (up/down/neutral) from last N candles
 * @param {Array} candles - Candle array from fetchCandleData
 * @returns {string} - "up", "down", "neutral"
 */
function calculateTrend(candles) {
  if (!candles || candles.length < 2) return "neutral";
  const lastClose = candles[candles.length - 1].close;
  const prevClose = candles[candles.length - 2].close;
  if (lastClose > prevClose) return "up";
  if (lastClose < prevClose) return "down";
  return "neutral";
}

/**
 * Compute risk/reward example based on entry price, stop loss, take profit
 * @param {number} entry - Entry price
 * @param {number} sl - Stop loss price
 * @param {number|Array} tp - Take profit price or array for multiple targets
 * @returns {Object} - Risk/reward ratios
 */
function calculateRiskReward(entry, sl, tp) {
  if (!entry || !sl || !tp) return null;
  const tpArray = Array.isArray(tp) ? tp : [tp];
  const rrArray = tpArray.map(target => {
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(target - entry);
    return (reward / risk).toFixed(2);
  });
  return rrArray;
}

// Export functions for main.js
export { fetchRealTimePrice, fetchCandleData, calculateTrend, calculateRiskReward };