/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * wow Chef AI — Conversational Assistant Drawer Component
 * Brand: "wow Chef AI"
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function (window, document) {
  'use strict';

  // ─── 1. CULINARY INTELLIGENCE KNOWLEDGE BASE ────────────────────────────────
  var culinaryKnowledge = {
    // Ingredient Substitutions Knowledge Map
    substitutions: [
      {
        triggers: ['heavy cream', 'cream', 'whipping cream'],
        sub: 'Milk + Melted Butter (or Greek Yogurt)',
        ratio: '3/4 cup Whole Milk + 1/4 cup Melted Butter = 1 cup Heavy Cream',
        profile: 'Rich & creamy. For soups or sauces, Greek yogurt provides tangy thickness with lower fat.',
        dietary: 'Vegetarian • Gluten-Free'
      },
      {
        triggers: ['buttermilk', 'butter milk'],
        sub: 'Milk + Fresh Lemon Juice (or White Vinegar)',
        ratio: '1 cup Milk + 1 tbsp Lemon Juice (let rest 5 mins)',
        profile: 'Provides identical acidity and lactic tang to activate baking soda and tenderize fried chicken.',
        dietary: 'Vegetarian • Quick Pantry Swap'
      },
      {
        triggers: ['soy sauce', 'shoyu', 'soya sauce'],
        sub: 'Tamari (Gluten-Free) or Coconut Aminos',
        ratio: '1:1 Direct Substitute',
        profile: 'Tamari is richer and 100% wheat-free. Coconut aminos are slightly sweeter with 65% less sodium.',
        dietary: 'Gluten-Free • Paleo/Keto'
      },
      {
        triggers: ['egg', 'eggs', 'baking egg'],
        sub: 'Applesauce, Mashed Banana, or Flax Egg',
        ratio: '1/4 cup Applesauce = 1 Egg (in baking), or 1 tbsp Ground Flaxseed + 3 tbsp Water',
        profile: 'Flax egg binds structure seamlessly; applesauce retains moisture in muffins and cakes.',
        dietary: 'Vegan • Plant-Based'
      },
      {
        triggers: ['sour cream', 'sourcream'],
        sub: 'Plain Whole Greek Yogurt',
        ratio: '1:1 Direct Substitute',
        profile: 'Virtually indistinguishable in dips, tacos, and baking batters, with double the protein.',
        dietary: 'High Protein • Probiotic'
      },
      {
        triggers: ['brown sugar'],
        sub: 'White Sugar + Molasses (or Maple Syrup)',
        ratio: '1 cup White Sugar + 1 tbsp Molasses = 1 cup Brown Sugar',
        profile: 'Delivers warm caramel undertones and rich moisture for cookies and glazed meats.',
        dietary: 'Pantry Essential'
      },
      {
        triggers: ['wine', 'white wine', 'red wine', 'cooking wine'],
        sub: 'Chicken/Vegetable Broth + Splash of Lemon Juice',
        ratio: '1 cup Broth + 1 tbsp Lemon Juice or Vinegar = 1 cup Wine',
        profile: 'Deglazes fond from stainless steel pans and delivers crisp acidity without alcohol.',
        dietary: 'Non-Alcoholic • Halal'
      },
      {
        triggers: ['all-purpose flour', 'flour', 'wheat flour'],
        sub: 'Almond Flour + Tapioca Starch or Oat Flour',
        ratio: '1:1 for Oat Flour (in quick breads); 3:1 Almond-to-Tapioca for crusts',
        profile: 'Nutty, tender crumb with zero gluten.',
        dietary: 'Gluten-Free • Low Carb'
      },
      {
        triggers: ['butter'],
        sub: 'Extra Virgin Olive Oil, Coconut Oil, or Ghee',
        ratio: '3/4 cup Olive Oil = 1 cup Butter',
        profile: 'Rich monounsaturated fats; excellent for skillet sautéing and rustic Mediterranean baking.',
        dietary: 'Heart Healthy'
      }
    ],

    // Technique Guidance Knowledge Map
    techniques: [
      {
        triggers: ['dice onion', 'cut onion', 'chop onion', 'dicing an onion', 'onion dice', 'onion'],
        response: `<h4>🧅 Chef's Guide: Dicing an Onion Efficiently</h4>
<p>Here is how Michelin chefs dice onions with zero tears and uniform cuts:</p>
<ol>
  <li><strong>Keep the Root Intact:</strong> Slice the onion in half through the root from pole to pole. Peel the skin off both halves.</li>
  <li><strong>Horizontal Slices:</strong> Lay flat side down. Make 2–3 horizontal cuts towards the root without cutting through it.</li>
  <li><strong>Vertical Slices:</strong> Make vertical cuts from root to tip spaced 1/4-inch apart.</li>
  <li><strong>Cross Cut:</strong> Slice across vertically to produce clean, uniform chef-grade dice!</li>
</ol>`
      },
      {
        triggers: ['boil egg', 'boil eggs', 'boiled egg', 'boiled eggs', 'soft boiled', 'hard boiled', 'egg timer', 'boiling eggs', 'boiling egg'],
        response: `<h4>🥚 Perfect Egg Boiling Timers (from boiling water)</h4>
<p>Gently lower cold eggs into boiling water, then reduce to a gentle simmer:</p>
<ul>
  <li><strong>6 Minutes:</strong> Liquid runny golden yolk, soft warm whites (Ramen style).</li>
  <li><strong>7 Minutes:</strong> Custardy jammy yolk (Chef Sarah's favorite).</li>
  <li><strong>8.5 Minutes:</strong> Firm yolk with creamy tender center.</li>
  <li><strong>10 Minutes:</strong> Fully set hard-boiled (Classic egg salad).</li>
</ul>
<p><em>Chef Tip: Transfer immediately to an ice water bath for 3 minutes for effortless shell peeling!</em></p>`
      },
      {
        triggers: ['steak', 'sear steak', 'temp', 'ribeye', 'meat temperature'],
        response: `<h4>🥩 Prime Steak Internal Temperature Guide</h4>
<p>Always use a digital instant-read thermometer inserted into the thickest part:</p>
<ul>
  <li><strong>Rare:</strong> 120°F – 125°F (Cool red center)</li>
  <li><strong>Medium-Rare:</strong> 130°F – 135°F (Warm pink center, peak juiciness)</li>
  <li><strong>Medium:</strong> 140°F – 145°F (Warm pink with slight gray band)</li>
  <li><strong>Medium-Well:</strong> 150°F – 155°F (Slight hint of pink)</li>
</ul>
<p><em>Chef Tip: Pull steak 5°F before target temp and rest for 8 minutes. Residual carryover cooking finishes it perfectly!</em></p>`
      },
      {
        triggers: ['wine pairing', 'wine for steak', 'wine for chicken', 'pairing'],
        response: `<h4>🍷 Sommelier Wine Pairing Recommendations</h4>
<ul>
  <li><strong>Prime Ribeye &amp; Red Meats:</strong> Bold Cabernet Sauvignon, Argentine Malbec, or Syrah to cut through marbled fats.</li>
  <li><strong>Honey Sesame Chicken:</strong> Off-dry German Riesling, Pinot Gris, or aromatic Gewürztraminer.</li>
  <li><strong>Spaghetti Carbonara:</strong> Crisp Italian Pinot Grigio, Gavi di Gavi, or light Chianti Classico.</li>
  <li><strong>Spicy Curries &amp; Biryani:</strong> Chilled Viognier, sparkling Prosecco, or authentic Mango Lassi.</li>
</ul>`
      },
      {
        triggers: ['salty', 'too salty', 'oversalted', 'fix salt'],
        response: `<h4>🧂 How to Fix Oversalted Food</h4>
<p>Don't panic! Here are 4 chef rescue techniques:</p>
<ol>
  <li><strong>Add Acid:</strong> Squeeze fresh lemon juice or add a splash of apple cider vinegar to balance the sodium receptor profile.</li>
  <li><strong>Dilute with Liquid:</strong> Add unsalted broth, water, cream, or unsalted canned crushed tomatoes.</li>
  <li><strong>Starch Absorption:</strong> Simmer halved raw potatoes in the soup for 15 mins—they absorb excess sodium.</li>
  <li><strong>Sweet Counterbalance:</strong> A pinch of brown sugar or honey softens aggressive salt perception.</li>
</ol>`
      }
    ]
  };

  // ─── 2. DRAWER COMPONENT INITIALIZATION ─────────────────────────────────────
  function initChefAIDrawer() {
    // Check if container already exists
    if (document.getElementById('wow-chef-ai-overlay')) return;

    var viewport = document.getElementById('viewport') || document.body;

    // A. Create Floating Action Button (FAB)
    var fab = document.createElement('button');
    fab.className = 'wow-chef-ai-fab z-[60] shadow-[0_4px_24px_rgba(61,242,224,0.25)] relative sm:absolute';
    fab.id = 'wow-chef-ai-fab';
    fab.setAttribute('aria-label', 'Open wow Chef AI Assistant');
    fab.setAttribute('type', 'button');
    fab.innerHTML = `
      <div class="chef-fab-avatar">
        <span class="material-symbols-outlined">smart_toy</span>
        <span class="chef-fab-pulse animate-pulse"></span>
      </div>
      <span class="chef-fab-label">wow <span>Chef AI</span></span>
      <span class="material-symbols-outlined chef-fab-sparkle">sparkles</span>
    `;

    // B. Create Drawer Overlay HTML
    var overlay = document.createElement('div');
    overlay.className = 'wow-chef-ai-overlay';
    overlay.id = 'wow-chef-ai-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'wow Chef AI Assistant');
    overlay.innerHTML = `
      <div class="wow-chef-ai-drawer" id="wow-chef-ai-drawer">
        
        <!-- Header -->
        <div class="chef-drawer-header">
          <div class="chef-drawer-drag-pill"></div>
          
          <div class="chef-header-top-row">
            <div class="chef-brand-identity">
              <div class="chef-avatar-badge">
                <span class="material-symbols-outlined">restaurant</span>
              </div>
              <div class="chef-identity-meta">
                <div class="chef-name-title">
                  <span>wow Chef AI</span>
                  <span class="chef-ai-tag">PRO</span>
                </div>
                <div class="chef-status-text">
                  <span class="chef-status-dot"></span>
                  <span>Live Culinary Assistant</span>
                </div>
              </div>
            </div>

            <div class="chef-header-controls">
              <button class="chef-header-btn" id="btn-clear-chat" title="Clear Conversation" type="button" aria-label="Clear chat">
                <span class="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
              <button class="chef-header-btn" id="btn-close-chef-drawer" title="Close Drawer" type="button" aria-label="Close Assistant">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <!-- Mode Switcher Tabs -->
          <div class="chef-mode-tabs" role="tablist">
            <button class="chef-mode-tab active" id="tab-mode-chat" role="tab" aria-selected="true" type="button">
              <span class="material-symbols-outlined text-[16px]">chat_bubble</span>
              <span>Chef Chat</span>
            </button>
            <button class="chef-mode-tab" id="tab-mode-advisor" role="tab" aria-selected="false" type="button">
              <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>Substitution Advisor</span>
            </button>
          </div>
        </div>

        <!-- Chat Stream Message History -->
        <div class="chef-chat-stream no-scrollbar" id="chef-chat-stream">
          <!-- Initial AI Greeting Message -->
          <div class="chat-msg-row ai">
            <div class="chat-bubble ai-bubble">
              <h4>👨‍🍳 Bonjour Chef! I'm your wow Chef AI.</h4>
              <p>Ask me any culinary question, technique guidance, recipe timing, or tap a quick cooking prompt below!</p>
            </div>
          </div>
        </div>

        <!-- Quick Cooking Prompts Carousel -->
        <div class="chef-quick-chips-wrapper no-scrollbar" id="chef-chips-carousel">
          <button class="chef-prompt-chip" data-prompt="How do I dice an onion?" type="button">
            <span>🧅 Dice an Onion</span>
          </button>
          <button class="chef-prompt-chip" data-prompt="How long to boil eggs?" type="button">
            <span>🥚 Boil Eggs</span>
          </button>
          <button class="chef-prompt-chip" data-prompt="What is a good substitute for heavy cream?" type="button">
            <span>🥛 Heavy Cream Swap</span>
          </button>
          <button class="chef-prompt-chip" data-prompt="What internal temperature should my steak be?" type="button">
            <span>🥩 Steak Temps</span>
          </button>
          <button class="chef-prompt-chip" data-prompt="What wine pairs with pasta or chicken?" type="button">
            <span>🍷 Wine Pairings</span>
          </button>
          <button class="chef-prompt-chip" data-prompt="How do I fix oversalted food?" type="button">
            <span>🧂 Fix Salty Food</span>
          </button>
        </div>

        <!-- Chat Input Bar -->
        <form class="chef-input-bar" id="chef-chat-form" onsubmit="event.preventDefault();">
          <div class="chef-input-container">
            <input
              type="text"
              id="chef-chat-input"
              class="chef-chat-input"
              placeholder="Ask wow Chef AI anything about cooking..."
              autocomplete="off"
            />
            <button type="button" class="chef-mic-btn" id="btn-chef-mic" title="Voice Input" aria-label="Use voice input">
              <span class="material-symbols-outlined text-[18px]">mic</span>
            </button>
          </div>
          <button type="submit" class="chef-send-btn" id="btn-chef-send" aria-label="Send Message">
            <span class="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>

      </div>
    `;

    viewport.appendChild(fab);
    viewport.appendChild(overlay);

    // ─── 3. EVENT LISTENERS & LOGIC ───────────────────────────────────────────
    var drawerOverlay = document.getElementById('wow-chef-ai-overlay');
    var chatStream = document.getElementById('chef-chat-stream');
    var chatInput = document.getElementById('chef-chat-input');
    var chatForm = document.getElementById('chef-chat-form');
    var closeBtn = document.getElementById('btn-close-chef-drawer');
    var clearBtn = document.getElementById('btn-clear-chat');
    var micBtn = document.getElementById('btn-chef-mic');
    var tabChat = document.getElementById('tab-mode-chat');
    var tabAdvisor = document.getElementById('tab-mode-advisor');
    var currentMode = 'chat'; // 'chat' or 'advisor'

    function openDrawer() {
      drawerOverlay.classList.add('open');
      if (window.GlobalViewportController) {
        window.GlobalViewportController.openDrawer(drawerOverlay);
      }
      setTimeout(function () {
        chatInput.focus();
      }, 350);
    }

    function closeDrawer() {
      drawerOverlay.classList.remove('open');
      if (window.GlobalViewportController) {
        window.GlobalViewportController.closeDrawer(drawerOverlay);
      }
      chatInput.blur();
    }

    fab.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    drawerOverlay.addEventListener('click', function (e) {
      if (e.target === drawerOverlay) {
        closeDrawer();
      }
    });

    // Clear Conversation
    clearBtn.addEventListener('click', function () {
      chatStream.innerHTML = `
        <div class="chat-msg-row ai">
          <div class="chat-bubble ai-bubble">
            <h4>👨‍🍳 Chat Cleared.</h4>
            <p>What culinary masterpiece are we creating next with <strong>wow Chef AI</strong>?</p>
          </div>
        </div>
      `;
    });

    // Mode Switcher Tabs
    tabChat.addEventListener('click', function () {
      currentMode = 'chat';
      tabChat.classList.add('active');
      tabAdvisor.classList.remove('active');
      chatInput.placeholder = 'Ask wow Chef AI anything about cooking...';
      appendAIMessage('👨‍🍳 Switched to <strong>Chef Chat &amp; Technique Mode</strong>. How can I assist your kitchen craft?');
    });

    tabAdvisor.addEventListener('click', function () {
      currentMode = 'advisor';
      tabAdvisor.classList.add('active');
      tabChat.classList.remove('active');
      chatInput.placeholder = 'Type an ingredient you lack (e.g., buttermilk, eggs, soy sauce)...';
      appendAIMessage('🔄 <strong>Ingredient Substitution Advisor Active</strong>. Type any ingredient you need an alternative for!');
    });

    // Append Message to Stream
    function appendUserMessage(text) {
      var row = document.createElement('div');
      row.className = 'chat-msg-row user';
      row.innerHTML = `<div class="chat-bubble user-bubble">${escapeHtml(text)}</div>`;
      chatStream.appendChild(row);
      chatStream.scrollTop = chatStream.scrollHeight;
    }

    function appendAIMessage(htmlContent) {
      var row = document.createElement('div');
      row.className = 'chat-msg-row ai';
      row.innerHTML = `<div class="chat-bubble ai-bubble">${htmlContent}</div>`;
      chatStream.appendChild(row);
      chatStream.scrollTop = chatStream.scrollHeight;
    }

    function showTypingIndicator() {
      var row = document.createElement('div');
      row.className = 'chat-msg-row ai';
      row.id = 'chef-typing-indicator';
      row.innerHTML = `
        <div class="chat-bubble ai-bubble">
          <div class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      `;
      chatStream.appendChild(row);
      chatStream.scrollTop = chatStream.scrollHeight;
    }

    function removeTypingIndicator() {
      var el = document.getElementById('chef-typing-indicator');
      if (el) el.remove();
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Process Chef Response
    function generateChefResponse(userText) {
      var lower = userText.toLowerCase().trim();

      // Check if user has explicit substitution intent keywords
      var hasExplicitSubWord = lower.includes('substitut') ||
        lower.includes('swap') ||
        lower.includes('replace') ||
        lower.includes('instead of') ||
        lower.includes('alternative') ||
        lower.includes('without ') ||
        lower.includes('don\'t have') ||
        lower.includes('lack') ||
        lower.includes('no ');

      // Check if prompt has clear technique cues
      var hasTechniqueCue = lower.includes('how to') ||
        lower.includes('how do i') ||
        lower.includes('how long') ||
        lower.includes('boil') ||
        lower.includes('dice') ||
        lower.includes('timer') ||
        lower.includes('sear') ||
        lower.includes('temp') ||
        lower.includes('pairing') ||
        lower.includes('fix ') ||
        lower.includes('minutes');

      // Helper to find substitution
      function matchSubstitution() {
        for (var i = 0; i < culinaryKnowledge.substitutions.length; i++) {
          var item = culinaryKnowledge.substitutions[i];
          for (var j = 0; j < item.triggers.length; j++) {
            if (lower.includes(item.triggers[j])) {
              return `
                <h4>🔄 wow Chef Substitution Advisor</h4>
                <p>Looking for a substitute for <strong>${escapeHtml(item.triggers[0].toUpperCase())}</strong>? Here is the Michelin chef recommendation:</p>
                <div class="sub-advisor-card">
                  <div class="sub-advisor-title">
                    <span class="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>${escapeHtml(item.sub)}</span>
                  </div>
                  <div class="sub-ratio-pill">${escapeHtml(item.ratio)}</div>
                  <div class="sub-profile-note">${escapeHtml(item.profile)}</div>
                  <span style="font-size:9.5px; font-weight:700; color:#FFD700; margin-top:2px;">${escapeHtml(item.dietary)}</span>
                </div>
              `;
            }
          }
        }
        return null;
      }

      // Helper to find technique
      function matchTechnique() {
        for (var k = 0; k < culinaryKnowledge.techniques.length; k++) {
          var tech = culinaryKnowledge.techniques[k];
          for (var l = 0; l < tech.triggers.length; l++) {
            if (lower.includes(tech.triggers[l])) {
              return tech.response;
            }
          }
        }
        return null;
      }

      // Priority 1: Explicit substitution phrasing
      if (hasExplicitSubWord) {
        var subResult = matchSubstitution();
        if (subResult) return subResult;
      }

      // Priority 2: In Advisor mode (and no specific technique cue requested)
      if (currentMode === 'advisor' && !hasTechniqueCue) {
        var advSubResult = matchSubstitution();
        if (advSubResult) return advSubResult;
      }

      // Priority 3: Technique & Prep Matches
      var techResult = matchTechnique();
      if (techResult) return techResult;

      // Priority 4: Direct ingredient match fallback
      var subFallback = matchSubstitution();
      if (subFallback) return subFallback;

      // Priority 5: Contextual Greetings / Suggestions
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return `<h4>👨‍🍳 Greetings from wow Chef AI!</h4>
<p>What are we cooking today? I can help with cooking timers, substitute missing ingredients, or recommend wine pairings!</p>`;
      }

      if (lower.includes('recipe') || lower.includes('suggest') || lower.includes('dinner')) {
        return `<h4>✨ wow Chef Recommendations</h4>
<p>Based on today's pantry inventory, I recommend:</p>
<ul>
  <li><strong>Honey Sesame Chicken:</strong> 20 min crispy skillet glaze (480 kcal).</li>
  <li><strong>Roman Spaghetti Carbonara:</strong> 25 min silky guanciale &amp; egg emulsion.</li>
  <li><strong>Slow-Simmered Dal Makhani:</strong> Velvety black lentils with churned butter.</li>
</ul>
<p><em>Tap Cook Mode in the bottom navigation to launch voice guidance anytime!</em></p>`;
      }

      // Fallback helpful guidance
      return `<h4>👨‍🍳 wow Chef AI Advice</h4>
<p>Excellent culinary question! To achieve optimal flavor balance for <em>"${escapeHtml(userText)}"</em>:</p>
<ul>
  <li>Ensure your cooking surface is preheated to high heat before proteins touch the pan.</li>
  <li>Season in layers: early for deep osmosis, and finish with flaky sea salt and fresh herbs right before plating.</li>
  <li>Rest cooked meats for at least 5–8 minutes to redistribute natural juices.</li>
</ul>
<p>Need a substitute or specific timer? Just ask <strong>wow Chef AI</strong>!</p>`;
    }

    // Handle User Message Submission
    function handleUserSubmit(text) {
      if (!text || !text.trim()) return;
      var cleanText = text.trim();
      appendUserMessage(cleanText);
      chatInput.value = '';

      showTypingIndicator();

      // Realistic response generation delay
      setTimeout(function () {
        removeTypingIndicator();
        var responseHtml = generateChefResponse(cleanText);
        appendAIMessage(responseHtml);
      }, 600);
    }

    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleUserSubmit(chatInput.value);
    });

    // Quick Prompt Chips Click
    var promptChips = document.querySelectorAll('.chef-prompt-chip');
    promptChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var promptText = chip.getAttribute('data-prompt');
        handleUserSubmit(promptText);
      });
    });

    // Voice Recognition (Web Speech API)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      var recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'en-US';

      recognizer.onstart = function () {
        micBtn.classList.add('listening');
        chatInput.placeholder = 'Listening to your kitchen question...';
      };

      recognizer.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        handleUserSubmit(transcript);
      };

      recognizer.onerror = function () {
        micBtn.classList.remove('listening');
        chatInput.placeholder = 'Ask wow Chef AI anything about cooking...';
      };

      recognizer.onend = function () {
        micBtn.classList.remove('listening');
        chatInput.placeholder = 'Ask wow Chef AI anything about cooking...';
      };

      micBtn.addEventListener('click', function () {
        try {
          recognizer.start();
        } catch (err) {
          recognizer.stop();
        }
      });
    } else {
      micBtn.addEventListener('click', function () {
        alert('Voice recognition is available on supported Chrome / Chromium browsers.');
      });
    }

  }

  // Auto-init on DOMContentLoaded or immediate if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChefAIDrawer);
  } else {
    initChefAIDrawer();
  }

  // Expose global controller
  window.wowChefAI = {
    open: function () {
      var overlay = document.getElementById('wow-chef-ai-overlay');
      if (overlay) overlay.classList.add('open');
    },
    close: function () {
      var overlay = document.getElementById('wow-chef-ai-overlay');
      if (overlay) overlay.classList.remove('open');
    },
    ask: function (question) {
      var overlay = document.getElementById('wow-chef-ai-overlay');
      if (overlay) {
        overlay.classList.add('open');
        var input = document.getElementById('chef-chat-input');
        var form = document.getElementById('chef-chat-form');
        if (input && form) {
          input.value = question;
          form.dispatchEvent(new Event('submit'));
        }
      }
    }
  };

})(window, document);
