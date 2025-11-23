// Content Script - Psychology-Driven Mindful Browsing
// With contextual whitelisting, quick tap responses, and gentle UX
// Mentra content script loaded

// Listen for messages from background script - set up IMMEDIATELY
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Message received
  
  if (message.type === 'PING') {
    sendResponse({ status: 'ready' });
    return true;
  }
  
  if (message.type === 'SHOW_REFLECTION_MODAL') {
    // Showing reflection modal
    try {
      showReflectionModal(
        message.website, 
        message.url, 
        message.prompt,
        message.count
      );
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error showing modal:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Keep the message channel open for async response
});

// Varied quick tap response pool
const QUICK_RESPONSES = [
  { text: "I'm tired", emoji: "😴" },
  { text: "I'm bored", emoji: "🥱" },
  { text: "Just a quick visit", emoji: "⚡" },
  { text: "Break needed", emoji: "☕" },
  { text: "Mindlessly drifting", emoji: "🌊" },
  { text: "Checking out of curiosity", emoji: "🤔" }
];

// Create and show reflection modal with gentle, calm UX
function showReflectionModal(website, url, prompt, count) {
  const existingModal = document.getElementById('mentra-reflection-modal');
  if (existingModal) existingModal.remove();

  const overlay = document.createElement('div');
  overlay.id = 'mentra-reflection-modal';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; 
    width: 100% !important; height: 100% !important;
    background: linear-gradient(135deg, rgba(99, 179, 237, 0.15) 0%, rgba(167, 243, 208, 0.15) 100%),
                rgba(15, 23, 42, 0.90) !important;
    backdrop-filter: blur(16px) !important; z-index: 2147483647 !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: linear-gradient(to bottom, #f0f9ff 0%, #ecfdf5 100%);
    border-radius: 28px; padding: 44px 40px; max-width: 540px; width: 90%;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(99, 179, 237, 0.2);
    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  modal.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
      
      * {
        font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      }
      
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { 
        from { transform: translateY(50px) scale(0.96); opacity: 0; } 
        to { transform: translateY(0) scale(1); opacity: 1; } 
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .mentra-btn {
        all: unset;
        padding: 12px 20px !important; 
        border-radius: 16px !important; 
        font-size: 14px !important; 
        font-weight: 600 !important; 
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        letter-spacing: 0.2px !important;
        text-align: center !important;
        display: inline-block !important;
        box-sizing: border-box !important;
      }
      .mentra-btn:hover { 
        transform: translateY(-2px) !important; 
        box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important; 
      }
      .mentra-btn:active { transform: translateY(0) !important; }
      
      .mentra-btn-primary {
        background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
        color: white !important; 
        box-shadow: 0 4px 14px rgba(14, 165, 233, 0.3) !important;
        border: none !important;
      }
      .mentra-btn-secondary {
        background: white !important; 
        color: #64748b !important;
        border: 2px solid #cbd5e1 !important;
      }
      .mentra-btn-secondary:hover {
        border-color: #0ea5e9 !important; 
        color: #0ea5e9 !important;
      }
      
      .mentra-quick-btn {
        padding: 12px 20px; border-radius: 16px;
        background: white; border: 2px solid #e0f2fe;
        color: #475569; font-size: 14px; font-weight: 500;
        cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex; align-items: center; gap: 8px;
        margin: 5px 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
      .mentra-quick-btn:hover {
        border-color: #0ea5e9; color: #0ea5e9;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
      }
      .mentra-quick-btn.selected {
        background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
        border-color: transparent; color: white;
        box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
      }
      
      .mentra-whitelist-btn {
        padding: 11px 16px; border-radius: 14px;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 1px solid #fbbf24 !important;
        color: #92400e !important; font-size: 13px !important; font-weight: 600 !important;
        cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex !important; align-items: center; gap: 6px;
        box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
        white-space: nowrap; font-family: inherit !important;
      }
      .mentra-whitelist-btn:hover {
        background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
      }
      
      .mentra-spinner {
        border: 3px solid #e0f2fe; border-top: 3px solid #0ea5e9;
        border-radius: 50%; width: 32px; height: 32px;
        animation: spin 1s linear infinite;
      }
      
      .mentra-breathe-icon {
        animation: breathe 3s ease-in-out infinite;
      }
      
      details {
        all: revert;
      }
      
      summary {
        all: revert;
        cursor: pointer;
        color: #64748b !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        padding: 10px !important;
        user-select: none !important;
        list-style: none !important;
        background: transparent !important;
      }
      
      summary::-webkit-details-marker {
        display: none;
      }
    </style>
    
    <div style="text-align: center; margin-bottom: 32px;">
      <div class="mentra-breathe-icon" style="width: 80px; height: 80px; 
                  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); 
                  border-radius: 24px; display: flex; align-items: center; justify-content: center; 
                  margin: 0 auto 18px; box-shadow: 0 8px 28px rgba(14, 165, 233, 0.25);">
        <span style="font-size: 42px;">🌿</span>
      </div>
      <p style="font-size: 13px; color: #64748b; margin: 0 0 14px; font-weight: 500; letter-spacing: 0.5px;">
        MINDFUL MOMENT #${count}
      </p>
      <h1 style="font-size: 26px; font-weight: 600; color: #0f172a; margin: 0 0 12px; 
                  line-height: 1.3; letter-spacing: -0.3px;">
        ${prompt}
      </h1>
      <p style="font-size: 15px; color: #64748b; margin: 0;">
        You're about to visit <strong style="color: #0ea5e9; font-weight: 600;">${website}</strong>
      </p>
    </div>

    <div id="mentra-step1">
      <div style="margin-bottom: 22px;">
        <label style="display: block; font-weight: 600; color: #475569; margin-bottom: 14px; 
                      font-size: 13px; letter-spacing: 0.3px;">
          How are you feeling right now?
        </label>
        <div id="mentra-quick-responses" style="margin-bottom: 18px; text-align: center;">
          ${QUICK_RESPONSES.map((resp, i) => `
            <button class="mentra-quick-btn" data-index="${i}" data-response="${resp.text}">
              <span>${resp.emoji}</span> ${resp.text}
            </button>
          `).join('')}
        </div>
        
        <details style="margin-top: 18px;">
          <summary style="cursor: pointer; color: #64748b; font-size: 13px; font-weight: 500; 
                          padding: 10px; list-style: none; user-select: none;">
            <span style="color: #0ea5e9;">✏️</span> Want to write more? (optional)
          </summary>
          <textarea 
            id="mentra-reflection-input"
            placeholder="Share what's on your mind..."
            style="width: 100%; padding: 14px; border: 2px solid #e0f2fe; 
                   border-radius: 16px; font-size: 14px; resize: vertical; min-height: 85px;
                   font-family: inherit; color: #334155 !important; background: white !important;
                   transition: all 0.3s; margin-top: 12px; box-sizing: border-box;"
          ></textarea>
        </details>
      </div>

      <div style="padding: 16px 18px; background: linear-gradient(135deg, #dbeafe 0%, #d1fae5 100%); 
                  border-radius: 16px; margin-bottom: 22px; border-left: 3px solid #0ea5e9;">
        <p style="margin: 0; color: #0c4a6e; font-size: 13px; line-height: 1.6; font-weight: 500;">
          <span style="font-size: 16px;">💚</span> <em>Let's take a mindful moment.</em> Your awareness helps you stay intentional.
        </p>
      </div>
      
      <div style="margin-bottom: 22px;">
        <label style="display: block; font-weight: 600; color: #475569; margin-bottom: 12px; 
                      font-size: 13px; letter-spacing: 0.3px;">
          ⏱️ Need more time here?
        </label>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px;">
          <button class="mentra-whitelist-btn mentra-whitelist-10min" data-website="${website}" style="justify-content: center; width: 100%;">
            <span>⏰</span> Allow for 10 minutes
          </button>
          <button class="mentra-whitelist-btn mentra-whitelist-session" data-website="${website}" style="justify-content: center; width: 100%;">
            <span>🔓</span> Allow for this session
          </button>
          <button class="mentra-whitelist-btn mentra-whitelist-tomorrow" data-website="${website}" style="justify-content: center; width: 100%;">
            <span>🌙</span> Allow until tomorrow
          </button>
        </div>
      </div>

      <div style="display: flex !important; gap: 12px !important; margin-top: 24px !important;">
        <button class="mentra-btn mentra-btn-secondary mentra-close-btn" style="flex: 1 !important;">
          ← Go back
        </button>
        <button id="mentra-submit-btn" class="mentra-btn mentra-btn-primary" data-website="${website}" data-url="${url}" data-prompt="${prompt}" style="flex: 1.5 !important;">
          Continue mindfully →
        </button>
      </div>
    </div>

    <div id="mentra-step2" style="display: none;">
      <div id="mentra-loading" style="text-align: center; padding: 48px 20px;">
        <div class="mentra-spinner" style="margin: 0 auto 20px;"></div>
        <p style="color: #64748b; font-size: 15px; margin: 0; animation: pulse 2.5s infinite; font-weight: 500;">
          Reflecting with you...
        </p>
      </div>
      
      <div id="mentra-ai-response" style="display: none; padding: 24px; 
                                            background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%); 
                                            border-radius: 18px; margin-bottom: 24px; 
                                            border: 1px solid rgba(14, 165, 233, 0.2);
                                            box-shadow: 0 4px 14px rgba(14, 165, 233, 0.1);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
          <span style="font-size: 26px;">✨</span>
          <strong style="color: #0ea5e9; font-size: 16px; font-weight: 600;">Mindful Insight</strong>
        </div>
        <p id="mentra-ai-text" style="margin: 0; color: #334155; line-height: 1.8; font-size: 15px;"></p>
      </div>

      <div style="padding: 18px; background: white; border-radius: 16px; margin-bottom: 22px; 
                  border: 1px solid #e0f2fe; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
        <strong style="color: #64748b; font-size: 13px; font-weight: 600;">Your reflection:</strong>
        <p id="mentra-user-reflection" style="margin: 10px 0 0; color: #475569; font-style: italic; 
                                              font-size: 14px; line-height: 1.7;"></p>
      </div>

      <div style="margin-bottom: 22px;">
        <p style="color: #64748b; font-size: 14px; margin-bottom: 12px; font-weight: 500;">Was this helpful?</p>
        <div style="display: flex; gap: 10px;">
          <button class="mentra-btn mentra-btn-secondary mentra-feedback-no" style="flex: 1;">
            Not really
          </button>
          <button class="mentra-btn mentra-btn-primary mentra-feedback-yes" style="flex: 1;">
            Yes, helpful! 💚
          </button>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="mentra-btn mentra-btn-secondary mentra-close-btn" style="flex: 1;">
          ← Go back
        </button>
        <button class="mentra-btn mentra-proceed-btn" style="flex: 1; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                                           color: white; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
          Proceed mindfully →
        </button>
      </div>
    </div>
  `;

  // Add to page - ensure it's added to body, not any container
  overlay.appendChild(modal);
  
  // Wait for body to be available if it's not yet
  const addToPage = () => {
    if (document.body) {
      document.body.appendChild(overlay);
      // Force reflow to ensure styles are applied
      overlay.offsetHeight;
      
      // Set up event listeners after modal is in DOM
      setupEventListeners(website, url, prompt);
    } else {
      setTimeout(addToPage, 10);
    }
  };
  
  addToPage();
}

// Set up event listeners for modal buttons
function setupEventListeners(website, url, prompt) {
  // Quick response buttons
  document.querySelectorAll('.mentra-quick-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      const response = QUICK_RESPONSES[index].emoji + ' ' + QUICK_RESPONSES[index].text;
      // If already selected, deselect it
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedQuickResponse = null;
      } else {
        window.selectQuickResponse(index, response);
      }
    });
  });
  
  // Textarea focus/blur for styling
  const textarea = document.getElementById('mentra-reflection-input');
  if (textarea) {
    textarea.addEventListener('focus', function() {
      this.style.borderColor = '#0ea5e9';
      this.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
    });
    textarea.addEventListener('blur', function() {
      this.style.borderColor = '#e0f2fe';
      this.style.boxShadow = 'none';
    });
  }
  
  // Submit button
  const submitBtn = document.getElementById('mentra-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const btnWebsite = submitBtn.dataset.website;
      const btnUrl = submitBtn.dataset.url;
      const btnPrompt = submitBtn.dataset.prompt;
      window.submitReflection(btnWebsite, btnUrl, btnPrompt);
    });
  }
  
  // Whitelist buttons
  const whitelist10min = document.querySelector('.mentra-whitelist-10min');
  const whitelistSession = document.querySelector('.mentra-whitelist-session');
  const whitelistTomorrow = document.querySelector('.mentra-whitelist-tomorrow');
  
  if (whitelist10min) {
    whitelist10min.addEventListener('click', () => {
      const btnWebsite = whitelist10min.dataset.website;
      window.whitelistFor(10, btnWebsite);
    });
  }
  if (whitelistSession) {
    whitelistSession.addEventListener('click', () => {
      const btnWebsite = whitelistSession.dataset.website;
      window.whitelistForSession(btnWebsite);
    });
  }
  if (whitelistTomorrow) {
    whitelistTomorrow.addEventListener('click', () => {
      const btnWebsite = whitelistTomorrow.dataset.website;
      window.whitelistUntil('tomorrow', btnWebsite);
    });
  }
  
  // Close/back buttons
  document.querySelectorAll('.mentra-close-btn').forEach(btn => {
    btn.addEventListener('click', window.closeModal);
  });
  
  // Proceed button
  const proceedBtn = document.querySelector('.mentra-proceed-btn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', window.proceedToSite);
  }
  
  // Feedback buttons
  const feedbackNoBtn = document.querySelector('.mentra-feedback-no');
  const feedbackYesBtn = document.querySelector('.mentra-feedback-yes');
  
  if (feedbackNoBtn) {
    feedbackNoBtn.addEventListener('click', window.feedbackNo);
  }
  if (feedbackYesBtn) {
    feedbackYesBtn.addEventListener('click', window.feedbackYes);
  }
}

let selectedQuickResponse = null;

// Quick tap response handler
window.selectQuickResponse = (index, response) => {
  // Deselect all
  document.querySelectorAll('.mentra-quick-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  // Select clicked
  document.querySelectorAll('.mentra-quick-btn')[index].classList.add('selected');
  selectedQuickResponse = response;
};

// Submit reflection (with quick response or free text)
window.submitReflection = async (website, url, prompt) => {
  const textarea = document.getElementById('mentra-reflection-input');
  const freeText = textarea.value.trim();
  const reflection = freeText || selectedQuickResponse;
  
  if (!reflection) {
    alert('Please select a quick response or write your own reflection.');
    return;
  }

  // Show step 2 with loading
  document.getElementById('mentra-step1').style.display = 'none';
  document.getElementById('mentra-step2').style.display = 'block';
  document.getElementById('mentra-user-reflection').textContent = reflection;

  // Get AI response
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_AI_RESPONSE',
      reflection,
      website,
      url,
      prompt
    });

    document.getElementById('mentra-loading').style.display = 'none';
    document.getElementById('mentra-ai-response').style.display = 'block';
    
    // Format the AI response (convert markdown to HTML)
    const aiText = response.response || `Consider: ${prompt} Take this moment to realign with your intentions.`;
    const formattedText = aiText
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
      .replace(/\n\n/g, '</p><p style="margin: 0.8em 0;">') // Paragraphs
      .replace(/\n/g, '<br>'); // Line breaks
    
    document.getElementById('mentra-ai-text').innerHTML = '<p style="margin: 0;">' + formattedText + '</p>';

    // Save reflection to IndexedDB
    chrome.runtime.sendMessage({
      type: 'SAVE_REFLECTION',
      data: { 
        website, 
        url,
        prompt,
        quickResponse: selectedQuickResponse,
        freeText: freeText || null,
        reflection: reflection,
        aiResponse: response.response 
      }
    });
  } catch (error) {
    console.error('AI response error:', error);
    document.getElementById('mentra-loading').style.display = 'none';
    document.getElementById('mentra-ai-response').style.display = 'block';
    document.getElementById('mentra-ai-text').textContent = 
      `Take a moment to reflect: ${prompt} Consider if this aligns with your intentions right now.`;
  }
};

// Close modal and return
window.closeModal = () => {
  document.getElementById('mentra-reflection-modal')?.remove();
  window.history.back();
};

// Proceed to site
window.proceedToSite = () => {
  chrome.runtime.sendMessage({
    type: 'UPDATE_STATS',
    stats: { proceeded: true }
  });
  document.getElementById('mentra-reflection-modal')?.remove();
};

// Feedback handlers
window.feedbackYes = () => {
  chrome.runtime.sendMessage({ type: 'FEEDBACK', helpful: true });
  showToast('💚 Thanks for your feedback!', '#10b981');
};

window.feedbackNo = () => {
  chrome.runtime.sendMessage({ type: 'FEEDBACK', helpful: false });
  showToast('Thank you. We\'ll improve our suggestions.', '#64748b');
};

// Contextual whitelisting handlers
window.whitelistFor = (minutes, website) => {
  const domain = new URL(website).hostname.replace('www.', '');
  const expiresAt = Date.now() + (minutes * 60 * 1000);
  
  chrome.runtime.sendMessage({
    type: 'WHITELIST_ADD',
    rule: {
      domain,
      expiresAt,
      type: `${minutes}min`
    }
  });
  
  showToast(`✓ ${domain} allowed for ${minutes} minutes`, '#fbbf24');
  setTimeout(() => document.getElementById('mentra-reflection-modal')?.remove(), 1500);
};

window.whitelistForSession = (website) => {
  const domain = new URL(website).hostname.replace('www.', '');
  // Session expires when browser closes (set to 12 hours as max)
  const expiresAt = Date.now() + (12 * 60 * 60 * 1000);
  
  chrome.runtime.sendMessage({
    type: 'WHITELIST_ADD',
    rule: {
      domain,
      expiresAt,
      type: 'session'
    }
  });
  
  showToast(`🔓 ${domain} allowed for this session`, '#fbbf24');
  setTimeout(() => document.getElementById('mentra-reflection-modal')?.remove(), 1500);
};

window.whitelistUntil = (when, website) => {
  const domain = new URL(website).hostname.replace('www.', '');
  let expiresAt;
  
  if (when === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    expiresAt = tomorrow.getTime();
  }
  
  chrome.runtime.sendMessage({
    type: 'WHITELIST_ADD',
    rule: {
      domain,
      expiresAt,
      type: 'tomorrow'
    }
  });
  
  showToast(`🌙 ${domain} allowed until ${when}`, '#fbbf24');
  setTimeout(() => document.getElementById('mentra-reflection-modal')?.remove(), 1500);
};

// Helper: Show toast notification
function showToast(message, color = '#0ea5e9') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed !important; 
    bottom: 30px !important; 
    left: 50% !important; 
    transform: translateX(-50%) !important;
    background: ${color} !important; 
    color: white !important; 
    padding: 14px 24px !important;
    border-radius: 16px !important; 
    font-size: 14px !important; 
    font-weight: 600 !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
    z-index: 2147483647 !important; 
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    backdrop-filter: blur(10px) !important;
    opacity: 0;
    animation: toastFadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
  `;
  
  // Add animation styles if not already present
  if (!document.getElementById('mentra-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'mentra-toast-styles';
    style.textContent = `
      @keyframes toastFadeIn {
        from { 
          opacity: 0; 
          transform: translateX(-50%) translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }
      }
      @keyframes toastFadeOut {
        from { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }
        to { 
          opacity: 0; 
          transform: translateX(-50%) translateY(20px); 
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
