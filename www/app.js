/**
 * wow Food Recipes — Centralized Global State Engine & Background Data Controller
 * File: app.js
 * 
 * Architecture:
 * 1. Global State Engine ('WowAppState') storing active user metrics silently in localStorage.
 * 2. Scanner-to-Explore Pipeline: Syncs pantry scan items into active pantry ingredients and tag filters.
 * 3. Planner-to-Grocery Pipeline: Cross-references planned meal ingredients against active pantry ingredients
 *    and automatically injects missing items into the appropriate grocery aisles.
 * 4. Live Price & Telemetry Recalculation Engine: Computes exact subtotals, item counts, and syncs
 *    DOM container bindings smoothly with zero visual layout shift.
 * 5. Secure Payment & VIP Subscription Pipeline: Persists VIP status and provides instant bypass.
 */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'wow_app_state_v1';
  const VIP_STORAGE_KEY = 'wow_vip_subscription';
  const SOCIAL_POSTS_STORAGE_KEY = 'wow_social_posts';

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. DEFAULT DATASETS
  // ═══════════════════════════════════════════════════════════════════════════

  const DEFAULT_SOCIAL_POSTS = [
    {
      id: 'post-sarah-01',
      author: 'Chef Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150',
      verified: true,
      timeMeta: '2h ago • Michelin Contender',
      recipeName: 'Honey Sesame Chicken',
      recipeId: 'sesame-chicken',
      recipeIcon: '🍳',
      photo: 'assets/sesame-chicken.png',
      likes: 1400,
      likesFormatted: '1.4k',
      liked: false,
      commentsCount: 86,
      caption: 'The AI scanner suggested raw clover honey and it produced the most glistening glaze! Crispy scallions added the perfect aromatic crunch. 🍯✨',
      tags: ['#RawCloverHoney', '#GlazeMastery', '#HighProtein'],
      category: 'trending following',
      isUserPost: false
    },
    {
      id: 'post-marco-02',
      author: 'Marco Rossi',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
      verified: true,
      timeMeta: '4h ago • Rome, Italy',
      recipeName: 'Spaghetti Carbonara',
      recipeId: 'carbonara',
      recipeIcon: '🍝',
      photo: 'assets/carbonara.png',
      likes: 2800,
      likesFormatted: '2.8k',
      liked: false,
      commentsCount: 142,
      caption: 'No cream, ever! Only egg yolks, Pecorino Romano, and crispy guanciale fat emulsion. The step-by-step timer in the app kept the heat perfectly controlled. 🇮🇹🔥',
      tags: ['#AuthenticCarbonara', '#Guanciale', '#RomanKitchen'],
      category: 'trending',
      isUserPost: false
    },
    {
      id: 'post-elena-03',
      author: 'Elena Vega',
      avatar: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=150',
      verified: true,
      timeMeta: '6h ago • Valencia, Spain',
      recipeName: 'Spanish Seafood Paella',
      recipeId: 'paella',
      recipeIcon: '🥘',
      photo: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
      likes: 1900,
      likesFormatted: '1.9k',
      liked: false,
      commentsCount: 64,
      caption: 'That golden socarrat crust at the bottom of the pan is the holy grail. The Spanish saffron infusion gave the bomba rice unmatched depth! 🇪🇸🦐',
      tags: ['#Socarrat', '#SeafoodPaella', '#BombaRice'],
      category: 'following',
      isUserPost: false
    },
    {
      id: 'post-priya-04',
      author: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      verified: true,
      timeMeta: '8h ago • Hyderabad Classic',
      recipeName: 'Royal Chicken Biryani',
      recipeId: 'biryani',
      recipeIcon: '🍗',
      photo: 'assets/biryani.png',
      likes: 3400,
      likesFormatted: '3.4k',
      liked: false,
      commentsCount: 198,
      caption: 'Dough-sealed handi dum cooking for 45 mins locked in every aromatic vapor. Saffron milk and caramelized fried onions created pure magic! 🌿✨',
      tags: ['#DumBiryani', '#Hyderabadi', '#SaffronGhee'],
      category: 'trending following',
      isUserPost: false
    }
  ];

  const DEFAULT_PANTRY_INGREDIENTS = [
    'Garlic',
    'Tomato',
    'Chicken',
    'Eggs',
    'Basil',
    'Buffalo Mozzarella'
  ];

  const DEFAULT_SHOPPING_LIST = [
    {
      id: 'ribeye',
      name: 'Premium Bone-In Ribeye Cut',
      desc: '1 pcs (450g) • Prime Reserve Cut • Ribeye',
      category: 'protein',
      recipe: 'ribeye',
      quantity: 1,
      unitPrice: 24.95,
      checked: false
    },
    {
      id: 'chicken',
      name: 'Boneless Chicken Breasts',
      desc: '650g • Diced cubes • Honey Sesame',
      category: 'protein',
      recipe: 'chicken',
      quantity: 1,
      unitPrice: 9.95,
      checked: false
    },
    {
      id: 'guanciale',
      name: 'Cured Guanciale / Bacon',
      desc: '150g • Thick cut strips • Carbonara',
      category: 'protein',
      recipe: 'carbonara',
      quantity: 1,
      unitPrice: 6.50,
      checked: false
    },
    {
      id: 'parmigiano',
      name: 'Aged Parmigiano-Reggiano',
      desc: '80g • 24-Month Aged DOP Cheese • Carbonara',
      category: 'dairy',
      recipe: 'carbonara',
      quantity: 1,
      unitPrice: 7.25,
      checked: false
    },
    {
      id: 'truffle-butter',
      name: 'Unsalted Truffle Butter Block',
      desc: '50g • Black Summer Truffle Infusion • Ribeye',
      category: 'dairy',
      recipe: 'ribeye',
      quantity: 2,
      unitPrice: 8.50,
      checked: false
    },
    {
      id: 'pecorino',
      name: 'Pecorino Romano DOP',
      desc: "100g • Aged sheep's milk cheese • Carbonara",
      category: 'dairy',
      recipe: 'carbonara',
      quantity: 1,
      unitPrice: 5.75,
      checked: false
    },
    {
      id: 'fettuccine',
      name: 'Artisan Egg Fettuccine',
      desc: '200g • Bronze-cut Italian Pasta • Carbonara',
      category: 'produce',
      recipe: 'carbonara',
      quantity: 1,
      unitPrice: 4.50,
      checked: false
    },
    {
      id: 'honey',
      name: 'Raw Wildflower Honey',
      desc: '80 ml • Grade A clover nectar • Honey Sesame',
      category: 'produce',
      recipe: 'chicken',
      quantity: 1,
      unitPrice: 5.95,
      checked: false
    },
    {
      id: 'scallions',
      name: 'Fresh Green Scallions',
      desc: '1 bunch • Organic crisp herbs • Honey Sesame',
      category: 'produce',
      recipe: 'chicken',
      quantity: 1,
      unitPrice: 1.85,
      checked: false
    },
    {
      id: 'saffron',
      name: 'Kashmiri Saffron Strands',
      desc: '1 pinch • Golden milk infusion • Biryani',
      category: 'produce',
      recipe: 'biryani',
      quantity: 1,
      unitPrice: 12.50,
      checked: false
    }
  ];

  const DEFAULT_WEEKLY_PLANNED_MEALS = {
    'Oct 12': {
      date: 'Oct 12',
      dayKey: 'mon',
      dayName: 'Monday',
      calories: 1420,
      protein: '102g', carbs: '115g', fats: '42g',
      breakfast: { title: 'Greek Yogurt Berry Parfait', time: '8:00 AM', kcal: 340, recipeId: 'greek-yogurt' },
      lunch: { title: 'Spaghetti Carbonara', time: '1:00 PM', kcal: 620, recipeId: 'spaghetti-carbonara' },
      dinner: { title: 'Grilled Salmon & Asparagus', time: '7:30 PM', kcal: 460, recipeId: 'salmon' }
    },
    'Oct 13': {
      date: 'Oct 13',
      dayKey: 'tue',
      dayName: 'Tuesday',
      calories: 1380,
      protein: '98g', carbs: '128g', fats: '40g',
      breakfast: { title: 'Spinach & Feta Egg Scramble', time: '8:15 AM', kcal: 360, recipeId: 'spinach-egg' },
      lunch: { title: 'Mexican Birria Tacos', time: '1:30 PM', kcal: 580, recipeId: 'birria' },
      dinner: { title: 'Neapolitan Pizza Margherita', time: '8:00 PM', kcal: 440, recipeId: 'pizza-authentic' }
    },
    'Oct 14': {
      date: 'Oct 14',
      dayKey: 'wed',
      dayName: 'Wednesday',
      calories: 1340,
      protein: '94g', carbs: '120g', fats: '46g',
      breakfast: { title: 'Healthy Greens Avocado Toast', time: '8:30 AM', kcal: 380, recipeId: 'avocado-toast' },
      lunch: { title: 'Honey Sesame Chicken', time: '1:15 PM', kcal: 540, recipeId: 'sesame-chicken' },
      dinner: { title: 'Slow-Simmered Dal Makhani', time: '7:45 PM', kcal: 420, recipeId: 'dal-makhani' }
    },
    'Oct 15': {
      date: 'Oct 15',
      dayKey: 'thu',
      dayName: 'Thursday',
      calories: 1450,
      protein: '110g', carbs: '110g', fats: '48g',
      breakfast: { title: 'Overnight Chia Seed Pudding', time: '8:00 AM', kcal: 320, recipeId: 'chia-pudding' },
      lunch: { title: 'Pan-Seared Prime Ribeye Steak', time: '1:15 PM', kcal: 680, recipeId: 'ribeye' },
      dinner: { title: 'Mediterranean Quinoa Salad', time: '7:30 PM', kcal: 450, recipeId: 'quinoa-salad' }
    },
    'Oct 16': {
      date: 'Oct 16',
      dayKey: 'fri',
      dayName: 'Friday',
      calories: 1520,
      protein: '105g', carbs: '135g', fats: '52g',
      breakfast: { title: 'Protein Fluffy Pancakes', time: '8:30 AM', kcal: 420, recipeId: 'protein-pancakes' },
      lunch: { title: 'Traditional Spanish Paella', time: '1:30 PM', kcal: 610, recipeId: 'paella' },
      dinner: { title: 'Royal Lucknowi Biryani', time: '8:00 PM', kcal: 490, recipeId: 'biryani' }
    },
    'Oct 17': {
      date: 'Oct 17',
      dayKey: 'sat',
      dayName: 'Saturday',
      calories: 1600,
      protein: '115g', carbs: '145g', fats: '54g',
      breakfast: { title: "Chef's Shakshuka in Cast Iron", time: '9:00 AM', kcal: 410, recipeId: 'shakshuka' },
      lunch: { title: 'Artisanal Wagyu Smash Burger', time: '2:00 PM', kcal: 720, recipeId: 'wagyu-burger' },
      dinner: { title: 'Truffle Mushroom Tagliatelle', time: '8:30 PM', kcal: 470, recipeId: 'truffle-tagliatelle' }
    }
  };

  // Recipe Ingredient Reference Map for Planner-to-Grocery Pipeline
  const RECIPE_INGREDIENT_CATALOG = {
    'spaghetti-carbonara': [
      { id: 'guanciale', name: 'Cured Guanciale / Bacon', desc: '150g • Thick cut strips', category: 'protein', unitPrice: 6.50 },
      { id: 'parmigiano', name: 'Aged Parmigiano-Reggiano', desc: '80g • 24-Month Aged DOP Cheese', category: 'dairy', unitPrice: 7.25 },
      { id: 'pecorino', name: 'Pecorino Romano DOP', desc: "100g • Aged sheep's milk cheese", category: 'dairy', unitPrice: 5.75 },
      { id: 'fettuccine', name: 'Artisan Egg Fettuccine', desc: '200g • Bronze-cut Italian Pasta', category: 'produce', unitPrice: 4.50 },
      { id: 'eggs', name: 'Organic Farm Eggs', desc: '4 large yolks', category: 'dairy', unitPrice: 3.50 }
    ],
    'sesame-chicken': [
      { id: 'chicken', name: 'Boneless Chicken Breasts', desc: '650g • Diced cubes', category: 'protein', unitPrice: 9.95 },
      { id: 'honey', name: 'Raw Wildflower Honey', desc: '80 ml • Grade A clover nectar', category: 'produce', unitPrice: 5.95 },
      { id: 'scallions', name: 'Fresh Green Scallions', desc: '1 bunch • Organic crisp herbs', category: 'produce', unitPrice: 1.85 },
      { id: 'sesame-seeds', name: 'Toasted White Sesame Seeds', desc: '30g • Aromatic crunch', category: 'produce', unitPrice: 2.25 },
      { id: 'garlic', name: 'Fresh Garlic Cloves', desc: '4 cloves minced', category: 'produce', unitPrice: 1.20 }
    ],
    'ribeye': [
      { id: 'ribeye', name: 'Premium Bone-In Ribeye Cut', desc: '1 pcs (450g) • Prime Reserve Cut', category: 'protein', unitPrice: 24.95 },
      { id: 'truffle-butter', name: 'Unsalted Truffle Butter Block', desc: '50g • Black Summer Truffle Infusion', category: 'dairy', unitPrice: 8.50 },
      { id: 'rosemary', name: 'Fresh Organic Rosemary', desc: '3 sprigs garden fresh', category: 'produce', unitPrice: 1.95 }
    ],
    'biryani': [
      { id: 'saffron', name: 'Kashmiri Saffron Strands', desc: '1 pinch • Golden milk infusion', category: 'produce', unitPrice: 12.50 },
      { id: 'basmati', name: 'Aged Long-Grain Basmati Rice', desc: '500g • Royal reserve grains', category: 'produce', unitPrice: 4.95 },
      { id: 'lamb-mutton', name: 'Tender Spiced Lamb Cuts', desc: '600g • Marinated cuts', category: 'protein', unitPrice: 18.50 }
    ],
    'avocado-toast': [
      { id: 'avocado', name: 'Hass Avocados', desc: '2 ripe organic avocados', category: 'produce', unitPrice: 3.50 },
      { id: 'sourdough', name: 'Artisan Sourdough Loaf', desc: '1 loaf sliced', category: 'produce', unitPrice: 4.25 },
      { id: 'eggs', name: 'Pasture-Raised Farm Eggs', desc: '2 poached eggs', category: 'dairy', unitPrice: 3.50 }
    ],
    'dal-makhani': [
      { id: 'black-lentils', name: 'Whole Black Urad Lentils', desc: '300g • Slow-simmered beans', category: 'produce', unitPrice: 3.25 },
      { id: 'churned-butter', name: 'White Churned Butter', desc: '100g • Farm fresh dairy', category: 'dairy', unitPrice: 4.50 },
      { id: 'heavy-cream', name: 'Velvety Spiced Cream', desc: '120ml • Rich finishing cream', category: 'dairy', unitPrice: 2.80 }
    ],
    'pizza-authentic': [
      { id: 'pizza-flour', name: 'Type 00 Italian Pizza Flour', desc: '250g • High protein flour', category: 'produce', unitPrice: 3.75 },
      { id: 'mozzarella', name: 'Fior di Latte Mozzarella', desc: '200g • Fresh buffalo curd', category: 'dairy', unitPrice: 5.50 },
      { id: 'san-marzano', name: 'San Marzano Tomato Sauce', desc: '150ml • D.O.P. coulis', category: 'produce', unitPrice: 4.20 },
      { id: 'basil', name: 'Fresh Sweet Basil', desc: '50g • Fragrant whole leaves', category: 'produce', unitPrice: 1.50 }
    ],
    'birria': [
      { id: 'beef-shank', name: 'Braised Beef Shank & Chuck', desc: '500g • Slow braised beef', category: 'protein', unitPrice: 14.50 },
      { id: 'chiles', name: 'Dried Guajillo & Ancho Chiles', desc: '50g • Mexican chili blend', category: 'produce', unitPrice: 3.00 },
      { id: 'corn-tortillas', name: 'Stone-Ground Corn Tortillas', desc: '12 count pack', category: 'produce', unitPrice: 2.50 }
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. CORE CENTRAL APPLICATION STATE ('WowAppState')
  // ═══════════════════════════════════════════════════════════════════════════

  class CentralStateManager {
    constructor() {
      this.listeners = [];
      this.state = this._loadInitialState();
      this._bindStorageSync();
    }

    _loadInitialState() {
      let saved = null;
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            saved = JSON.parse(raw);
          }
        }
      } catch (e) {
        console.warn('[WowAppState] LocalStorage read failed:', e);
      }

      // Check external VIP flag
      let vipFlag = true;
      try {
        if (typeof localStorage !== 'undefined') {
          const rawVip = localStorage.getItem(VIP_STORAGE_KEY);
          if (rawVip !== null) {
            vipFlag = rawVip === 'true';
          }
        }
      } catch (e) {}

      // Load social posts
      let savedPosts = null;
      if (saved && Array.isArray(saved.socialFeedPosts)) {
        savedPosts = saved.socialFeedPosts;
      } else {
        try {
          if (typeof localStorage !== 'undefined') {
            const rawSocial = localStorage.getItem(SOCIAL_POSTS_STORAGE_KEY);
            if (rawSocial) savedPosts = JSON.parse(rawSocial);
          }
        } catch (e) {}
      }
      const socialPosts = (savedPosts && Array.isArray(savedPosts))
        ? savedPosts
        : JSON.parse(JSON.stringify(DEFAULT_SOCIAL_POSTS));

      const activePantry = (saved && Array.isArray(saved.activePantryIngredients))
        ? saved.activePantryIngredients
        : [...DEFAULT_PANTRY_INGREDIENTS];

      const shoppingList = (saved && Array.isArray(saved.activeShoppingList))
        ? saved.activeShoppingList
        : JSON.parse(JSON.stringify(DEFAULT_SHOPPING_LIST));

      const plannedMeals = (saved && saved.weeklyPlannedMeals && typeof saved.weeklyPlannedMeals === 'object')
        ? saved.weeklyPlannedMeals
        : JSON.parse(JSON.stringify(DEFAULT_WEEKLY_PLANNED_MEALS));

      const vip = (saved && typeof saved.userSubscriptionVIP === 'boolean')
        ? saved.userSubscriptionVIP
        : vipFlag;

      return {
        activePantryIngredients: activePantry,
        weeklyPlannedMeals: plannedMeals,
        activeShoppingList: shoppingList,
        userSubscriptionVIP: vip,
        socialFeedPosts: socialPosts,
        lastUpdated: Date.now()
      };
    }

    _saveState() {
      try {
        if (typeof localStorage !== 'undefined') {
          this.state.lastUpdated = Date.now();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
          localStorage.setItem(VIP_STORAGE_KEY, String(this.state.userSubscriptionVIP));
          localStorage.setItem(SOCIAL_POSTS_STORAGE_KEY, JSON.stringify(this.state.socialFeedPosts));
        }
      } catch (e) {
        console.warn('[WowAppState] LocalStorage write failed:', e);
      }
      this._emit('statechange', this.state);
    }

    _bindStorageSync() {
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === STORAGE_KEY && e.newValue) {
            try {
              this.state = JSON.parse(e.newValue);
              this._emit('statechange', this.state);
            } catch (err) {}
          } else if (e.key === VIP_STORAGE_KEY) {
            this.state.userSubscriptionVIP = e.newValue === 'true';
            this._emit('vipupdate', this.state.userSubscriptionVIP);
          } else if (e.key === SOCIAL_POSTS_STORAGE_KEY && e.newValue) {
            try {
              this.state.socialFeedPosts = JSON.parse(e.newValue);
              this._emit('socialupdate', { allPosts: this.state.socialFeedPosts });
            } catch (err) {}
          }
        });
      }
    }

    _emit(type, detail) {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        const event = new CustomEvent(`wow:${type}`, { detail });
        window.dispatchEvent(event);
      }
      this.listeners.forEach(fn => {
        try { fn(type, detail); } catch (e) { console.error(e); }
      });
    }

    subscribe(listener) {
      if (typeof listener === 'function') {
        this.listeners.push(listener);
        return () => {
          this.listeners = this.listeners.filter(l => l !== listener);
        };
      }
      return () => {};
    }

    // ─── Getters for Root Properties ─────────────────────────────────────────
    get activePantryIngredients() {
      return this.state.activePantryIngredients;
    }

    get weeklyPlannedMeals() {
      return this.state.weeklyPlannedMeals;
    }

    get activeShoppingList() {
      return this.state.activeShoppingList;
    }

    get userSubscriptionVIP() {
      return this.state.userSubscriptionVIP;
    }

    get socialFeedPosts() {
      return this.state.socialFeedPosts;
    }

    // ─── 0. Social Feed Community Activity Pipeline ──────────────────────────
    getSocialPosts() {
      return [...(this.state.socialFeedPosts || [])];
    }

    addSocialPost(postPayload) {
      if (!postPayload || typeof postPayload !== 'object') return null;

      const newPost = {
        id: postPayload.id || `post-user-${Date.now()}`,
        author: postPayload.author || 'You (Chef Alex)',
        avatar: postPayload.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        verified: true,
        timeMeta: postPayload.timeMeta || 'Just now • Community Masterclass',
        recipeName: postPayload.recipeName || 'Honey Sesame Chicken',
        recipeId: postPayload.recipeId || 'sesame-chicken',
        recipeIcon: postPayload.recipeIcon || '🍳',
        photo: postPayload.photo || 'assets/sesame-chicken.png',
        likes: postPayload.likes !== undefined ? postPayload.likes : 1,
        likesFormatted: postPayload.likesFormatted || '1',
        liked: Boolean(postPayload.liked),
        commentsCount: postPayload.commentsCount || 0,
        caption: postPayload.caption || 'Crafted this dish with the app step-by-step mode. Flavor profile is truly exquisite!',
        tags: Array.isArray(postPayload.tags) ? postPayload.tags : ['#HomeChefCreation', '#wowRecipes'],
        category: postPayload.category || 'trending following',
        isUserPost: true,
        timestamp: Date.now()
      };

      if (!Array.isArray(this.state.socialFeedPosts)) {
        this.state.socialFeedPosts = [...DEFAULT_SOCIAL_POSTS];
      }

      this.state.socialFeedPosts.unshift(newPost);
      this._saveState();
      this._emit('socialupdate', { newPost, allPosts: this.state.socialFeedPosts });
      return newPost;
    }

    getRecentEngagedRecipes() {
      const recipeMap = new Map();

      // Seed curated recipe entries
      const catalogSeeds = [
        { id: 'sesame-chicken', title: 'Honey Sesame Chicken', icon: '🍳', image: 'assets/sesame-chicken.png' },
        { id: 'carbonara', title: 'Spaghetti Carbonara', icon: '🍝', image: 'assets/carbonara.png' },
        { id: 'ribeye', title: 'Prime Bone-In Ribeye Cut', icon: '🥩', image: 'assets/images/ribeye.jpg' },
        { id: 'biryani', title: 'Royal Chicken Biryani', icon: '🍗', image: 'assets/biryani.png' },
        { id: 'paella', title: 'Spanish Seafood Paella', icon: '🥘', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800' },
        { id: 'avocado-toast', title: 'Healthy Greens Avocado Toast', icon: '🥑', image: 'assets/images/avocado-toast.jpg' },
        { id: 'pizza-authentic', title: 'Neapolitan Pizza Margherita', icon: '🍕', image: 'assets/images/pizza-margherita.jpg' },
        { id: 'birria', title: 'Mexican Birria Tacos', icon: '🌮', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800' }
      ];

      catalogSeeds.forEach(r => recipeMap.set(r.id, r));

      // Extract from weeklyPlannedMeals dynamically
      if (this.state.weeklyPlannedMeals && typeof this.state.weeklyPlannedMeals === 'object') {
        Object.keys(this.state.weeklyPlannedMeals).forEach(dayKey => {
          const day = this.state.weeklyPlannedMeals[dayKey];
          if (!day) return;
          ['breakfast', 'lunch', 'dinner'].forEach(slotKey => {
            const slot = day[slotKey];
            if (slot && slot.title) {
              const rId = slot.recipeId || slot.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              if (!recipeMap.has(rId)) {
                let fallbackImg = 'assets/sesame-chicken.png';
                let icon = '🍳';
                const lower = slot.title.toLowerCase();
                if (lower.includes('carbonara') || lower.includes('pasta') || lower.includes('spaghetti')) {
                  fallbackImg = 'assets/carbonara.png';
                  icon = '🍝';
                } else if (lower.includes('ribeye') || lower.includes('steak')) {
                  fallbackImg = 'assets/images/ribeye.jpg';
                  icon = '🥩';
                } else if (lower.includes('biryani')) {
                  fallbackImg = 'assets/biryani.png';
                  icon = '🍗';
                } else if (lower.includes('paella')) {
                  fallbackImg = 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800';
                  icon = '🥘';
                } else if (lower.includes('toast') || lower.includes('avocado')) {
                  fallbackImg = 'assets/images/avocado-toast.jpg';
                  icon = '🥑';
                } else if (lower.includes('pizza')) {
                  fallbackImg = 'assets/images/pizza-margherita.jpg';
                  icon = '🍕';
                } else if (lower.includes('yogurt') || lower.includes('parfait')) {
                  fallbackImg = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800';
                  icon = '🥣';
                } else if (lower.includes('salmon')) {
                  fallbackImg = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800';
                  icon = '🐟';
                } else if (lower.includes('shakshuka')) {
                  fallbackImg = 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800';
                  icon = '🍳';
                }
                recipeMap.set(rId, {
                  id: rId,
                  title: slot.title,
                  icon: icon,
                  image: fallbackImg
                });
              }
            }
          });
        });
      }

      return Array.from(recipeMap.values());
    }

    // ─── 1. Scanner-to-Explore Pipeline Methods ──────────────────────────────
    getPantryIngredients() {
      return [...this.state.activePantryIngredients];
    }

    setPantryIngredients(ingredientsArr) {
      if (!Array.isArray(ingredientsArr)) return;
      const clean = Array.from(new Set(ingredientsArr.map(s => String(s).trim()).filter(Boolean)));
      this.state.activePantryIngredients = clean;
      this._saveState();
      this._emit('pantryupdate', this.state.activePantryIngredients);
    }

    addPantryIngredient(name) {
      if (!name || typeof name !== 'string') return;
      const clean = name.trim();
      if (!clean) return;
      const exists = this.state.activePantryIngredients.some(item => item.toLowerCase() === clean.toLowerCase());
      if (!exists) {
        this.state.activePantryIngredients.push(clean);
        this._saveState();
        this._emit('pantryupdate', this.state.activePantryIngredients);
      }
    }

    removePantryIngredient(name) {
      if (!name || typeof name !== 'string') return;
      const clean = name.trim().toLowerCase();
      this.state.activePantryIngredients = this.state.activePantryIngredients.filter(
        item => item.toLowerCase() !== clean
      );
      this._saveState();
      this._emit('pantryupdate', this.state.activePantryIngredients);
    }

    // ─── 2. Planner-to-Grocery Pipeline Methods ──────────────────────────────
    getPlannedMeal(dateKey) {
      return this.state.weeklyPlannedMeals[dateKey] || null;
    }

    setPlannedMeal(dateKey, mealData) {
      if (!dateKey) return;
      this.state.weeklyPlannedMeals[dateKey] = mealData;
      this._saveState();
      this._emit('plannerupdate', { dateKey, mealData });
    }

    /**
     * Cross-references planned recipes against active pantry items
     * and automatically injects missing items directly into activeShoppingList.
     */
    syncPlannerToGrocery() {
      const pantrySet = new Set(
        this.state.activePantryIngredients.map(i => i.toLowerCase().trim())
      );

      const currentShoppingIds = new Set(
        this.state.activeShoppingList.map(item => item.id)
      );

      const missingItemsToAdd = [];

      // Extract recipes from planned meals
      Object.keys(this.state.weeklyPlannedMeals).forEach(dateKey => {
        const plan = this.state.weeklyPlannedMeals[dateKey];
        if (!plan) return;

        const slots = [plan.breakfast, plan.lunch, plan.dinner];
        slots.forEach(slot => {
          if (!slot) return;
          const recipeId = slot.recipeId || (slot.title ? slot.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
          const catalogItems = RECIPE_INGREDIENT_CATALOG[recipeId] || [];

          catalogItems.forEach(ingredient => {
            // Check if ingredient exists in pantry
            const inPantry = Array.from(pantrySet).some(pantryItem => {
              const p = pantryItem.toLowerCase();
              const ing = ingredient.name.toLowerCase();
              return ing.includes(p) || p.includes(ing) || (ingredient.id && ingredient.id.toLowerCase().includes(p));
            });

            if (!inPantry && !currentShoppingIds.has(ingredient.id)) {
              missingItemsToAdd.push({
                id: ingredient.id,
                name: ingredient.name,
                desc: ingredient.desc + (slot.title ? ` • ${slot.title}` : ''),
                category: ingredient.category || 'produce',
                recipe: recipeId,
                quantity: 1,
                unitPrice: ingredient.unitPrice || 5.00,
                checked: false
              });
              currentShoppingIds.add(ingredient.id);
            }
          });
        });
      });

      if (missingItemsToAdd.length > 0) {
        this.state.activeShoppingList.push(...missingItemsToAdd);
        this._saveState();
        this._emit('groceryupdate', this.state.activeShoppingList);
      }

      return {
        addedCount: missingItemsToAdd.length,
        itemsAdded: missingItemsToAdd,
        shoppingList: this.state.activeShoppingList
      };
    }

    // ─── 3. Live Price & Grocery State Engine ────────────────────────────────
    getShoppingList() {
      return [...this.state.activeShoppingList];
    }

    setShoppingList(list) {
      if (!Array.isArray(list)) return;
      this.state.activeShoppingList = list;
      this._saveState();
      this._emit('groceryupdate', this.state.activeShoppingList);
    }

    updateShoppingItem(id, updates) {
      let found = false;
      this.state.activeShoppingList = this.state.activeShoppingList.map(item => {
        if (item.id === id) {
          found = true;
          return { ...item, ...updates };
        }
        return item;
      });
      if (found) {
        this._saveState();
        this._emit('groceryupdate', this.state.activeShoppingList);
      }
    }

    toggleShoppingItem(id) {
      const item = this.state.activeShoppingList.find(i => i.id === id);
      if (item) {
        this.updateShoppingItem(id, { checked: !item.checked });
      }
    }

    adjustShoppingItemQty(id, delta) {
      const item = this.state.activeShoppingList.find(i => i.id === id);
      if (item) {
        const nextQty = Math.max(1, (item.quantity || 1) + delta);
        this.updateShoppingItem(id, { quantity: nextQty });
      }
    }

    /**
     * Exact Price and Count Computation Engine
     */
    calculateGroceryTotals() {
      let total = 0;
      let visibleCount = 0;
      let struckCount = 0;

      this.state.activeShoppingList.forEach(item => {
        if (!item.checked) {
          visibleCount++;
          const qty = item.quantity || 1;
          const price = item.unitPrice || 0;
          total += qty * price;
        } else {
          struckCount++;
        }
      });

      const formattedTotal = total.toFixed(2);
      return {
        total,
        formattedTotal,
        visibleCount,
        struckCount,
        totalItems: this.state.activeShoppingList.length
      };
    }

    // ─── 4. Secure Payment Gateway & VIP Subscription Pipeline ───────────────
    getVIPStatus() {
      return this.state.userSubscriptionVIP;
    }

    setVIPStatus(isVIP) {
      this.state.userSubscriptionVIP = Boolean(isVIP);
      this._saveState();
      this._emit('vipupdate', this.state.userSubscriptionVIP);
    }

    resetToDefaults() {
      this.state = {
        activePantryIngredients: [...DEFAULT_PANTRY_INGREDIENTS],
        weeklyPlannedMeals: JSON.parse(JSON.stringify(DEFAULT_WEEKLY_PLANNED_MEALS)),
        activeShoppingList: JSON.parse(JSON.stringify(DEFAULT_SHOPPING_LIST)),
        userSubscriptionVIP: true,
        socialFeedPosts: JSON.parse(JSON.stringify(DEFAULT_SOCIAL_POSTS)),
        lastUpdated: Date.now()
      };
      this._saveState();
    }
  }

  // Instantiate Single Global Store
  const WowAppStateInstance = new CentralStateManager();
  global.WowAppState = WowAppStateInstance;

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SEAMLESS AUTOMATED SCREEN BINDINGS (ZERO VISUAL SHIFT)
  // ═══════════════════════════════════════════════════════════════════════════

  function autoBindPagePipelines() {
    if (typeof document === 'undefined') return;

    // ─── Screen A: Explore & Pantry Search (search-pantry.html) ─────────────
    const tagsContainer = document.getElementById('tags-container');
    const searchInput = document.getElementById('ingredient-search-input');

    if (tagsContainer && searchInput) {
      // 1. Ingest WowAppState.activePantryIngredients if container is missing any tags
      const currentTags = Array.from(tagsContainer.querySelectorAll('.ingredient-tag')).map(
        t => t.getAttribute('data-tag')?.toLowerCase()
      );

      const pantryIngredients = WowAppStateInstance.getPantryIngredients();
      pantryIngredients.forEach(item => {
        if (!item) return;
        const clean = item.trim();
        if (!currentTags.includes(clean.toLowerCase())) {
          const span = document.createElement('span');
          span.className = 'ingredient-tag';
          span.setAttribute('data-tag', clean);
          span.innerHTML = `${clean} <button class="tag-remove" type="button" aria-label="Remove ${clean}">×</button>`;
          tagsContainer.insertBefore(span, searchInput);

          const removeBtn = span.querySelector('.tag-remove');
          if (removeBtn) {
            removeBtn.onclick = function (e) {
              e.stopPropagation();
              span.remove();
              WowAppStateInstance.removePantryIngredient(clean);
              // Trigger search filter refresh if present
              if (typeof window.updateSearchResults === 'function') {
                window.updateSearchResults();
              } else {
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            };
          }
        }
      });

      // 2. Hook into dynamic tag additions
      const btnAdd = document.getElementById('btn-add-search');
      if (btnAdd) {
        btnAdd.addEventListener('click', function () {
          const val = searchInput.value.trim();
          if (val) WowAppStateInstance.addPantryIngredient(val);
        });
      }
    }

    // ─── Screen B: AI Pantry Camera Scanner (scanner.html / pantry_scan.html)
    const shutterBtn = document.getElementById('shutter-btn');
    if (shutterBtn) {
      shutterBtn.addEventListener('click', function () {
        // Silently register recognized vision objects
        const scannedIngredients = ['Tomatoes', 'Basil', 'Garlic', 'Buffalo Mozzarella', 'Onion'];
        scannedIngredients.forEach(item => WowAppStateInstance.addPantryIngredient(item));
      });
    }

    // ─── Screen C: Meal Planner (meal-planner.html / meal_planner.html) ──────
    const exportGroceryBtn = document.getElementById('btn-export-grocery-list');
    if (exportGroceryBtn) {
      exportGroceryBtn.addEventListener('click', function () {
        WowAppStateInstance.syncPlannerToGrocery();
      });
    }

    // ─── Screen D: Smart Grocery List (grocery.html) ─────────────────────────
    const remainingSubtitle = document.getElementById('remaining-header-subtitle');
    const badgeAllCount = document.getElementById('badge-all-count');
    const deliverySummary = document.getElementById('delivery-items-summary');
    const checkoutTotal = document.querySelector('.checkout-btn-right span:first-child');

    if (remainingSubtitle || checkoutTotal || deliverySummary) {
      // Synchronize quantity triggers and checkboxes with WowAppState
      const cards = document.querySelectorAll('.grocery-card');
      cards.forEach(card => {
        const rawId = card.getAttribute('data-id')?.replace('item-', '') || '';
        const itemState = WowAppStateInstance.activeShoppingList.find(i => i.id === rawId);

        if (itemState) {
          const qtyEl = card.querySelector(`[id="qty-${rawId}"], [id="cart-qty-val-${rawId}"]`);
          if (qtyEl && itemState.quantity) {
            qtyEl.textContent = itemState.quantity;
          }

          const checkbox = card.querySelector('.item-checkbox');
          if (checkbox && itemState.checked) {
            checkbox.classList.add('item-checkbox--checked');
            card.classList.add('struck');
            const checkIcon = checkbox.querySelector('.material-symbols-outlined');
            if (checkIcon) checkIcon.style.display = 'block';
          }
        }
      });

      // Recalculate Live Telemetry & Prices
      const totals = WowAppStateInstance.calculateGroceryTotals();
      if (remainingSubtitle) {
        remainingSubtitle.textContent = `${totals.visibleCount} items remaining`;
      }
      if (badgeAllCount) {
        badgeAllCount.textContent = totals.visibleCount;
      }
      if (deliverySummary) {
        deliverySummary.innerHTML = `${totals.visibleCount} missing items • <strong style="color:white;">$${totals.formattedTotal}</strong>`;
      }
      if (checkoutTotal) {
        checkoutTotal.innerText = `$${totals.formattedTotal}`;
      }

      // Intercept window.adjustQty to update WowAppState synchronously
      const origAdjustQty = window.adjustQty;
      window.adjustQty = function (key, delta) {
        WowAppStateInstance.adjustShoppingItemQty(key, delta);
        if (typeof origAdjustQty === 'function') {
          origAdjustQty(key, delta);
        } else if (typeof window.calculateCartTotal === 'function') {
          window.calculateCartTotal();
        }
      };
      window.adjustCartQty = window.adjustQty;
    }

    // ─── Screen E: Checkout & Payment Confirmation (checkout.html) ───────────
    const slideBtn = document.getElementById('slide-btn');
    if (slideBtn) {
      slideBtn.addEventListener('click', function () {
        WowAppStateInstance.setVIPStatus(true);
      });
    }

    // ─── Screen F: Global Payment Gateways (dashboard.html, profile.html) ────
    const razorpaySuccessTriggers = document.querySelectorAll('#btn-confirm-razorpay-pay, #btn-pay-now-action');
    razorpaySuccessTriggers.forEach(btn => {
      btn.addEventListener('click', function () {
        WowAppStateInstance.setVIPStatus(true);
      });
    });

    // ─── Screen G: Start Cooking Action on Payment Success (profile.html, dashboard.html) ────
    const startCookingSuccessBtns = document.querySelectorAll('#btn-start-cooking-success, .btn-start-cooking-success');
    startCookingSuccessBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        // Silently save subscription tokens
        localStorage.setItem('wow_premium_user', 'true');
        localStorage.setItem('wow_is_premium', 'true');
        WowAppStateInstance.setVIPStatus(true);

        // Completely hide the payment success modal window
        const paymentOverlay = document.getElementById('payment-success-modal') || 
                               document.getElementById('screen-10-paywall-modal') ||
                               document.querySelector('.payment-success-overlay') ||
                               btn.closest('.modal-overlay, .payment-overlay, [role="dialog"]');
        if (paymentOverlay) {
          paymentOverlay.style.transform = 'translateY(100%)';
          paymentOverlay.style.opacity = '0';
          setTimeout(() => {
            paymentOverlay.classList.add('hidden');
            paymentOverlay.style.display = 'none';
          }, 300);
        }
      });
    });

    // ─── Screen H: Profile & Settings Filter Overlay Drawer (profile.html, iot-settings.html) ────
    setupProfileFiltersOverlay();

    // ─── Screen I: Cooking Session Milestone Hook (immersive-cooking.html, cooking-guide.html) ──
    setupCookingCompletionHook();

    // ─── Screen J: Social Feed Timeline Post Controls Action Sheet (social-feed.html) ──
    setupSocialPostControlsSheet();

    // ─── Screen K: Global Profile Picture Synchronization & Camera Upload Trigger ──
    setupWowAvatarUploadListeners();
  }

  /**
   * Profile Filters Overlay & Preferences Drawer Manager
   * Dynamically attaches click listener to the right-side Filter/Settings icon button
   * and opens the 'wow profile filters' slide-up preference panel without causing layout shifts.
   */
  function setupProfileFiltersOverlay() {
    const filterBtns = document.querySelectorAll('.header-filter-btn, [aria-label="Filter settings"]');
    if (!filterBtns.length) return;

    // Ensure single instance of filter overlay container in DOM
    let overlay = document.getElementById('wow-profile-filters-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'wow-profile-filters-modal';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'wow profile filters');
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        z-index: 95;
        background: rgba(0, 0, 0, 0.78);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      overlay.innerHTML = `
        <div class="profile-filters-card" style="
          background: #0B0F14;
          border-top: 1px solid rgba(61, 242, 224, 0.35);
          border-left: 1px solid rgba(61, 242, 224, 0.2);
          border-right: 1px solid rgba(61, 242, 224, 0.2);
          border-radius: 32px 32px 0 0;
          padding: 16px 20px 36px;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.95), 0 0 25px rgba(61, 242, 224, 0.15);
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          max-height: 85vh;
          overflow-y: auto;
        ">
          <style>
            .profile-filters-card .hover-lift {
              transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease;
              will-change: transform, box-shadow;
            }
            .profile-filters-card .hover-lift:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
            }
            .profile-filters-card .diet-pill-btn.active.hover-lift:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 20px rgba(61, 242, 224, 0.15);
            }
          </style>

          <!-- Drag Handle Bar -->
          <div style="width: 38px; height: 4px; border-radius: 2px; background: rgba(255, 255, 255, 0.2); margin: 0 auto 4px;"></div>

          <!-- Header Row with Dual-Tab Switcher and Close Button (X) -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #FFFFFF; font-family: 'Britannic Bold', 'Plus Jakarta Sans', sans-serif; font-style: italic; font-size: 19px; font-weight: 900; line-height: 1;">wow</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button id="tab-btn-app-filters" type="button" class="profile-filter-tab-btn active" style="
                  background: transparent;
                  border: none;
                  padding: 4px 8px;
                  color: #3DF2E0;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  font-size: 14px;
                  font-weight: 700;
                  letter-spacing: 0.5px;
                  text-shadow: 0 0 10px rgba(61, 242, 224, 0.45);
                  cursor: pointer;
                  transition: all 0.2s ease;
                  position: relative;
                ">
                  App Filters
                  <span class="tab-indicator" style="position: absolute; bottom: -9px; left: 0; right: 0; height: 2px; background: #3DF2E0; border-radius: 1px; box-shadow: 0 0 8px rgba(61, 242, 224, 0.8);"></span>
                </button>

                <span style="color: rgba(255, 255, 255, 0.18); font-size: 13px;">|</span>

                <button id="tab-btn-dietary-matrix" type="button" class="profile-filter-tab-btn" style="
                  background: transparent;
                  border: none;
                  padding: 4px 8px;
                  color: #8E9AA6;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  font-size: 14px;
                  font-weight: 700;
                  letter-spacing: 0.5px;
                  text-shadow: none;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  position: relative;
                ">
                  Dietary Matrix
                  <span class="tab-indicator" style="position: absolute; bottom: -9px; left: 0; right: 0; height: 2px; background: transparent; border-radius: 1px;"></span>
                </button>
              </div>
            </div>

            <button id="btn-close-profile-filters" type="button" aria-label="Close Profile Filters" style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.12);
              color: #E5E5EA;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s;
            ">✕</button>
          </div>

          <!-- VIEW 1: APP FILTERS -->
          <div id="view-app-filters" class="profile-filters-tab-view" style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Subtitle Description -->
            <p style="font-size: 11px; color: #8E9BA8; margin: 0; line-height: 1.4;">
              Configure personalized telemetry preferences, public profile visibility, and metric units tracking.
            </p>

            <!-- Preferences List Stack -->
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">

              <!-- PREFERENCE 1: TOGGLE PREMIUM DISPLAY -->
              <div class="pref-toggle-row" style="
                background: #17202A;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                padding: 12px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
              ">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.3); display: flex; align-items: center; justify-content: center; color: #FBBF24; flex-shrink: 0;">
                    <span class="material-symbols-outlined" style="font-size: 19px;">workspace_premium</span>
                  </div>
                  <div>
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Toggle Premium Display</div>
                    <div style="font-size: 10.5px; color: #8E9BA8; margin-top: 2px;">Display VIP Gold crown &amp; Masterclass flair</div>
                  </div>
                </div>
                <button class="filter-toggle-switch" id="toggle-pref-premium" type="button" role="switch" aria-checked="true" style="
                  width: 44px;
                  height: 24px;
                  border-radius: 12px;
                  background: #3DF2E0;
                  box-shadow: 0 0 10px rgba(61, 242, 224, 0.4);
                  border: none;
                  padding: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  cursor: pointer;
                  transition: all 0.25s ease;
                  flex-shrink: 0;
                ">
                  <div class="filter-toggle-knob" style="width: 20px; height: 20px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.35); transition: transform 0.25s ease;"></div>
                </button>
              </div>

              <!-- PREFERENCE 2: PRIVACY MODE -->
              <div class="pref-toggle-row" style="
                background: #17202A;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                padding: 12px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
              ">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(61, 242, 224, 0.12); border: 1px solid rgba(61, 242, 224, 0.3); display: flex; align-items: center; justify-content: center; color: #3DF2E0; flex-shrink: 0;">
                    <span class="material-symbols-outlined" style="font-size: 19px;">shield_lock</span>
                  </div>
                  <div>
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Privacy Mode</div>
                    <div style="font-size: 10.5px; color: #8E9BA8; margin-top: 2px;">Conceal caloric metrics from community stream</div>
                  </div>
                </div>
                <button class="filter-toggle-switch off" id="toggle-pref-privacy" type="button" role="switch" aria-checked="false" style="
                  width: 44px;
                  height: 24px;
                  border-radius: 12px;
                  background: #333942;
                  box-shadow: none;
                  border: none;
                  padding: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                  cursor: pointer;
                  transition: all 0.25s ease;
                  flex-shrink: 0;
                ">
                  <div class="filter-toggle-knob" style="width: 20px; height: 20px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.35); transition: transform 0.25s ease;"></div>
                </button>
              </div>

              <!-- PREFERENCE 3: METRIC UNITS TRACKING -->
              <div class="pref-toggle-row" style="
                background: #17202A;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                padding: 12px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
              ">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(0, 230, 118, 0.12); border: 1px solid rgba(0, 230, 118, 0.3); display: flex; align-items: center; justify-content: center; color: #00E676; flex-shrink: 0;">
                    <span class="material-symbols-outlined" style="font-size: 19px;">straighten</span>
                  </div>
                  <div>
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Metric Units Tracking</div>
                    <div style="font-size: 10.5px; color: #8E9BA8; margin-top: 2px;">Display in grams (g), ml and Celsius (°C)</div>
                  </div>
                </div>
                <button class="filter-toggle-switch" id="toggle-pref-metric" type="button" role="switch" aria-checked="true" style="
                  width: 44px;
                  height: 24px;
                  border-radius: 12px;
                  background: #3DF2E0;
                  box-shadow: 0 0 10px rgba(61, 242, 224, 0.4);
                  border: none;
                  padding: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  cursor: pointer;
                  transition: all 0.25s ease;
                  flex-shrink: 0;
                ">
                  <div class="filter-toggle-knob" style="width: 20px; height: 20px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.35); transition: transform 0.25s ease;"></div>
                </button>
              </div>

            </div>
          </div>

          <!-- VIEW 2: DIETARY MATRIX (Screen 8 Integration) -->
          <div id="view-dietary-matrix" class="profile-filters-tab-view" style="display: none; flex-direction: column; gap: 16px;">
            
            <!-- Profile & Credential Ribbon -->
            <div style="
              background: #171E26;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 18px;
              padding: 12px 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            ">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg, #3DF2E0, #20C5B5, #3DF2E0); box-shadow: 0 0 10px rgba(61, 242, 224, 0.35); flex-shrink: 0;">
                  <img alt="Chef Sarah" class="wow-global-avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background: #171E26;" src="https://lh3.googleusercontent.com/aida/AEtjO1UKk6JtH4oRDXvVx7Eyw9ww6SDOfM4ld-GX2TDB8_3T1hbxORbXocJkAjZCjfEZbvJZo1_OvToE1oUDz4CHCux23YZ-Ydb7wDocetX1ppJLZVVyZt2Hm_JApySxgUhM-pVtsiQLhDXIY4WwgWAqWrhdISLZmZJw37h2Fr-pF6l63muOuK8ESMk-yriJwabUEwmmtyUjvBpuv1Q5OUnjBIXPS2ze7YDbf8fuuco2ai8nS111f3qvrQkBF-t_">
                </div>
                <div>
                  <div style="font-family: 'EB Garamond', serif; font-size: 16px; font-weight: 600; color: #FFFFFF; line-height: 1.2;">Namaste, Chef Sarah</div>
                  <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                    <span style="display: inline-flex; align-items: center; gap: 3px; padding: 1px 7px; border-radius: 10px; background: rgba(61, 242, 224, 0.15); border: 1px solid rgba(61, 242, 224, 0.5); color: #FFFFFF; font-size: 9.5px; font-weight: 600;">
                      <span class="material-symbols-outlined" style="font-size: 11px; color: #3DF2E0;">verified</span>
                      <span>Premium</span>
                    </span>
                    <span style="color: #8E9AA6; font-size: 10px;">Executive Member</span>
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <div style="background: #0B0F14; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 4px 8px; text-align: center;">
                  <div style="font-size: 8.5px; color: #8E9AA6; text-transform: uppercase;">Saved</div>
                  <div style="font-size: 12px; font-weight: 700; color: #3DF2E0;">24</div>
                </div>
                <div style="background: #0B0F14; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 4px 8px; text-align: center;">
                  <div style="font-size: 8.5px; color: #8E9AA6; text-transform: uppercase;">Match</div>
                  <div style="font-size: 12px; font-weight: 700; color: #3DF2E0;">98%</div>
                </div>
              </div>
            </div>

            <!-- SECTION 1: DIETARY PREFERENCES -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="material-symbols-outlined" style="color: #3DF2E0; font-size: 17px;">restaurant</span>
                  <h3 style="font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; color: #FFFFFF; text-transform: uppercase; margin: 0;">DIETARY PREFERENCES</h3>
                </div>
                <span id="diet-active-count-label" style="font-size: 10px; color: #8E9AA6; font-weight: 600;">2 Active</span>
              </div>
              <p style="font-size: 10.5px; color: #8E9AA6; margin: 0 0 10px; line-height: 1.35;">
                Recipes across discovery and AI pantry matching will automatically prioritize your taste matrix.
              </p>

              <!-- Dietary Preference Pills Grid -->
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <!-- Vegan (Active) -->
                <button type="button" class="diet-pill-btn active hover-lift" data-diet="vegan" style="
                  background: #171E26;
                  border: 2px solid #3DF2E0;
                  box-shadow: 0 0 12px rgba(61, 242, 224, 0.22);
                  border-radius: 14px;
                  padding: 10px 12px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  cursor: pointer;
                  text-align: left;
                ">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined diet-icon" style="font-size: 18px; color: #3DF2E0;">eco</span>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 700; color: #FFFFFF;">Vegan</span>
                      <span style="display: block; font-size: 9.5px; color: #8E9AA6;">100% Plant-based</span>
                    </div>
                  </div>
                  <div class="diet-check" style="width: 18px; height: 18px; border-radius: 50%; background: #3DF2E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span class="material-symbols-outlined" style="font-size: 13px; font-weight: 800; color: #0B0F14;">check</span>
                  </div>
                </button>

                <!-- High-Protein (Active) -->
                <button type="button" class="diet-pill-btn active hover-lift" data-diet="high-protein" style="
                  background: #171E26;
                  border: 2px solid #3DF2E0;
                  box-shadow: 0 0 12px rgba(61, 242, 224, 0.22);
                  border-radius: 14px;
                  padding: 10px 12px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  cursor: pointer;
                  text-align: left;
                ">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined diet-icon" style="font-size: 18px; color: #3DF2E0;">fitness_center</span>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 700; color: #FFFFFF;">High-Protein</span>
                      <span style="display: block; font-size: 9.5px; color: #8E9AA6;">&gt;25g per serving</span>
                    </div>
                  </div>
                  <div class="diet-check" style="width: 18px; height: 18px; border-radius: 50%; background: #3DF2E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span class="material-symbols-outlined" style="font-size: 13px; font-weight: 800; color: #0B0F14;">check</span>
                  </div>
                </button>

                <!-- Keto (Inactive) -->
                <button type="button" class="diet-pill-btn hover-lift" data-diet="keto" style="
                  background: #171E26;
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 14px;
                  padding: 10px 12px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  cursor: pointer;
                  text-align: left;
                ">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined diet-icon" style="font-size: 18px; color: #8E9AA6;">egg_alt</span>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 600; color: #FFFFFF;">Keto</span>
                      <span style="display: block; font-size: 9.5px; color: #8E9AA6;">Under 15g carbs</span>
                    </div>
                  </div>
                  <div class="diet-check" style="width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(142, 154, 166, 0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"></div>
                </button>

                <!-- Low-Carb (Inactive) -->
                <button type="button" class="diet-pill-btn hover-lift" data-diet="low-carb" style="
                  background: #171E26;
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 14px;
                  padding: 10px 12px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  cursor: pointer;
                  text-align: left;
                ">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined diet-icon" style="font-size: 18px; color: #8E9AA6;">grain</span>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 600; color: #FFFFFF;">Low-Carb</span>
                      <span style="display: block; font-size: 9.5px; color: #8E9AA6;">Gluten-free grains</span>
                    </div>
                  </div>
                  <div class="diet-check" style="width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(142, 154, 166, 0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"></div>
                </button>

                <!-- Gluten-Free (Inactive) -->
                <button type="button" class="diet-pill-btn hover-lift" data-diet="gluten-free" style="
                  background: #171E26;
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 14px;
                  padding: 10px 12px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  cursor: pointer;
                  text-align: left;
                ">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined diet-icon" style="font-size: 18px; color: #8E9AA6;">do_not_disturb_on</span>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 600; color: #FFFFFF;">Gluten-Free</span>
                      <span style="display: block; font-size: 9.5px; color: #8E9AA6;">Celiac compliant</span>
                    </div>
                  </div>
                  <div class="diet-check" style="width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(142, 154, 166, 0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"></div>
                </button>

                <!-- Sattvic / Jain (Inactive) -->
                <button type="button" class="diet-pill-btn hover-lift" data-diet="sattvic" style="
                  background: #171E26;
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 14px;
                  padding: 10px 12px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  cursor: pointer;
                  text-align: left;
                ">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined diet-icon" style="font-size: 18px; color: #8E9AA6;">spa</span>
                    <div>
                      <span style="display: block; font-size: 12px; font-weight: 600; color: #FFFFFF;">Sattvic / Jain</span>
                      <span style="display: block; font-size: 9.5px; color: #8E9AA6;">No onion, garlic</span>
                    </div>
                  </div>
                  <div class="diet-check" style="width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(142, 154, 166, 0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"></div>
                </button>
              </div>
            </div>

            <!-- SECTION 2: MASTERED DISHES -->
            <div style="
              background: #171E26;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 18px;
              padding: 12px 14px;
            ">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="material-symbols-outlined" style="color: #3DF2E0; font-size: 17px;">military_tech</span>
                  <h3 style="font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; color: #FFFFFF; text-transform: uppercase; margin: 0;">MASTERED DISHES</h3>
                </div>
                <span style="padding: 2px 8px; border-radius: 12px; background: rgba(61, 242, 224, 0.1); border: 1px solid rgba(61, 242, 224, 0.3); color: #FFFFFF; font-size: 9.5px; font-weight: 700;">2/4 UNLOCKED</span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <div class="hover-lift" style="background: rgba(11, 15, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 8px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: #171E26; border: 1px solid rgba(61, 242, 224, 0.8); display: flex; align-items: center; justify-content: center; margin-bottom: 6px; box-shadow: 0 0 14px rgba(61, 242, 224, 0.35);">
                    <span class="material-symbols-outlined" style="font-size: 20px; color: #3DF2E0;">local_fire_department</span>
                  </div>
                  <span style="font-size: 11px; font-weight: 600; color: #FFFFFF; line-height: 1.2;">Honey Sesame Chicken</span>
                  <span style="font-size: 9px; color: #3DF2E0; margin-top: 2px;">Mastered • Lvl 5</span>
                </div>

                <div class="hover-lift" style="background: rgba(11, 15, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 8px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: #171E26; border: 1px solid rgba(61, 242, 224, 0.8); display: flex; align-items: center; justify-content: center; margin-bottom: 6px; box-shadow: 0 0 14px rgba(61, 242, 224, 0.35);">
                    <span class="material-symbols-outlined" style="font-size: 20px; color: #3DF2E0;">workspace_premium</span>
                  </div>
                  <span style="font-size: 11px; font-weight: 600; color: #FFFFFF; line-height: 1.2;">Carbonara Champion</span>
                  <span style="font-size: 9px; color: #3DF2E0; margin-top: 2px;">Mastered • Lvl 5</span>
                </div>

                <div class="hover-lift" style="background: rgba(11, 15, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 8px; text-align: center; display: flex; flex-direction: column; align-items: center; opacity: 0.45;">
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: #171E26; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 18px; color: #8E9AA6;">lock</span>
                  </div>
                  <span style="font-size: 11px; font-weight: 600; color: #FFFFFF; line-height: 1.2;">Woodfired Pizza</span>
                  <span style="font-size: 9px; color: #8E9AA6; margin-top: 2px;">Locked • Cook 3x</span>
                </div>

                <div class="hover-lift" style="background: rgba(11, 15, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 8px; text-align: center; display: flex; flex-direction: column; align-items: center; opacity: 0.45;">
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: #171E26; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 18px; color: #8E9AA6;">lock</span>
                  </div>
                  <span style="font-size: 11px; font-weight: 600; color: #FFFFFF; line-height: 1.2;">Tikka Masala</span>
                  <span style="font-size: 9px; color: #8E9AA6; margin-top: 2px;">Locked • Cook 3x</span>
                </div>
              </div>
            </div>

            <!-- SECTION 3: ALLERGIES -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="material-symbols-outlined" style="color: #3DF2E0; font-size: 17px;">warning</span>
                  <h3 style="font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; color: #FFFFFF; text-transform: uppercase; margin: 0;">ALLERGIES</h3>
                </div>
                <span style="font-size: 10px; color: #3DF2E0; font-weight: 600;">Instant Exclusion</span>
              </div>

              <div style="
                background: #171E26;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
              ">
                <!-- Nuts Toggle -->
                <div style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 30px; height: 30px; border-radius: 8px; background: rgba(61, 242, 224, 0.12); border: 1px solid rgba(61, 242, 224, 0.3); display: flex; align-items: center; justify-content: center; color: #3DF2E0;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">nutrition</span>
                    </div>
                    <div>
                      <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">Nuts</div>
                      <div style="font-size: 9.5px; color: #8E9AA6;">Tree nuts, peanuts, almonds</div>
                    </div>
                  </div>
                  <button class="filter-toggle-switch" id="toggle-allergy-nuts" type="button" role="switch" aria-checked="true" style="
                    width: 40px;
                    height: 22px;
                    border-radius: 11px;
                    background: #3DF2E0;
                    box-shadow: 0 0 10px rgba(61, 242, 224, 0.4);
                    border: none;
                    padding: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    cursor: pointer;
                    transition: all 0.25s ease;
                  ">
                    <div class="filter-toggle-knob" style="width: 18px; height: 18px; border-radius: 50%; background: #0B0F14; display: flex; align-items: center; justify-content: center;">
                      <span class="material-symbols-outlined" style="font-size: 11px; font-weight: 800; color: #3DF2E0;">check</span>
                    </div>
                  </button>
                </div>

                <!-- Dairy Toggle -->
                <div style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 30px; height: 30px; border-radius: 8px; background: rgba(61, 242, 224, 0.12); border: 1px solid rgba(61, 242, 224, 0.3); display: flex; align-items: center; justify-content: center; color: #3DF2E0;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">water_bottle</span>
                    </div>
                    <div>
                      <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">Dairy</div>
                      <div style="font-size: 9.5px; color: #8E9AA6;">Lactose, butter, milk solids</div>
                    </div>
                  </div>
                  <button class="filter-toggle-switch" id="toggle-allergy-dairy" type="button" role="switch" aria-checked="true" style="
                    width: 40px;
                    height: 22px;
                    border-radius: 11px;
                    background: #3DF2E0;
                    box-shadow: 0 0 10px rgba(61, 242, 224, 0.4);
                    border: none;
                    padding: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    cursor: pointer;
                    transition: all 0.25s ease;
                  ">
                    <div class="filter-toggle-knob" style="width: 18px; height: 18px; border-radius: 50%; background: #0B0F14; display: flex; align-items: center; justify-content: center;">
                      <span class="material-symbols-outlined" style="font-size: 11px; font-weight: 800; color: #3DF2E0;">check</span>
                    </div>
                  </button>
                </div>

                <!-- Shellfish Toggle (Off) -->
                <div style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 30px; height: 30px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; color: #8E9AA6;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">set_meal</span>
                    </div>
                    <div>
                      <div style="font-size: 12px; font-weight: 600; color: #FFFFFF;">Shellfish &amp; Crustaceans</div>
                      <div style="font-size: 9.5px; color: #8E9AA6;">Shrimp, prawns, crab</div>
                    </div>
                  </div>
                  <button class="filter-toggle-switch off" id="toggle-allergy-shellfish" type="button" role="switch" aria-checked="false" style="
                    width: 40px;
                    height: 22px;
                    border-radius: 11px;
                    background: #0B0F14;
                    border: 1px solid rgba(142, 154, 166, 0.3);
                    padding: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    cursor: pointer;
                    transition: all 0.25s ease;
                  ">
                    <div class="filter-toggle-knob" style="width: 16px; height: 16px; border-radius: 50%; background: #8E9AA6;"></div>
                  </button>
                </div>

                <!-- Soy Toggle (Off) -->
                <div style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 30px; height: 30px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; color: #8E9AA6;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">spa</span>
                    </div>
                    <div>
                      <div style="font-size: 12px; font-weight: 600; color: #FFFFFF;">Soy Products</div>
                      <div style="font-size: 9.5px; color: #8E9AA6;">Soy sauce, tofu, edamame</div>
                    </div>
                  </div>
                  <button class="filter-toggle-switch off" id="toggle-allergy-soy" type="button" role="switch" aria-checked="false" style="
                    width: 40px;
                    height: 22px;
                    border-radius: 11px;
                    background: #0B0F14;
                    border: 1px solid rgba(142, 154, 166, 0.3);
                    padding: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    cursor: pointer;
                    transition: all 0.25s ease;
                  ">
                    <div class="filter-toggle-knob" style="width: 16px; height: 16px; border-radius: 50%; background: #8E9AA6;"></div>
                  </button>
                </div>
              </div>
            </div>

            <!-- SECTION 4: AI CULINARY ENGINE -->
            <div style="
              background: #171E26;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              padding: 12px 14px;
              display: flex;
              flex-direction: column;
              gap: 10px;
            ">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="color: #3DF2E0; font-size: 17px;">psychology</span>
                <h3 style="font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; color: #FFFFFF; text-transform: uppercase; margin: 0;">AI CULINARY ENGINE</h3>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #FFFFFF;">Nocturnal Spice Dial</div>
                  <div style="font-size: 9.5px; color: #8E9AA6;">Match chili heat to time of day</div>
                </div>
                <span style="padding: 3px 8px; border-radius: 8px; background: rgba(61, 242, 224, 0.15); color: #3DF2E0; border: 1px solid rgba(61, 242, 224, 0.4); font-size: 10.5px; font-weight: 700; box-shadow: 0 0 10px rgba(61, 242, 224, 0.2);">Fiery 🔥</span>
              </div>
            </div>

            <!-- System Footer Signature -->
            <div style="text-align: center; padding-top: 2px;">
              <p style="font-size: 9.5px; color: #8E9AA6; letter-spacing: 0.08em; text-transform: uppercase; margin: 0; font-weight: 600;">WOW PREMIUM LUXURY GASTRONOMY - V2.4.1</p>
            </div>
          </div>

          <!-- Quick Action: Save Preferences & Return -->
          <button id="btn-save-profile-filters" type="button" style="
            width: 100%;
            height: 42px;
            border-radius: 21px;
            background: linear-gradient(135deg, #3DF2E0, #20C5B5);
            color: #0B0F14;
            font-size: 12.5px;
            font-weight: 800;
            letter-spacing: 0.02em;
            border: none;
            cursor: pointer;
            box-shadow: 0 0 16px rgba(61, 242, 224, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 4px;
            transition: all 0.2s;
          ">
            <span class="material-symbols-outlined" style="font-size: 17px;">check</span>
            <span>Apply &amp; Return</span>
          </button>
        </div>
      `;

      const mountParent = document.getElementById('viewport') || document.body;
      mountParent.appendChild(overlay);
    }

    const card = overlay.querySelector('.profile-filters-card');
    const closeBtn = overlay.querySelector('#btn-close-profile-filters');
    const applyBtn = overlay.querySelector('#btn-save-profile-filters');

    // Dual-Tab Switcher Controller
    const tabBtnAppFilters = overlay.querySelector('#tab-btn-app-filters');
    const tabBtnDietaryMatrix = overlay.querySelector('#tab-btn-dietary-matrix');
    const viewAppFilters = overlay.querySelector('#view-app-filters');
    const viewDietaryMatrix = overlay.querySelector('#view-dietary-matrix');

    function switchProfileFiltersTab(activeTab) {
      if (activeTab === 'dietary') {
        if (viewAppFilters) viewAppFilters.style.display = 'none';
        if (viewDietaryMatrix) viewDietaryMatrix.style.display = 'flex';

        if (tabBtnAppFilters) {
          tabBtnAppFilters.classList.remove('active');
          tabBtnAppFilters.style.color = '#8E9AA6';
          tabBtnAppFilters.style.textShadow = 'none';
          const ind = tabBtnAppFilters.querySelector('.tab-indicator');
          if (ind) {
            ind.style.background = 'transparent';
            ind.style.boxShadow = 'none';
          }
        }
        if (tabBtnDietaryMatrix) {
          tabBtnDietaryMatrix.classList.add('active');
          tabBtnDietaryMatrix.style.color = '#3DF2E0';
          tabBtnDietaryMatrix.style.textShadow = '0 0 10px rgba(61, 242, 224, 0.45)';
          const ind = tabBtnDietaryMatrix.querySelector('.tab-indicator');
          if (ind) {
            ind.style.background = '#3DF2E0';
            ind.style.boxShadow = '0 0 8px rgba(61, 242, 224, 0.8)';
          }
        }
      } else {
        if (viewAppFilters) viewAppFilters.style.display = 'flex';
        if (viewDietaryMatrix) viewDietaryMatrix.style.display = 'none';

        if (tabBtnAppFilters) {
          tabBtnAppFilters.classList.add('active');
          tabBtnAppFilters.style.color = '#3DF2E0';
          tabBtnAppFilters.style.textShadow = '0 0 10px rgba(61, 242, 224, 0.45)';
          const ind = tabBtnAppFilters.querySelector('.tab-indicator');
          if (ind) {
            ind.style.background = '#3DF2E0';
            ind.style.boxShadow = '0 0 8px rgba(61, 242, 224, 0.8)';
          }
        }
        if (tabBtnDietaryMatrix) {
          tabBtnDietaryMatrix.classList.remove('active');
          tabBtnDietaryMatrix.style.color = '#8E9AA6';
          tabBtnDietaryMatrix.style.textShadow = 'none';
          const ind = tabBtnDietaryMatrix.querySelector('.tab-indicator');
          if (ind) {
            ind.style.background = 'transparent';
            ind.style.boxShadow = 'none';
          }
        }
      }
    }

    if (tabBtnAppFilters) {
      tabBtnAppFilters.onclick = function(e) {
        e.stopPropagation();
        switchProfileFiltersTab('app');
      };
    }

    if (tabBtnDietaryMatrix) {
      tabBtnDietaryMatrix.onclick = function(e) {
        e.stopPropagation();
        switchProfileFiltersTab('dietary');
      };
    }

    // Dietary Preferences Interactive Pills
    const dietPillBtns = overlay.querySelectorAll('.diet-pill-btn');
    dietPillBtns.forEach(pill => {
      pill.onclick = function(e) {
        e.stopPropagation();
        const isActive = pill.classList.contains('active');
        const checkEl = pill.querySelector('.diet-check');
        const iconEl = pill.querySelector('.diet-icon');

        if (isActive) {
          pill.classList.remove('active');
          pill.style.border = '1px solid rgba(255, 255, 255, 0.08)';
          pill.style.boxShadow = 'none';
          if (iconEl) iconEl.style.color = '#8E9AA6';
          if (checkEl) {
            checkEl.style.background = 'transparent';
            checkEl.style.border = '1px solid rgba(142, 154, 166, 0.4)';
            checkEl.innerHTML = '';
          }
        } else {
          pill.classList.add('active');
          pill.style.border = '2px solid #3DF2E0';
          pill.style.boxShadow = '0 0 12px rgba(61, 242, 224, 0.22)';
          if (iconEl) iconEl.style.color = '#3DF2E0';
          if (checkEl) {
            checkEl.style.background = '#3DF2E0';
            checkEl.style.border = 'none';
            checkEl.innerHTML = '<span class="material-symbols-outlined" style="font-size: 13px; font-weight: 800; color: #0B0F14;">check</span>';
          }
        }

        // Update active count badge
        const activeCount = overlay.querySelectorAll('.diet-pill-btn.active').length;
        const countLabel = overlay.querySelector('#diet-active-count-label');
        if (countLabel) {
          countLabel.textContent = `${activeCount} Active`;
        }
      };
    });

    function openFiltersOverlay(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      syncWowProfilePicture();
      overlay.style.pointerEvents = 'auto';
      overlay.style.opacity = '1';
      if (card) {
        card.style.transform = 'translateY(0)';
      }
    }

    function closeFiltersOverlay() {
      if (card) {
        card.style.transform = 'translateY(100%)';
      }
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.pointerEvents = 'none';
      }, 320);
    }

    // Attach button clicks safely to all filter icon instances
    filterBtns.forEach(btn => {
      btn.onclick = openFiltersOverlay;
    });

    if (closeBtn) closeBtn.onclick = closeFiltersOverlay;
    if (applyBtn) {
      applyBtn.onclick = function() {
        closeFiltersOverlay();
        if (typeof window.showToast === 'function') {
          window.showToast('Profile filter preferences applied', 'tune');
        }
      };
    }

    // Close when clicking overlay backdrop outside card
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        closeFiltersOverlay();
      }
    };

    // Toggle switch interactivity inside popup
    const switches = overlay.querySelectorAll('.filter-toggle-switch');
    switches.forEach(sw => {
      sw.onclick = function(e) {
        e.stopPropagation();
        const isOff = sw.classList.contains('off');
        if (isOff) {
          sw.classList.remove('off');
          sw.style.background = '#3DF2E0';
          sw.style.boxShadow = '0 0 10px rgba(61, 242, 224, 0.4)';
          sw.style.justifyContent = 'flex-end';
          sw.setAttribute('aria-checked', 'true');
        } else {
          sw.classList.add('off');
          sw.style.background = '#333942';
          sw.style.boxShadow = 'none';
          sw.style.justifyContent = 'flex-start';
          sw.setAttribute('aria-checked', 'false');
        }
      };
    });

    // Expose globally for testing or programmatic usage
    window.openProfileFiltersOverlay = openFiltersOverlay;
    window.closeProfileFiltersOverlay = closeFiltersOverlay;
  }

  /**
   * Cooking Session Completion & Milestone Publication Pipeline
   * Hooks into final step completion / celebration trigger, extracts active recipe data,
   * and provides a milestone publication prompt modal into the global social activity feed.
   */
  function setupCookingCompletionHook() {
    const finishTriggers = document.querySelectorAll(
      '#btn-next-step, #finish-cooking-btn, .btn-finish, #btn-share-celebration, [data-action="finish-session"]'
    );
    const celebrationOverlay = document.getElementById('celebration-overlay');

    if (!finishTriggers.length && !celebrationOverlay) return;

    function getActiveRecipePayload() {
      const titleEl = document.getElementById('label-recipe-title');
      const tagEl = document.getElementById('celebration-recipe-tag');
      const photoEl = document.getElementById('step-media-photo');
      const modalDishNameEl = milestoneModal ? milestoneModal.querySelector('#milestone-dish-name') : null;

      const urlParams = (typeof window !== 'undefined' && window.location) ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const rawKey = urlParams.get('id') || urlParams.get('recipe') || urlParams.get('slug') || urlParams.get('name') || 'sesame-chicken';

      let recipeTitle = 'Honey Sesame Chicken';
      let badge = 'Mastered';
      let xpMetric = '+150 Culinary XP';

      // 1. Check dynamic recipe resolver if present
      if (typeof window !== 'undefined' && typeof window.resolveRecipe === 'function') {
        try {
          const resolved = window.resolveRecipe(rawKey);
          if (resolved && resolved.title) {
            recipeTitle = resolved.title;
          }
        } catch (e) {}
      }

      // 2. Check DOM element labels
      if (titleEl && titleEl.textContent && titleEl.textContent.trim()) {
        let t = titleEl.textContent.trim();
        if (t === t.toUpperCase() && t.length > 3) {
          t = t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }
        recipeTitle = t;
      } else if (tagEl && tagEl.textContent && tagEl.textContent.trim()) {
        let t = tagEl.textContent.replace(/\s*(Mastered|Completed).*/i, '').trim();
        if (t === t.toUpperCase() && t.length > 3) {
          t = t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }
        if (t) recipeTitle = t;
      } else if (modalDishNameEl && modalDishNameEl.textContent && modalDishNameEl.textContent.trim()) {
        recipeTitle = modalDishNameEl.textContent.trim();
      }

      // 3. Known key mappings
      if (rawKey === '52772' || rawKey.includes('casserole') || rawKey.includes('teriyaki')) {
        recipeTitle = 'Teriyaki Chicken Casserole';
      } else if (rawKey.includes('sesame-chicken') || rawKey.includes('sesame')) {
        recipeTitle = 'Honey Sesame Chicken';
      } else if (rawKey.includes('carbonara')) {
        recipeTitle = 'Spaghetti Carbonara';
      } else if (rawKey.includes('ribeye')) {
        recipeTitle = 'Prime Bone-In Ribeye Cut';
      } else if (rawKey.includes('biryani')) {
        recipeTitle = 'Royal Chicken Biryani';
      } else if (rawKey.includes('paella')) {
        recipeTitle = 'Spanish Seafood Paella';
      }

      let recipePhoto = 'assets/sesame-chicken.png';
      if (photoEl && photoEl.src && !photoEl.src.includes('data:image/svg')) {
        recipePhoto = photoEl.src;
      } else if (rawKey === '52772' || rawKey.includes('casserole') || rawKey.includes('teriyaki')) {
        recipePhoto = 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg';
      } else if (rawKey.includes('sesame-chicken') || rawKey.includes('sesame')) {
        recipePhoto = 'assets/sesame-chicken.png';
      } else if (rawKey.includes('carbonara')) {
        recipePhoto = 'assets/carbonara.png';
      } else if (rawKey.includes('ribeye')) {
        recipePhoto = 'assets/images/ribeye.jpg';
      } else if (rawKey.includes('biryani')) {
        recipePhoto = 'assets/biryani.png';
      }

      let icon = '🍳';
      const lower = recipeTitle.toLowerCase();
      if (lower.includes('carbonara') || lower.includes('pasta')) icon = '🍝';
      else if (lower.includes('ribeye') || lower.includes('steak')) icon = '🥩';
      else if (lower.includes('biryani')) icon = '🍗';
      else if (lower.includes('paella')) icon = '🥘';
      else if (lower.includes('casserole') || lower.includes('teriyaki')) icon = '🍲';

      return {
        recipeId: rawKey,
        recipeName: recipeTitle,
        badge: badge,
        xpMetric: xpMetric,
        recipeIcon: icon,
        photo: recipePhoto
      };
    }

    // Modal prompt instance
    let milestoneModal = document.getElementById('wow-cooking-milestone-modal');
    if (!milestoneModal) {
      milestoneModal = document.createElement('div');
      milestoneModal.id = 'wow-cooking-milestone-modal';
      milestoneModal.setAttribute('role', 'dialog');
      milestoneModal.setAttribute('aria-modal', 'true');
      milestoneModal.setAttribute('aria-label', 'Publish Cooking Milestone');
      milestoneModal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 100;
        background: rgba(0, 0, 0, 0.82);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      milestoneModal.innerHTML = `
        <div class="milestone-card" style="
          background: #0B0F14;
          border: 1.5px solid rgba(61, 242, 224, 0.45);
          border-radius: 28px;
          padding: 24px 20px 22px;
          box-shadow: 0 0 35px rgba(61, 242, 224, 0.22), 0 25px 60px rgba(0, 0, 0, 0.95);
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          transform: scale(0.92);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        ">
          <!-- Glowing Trophy Icon Badge -->
          <div style="
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: rgba(61, 242, 224, 0.12);
            border: 1.5px solid rgba(61, 242, 224, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3DF2E0;
            box-shadow: 0 0 20px rgba(61, 242, 224, 0.35);
          ">
            <span class="material-symbols-outlined" style="font-size: 32px;">workspace_premium</span>
          </div>

          <!-- Header Title -->
          <div style="display: flex; align-items: baseline; justify-content: center; gap: 6px;">
            <span style="color: #FFFFFF; font-family: 'Britannic Bold', 'Plus Jakarta Sans', sans-serif; font-style: italic; font-size: 22px; font-weight: 900; line-height: 1;">wow</span>
            <span style="color: #3DF2E0; font-style: italic; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 0 10px rgba(61, 242, 224, 0.45); line-height: 1;">milestone publish</span>
          </div>

          <!-- Recipe Preview Pill Card -->
          <div style="
            background: #141A22;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            text-align: left;
            box-sizing: border-box;
          ">
            <img id="milestone-dish-thumb" src="assets/sesame-chicken.png" alt="Cooked Dish" style="width: 46px; height: 46px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(61, 242, 224, 0.3);" />
            <div style="flex: 1; min-width: 0;">
              <div id="milestone-dish-name" style="font-size: 13.5px; font-weight: 800; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Honey Sesame Chicken</div>
              <div id="milestone-dish-xp" style="font-size: 11px; color: #3DF2E0; font-weight: 700; margin-top: 2px;">+150 Culinary XP • Mastered</div>
            </div>
          </div>

          <!-- Subtitle Description -->
          <p style="font-size: 11.5px; color: #8E9BA8; margin: 0; line-height: 1.45;">
            Celebrate your masterclass achievement! Would you like to share this cooking milestone to the <strong>wow social feed</strong>?
          </p>

          <!-- Buttons Group -->
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 4px;">
            <button id="btn-confirm-milestone-publish" type="button" style="
              width: 100%;
              height: 44px;
              border-radius: 22px;
              background: linear-gradient(135deg, #3DF2E0, #20C5B5);
              color: #0B0F14;
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 0.02em;
              border: none;
              cursor: pointer;
              box-shadow: 0 0 18px rgba(61, 242, 224, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.2s;
            ">
              <span class="material-symbols-outlined" style="font-size: 18px;">rocket_launch</span>
              <span>Publish to Feed 🚀</span>
            </button>

            <button id="btn-dismiss-milestone-publish" type="button" style="
              width: 100%;
              height: 38px;
              border-radius: 19px;
              background: rgba(255, 255, 255, 0.06);
              color: #8E9BA8;
              font-size: 12px;
              font-weight: 700;
              border: 1px solid rgba(255, 255, 255, 0.1);
              cursor: pointer;
              transition: all 0.2s;
            ">
              Maybe Later
            </button>
          </div>
        </div>
      `;

      const mountParent = document.getElementById('viewport') || document.body;
      mountParent.appendChild(milestoneModal);
    }

    const card = milestoneModal.querySelector('.milestone-card');
    const confirmBtn = milestoneModal.querySelector('#btn-confirm-milestone-publish');
    const dismissBtn = milestoneModal.querySelector('#btn-dismiss-milestone-publish');

    let currentPayload = null;

    function openMilestonePrompt(customPayload) {
      currentPayload = customPayload || getActiveRecipePayload();

      const thumb = milestoneModal.querySelector('#milestone-dish-thumb');
      const name = milestoneModal.querySelector('#milestone-dish-name');
      const xpEl = milestoneModal.querySelector('#milestone-dish-xp');
      if (thumb && currentPayload.photo) thumb.src = currentPayload.photo;
      if (name && currentPayload.recipeName) name.textContent = currentPayload.recipeName;
      if (xpEl) xpEl.textContent = `${currentPayload.xpMetric || '+150 Culinary XP'} • ${currentPayload.badge || 'Mastered'}`;

      milestoneModal.style.pointerEvents = 'auto';
      milestoneModal.style.opacity = '1';
      if (card) card.style.transform = 'scale(1)';
    }

    function closeMilestonePrompt() {
      if (card) card.style.transform = 'scale(0.92)';
      milestoneModal.style.opacity = '0';
      setTimeout(() => {
        milestoneModal.style.pointerEvents = 'none';
      }, 300);
    }

    if (confirmBtn) {
      confirmBtn.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        const payload = currentPayload || getActiveRecipePayload();
        const createdPost = WowAppStateInstance.addSocialPost({
          recipeId: payload.recipeId,
          recipeName: payload.recipeName,
          badge: payload.badge || 'Mastered',
          xpMetric: payload.xpMetric || '+150 Culinary XP',
          recipeIcon: payload.recipeIcon,
          photo: payload.photo,
          caption: `Just mastered ${payload.recipeName} with step-by-step masterclass mode! Earned ${payload.xpMetric || '+150 Culinary XP'}. Flavor profile turned out incredible! 🔥🍽️`,
          tags: ['#MasterclassComplete', '#ChefMilestone', '#CulinaryXP', '#wowRecipes'],
          category: 'trending following'
        });

        // 300ms fade-out transition
        if (card) card.style.transform = 'scale(0.92)';
        milestoneModal.style.opacity = '0';

        setTimeout(() => {
          milestoneModal.style.pointerEvents = 'none';

          if (typeof window.showToast === 'function') {
            window.showToast('🎉 Milestone published to wow social feed!', 'military_tech');
          }

          // Update share link on celebration screen if present
          const shareBtn = document.getElementById('btn-share-celebration');
          if (shareBtn) {
            shareBtn.href = `social-feed.html?post=${encodeURIComponent(payload.recipeId)}`;
          }

          // Cleanly trigger view router to switch active tab/screen to 'Social Feed'
          if (typeof window.navigateToTab === 'function') {
            window.navigateToTab('social-feed');
          } else if (typeof window.switchScreen === 'function') {
            window.switchScreen('social-feed');
          } else if (typeof window !== 'undefined' && window.location) {
            window.location.href = 'social-feed.html';
          }
        }, 300);
      };
    }

    if (dismissBtn) {
      dismissBtn.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        // Clean dismissal with zero data transmission
        closeMilestonePrompt();
      };
    }

    milestoneModal.onclick = function (e) {
      if (e.target === milestoneModal) {
        closeMilestonePrompt();
      }
    };

    // Expose prompt function globally
    window.triggerCookingMilestonePrompt = openMilestonePrompt;
    window.closeCookingMilestonePrompt = closeMilestonePrompt;

    // Attach to Finish buttons
    finishTriggers.forEach(btn => {
      btn.addEventListener('click', function (e) {
        const isFinish = btn.id === 'finish-cooking-btn' ||
                         btn.classList.contains('btn-finish') ||
                         (btn.textContent && (btn.textContent.includes('Done') || btn.textContent.includes('Finish')));

        if (isFinish && btn.id !== 'btn-share-celebration') {
          setTimeout(() => {
            openMilestonePrompt();
          }, 450);
        } else if (btn.id === 'btn-share-celebration') {
          const payload = getActiveRecipePayload();
          WowAppStateInstance.addSocialPost({
            recipeId: payload.recipeId,
            recipeName: payload.recipeName,
            recipeIcon: payload.recipeIcon,
            photo: payload.photo,
            caption: `Just mastered ${payload.recipeName} with step-by-step masterclass mode! Flavor profile turned out incredible. +150 XP earned 🔥🍽️`,
            tags: ['#MasterclassComplete', '#ChefMilestone', '#CulinaryXP', '#wowRecipes'],
            category: 'trending following'
          });
        }
      });
    });
  }

  /**
   * Social Feed Timeline: "wow post controls" Slide-Up Action Sheet
   * Activates three-dots menu buttons (.more-opts-btn) with:
   * 1. [ Hide this Post ]: Smooth 200ms fade-out and DOM removal from timeline matrix.
   * 2. [ Copy Recipe Link ]: Writes deep-link to clipboard and triggers micro toast "Link Copied!".
   * 3. [ Report Post ]: Flags post context and dismisses action sheet safely.
   * 4. Safe overlay closure with zero grid displacement or reload.
   */
  function setupSocialPostControlsSheet() {
    if (typeof document === 'undefined') return;

    let postControlsSheet = document.getElementById('wow-post-controls-sheet');
    if (!postControlsSheet) {
      postControlsSheet = document.createElement('div');
      postControlsSheet.id = 'wow-post-controls-sheet';
      postControlsSheet.setAttribute('role', 'dialog');
      postControlsSheet.setAttribute('aria-modal', 'true');
      postControlsSheet.setAttribute('aria-label', 'Post Controls');
      postControlsSheet.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 80;
        background: rgba(0, 0, 0, 0.78);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      postControlsSheet.innerHTML = `
        <div class="post-controls-card" style="
          background: #0B0F14;
          border-top: 2px solid #3DF2E0;
          border-radius: 28px 28px 0 0;
          padding: 14px 20px 28px;
          box-shadow: 0 -10px 40px rgba(61, 242, 224, 0.22), 0 25px 60px rgba(0, 0, 0, 0.95);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 440px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        ">
          <!-- Drawer Handle -->
          <div style="width: 40px; height: 4px; border-radius: 2px; background: rgba(255, 255, 255, 0.2); margin: 0 auto 2px;"></div>

          <!-- Header Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 10px;">
            <div style="display: flex; align-items: baseline; gap: 6px;">
              <span style="color: #FFFFFF; font-family: 'Britannic Bold', 'Plus Jakarta Sans', sans-serif; font-style: italic; font-size: 20px; font-weight: 900; line-height: 1;">wow</span>
              <span style="color: #3DF2E0; font-style: italic; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 0 10px rgba(61, 242, 224, 0.45); line-height: 1;">post controls</span>
            </div>
            <button id="btn-close-post-controls" type="button" aria-label="Close post controls" style="background: none; border: none; color: #8E9BA8; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; transition: background-color 0.2s;">
              <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
            </button>
          </div>

          <!-- Action Items Group -->
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 2px;">
            <!-- 1. Hide this Post -->
            <button id="opt-hide-post" type="button" style="
              display: flex;
              align-items: center;
              gap: 14px;
              width: 100%;
              padding: 12px 14px;
              background: #141A22;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              color: #FFFFFF;
              font-family: inherit;
              font-size: 14px;
              font-weight: 600;
              text-align: left;
              cursor: pointer;
              transition: all 0.2s;
            ">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(61, 242, 224, 0.12); border: 1px solid rgba(61, 242, 224, 0.3); display: flex; align-items: center; justify-content: center; color: #3DF2E0; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="font-size: 20px;">visibility_off</span>
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 700; color: #FFFFFF; font-size: 13.5px;">Hide this Post</div>
                <div style="font-size: 11px; color: #8E9BA8; margin-top: 1px;">Remove this creation from your feed view</div>
              </div>
            </button>

            <!-- 2. Copy Recipe Link -->
            <button id="opt-copy-link" type="button" style="
              display: flex;
              align-items: center;
              gap: 14px;
              width: 100%;
              padding: 12px 14px;
              background: #141A22;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              color: #FFFFFF;
              font-family: inherit;
              font-size: 14px;
              font-weight: 600;
              text-align: left;
              cursor: pointer;
              transition: all 0.2s;
            ">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(61, 242, 224, 0.12); border: 1px solid rgba(61, 242, 224, 0.3); display: flex; align-items: center; justify-content: center; color: #3DF2E0; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="font-size: 20px;">link</span>
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 700; color: #FFFFFF; font-size: 13.5px;">Copy Recipe Link</div>
                <div style="font-size: 11px; color: #8E9BA8; margin-top: 1px;">Share direct masterclass link with friends</div>
              </div>
            </button>

            <!-- 3. Report Post -->
            <button id="opt-report-post" type="button" style="
              display: flex;
              align-items: center;
              gap: 14px;
              width: 100%;
              padding: 12px 14px;
              background: #141A22;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              color: #FFFFFF;
              font-family: inherit;
              font-size: 14px;
              font-weight: 600;
              text-align: left;
              cursor: pointer;
              transition: all 0.2s;
            ">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 59, 48, 0.12); border: 1px solid rgba(255, 59, 48, 0.3); display: flex; align-items: center; justify-content: center; color: #FF3B30; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="font-size: 20px;">flag</span>
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 700; color: #FFFFFF; font-size: 13.5px;">Report Post</div>
                <div style="font-size: 11px; color: #8E9BA8; margin-top: 1px;">Flag inappropriate or broken recipe content</div>
              </div>
            </button>
          </div>

          <!-- Cancel Button -->
          <button id="btn-cancel-post-controls" type="button" style="
            width: 100%;
            height: 40px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.06);
            color: #8E9BA8;
            font-size: 12.5px;
            font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            margin-top: 4px;
            transition: all 0.2s;
          ">
            Cancel
          </button>
        </div>
      `;

      const mountParent = document.getElementById('viewport') || document.body;
      mountParent.appendChild(postControlsSheet);
    }

    const card = postControlsSheet.querySelector('.post-controls-card');
    const closeBtn = postControlsSheet.querySelector('#btn-close-post-controls');
    const cancelBtn = postControlsSheet.querySelector('#btn-cancel-post-controls');
    const hideBtn = postControlsSheet.querySelector('#opt-hide-post');
    const copyBtn = postControlsSheet.querySelector('#opt-copy-link');
    const reportBtn = postControlsSheet.querySelector('#opt-report-post');

    let activePostId = null;
    let activePostCard = null;

    function openPostControls(postId, targetCardEl) {
      activePostId = postId || (targetCardEl ? targetCardEl.getAttribute('data-post-id') : 'gourmet-post');
      activePostCard = targetCardEl || (postId ? document.querySelector(`.post-card[data-post-id="${postId}"]`) : null);

      postControlsSheet.style.pointerEvents = 'auto';
      postControlsSheet.style.opacity = '1';
      if (card) card.style.transform = 'translateY(0)';
    }

    function closePostControls() {
      if (card) card.style.transform = 'translateY(100%)';
      postControlsSheet.style.opacity = '0';
      setTimeout(() => {
        postControlsSheet.style.pointerEvents = 'none';
      }, 300);
    }

    function notifyToast(msg, icon) {
      if (typeof window.showToast === 'function') {
        window.showToast(msg, icon || 'check_circle');
        return;
      }
      const globalToast = document.getElementById('global-toast');
      const toastMsg = document.getElementById('toast-msg');
      const toastIcon = document.getElementById('toast-icon');
      if (globalToast && toastMsg) {
        toastMsg.textContent = msg;
        if (toastIcon && icon) toastIcon.textContent = icon;
        globalToast.classList.add('show');
        setTimeout(() => globalToast.classList.remove('show'), 2600);
      }
    }

    // 1. Hide this Post
    if (hideBtn) {
      hideBtn.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        const cardToHide = activePostCard || (activePostId ? document.querySelector(`.post-card[data-post-id="${activePostId}"]`) : null);
        if (cardToHide) {
          cardToHide.style.transition = 'opacity 0.2s ease, transform 0.2s ease, max-height 0.2s ease, margin 0.2s ease';
          cardToHide.style.opacity = '0';
          cardToHide.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (cardToHide && cardToHide.parentNode) {
              cardToHide.parentNode.removeChild(cardToHide);
            }
          }, 200);
        }
        closePostControls();
        notifyToast('Post hidden from timeline', 'visibility_off');
      };
    }

    // 2. Copy Recipe Link
    if (copyBtn) {
      copyBtn.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        const id = activePostId || 'gourmet-recipe';
        const deepLink = (typeof window !== 'undefined' && window.location)
          ? `${window.location.origin}${window.location.pathname}?post=${encodeURIComponent(id)}`
          : `https://wowrecipes.app/feed?post=${encodeURIComponent(id)}`;
        
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(deepLink).catch(() => {});
          }
        } catch (err) {}

        closePostControls();
        notifyToast('Link Copied!', 'content_copy');
      };
    }

    // 3. Report Post
    if (reportBtn) {
      reportBtn.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        closePostControls();
        notifyToast('Post reported. Thank you for keeping wow safe!', 'flag');
      };
    }

    // Dismiss buttons
    if (closeBtn) closeBtn.onclick = closePostControls;
    if (cancelBtn) cancelBtn.onclick = closePostControls;

    postControlsSheet.onclick = function (e) {
      if (e.target === postControlsSheet) {
        closePostControls();
      }
    };

    // Expose functions globally
    window.openPostControls = openPostControls;
    window.closePostControls = closePostControls;

    // Delegated click listener on three-dots buttons across the feed grid
    document.addEventListener('click', function (e) {
      const moreBtn = e.target.closest('.more-opts-btn, .more-options-btn, [data-action="post-controls"]');
      if (moreBtn) {
        e.preventDefault();
        e.stopPropagation();
        const postCard = moreBtn.closest('.post-card');
        const postId = postCard ? (postCard.getAttribute('data-post-id') || postCard.id) : null;
        openPostControls(postId, postCard);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. GLOBAL PROFILE PICTURE SYNCHRONIZATION PIPELINE
  // Storage Key: 'wow_user_profile_pic'
  // ═══════════════════════════════════════════════════════════════════════════

  const PROFILE_PIC_STORAGE_KEY = 'wow_user_profile_pic';

  /**
   * Multi-Screen Real-Time Reactive Profile Picture Synchronizer
   * Updates all DOM image tags matching .wow-global-avatar or targeted profile slots
   */
  function syncWowProfilePicture(customPic) {
    let pic = customPic;
    if (!pic) {
      try {
        pic = localStorage.getItem(PROFILE_PIC_STORAGE_KEY);
      } catch (e) {
        console.warn('LocalStorage read error for profile pic:', e);
      }
    }
    if (!pic) return;

    // 1. Update all image elements matching .wow-global-avatar class token or data binding
    const avatarImgs = document.querySelectorAll('.wow-global-avatar, #global-current-user-avatar, [data-bind="currentUser.profilePictureUrl"]');
    avatarImgs.forEach(function (img) {
      if (img && img.tagName === 'IMG') {
        img.src = pic;
      }
    });

    // 2. Target binding: Home Dashboard Screen Header Avatar (#profile-avatar-btn)
    const profileAvatarBtn = document.getElementById('profile-avatar-btn');
    if (profileAvatarBtn) {
      let img = profileAvatarBtn.querySelector('img.wow-global-avatar') || profileAvatarBtn.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.className = 'wow-global-avatar';
        img.alt = 'Chef Profile';
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;';
        profileAvatarBtn.insertBefore(img, profileAvatarBtn.firstChild);
      }
      img.src = pic;
      img.style.display = 'block';
      const initials = profileAvatarBtn.querySelector('.avatar-fallback, .avatar-initials');
      if (initials) {
        initials.style.display = 'none';
      }
    }

    // 3. Target binding: Social feed & story user avatar
    const storyUserAvatar = document.querySelector('.story-avatar-img[alt="Your Avatar"], [data-user-story-avatar]');
    if (storyUserAvatar && storyUserAvatar.tagName === 'IMG') {
      storyUserAvatar.src = pic;
    }
  }

  /**
   * Native Mobile File Picker Interface Trigger
   */
  function triggerWowAvatarUpload() {
    let fileInput = document.getElementById('wow-avatar-file-input');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'wow-avatar-file-input';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
    }

    fileInput.onchange = function () {
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64String = event.target.result;
          try {
            localStorage.setItem(PROFILE_PIC_STORAGE_KEY, base64String);
          } catch (e) {
            console.warn('LocalStorage save failed for profile pic:', e);
          }
          syncWowProfilePicture(base64String);
          if (typeof window.showToast === 'function') {
            window.showToast('Profile photo updated successfully', 'account_circle');
          }
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  /**
   * Global Avatar Listeners & Storage Watcher
   */
  function setupWowAvatarUploadListeners() {
    // 1. Camera icon triggers on Profile & Settings screen
    const avatarBtns = document.querySelectorAll('#btn-change-avatar, [aria-label="Change Profile Photo"], [data-action="update-profile-photo"]');
    avatarBtns.forEach(btn => {
      btn.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        triggerWowAvatarUpload();
      };
    });

    // 2. Storage event listener for real-time multi-window / multi-screen sync
    window.addEventListener('storage', function (e) {
      if (e.key === PROFILE_PIC_STORAGE_KEY) {
        syncWowProfilePicture(e.newValue);
      }
    });

    // 3. Initial sync run
    syncWowProfilePicture();
  }

  // Expose global methods
  window.syncWowProfilePicture = syncWowProfilePicture;
  window.triggerWowAvatarUpload = triggerWowAvatarUpload;

  // Initialize DOM bindings on DOMContentLoaded or immediate if already ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoBindPagePipelines);
    } else {
      autoBindPagePipelines();
    }
  }

})(typeof window !== 'undefined' ? window : globalThis);
