/**
 * Test script for MealDBCacheEngine
 */
const fs = require('fs');

global.window = global;

// Simple localStorage mock for Node.js environment
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i] || null
};


// Load cache engine
require('../cache-engine.js');

console.log('🧪 Starting MealDBCacheEngine Unit Test Suite...');

// Test 1: Set and Get fresh cache
const testData = { idMeal: '52772', strMeal: 'Teriyaki Chicken Casserole' };
window.MealDBCacheEngine.set('recipe_52772', testData);

const res1 = window.MealDBCacheEngine.get('recipe_52772');
if (!res1 || res1.isExpired || res1.data.strMeal !== 'Teriyaki Chicken Casserole') {
  console.error('❌ Test 1 Failed: Fresh cache read failed!', res1);
  process.exit(1);
}
console.log('✅ Test 1 Passed: Fresh cache read successful within 7-day TTL.');

// Test 2: Expired TTL check
window.MealDBCacheEngine.set('expired_test', { foo: 'bar' }, -1000); // Already expired
const res2 = window.MealDBCacheEngine.get('expired_test');
if (!res2 || !res2.isExpired) {
  console.error('❌ Test 2 Failed: Expired TTL calculation failed!', res2);
  process.exit(1);
}
console.log('✅ Test 2 Passed: Expired TTL correctly identified.');

// Test 3: Prune expired keys
window.MealDBCacheEngine.pruneOldest();
if (window.MealDBCacheEngine.get('expired_test') !== null) {
  console.error('❌ Test 3 Failed: Expired cache item was not pruned!');
  process.exit(1);
}
console.log('✅ Test 3 Passed: Pruning removed expired cache items.');

console.log('🎉 ALL MEALDB CACHE ENGINE TESTS PASSED PERFECTLY!');
