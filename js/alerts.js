// js/alerts.js

/**
 * Show alert notification on dashboard
 * @param {string} message - Message to display
 * @param {string} type - "info", "success", "warning", "error"
 */
export function showAlert(message, type = "info") {
  // Create alert container if not exists
  let container = document.getElementById("alertContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "alertContainer";
    container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(container);
  }

  // Create alert element
  const alert = document.createElement("div");
  alert.className = `
    px-4 py-2 rounded shadow-lg text-sm font-semibold
    ${type === "success" ? "bg-green-600 text-gray-100" : ""}
    ${type === "info" ? "bg-blue-600 text-gray-100" : ""}
    ${type === "warning" ? "bg-yellow-500 text-gray-900" : ""}
    ${type === "error" ? "bg-red-600 text-gray-100" : ""}
    transform transition-all duration-300
  `;
  alert.textContent = message;

  // Append and auto-remove
  container.appendChild(alert);
  setTimeout(() => {
    alert.classList.add("opacity-0", "translate-x-10");
    setTimeout(() => container.removeChild(alert), 300);
  }, 4000); // 4s display
}

/**
 * Trigger alert for price break levels (example)
 * @param {string} pair - Forex pair
 * @param {number} price - Current price
 * @param {Object} levels - {sl, tp}
 */
export function priceAlert(pair, price, levels) {
  if (!levels) return;
  if (price <= levels.sl) {
    showAlert(`${pair} hit STOP LOSS at ${price.toFixed(5)}`, "error");
  } else if (price >= levels.tp) {
    showAlert(`${pair} hit TAKE PROFIT at ${price.toFixed(5)}`, "success");
  }
}

/**
 * AI-driven signal alert example
 * @param {string} pair - Forex pair
 * @param {string} signalType - "buy", "sell", "scalp", "swing"
 * @param {number} entry - Entry price
 */
export function signalAlert(pair, signalType, entry) {
  showAlert(`AI Signal: ${signalType.toUpperCase()} ${pair} @ ${entry.toFixed(5)}`, "info");
}