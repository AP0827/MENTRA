// Popup script - loads and displays current stats
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
});

function loadStats() {
  chrome.storage.local.get(['stats'], (result) => {
    const stats = result.stats || {
      focusTime: 0,
      distractions: 0,
      streak: 0,
      productivity: 0
    };

    // Update UI
    const hours = Math.floor(stats.focusTime / 60);
    const minutes = stats.focusTime % 60;
    document.getElementById('focus-time').textContent = `${hours}h ${minutes}m`;
    document.getElementById('distractions').textContent = stats.distractions;
    document.getElementById('streak').textContent = stats.streak;
    document.getElementById('productivity').textContent = `${stats.productivity}%`;
  });
}

// Refresh stats every second
setInterval(loadStats, 1000);

// Open dashboard in new tab
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000' });
  // Send a message to let the dashboard know extension is available
  chrome.runtime.sendMessage({ type: 'DASHBOARD_OPENED' });
});
