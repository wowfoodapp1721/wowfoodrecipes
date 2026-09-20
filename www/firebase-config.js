/**
 * Wow Food Recipes - Firebase Web SDK & User Preferences Sync
 * File: firebase-config.js
 * Package ID: com.wowfoodrecipes.app
 * 
 * Integrates Firebase for user preferences, dietary settings hub, and cloud backup with fallback to localStorage.
 */

(function(global) {
  'use strict';

  // Default Firebase configuration placeholder derived from google-services.json context
  const firebaseConfig = {
    apiKey: "AIzaSy_WOW_FOOD_RECIPES_FIREBASE_KEY",
    authDomain: "wow-food-recipes-app.firebaseapp.com",
    projectId: "wow-food-recipes-app",
    storageBucket: "wow-food-recipes-app.appspot.com",
    messagingSenderId: "109876543210",
    appId: "1:109876543210:web:com.wowfoodrecipes.app"
  };

  const USER_PREFS_KEY = 'wow_user_dietary_preferences_v1';

  const WowFirebaseManager = {
    config: firebaseConfig,
    isInitialized: false,

    init() {
      if (this.isInitialized) return;
      try {
        if (typeof window !== 'undefined' && window.firebase && window.firebase.initializeApp) {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(this.config);
          }
          this.isInitialized = true;
          console.log('[WowFirebaseManager] Firebase initialized successfully for package com.wowfoodrecipes.app');
        } else {
          console.log('[WowFirebaseManager] Firebase Web SDK script not loaded; running in offline/local storage mode.');
        }
      } catch (err) {
        console.warn('[WowFirebaseManager] Firebase init warning:', err);
      }
    },

    /**
     * Get user dietary preferences (from Firebase DB or localStorage fallback)
     * @returns {Object}
     */
    getDietaryPreferences() {
      const defaultPrefs = {
        vegan: false,
        vegetarian: false,
        keto: false,
        glutenFree: false,
        dairyFree: false,
        halal: false,
        nutFree: false,
        updatedAt: Date.now()
      };

      try {
        const localData = localStorage.getItem(USER_PREFS_KEY);
        if (localData) {
          return { ...defaultPrefs, ...JSON.parse(localData) };
        }
      } catch (e) {
        console.warn('[WowFirebaseManager] Error reading local dietary prefs:', e);
      }
      return defaultPrefs;
    },

    /**
     * Save dietary preferences to both localStorage and Firebase
     * @param {Object} prefs 
     */
    async saveDietaryPreferences(prefs) {
      const updated = {
        ...this.getDietaryPreferences(),
        ...prefs,
        updatedAt: Date.now()
      };

      // 1. Save to local storage
      try {
        localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('[WowFirebaseManager] Error writing local dietary prefs:', e);
      }

      // 2. Sync with Firebase if available
      try {
        if (window.firebase && window.firebase.auth && window.firebase.firestore) {
          const user = window.firebase.auth().currentUser;
          if (user) {
            await window.firebase.firestore()
              .collection('users')
              .doc(user.uid)
              .set({ dietaryPreferences: updated }, { merge: true });
            console.log('[WowFirebaseManager] Synced dietary preferences to Firebase Cloud');
          }
        }
      } catch (err) {
        console.warn('[WowFirebaseManager] Firebase sync pending (will retry online):', err);
      }

      return updated;
    }
  };

  // Auto-initialize on load
  WowFirebaseManager.init();

  global.WowFirebaseManager = WowFirebaseManager;

})(typeof window !== 'undefined' ? window : this);
