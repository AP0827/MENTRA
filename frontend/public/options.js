// Options page JavaScript - Manifest V3 compliant
document.addEventListener('DOMContentLoaded', function() {
  // Load initial settings
  loadSettings();

  // Set up event listeners
  document.getElementById('new-site').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addSite();
    }
  });

  document.getElementById('add-site-btn').addEventListener('click', addSite);
  document.getElementById('notifications-toggle').addEventListener('click', toggleNotifications);
  document.getElementById('ai-toggle').addEventListener('click', toggleAI);
  document.getElementById('open-dashboard-btn').addEventListener('click', openDashboard);
});

function loadSettings() {
  chrome.storage.local.get(['blockedSites', 'notifications', 'aiModel'], (result) => {
    // Load blocked sites
    const sites = result.blockedSites || [];
    renderSites(sites);

    // Load toggles
    if (result.notifications) {
      document.getElementById('notifications-toggle').classList.add('active');
    }
    if (result.aiModel === 'gpt4') {
      document.getElementById('ai-toggle').classList.add('active');
    }
  });
}

function renderSites(sites) {
  const container = document.getElementById('sites-list');
  container.innerHTML = sites.map(site => `
    <span class="site-tag">
      ${site}
      <button data-site="${site}">×</button>
    </span>
  `).join('');

  // Add event listeners to remove buttons
  container.querySelectorAll('button[data-site]').forEach(button => {
    button.addEventListener('click', function() {
      removeSite(this.getAttribute('data-site'));
    });
  });
}

function addSite() {
  const input = document.getElementById('new-site');
  const site = input.value.trim().toLowerCase();

  if (!site) return;

  chrome.storage.local.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      chrome.storage.local.set({ blockedSites: sites }, () => {
        renderSites(sites);
        input.value = '';
        showSuccess();
      });
    }
  });
}

function removeSite(site) {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    const filtered = sites.filter(s => s !== site);
    chrome.storage.local.set({ blockedSites: filtered }, () => {
      renderSites(filtered);
      showSuccess();
    });
  });
}

function toggleNotifications() {
  const toggle = document.getElementById('notifications-toggle');
  toggle.classList.toggle('active');
  const enabled = toggle.classList.contains('active');
  chrome.storage.local.set({ notifications: enabled }, showSuccess);
}

function toggleAI() {
  const toggle = document.getElementById('ai-toggle');
  toggle.classList.toggle('active');
  const model = toggle.classList.contains('active') ? 'gpt4' : 'local';
  chrome.storage.local.set({ aiModel: model }, showSuccess);
}

function openDashboard() {
  chrome.tabs.create({ url: 'http://localhost:3000' });
}

function showSuccess() {
  const message = document.getElementById('success-message');
  message.style.display = 'block';
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}