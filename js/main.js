// js/main.js

import { fetchRealTimePrice, fetchCandleData, calculateTrend } from "../lib/twelvedata.js";
import { fetchNews, renderNews } from "../lib/finnhub.js";
import { showAlert } from "./alerts.js";
import { getTimeInTimezone, formatNumber } from "./utils.js";

// ------------------------
// Dashboard State
// ------------------------
let selectedPair = "EUR/USD";
const pairs = ["EUR/USD","GBP/USD","USD/JPY","AUD/USD","USD/CAD"];
let marketStrength = 0;

// ------------------------
// DOM Elements
// ------------------------
const pairSelect = document.getElementById("pairSelect");
const ordersInput = document.getElementById("ordersInput");
const marketAnalysis = document.getElementById("marketAnalysis");
const speedometer = document.getElementById("speedometer");
const openOrders = document.getElementById("openOrders");

// ------------------------
// Initialize Pair Selector
// ------------------------
pairs.forEach(pair=>{
  const opt = document.createElement("option");
  opt.value = pair;
  opt.textContent = pair;
  pairSelect.appendChild(opt);
});

pairSelect.addEventListener("change", ()=> {
  selectedPair = pairSelect.value;
  updateDashboard();
});

// ------------------------
// Update Dashboard Function
// ------------------------
async function updateDashboard(){
  try {
    const price = await fetchRealTimePrice(selectedPair);
    const candles = await fetchCandleData(selectedPair, "15min", 50);
    const trend = calculateTrend(candles);

    marketAnalysis.innerHTML = `
      <p>Pair: ${selectedPair}</p>
      <p>Live Price: ${price ? formatNumber(price,5) : "Loading..."}</p>
      <p>Trend (Top-Down 1D→M15): ${trend}</p>
      <p>Suggested Trades:</p>
      <ul class="ml-4">
        <li>Scalp Entry: ${price ? formatNumber(price*0.998,5) : "-"}</li>
        <li>Swing Entry: ${price ? formatNumber(price*0.995,5) : "-"}</li>
        <li>Position Trade Entry: ${price ? formatNumber(price*0.99,5) : "-"}</li>
      </ul>
    `;

    // Market strength % based on candle trend
    marketStrength = Math.min(Math.max(trend === "Bullish"? 80 : trend === "Bearish"? 20 : 50,0),100);
    speedometer.style.width = `${marketStrength}%`;

    // Open orders display (dummy for now)
    const numOrders = parseInt(ordersInput.value) || 0;
    openOrders.innerHTML = numOrders > 0 ? `${numOrders} active orders for ${selectedPair}` : "No open orders yet. Select a pair to start trading.";

    showAlert(`Dashboard updated: ${selectedPair} | ${getTimeInTimezone("UTC")}`, "success");

  } catch (err) {
    console.error("Dashboard update error:", err);
    showAlert("Error updating dashboard", "error");
  }
}

// ------------------------
// Auto Refresh Interval
// ------------------------
updateDashboard();
setInterval(updateDashboard, 30000); // every 30 seconds

// ------------------------
// Load Live News (Optional on Dashboard)
// ------------------------
const newsContainer = document.getElementById("newsSection");
if(newsContainer){
  async function loadNews() {
    const newsData = await fetchNews("forex",10);
    renderNews(newsData,newsContainer);
  }
  loadNews();
  setInterval(loadNews,60000); // refresh news every 60s
}

// ------------------------
// Refresh Button
// ------------------------
const refreshBtn = document.getElementById("refreshBtn");
if(refreshBtn){
  refreshBtn.addEventListener("click", updateDashboard);
}

// ------------------------
// Initial Setup Alert
// ------------------------
showAlert("GodMode Forex Dashboard Loaded", "info");