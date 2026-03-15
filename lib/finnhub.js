// lib/finnhub.js

const FINNHUB_API_KEY = "d6pv1a9r01qk0cf21bggd6pv1a9r01qk0cf21bh0";

/**
 * Fetch latest Forex/market news
 * @param {string} category - e.g., "forex", "general"
 * @param {number} limit - Number of news items
 * @returns {Promise<Array>} - Array of news objects
 */
async function fetchNews(category = "forex", limit = 10) {
  try {
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (Array.isArray(data)) {
      return data.slice(0, limit).map(item => ({
        headline: item.headline,
        source: item.source,
        url: item.url,
        datetime: new Date(item.datetime * 1000), // convert Unix timestamp
      }));
    } else {
      console.error("Finnhub news error:", data);
      return [];
    }
  } catch (err) {
    console.error("Finnhub fetch error:", err);
    return [];
  }
}

/**
 * Render news into a container element
 * @param {Array} newsArray - Array from fetchNews
 * @param {HTMLElement} container - DOM element to append news
 */
function renderNews(newsArray, container) {
  if (!container) return;
  container.innerHTML = ""; // clear previous
  if (!newsArray.length) {
    container.innerHTML = "<p>No news available.</p>";
    return;
  }

  newsArray.forEach(item => {
    const newsItem = document.createElement("div");
    newsItem.className = "p-2 mb-2 border-b border-gray-700 hover:bg-gray-700 transition-all rounded cursor-pointer";
    newsItem.innerHTML = `
      <a href="${item.url}" target="_blank" class="text-blue-400 hover:underline">${item.headline}</a>
      <p class="text-gray-400 text-sm">${item.source} | ${item.datetime.toLocaleString()}</p>
    `;
    container.appendChild(newsItem);
  });
}

// Export functions for main.js
export { fetchNews, renderNews };