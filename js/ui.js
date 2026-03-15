// js/ui.js

/**
 * Animate the speedometer smoothly
 * @param {HTMLElement} bar - The speedometer div
 * @param {number} targetPercent - Target width in %
 */
export function animateSpeedometer(bar, targetPercent) {
  if (!bar) return;
  let width = 0;
  const step = targetPercent / 50; // 50 steps animation
  const interval = setInterval(() => {
    width += step;
    if (width >= targetPercent) {
      width = targetPercent;
      clearInterval(interval);
    }
    bar.style.width = `${width}%`;
  }, 10); // animation frame every 10ms
}

/**
 * Animate card hover glow effect
 * @param {NodeList} cards - All card elements
 */
export function initCardHoverAnimation(cards) {
  if (!cards || !cards.length) return;
  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("shadow-lg");
      card.style.boxShadow = "0 12px 25px rgba(79,70,229,0.5)";
      card.style.transform = "scale(1.02)";
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("shadow-lg");
      card.style.boxShadow = "";
      card.style.transform = "scale(1)";
    });
  });
}

/**
 * Animate text update with pulse effect
 * @param {HTMLElement} element - DOM element
 * @param {string} newText - New text content
 */
export function pulseUpdate(element, newText) {
  if (!element) return;
  element.classList.add("animate-pulse");
  setTimeout(() => {
    element.textContent = newText;
    element.classList.remove("animate-pulse");
  }, 500);
}

/**
 * Initialize dashboard interactive UI
 */
export function initDashboardUI() {
  // Animate speedometer periodically (optional)
  const speedBar = document.getElementById("speedometer");
  if (speedBar) {
    setInterval(() => {
      const currentWidth = parseFloat(speedBar.style.width) || 50;
      const variance = Math.random() * 5 - 2.5; // ±2.5%
      let newWidth = Math.min(Math.max(currentWidth + variance, 0), 100);
      speedBar.style.width = `${newWidth}%`;
    }, 3000);
  }

  // Card hover animation
  const cards = document.querySelectorAll(".shadow-lg");
  initCardHoverAnimation(cards);
}