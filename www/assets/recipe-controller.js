/**
 * wow Food Recipes — Central Dynamic Recipe Router & Data Synchronization Engine
 * File: recipe-controller.js
 * 
 * Manages full lifecycle data synchronization across the entire application flow:
 * [Recipe Cards] ---> [Recipe Details (recipe-detail.html)] ---> [Immersive Steps (cooking-guide.html / immersive-cooking.html)]
 * 
 * Features:
 * 1. Global Local Recipe Database with rich ingredients, instructions, health scores, and preparation steps.
 * 2. Dynamic Card Trigger Re-routing with standard '?id=' URL parameters.
 * 3. Detail View Dynamic Data & Header Canvas Wrapper Injection.
 * 4. Seamless Flow Hand-off to Immersive Cook Mode & Voice-Assisted Preparation Sessions.
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. COMPREHENSIVE LOCAL RECIPE DATABASE
  // ═══════════════════════════════════════════════════════════════════════════
  const RECIPE_DB = {
    'pizza-authentic': {
      id: 'pizza-authentic',
      slug: 'pizza-authentic',
      title: 'Authentic Neapolitan Artisan Pizza',
      subtitle: 'San Marzano D.O.P. tomato coulis, fresh Fior di Latte mozzarella, fragrant sweet basil, and extra virgin olive oil on blistered sourdough crust.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
      strMealThumb: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
      category: 'PIZZA • NAPOLI ARTISAN',
      badge: 'Wood-Fired Classic',
      prepTime: '20 min',
      cookTime: '15 min',
      totalTime: '35 minutes',
      servings: 4,
      calories: 520,
      calorieStr: '520 kcal',
      likes: '312.4k',
      intro: 'Originating from the volcanic hills of Naples, this authentic pizza features a 48-hour fermented crust baked at high heat for signature leopard-spotted charring and velvety melted mozzarella.',
      ingredients: [
        { name: '250g Type 00 Pizza Flour', qty: '250g', amount: '250g', base: 250, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { name: '200g Fresh Mozzarella', qty: '200g', amount: '200g', base: 200, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80' },
        { name: '150ml San Marzano Tomato Sauce', qty: '150ml', amount: '150ml', base: 150, unit: 'ml', ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
        { name: '50g Fresh Basil Leaves', qty: '50g', amount: '50g', base: 50, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1588879462719-74d320ddca2b?auto=format&fit=crop&w=600&q=80' },
        { name: '15ml Extra Virgin Olive Oil', qty: '15ml', amount: '15ml', base: 15, unit: 'ml', ingredientIcon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
        { name: '5g Sea Salt & Active Yeast', qty: '5g', amount: '5g', base: 5, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80' }
      ],
      instructions: [
        { stepNum: 1, title: '1. Hand-Stretch Sourdough Crust', instruction: 'Hand-stretch the 48-hour cold-fermented dough gently outward from the center, preserving an airy, puffed cornicione crust perimeter.', timer: '05:00', durationText: '5 mins' },
        { stepNum: 2, title: '2. Ladle San Marzano Coulis', instruction: 'Ladle 150ml crushed San Marzano D.O.P. tomatoes spiraling evenly across dough base without overcrowding.', timer: '03:00', durationText: '3 mins' },
        { stepNum: 3, title: '3. Layer Fior di Latte Mozzarella', instruction: 'Tear 200g fresh Fior di Latte mozzarella across sauce, then drizzle 15ml extra virgin olive oil over entire surface.', timer: '04:00', durationText: '4 mins' },
        { stepNum: 4, title: '4. High-Heat Stone Bake', instruction: 'Slide onto preheated baking steel at 500°F (260°C) and bake for 8-10 minutes until cheese bubbles and crust blisters with signature leopard spotting.', timer: '10:00', durationText: '10 mins' },
        { stepNum: 5, title: '5. Aromatic Basil Garnish', instruction: 'Scatter 50g fresh fragrant sweet basil leaves immediately upon removal and slice with artisanal rocker blade.', timer: '02:00', durationText: '2 mins' }
      ],
      healthScore: {
        score: 94,
        rating: 'High Protein / Heart Healthy',
        ratingSub: 'Mediterranean Balance',
        macros: {
          protein: { val: '38.0g', pct: 76 },
          carbs: { val: '46.0g', pct: 48 },
          fat: { val: '16.0g', pct: 32 },
          fiber: { val: '5.5g', pct: 55 }
        },
        nutritionTable: [
          { name: 'Calories', val: '520 kcal', pct: '(26% DV)' },
          { name: 'Total Fat', val: '16.00g', pct: '(21% DV)' },
          { name: 'Carbohydrates', val: '46.00g', pct: '(17% DV)' },
          { name: 'Dietary Fiber', val: '5.50g', pct: '(20% DV)' },
          { name: 'Protein', val: '38.00g', pct: '(76% DV)' },
          { name: 'Sodium', val: '510.00mg', pct: '(22% DV)' }
        ]
      },
      community: { liked: '312 liked', disliked: '4 disliked', tags: ['Neapolitan', 'Wood-Fired', 'Fior di Latte', 'San Marzano', 'High Protein'] },
      steps: [
        { stepNumber: 1, headline: '1. Hand-Stretch Sourdough Crust', durationText: '5 mins', timerSeconds: 300, timerLabel: 'Stretch Timer', description: 'Hand-stretch <strong>250g Type 00 dough</strong> gently outward from center, preserving an airy cornicione perimeter.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85' },
        { stepNumber: 2, headline: '2. Ladle San Marzano Coulis', durationText: '3 mins', timerSeconds: 180, timerLabel: 'Sauce Timer', description: 'Ladle <strong>150ml San Marzano tomatoes</strong> spiraling evenly across dough base.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85' },
        { stepNumber: 3, headline: '3. Layer Fior di Latte Mozzarella', durationText: '4 mins', timerSeconds: 240, timerLabel: 'Cheese Timer', description: 'Tear <strong>200g fresh mozzarella</strong> across sauce, then drizzle <strong>15ml olive oil</strong>.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85' },
        { stepNumber: 4, headline: '4. High-Heat Stone Bake', durationText: '10 mins', timerSeconds: 600, timerLabel: 'Stone Bake Timer', description: 'Bake at 500°F (260°C) for 8-10 minutes until cheese bubbles and crust blisters.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85' },
        { stepNumber: 5, headline: '5. Aromatic Basil Garnish', durationText: '2 mins', timerSeconds: 120, timerLabel: 'Garnish Timer', description: 'Scatter <strong>50g fresh basil leaves</strong> immediately upon removal and slice with rocker blade.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85' }
      ]
    },

    'pizza-skillet': {
      id: 'pizza-skillet',
      slug: 'pizza-skillet',
      title: 'Quick Pan-Seared Skillet Pizza (Detroit Style)',
      subtitle: 'Thick airy focaccia dough baked in seasoned cast iron skillet with caramelized Wisconsin brick cheese perimeter and twin racing tomato stripes.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
      img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
      strMealThumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
      category: 'PIZZA • DETROIT CRUNCH',
      badge: '15-Min Skillet',
      prepTime: '10 min',
      cookTime: '18 min',
      totalTime: '28 minutes',
      servings: 4,
      calories: 480,
      calorieStr: '480 kcal',
      likes: '215.8k',
      intro: 'Crispy caramelized cheese perimeter baked at intense radiant heat in a heavy iron skillet, delivering a cloud-soft interior crumb with crunchy frico corners.',
      ingredients: [
        { name: '220g High-Hydration Focaccia Dough', qty: '220g', amount: '220g', base: 220, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { name: '180g Wisconsin Brick Cheese', qty: '180g', amount: '180g', base: 180, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80' },
        { name: '120ml Simmered Garlic Pizza Sauce', qty: '120ml', amount: '120ml', base: 120, unit: 'ml', ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
        { name: '80g Crispy Pepperoni Cups', qty: '80g', amount: '80g', base: 80, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=600&q=80' },
        { name: '15ml Cold-Pressed Olive Oil', qty: '15ml', amount: '15ml', base: 15, unit: 'ml', ingredientIcon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }
      ],
      instructions: [
        { stepNum: 1, title: '1. Cast-Iron Pan Fit', instruction: 'Dimple high-hydration dough into well-oiled cast-iron skillet, pushing dough edges right up to hot pan perimeter.', timer: '05:00', durationText: '5 mins' },
        { stepNum: 2, title: '2. Edge-to-Edge Cheese Pack', instruction: 'Distribute cubed Wisconsin brick cheese right against pan edges to create caramelized crispy frico crown.', timer: '04:00', durationText: '4 mins' },
        { stepNum: 3, title: '3. Top with Pepperoni & Red Sauce', instruction: 'Layer cup-and-char pepperoni rounds across cheese surface and spoon twin racing stripes of hot garlic tomato sauce.', timer: '05:00', durationText: '5 mins' },
        { stepNum: 4, title: '4. Skillet Bake to Golden Crisp', instruction: 'Bake at 475°F (245°C) for 15-18 minutes until perimeter edges turn deeply caramelized and base is crunchy.', timer: '18:00', durationText: '18 mins' },
        { stepNum: 5, title: '5. Rest & Pan Release', instruction: 'Scatter Sicilian wild oregano and let rest 4 minutes before lifting with offset spatula.', timer: '04:00', durationText: '4 mins' }
      ],
      healthScore: {
        score: 93,
        rating: 'High Protein / Balanced Fuel',
        ratingSub: 'Precision Baked',
        macros: {
          protein: { val: '36.0g', pct: 72 },
          carbs: { val: '44.0g', pct: 46 },
          fat: { val: '18.0g', pct: 36 },
          fiber: { val: '4.8g', pct: 48 }
        },
        nutritionTable: [
          { name: 'Calories', val: '480 kcal', pct: '(24% DV)' },
          { name: 'Total Fat', val: '18.00g', pct: '(23% DV)' },
          { name: 'Carbohydrates', val: '44.00g', pct: '(16% DV)' },
          { name: 'Protein', val: '36.00g', pct: '(72% DV)' },
          { name: 'Sodium', val: '540.00mg', pct: '(23% DV)' }
        ]
      },
      community: { liked: '215 liked', disliked: '3 disliked', tags: ['Detroit Style', 'Cast Iron', 'Crispy Edge', 'Pepperoni'] },
      steps: [
        { stepNumber: 1, headline: '1. Cast-Iron Pan Fit', durationText: '5 mins', timerSeconds: 300, timerLabel: 'Skillet Fit Timer', description: 'Dimple <strong>220g dough</strong> into oiled cast-iron skillet, pushing edges right up to pan rim.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85' },
        { stepNumber: 2, headline: '2. Edge-to-Edge Cheese Pack', durationText: '4 mins', timerSeconds: 240, timerLabel: 'Cheese Rim Timer', description: 'Pack <strong>180g brick cheese</strong> right against hot skillet edges.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85' },
        { stepNumber: 3, headline: '3. Top with Pepperoni & Red Sauce', durationText: '5 mins', timerSeconds: 300, timerLabel: 'Topping Timer', description: 'Layer <strong>80g pepperoni cups</strong> and spoon <strong>120ml garlic tomato sauce</strong>.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85' },
        { stepNumber: 4, headline: '4. Skillet Bake to Golden Crisp', durationText: '18 mins', timerSeconds: 1080, timerLabel: 'Bake Timer', description: 'Bake at 475°F (245°C) for 15-18 minutes until perimeter edges turn deeply caramelized.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85' }
      ]
    },

    'pizza-chicago': {
      id: 'pizza-chicago',
      slug: 'pizza-chicago',
      title: 'Chicago Style Deep Dish Pizza',
      subtitle: 'Buttery cornmeal crust walls loaded with sliced whole-milk mozzarella, savory fennel sausage crumble, and chunky sweet-herb tomato sauce.',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
      img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
      strMealThumb: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
      category: 'PIZZA • CHICAGO HERITAGE',
      badge: 'Deep Dish Icon',
      prepTime: '25 min',
      cookTime: '35 min',
      totalTime: '60 minutes',
      servings: 6,
      calories: 580,
      calorieStr: '580 kcal',
      likes: '284.1k',
      intro: 'An authentic Windy City icon: high buttery walls of golden cornmeal crust filled with layers of melted mozzarella, savory Italian sausage, and crushed plum tomato sauce.',
      ingredients: [
        { name: '300g Golden Cornmeal Pizza Dough', qty: '300g', amount: '300g', base: 300, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { name: '250g Whole Milk Mozzarella', qty: '250g', amount: '250g', base: 250, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80' },
        { name: '200g Italian Fennel Sausage', qty: '200g', amount: '200g', base: 200, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80' },
        { name: '180ml Crushed Plum Tomato Sauce', qty: '180ml', amount: '180ml', base: 180, unit: 'ml', ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
        { name: '40g Aged Pecorino Romano', qty: '40g', amount: '40g', base: 40, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80' }
      ],
      instructions: [
        { stepNum: 1, title: '1. Line Deep Dish Pan', instruction: 'Press cornmeal-infused dough up the sides of a deep-dish cast iron skillet brushed with melted garlic butter.', timer: '08:00', durationText: '8 mins' },
        { stepNum: 2, title: '2. Reverse Cheese Layering', instruction: 'Layer thick slices of whole-milk mozzarella directly onto raw dough base for signature reverse deep-dish assembly.', timer: '05:00', durationText: '5 mins' },
        { stepNum: 3, title: '3. Add Sausage & Chunky Sauce', instruction: 'Scatter crumbled Italian fennel sausage and top generously with seasoned crushed plum tomato sauce.', timer: '07:00', durationText: '7 mins' },
        { stepNum: 4, title: '4. Deep Oven Bake', instruction: 'Bake at 425°F (220°C) for 32-35 minutes until deep crust edges turn golden biscuit-crisp and interior is molten.', timer: '35:00', durationText: '35 mins' },
        { stepNum: 5, title: '5. Pecorino Dust & Rest', instruction: 'Dust with 40g freshly grated Pecorino Romano and rest for 10 minutes before deep-slicing.', timer: '10:00', durationText: '10 mins' }
      ],
      healthScore: {
        score: 91,
        rating: 'High Protein / Muscle Recovery',
        ratingSub: 'Nutrient Dense',
        macros: {
          protein: { val: '42.0g', pct: 84 },
          carbs: { val: '52.0g', pct: 54 },
          fat: { val: '22.0g', pct: 44 },
          fiber: { val: '6.0g', pct: 60 }
        },
        nutritionTable: [
          { name: 'Calories', val: '580 kcal', pct: '(29% DV)' },
          { name: 'Total Fat', val: '22.00g', pct: '(28% DV)' },
          { name: 'Carbohydrates', val: '52.00g', pct: '(19% DV)' },
          { name: 'Protein', val: '42.00g', pct: '(84% DV)' }
        ]
      },
      community: { liked: '284 liked', disliked: '7 disliked', tags: ['Chicago', 'Deep Dish', 'Sausage', 'Comfort Food'] }
    },

    'pizza-new-york': {
      id: 'pizza-new-york',
      slug: 'pizza-new-york',
      title: 'New York Style Classic Thin Crust Pizza',
      subtitle: 'Extra-large foldable hand-tossed thin crust with rich low-moisture whole milk mozzarella, oregano sauce, and savory char.',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
      imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
      img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
      strMealThumb: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
      category: 'PIZZA • NYC CLASSIC',
      badge: 'NY Thin Crust',
      prepTime: '15 min',
      cookTime: '12 min',
      totalTime: '27 minutes',
      servings: 4,
      calories: 470,
      calorieStr: '470 kcal',
      likes: '268.9k',
      intro: 'The authentic New York slice: hand-tossed ultra-thin dough with crispy bottom blister, rich oregano sauce, and melted low-moisture mozzarella designed for the classic fold.',
      ingredients: [
        { name: '240g High-Gluten Bread Flour Dough', qty: '240g', amount: '240g', base: 240, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { name: '190g Low-Moisture Mozzarella', qty: '190g', amount: '190g', base: 190, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80' },
        { name: '140ml Herbed NYC Pizza Sauce', qty: '140ml', amount: '140ml', base: 140, unit: 'ml', ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
        { name: '30g Grated Parmigiano Reggiano', qty: '30g', amount: '30g', base: 30, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80' },
        { name: '10g Garlic Powder & Red Chili Flakes', qty: '10g', amount: '10g', base: 10, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' }
      ],
      instructions: [
        { stepNum: 1, title: '1. Hand-Spin Thin Crust', instruction: 'Hand-spin and stretch dough disc evenly to a 16-inch ultra-thin circle with slight raised outer edge.', timer: '06:00', durationText: '6 mins' },
        { stepNum: 2, title: '2. Sauce Swirl Technique', instruction: 'Ladle 140ml aromatic tomato sauce with gentle swirl motion, leaving a 1/2-inch border.', timer: '03:00', durationText: '3 mins' },
        { stepNum: 3, title: '3. Low-Moisture Cheese Blend', instruction: 'Scatter shredded low-moisture whole milk mozzarella evenly and dust with freshly grated Parmigiano.', timer: '04:00', durationText: '4 mins' },
        { stepNum: 4, title: '4. Quick High Heat Blister', instruction: 'Bake on roaring pizza stone at 500°F (260°C) for 10-12 minutes until crust is blistered and slice folds cleanly.', timer: '12:00', durationText: '12 mins' },
        { stepNum: 5, title: '5. NYC Slice & Season', instruction: 'Finish with crushed red pepper flakes, garlic powder, and slice into classic triangular wide slices.', timer: '02:00', durationText: '2 mins' }
      ],
      healthScore: {
        score: 92,
        rating: 'High Protein / Lean Energy',
        ratingSub: 'Classic Macro Profile',
        macros: {
          protein: { val: '34.0g', pct: 68 },
          carbs: { val: '48.0g', pct: 50 },
          fat: { val: '15.0g', pct: 30 },
          fiber: { val: '4.5g', pct: 45 }
        },
        nutritionTable: [
          { name: 'Calories', val: '470 kcal', pct: '(23% DV)' },
          { name: 'Total Fat', val: '15.00g', pct: '(19% DV)' },
          { name: 'Carbohydrates', val: '48.00g', pct: '(17% DV)' },
          { name: 'Protein', val: '34.00g', pct: '(68% DV)' }
        ]
      },
      community: { liked: '268 liked', disliked: '5 disliked', tags: ['NYC', 'Thin Crust', 'Foldable', 'Street Style'] }
    },

    'pizza-keto': {
      id: 'pizza-keto',
      slug: 'pizza-keto',
      title: 'High-Protein Crisp Artisan Pizza',
      subtitle: 'Low-carb golden almond-flour & egg-white protein crust topped with lean chicken breast, low-fat mozzarella, and fresh arugula.',
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
      imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
      img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
      strMealThumb: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
      category: 'PIZZA • LEAN PERFORMANCE',
      badge: 'Keto & High-Protein',
      prepTime: '10 min',
      cookTime: '15 min',
      totalTime: '25 minutes',
      servings: 2,
      calories: 390,
      calorieStr: '390 kcal',
      likes: '198.3k',
      intro: 'Engineered for athletes and fitness gourmets: 44g of clean bioavailable protein per serving with low glycemic impact, crispy crust, and fresh greens.',
      ingredients: [
        { name: '150g Almond Flour Protein Crust', qty: '150g', amount: '150g', base: 150, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { name: '140g Grilled Chicken Breast Strips', qty: '140g', amount: '140g', base: 140, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80' },
        { name: '100g Part-Skim Mozzarella', qty: '100g', amount: '100g', base: 100, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80' },
        { name: '80ml Reduced-Sugar Tomato Puree', qty: '80ml', amount: '80ml', base: 80, unit: 'ml', ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
        { name: '30g Baby Arugula & Shaved Parmesan', qty: '30g', amount: '30g', base: 30, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1588879462719-74d320ddca2b?auto=format&fit=crop&w=600&q=80' }
      ],
      instructions: [
        { stepNum: 1, title: '1. Par-Bake Protein Crust', instruction: 'Pre-bake the high-protein almond flour crust on parchment paper at 400°F (205°C) for 8 minutes until lightly crisp.', timer: '08:00', durationText: '8 mins' },
        { stepNum: 2, title: '2. Layer Sauce & Lean Protein', instruction: 'Spread 80ml reduced-sugar tomato puree and top with part-skim mozzarella and seasoned grilled chicken breast.', timer: '04:00', durationText: '4 mins' },
        { stepNum: 3, title: '3. Melt to Golden Bubble', instruction: 'Return to oven for 7 minutes until cheese is completely melted and bubbly with golden spots.', timer: '07:00', durationText: '7 mins' },
        { stepNum: 4, title: '4. Finish with Fresh Arugula', instruction: 'Top immediately with crisp fresh baby arugula, shaved parmesan, and a mist of truffle olive oil.', timer: '02:00', durationText: '2 mins' }
      ],
      healthScore: {
        score: 96,
        rating: 'High Protein / Keto Fuel',
        ratingSub: 'Optimal Fitness Matrix',
        macros: {
          protein: { val: '44.0g', pct: 88 },
          carbs: { val: '12.0g', pct: 12 },
          fat: { val: '14.0g', pct: 28 },
          fiber: { val: '6.5g', pct: 65 }
        },
        nutritionTable: [
          { name: 'Calories', val: '390 kcal', pct: '(19% DV)' },
          { name: 'Total Fat', val: '14.00g', pct: '(18% DV)' },
          { name: 'Carbohydrates', val: '12.00g', pct: '(4% DV)' },
          { name: 'Dietary Fiber', val: '6.50g', pct: '(23% DV)' },
          { name: 'Protein', val: '44.00g', pct: '(88% DV)' }
        ]
      },
      community: { liked: '198 liked', disliked: '2 disliked', tags: ['High Protein', 'Keto', 'Low Carb', '44g Protein'] }
    },

    'pizza-gourmet': {
      id: 'pizza-gourmet',
      slug: 'pizza-gourmet',
      title: 'Wow Chef AI Gourmet Truffle & Burrata Pizza',
      subtitle: 'Black winter truffle cream base, creamy Puglia burrata, wild porcini mushrooms, and 24-month aged Prosciutto di Parma.',
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
      imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
      img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
      strMealThumb: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
      category: 'PIZZA • CHEF SIGNATURE',
      badge: 'Michelin Style',
      prepTime: '15 min',
      cookTime: '12 min',
      totalTime: '27 minutes',
      servings: 4,
      calories: 560,
      calorieStr: '560 kcal',
      likes: '342.9k',
      intro: 'Curated by Chef AI for ultimate luxury: velvety black truffle velouté, whole torn burrata from Puglia, earth-harvested porcini, and prosciutto ribbons.',
      ingredients: [
        { name: '250g Artisanal Sourdough Pizza Base', qty: '250g', amount: '250g', base: 250, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { name: '150g Fresh Creamy Burrata Cheese', qty: '150g', amount: '150g', base: 150, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80' },
        { name: '100g Sautéed Wild Porcini Mushrooms', qty: '100g', amount: '100g', base: 100, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
        { name: '60g Prosciutto di Parma', qty: '60g', amount: '60g', base: 60, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=600&q=80' },
        { name: '30g Black Truffle Cream Velouté', qty: '30g', amount: '30g', base: 30, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' }
      ],
      instructions: [
        { stepNum: 1, title: '1. Truffle Cream Spread', instruction: 'Stretch artisanal sourdough dough and spread 30g aromatic black winter truffle cream across base.', timer: '05:00', durationText: '5 mins' },
        { stepNum: 2, title: '2. Porcini Mushroom Sear', instruction: 'Scatter sautéed wild porcini mushrooms and bake in high-temperature oven for 10 minutes until puffed and blistered.', timer: '10:00', durationText: '10 mins' },
        { stepNum: 3, title: '3. Fresh Burrata Placement', instruction: 'Open center of hot pizza and crown with whole 150g fresh creamy Puglia burrata cheese.', timer: '03:00', durationText: '3 mins' },
        { stepNum: 4, title: '4. Prosciutto di Parma Drape', instruction: 'Drape delicate ribbons of 24-month aged Prosciutto di Parma around burrata and drizzle with white truffle oil.', timer: '04:00', durationText: '4 mins' },
        { stepNum: 5, title: '5. Table Cut & Serve', instruction: 'Pierce burrata center at table to let rich cream pool across slices and serve with micro herbs.', timer: '02:00', durationText: '2 mins' }
      ],
      healthScore: {
        score: 95,
        rating: 'High Protein / Gourmet Vitality',
        ratingSub: 'Michelin Nutrition Standard',
        macros: {
          protein: { val: '39.0g', pct: 78 },
          carbs: { val: '43.0g', pct: 45 },
          fat: { val: '19.0g', pct: 38 },
          fiber: { val: '5.2g', pct: 52 }
        },
        nutritionTable: [
          { name: 'Calories', val: '560 kcal', pct: '(28% DV)' },
          { name: 'Total Fat', val: '19.00g', pct: '(24% DV)' },
          { name: 'Carbohydrates', val: '43.00g', pct: '(15% DV)' },
          { name: 'Protein', val: '39.00g', pct: '(78% DV)' }
        ]
      },
      community: { liked: '342 liked', disliked: '1 disliked', tags: ['Truffle', 'Burrata', 'Prosciutto', 'Michelin Chef'] }
    },

    'avocado-toast': {
      id: 'avocado-toast',
      slug: 'avocado-toast',
      title: 'Artisan Smashed Avocado Toast',
      subtitle: 'Sourdough slice with creamy smashed avocado, soft-boiled egg, chili flakes & microgreens.',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
      img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
      fallbackImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
      category: 'BREAKFAST ARTISAN',
      badge: "Morning Energy",
      prepTime: '5 min',
      cookTime: '10 min',
      totalTime: '15 minutes',
      servings: 2,
      calories: 340,
      calorieStr: '340 kcal',
      likes: '142.8k',
      intro: 'A gourmet breakfast standard featuring crisp toasted rustic sourdough layered with lemon-spiked Hass avocado mash, runny pasture-raised eggs, and smoky Aleppo pepper flakes.',
      ingredients: [
        {
          name: 'Ripe Hass Avocados',
          qty: '2 medium ripe',
          amount: '2 medium ripe',
          base: 2,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Artisan Sourdough Bread',
          qty: '2 thick slices',
          amount: '2 thick slices',
          base: 2,
          unit: 'slices',
          ingredientIcon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Pasture-Raised Eggs',
          qty: '2 large eggs',
          amount: '2 large eggs',
          base: 2,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Lemon Juice',
          qty: '1 tbsp freshly squeezed',
          amount: '1 tbsp freshly squeezed',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Extra Virgin Olive Oil',
          qty: '1 tbsp cold pressed',
          amount: '1 tbsp cold pressed',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Crushed Red Pepper Flakes',
          qty: '1/2 tsp',
          amount: '1/2 tsp',
          base: 0.5,
          unit: 'tsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Flaky Sea Salt & Black Pepper',
          qty: 'To taste',
          amount: 'To taste',
          base: 1,
          unit: 'taste',
          ingredientIcon: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Toast Bread & Prep Mash',
          instruction: 'Toast artisan sourdough slices in a skillet with a drizzle of olive oil until golden and crunchy. Scoop ripe avocado flesh into a bowl, add fresh lemon juice, salt, and pepper, and gently crush with a fork.',
          timer: '05:00',
          img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
          ingredients: [
            { name: 'Sourdough Slices', amt: '2 slices' },
            { name: 'Hass Avocados', amt: '2 pieces' },
            { name: 'Lemon Juice', amt: '1 tbsp' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Soft-Boil or Fry the Eggs',
          instruction: 'Gently lower eggs into simmering water for 6.5 minutes for a jammy yolk, then transfer to an ice bath and peel carefully.',
          timer: '06:30',
          img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800',
          ingredients: [
            { name: 'Pasture-Raised Eggs', amt: '2 eggs' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Assemble, Garnish & Serve',
          instruction: 'Slather generous heaps of smashed avocado over warm toasts. Top with halved soft-boiled eggs, microgreens, cracked pepper, and fiery red chili flakes.',
          timer: '02:00',
          img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
          ingredients: [
            { name: 'Red Pepper Flakes', amt: '1/2 tsp' },
            { name: 'Flaky Maldon Salt', amt: 'To finish' }
          ]
        }
      ],
      healthScore: {
        score: 9.1,
        rating: 'High Fiber',
        ratingSub: 'Superfood Profile',
        macros: {
          protein: { val: '18.2g', pct: 60 },
          carbs: { val: '32.4g', pct: 40 },
          fat: { val: '22.0g', pct: 42 },
          fiber: { val: '9.8g', pct: 95 }
        },
        nutritionTable: [
          { name: 'Calories', val: '340 kcal', pct: '(17% DV)' },
          { name: 'Total Fat', val: '22.00g', pct: '(28% DV)' },
          { name: 'Carbohydrates', val: '32.40g', pct: '(11% DV)' },
          { name: 'Dietary Fiber', val: '9.80g', pct: '(35% DV)' },
          { name: 'Protein', val: '18.20g', pct: '(36% DV)' },
          { name: 'Sodium', val: '280.00mg', pct: '(12% DV)' }
        ]
      },
      community: {
        liked: '289 liked',
        disliked: '6 disliked',
        tags: ['Healthy Breakfast', 'Superfood', 'Quick 15 Min', 'Vegetarian Friendly', 'High Fiber']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Toast Sourdough & Crush Avocado",
          durationText: "5 mins",
          timerSeconds: 300,
          timerLabel: "Toast & Mash Timer",
          description: "Toast <strong>2 artisan sourdough slices</strong> in olive oil. Coarsely mash <strong>2 Hass avocados</strong> with lemon juice, salt, and pepper.",
          image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800"
        },
        {
          stepNumber: 2,
          headline: "2. Cook Jammy 6-Minute Eggs",
          durationText: "6.5 mins",
          timerSeconds: 390,
          timerLabel: "Egg Boil Timer",
          description: "Boil <strong>2 eggs</strong> for 6.5 minutes for molten jammy yolks. Plunge into ice water, peel gently, and slice into halves.",
          image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800"
        },
        {
          stepNumber: 3,
          headline: "3. Assemble, Garnish & Plate",
          durationText: "2 mins",
          timerSeconds: 120,
          timerLabel: "Plating Timer",
          description: "Spread creamy green mash over crunchy toast, crown with jammy eggs, and finish with chili flakes and Maldon sea salt.",
          image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800"
        }
      ]
    },

    'spaghetti-carbonara': {
      id: 'spaghetti-carbonara',
      slug: 'spaghetti-carbonara',
      title: 'Roman Spaghetti Carbonara',
      subtitle: 'Authentic Roman masterpiece. Crispy guanciale, velvety egg yolks, and aged Pecorino Romano.',
      image: 'assets/carbonara.png',
      imageUrl: 'assets/carbonara.png',
      img: 'assets/carbonara.png',
      fallbackImage: 'assets/carbonara.png',
      category: 'ITALIAN CLASSIC',
      badge: 'For Dinner',
      prepTime: '10 min',
      cookTime: '15 min',
      totalTime: '25 minutes',
      servings: 4,
      calories: 620,
      calorieStr: '620 kcal',
      likes: '312.4k',
      intro: 'The quintessential Roman pasta. No cream, no peas — just the pure emulsification of starchy pasta water, rendered guanciale fat, egg yolks, and sharp Pecorino cheese.',
      ingredients: [
        {
          name: 'Bronze-Cut Spaghetti',
          qty: '400g core base',
          amount: '400g core base',
          base: 400,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Cured Guanciale (or Pancetta)',
          qty: '200g diced thick',
          amount: '200g diced thick',
          base: 200,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Pasture Egg Yolks',
          qty: '4 yolks + 1 whole egg',
          amount: '4 yolks + 1 whole egg',
          base: 4,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Pecorino Romano DOP',
          qty: '100g finely grated',
          amount: '100g finely grated',
          base: 100,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Freshly Cracked Black Peppercorns',
          qty: '2 tsp toasted & coarse',
          amount: '2 tsp toasted & coarse',
          base: 2,
          unit: 'tsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Flaky Sea Salt (for boiling water)',
          qty: '1 tbsp',
          amount: '1 tbsp',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: "1. Boil Pasta & Whip Egg Cream",
          instruction: "Drop bronze-cut spaghetti into boiling salted water. In a glass bowl, vigorously whisk egg yolks, Pecorino Romano cheese, and coarse black pepper until a thick golden paste forms.",
          timer: "09:00",
          img: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80",
          ingredients: [
            { name: "Bronze-Cut Spaghetti", amt: "400g" },
            { name: "Egg Yolks", amt: "4 yolks + 1 whole" },
            { name: "Pecorino Romano", amt: "100g" },
            { name: "Black Pepper", amt: "2 tsp" }
          ]
        },
        {
          stepNum: 2,
          title: "2. Crisp the Cured Guanciale",
          instruction: "Sauté cubed guanciale in a cold skillet over medium heat until fat renders and bits turn deeply golden and crisp. Reserve liquid pork fat in the pan.",
          timer: "08:00",
          img: "assets/images/cooking-skillet.jpg",
          ingredients: [
            { name: "Cured Guanciale", amt: "200g cubed" }
          ]
        },
        {
          stepNum: 3,
          title: "3. Emulsify Starchy Gloss Sauce",
          instruction: "Transfer al dente pasta directly into the skillet with rendered fat off the heat. Ladle hot starchy cooking water into the egg cream, pour over pasta, and toss continuously until ultra creamy.",
          timer: "03:00",
          img: "assets/images/pasta-emulsify.jpg",
          ingredients: [
            { name: "Hot Starchy Pasta Water", amt: "1/2 cup" },
            { name: "Egg-Cheese Sabayon", amt: "From Step 1" }
          ]
        },
        {
          stepNum: 4,
          title: "4. Garnish & Plate Immediately",
          instruction: "Twirl tall pasta nests onto warmed ceramic plates. Top with crispy guanciale cubes, additional grated Pecorino Romano, and cracked black pepper. Serve piping hot.",
          timer: "02:00",
          img: "assets/carbonara.png",
          ingredients: [
            { name: "Grated Pecorino", amt: "To dust" },
            { name: "Cracked Black Pepper", amt: "To finish" }
          ]
        }
      ],
      healthScore: {
        score: 6.8,
        rating: 'Medium',
        ratingSub: 'Classic Indulgence',
        macros: {
          protein: { val: '28.4g', pct: 65 },
          carbs: { val: '74.2g', pct: 78 },
          fat: { val: '24.6g', pct: 45 },
          fiber: { val: '3.2g', pct: 28 }
        },
        nutritionTable: [
          { name: 'Calories', val: '620 kcal', pct: '(31% DV)' },
          { name: 'Total Fat', val: '24.60g', pct: '(32% DV)' },
          { name: 'Carbohydrates', val: '74.20g', pct: '(27% DV)' },
          { name: 'Sugars', val: '2.40g', pct: '(5% DV)' },
          { name: 'Protein', val: '28.40g', pct: '(57% DV)' },
          { name: 'Sodium', val: '760.00mg', pct: '(33% DV)' }
        ]
      },
      community: {
        liked: '489 liked',
        disliked: '14 disliked',
        tags: ['Authentic Italian', 'Rich & Creamy', 'Comfort Food', 'Guanciale Gold', 'Date Night']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Prep & Ingredient Mise en Place",
          durationText: "9 mins",
          timerSeconds: 540,
          timerLabel: "Boil Pasta & Prep",
          description: "Cook <strong>400g spaghetti</strong> in boiling salted water. Whisk egg yolks, Pecorino Romano cheese, and black pepper into a smooth paste.",
          image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80"
        },
        {
          stepNumber: 2,
          headline: "2. Aromatics & Skillet Sauté",
          durationText: "8 mins",
          timerSeconds: 480,
          timerLabel: "Render Guanciale",
          description: "Crisp <strong>200g diced guanciale</strong> in a dry skillet over medium heat until the fat renders out and meat turns golden crisp.",
          image: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=800&q=80"
        },
        {
          stepNumber: 3,
          headline: "3. Emulsify Silky Sauce",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Emulsify Sauce",
          description: "Toss drained pasta into skillet off the heat. Pour egg cream and 1/2 cup starchy pasta water in, stirring rapidly to emulsify without curdling.",
          image: "assets/images/pasta-emulsify.jpg"
        },
        {
          stepNumber: 4,
          headline: "4. Garnish & Serve Hot",
          durationText: "2 mins",
          timerSeconds: 120,
          timerLabel: "Garnish & Serve",
          description: "Plate creamy pasta immediately. Top with crispy guanciale, extra grated Pecorino Romano, and cracked black pepper.",
          image: "assets/carbonara.png"
        }
      ]
    },

    'sesame-chicken': {
      id: 'sesame-chicken',
      slug: 'sesame-chicken',
      title: 'Honey Sesame Chicken',
      subtitle: 'Crispy pan-seared chicken glazed in rich honey soy with toasted sesame.',
      image: 'assets/sesame-chicken.png',
      imageUrl: 'assets/sesame-chicken.png',
      img: 'assets/sesame-chicken.png',
      fallbackImage: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
      category: 'POULTRY CLASSIC',
      badge: "Chef's Signature",
      prepTime: '10 min',
      cookTime: '20 min',
      totalTime: '30 minutes',
      servings: 4,
      calories: 480,
      calorieStr: '480 kcal',
      likes: '240.6k',
      intro: 'Tender chicken breast cubes crisped to perfection and tossed in a sweet blossom honey, aged soy sauce, and aromatic garlic glaze with nutty toasted sesame seeds.',
      ingredients: [
        {
          name: 'Boneless Chicken Breasts',
          qty: '400g diced cubes',
          amount: '400g diced cubes',
          base: 400,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Pure Blossom Honey',
          qty: '1/3 cup honey',
          amount: '1/3 cup honey',
          base: 0.333,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Dark Aged Soy Sauce',
          qty: '1/4 cup soy sauce',
          amount: '1/4 cup soy sauce',
          base: 0.25,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1589135233689-d562f4e3c3b0?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Toasted White Sesame Seeds',
          qty: '2 tbsp seeds',
          amount: '2 tbsp seeds',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Minced Garlic Cloves',
          qty: '3 cloves minced',
          amount: '3 cloves minced',
          base: 3,
          unit: 'cloves',
          ingredientIcon: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Cornstarch / Coating',
          qty: '2 tbsp',
          amount: '2 tbsp',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Sea Salt & Cracked Pepper',
          qty: 'To taste',
          amount: 'To taste',
          base: 1,
          unit: 'taste',
          ingredientIcon: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Prep & Coat Chicken',
          instruction: 'Cut chicken breasts into 1-inch bite-sized cubes. Season with salt and pepper, then toss thoroughly with cornstarch until evenly coated.',
          timer: '10:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Chicken Breasts', amt: '400g diced' },
            { name: 'Cornstarch Coating', amt: '2 tbsp' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Crisp Pan-Fry',
          instruction: 'Heat 2 tbsp oil in a large skillet over medium-high heat. Fry chicken pieces in a single layer for 8-10 minutes until golden brown and crispy.',
          timer: '08:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Coated Chicken', amt: 'From Step 1' },
            { name: 'Cooking Oil', amt: '2 tbsp' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Glaze & Reduce',
          instruction: 'Whisk honey, soy sauce, minced garlic, and sesame oil. Pour directly over hot chicken and simmer for 3 minutes until thickened into a mirror gloss glaze.',
          timer: '03:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Honey Glaze', amt: '1/3 cup' },
            { name: 'Soy Sauce & Garlic', amt: '1/4 cup' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Garnish & Serve',
          instruction: 'Garnish with toasted sesame seeds and fresh scallions. Serve immediately over warm jasmine rice.',
          timer: '02:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Toasted Sesame', amt: '2 tbsp' },
            { name: 'Fresh Scallions', amt: 'For garnish' }
          ]
        }
      ],
      healthScore: {
        score: 7.2,
        rating: 'Medium',
        ratingSub: 'High Protein',
        macros: {
          protein: { val: '42.1g', pct: 84 },
          carbs: { val: '38.5g', pct: 55 },
          fat: { val: '14.2g', pct: 32 },
          fiber: { val: '1.8g', pct: 48 }
        },
        nutritionTable: [
          { name: 'Calories', val: '480 kcal', pct: '(24% DV)' },
          { name: 'Total Fat', val: '14.20g', pct: '(18% DV)' },
          { name: 'Carbohydrates', val: '38.50g', pct: '(14% DV)' },
          { name: 'Sugars', val: '18.30g', pct: '(36% DV)' },
          { name: 'Protein', val: '42.10g', pct: '(84% DV)' },
          { name: 'Sodium', val: '820.00mg', pct: '(35% DV)' }
        ]
      },
      community: {
        liked: '367 liked',
        disliked: '20 disliked',
        tags: ['Delicious', 'Go-to Classic', 'Quick Prep', 'Great Leftovers', 'One-Pan Dish']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Prep & Coat the Chicken",
          durationText: "10 mins",
          timerSeconds: 600,
          timerLabel: "Prep & Coat Timer",
          description: "Cut <strong>400g chicken breasts</strong> into 1-inch cubes. Toss thoroughly with <strong>cornstarch</strong> until evenly coated.",
          image: "assets/sesame-chicken.png"
        },
        {
          stepNumber: 2,
          headline: "2. Pan-Fry to Golden Crisp",
          durationText: "10 mins",
          timerSeconds: 600,
          timerLabel: "Crisp Pan-Fry Timer",
          description: "Heat <strong>2 tablespoons oil</strong> in a skillet. Fry chicken pieces for 8 to 10 minutes until crisp and golden brown.",
          image: "assets/sesame-chicken.png"
        },
        {
          stepNumber: 3,
          headline: "3. Whisk & Add Honey Soy Glaze",
          durationText: "2 mins",
          timerSeconds: 120,
          timerLabel: "Glaze Reduction Timer",
          description: "Pour sweet honey soy sauce over chicken and toss continuously for 2-3 minutes until thick and glossy.",
          image: "assets/sesame-chicken.png"
        },
        {
          stepNumber: 4,
          headline: "4. Toss, Garnish & Serve",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Final Toss & Glaze",
          description: "Garnish with <strong>toasted sesame seeds</strong> and <strong>chopped scallions</strong>. Serve piping hot.",
          image: "assets/sesame-chicken.png"
        }
      ]
    },

    'ribeye': {
      id: 'ribeye',
      slug: 'ribeye',
      title: 'Prime Pan-Seared Ribeye',
      subtitle: 'Dry-aged USDA Prime ribeye with garlic-herb butter baste and charred crust.',
      image: 'assets/ribeye.jpg',
      imageUrl: 'assets/ribeye.jpg',
      img: 'assets/ribeye.jpg',
      fallbackImage: 'assets/ribeye.png',
      category: 'STEAKHOUSE SIGNATURE',
      badge: "Chef's Pick",
      prepTime: '5 min',
      cookTime: '20 min',
      totalTime: '20 minutes',
      servings: 2,
      calories: 520,
      calorieStr: '520 kcal',
      likes: '198.3k',
      intro: 'A restaurant-grade sear on cast iron with a butter-basting finish (arrosé). Rosemary, thyme, and crushed garlic cloves infuse deep flavor into every juicy slice.',
      ingredients: [
        {
          name: 'USDA Prime Bone-In Ribeye',
          qty: '2 thick steaks (16 oz each)',
          amount: '2 thick steaks (16 oz each)',
          base: 2,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'European Unsalted Butter',
          qty: '4 tbsp golden butter',
          amount: '4 tbsp golden butter',
          base: 4,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Rosemary & Thyme',
          qty: '4 fresh sprigs',
          amount: '4 fresh sprigs',
          base: 4,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Crushed Garlic Cloves',
          qty: '5 whole cloves',
          amount: '5 whole cloves',
          base: 5,
          unit: 'cloves',
          ingredientIcon: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Coarse Kosher Salt & Black Pepper',
          qty: '1 tbsp each',
          amount: '1 tbsp each',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Temper & Season Generously',
          instruction: 'Bring ribeye to room temperature for 30 minutes. Pat dry with paper towels and season heavily on all sides with coarse kosher salt and cracked black pepper.',
          timer: '05:00',
          img: 'assets/ribeye.jpg',
          ingredients: [
            { name: 'Prime Ribeye Steaks', amt: '2 steaks' },
            { name: 'Kosher Salt & Pepper', amt: 'Generously' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Smoking Hot Cast Iron Sear',
          instruction: 'Heat a heavy cast iron skillet until smoking hot. Sear steak for 3 minutes undisturbed on each side to create a deeply caramelized crust.',
          timer: '06:00',
          img: 'assets/ribeye.jpg',
          ingredients: [
            { name: 'High Smoke Point Oil', amt: '1 tbsp' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Butter Baste (Arrosé)',
          instruction: 'Add butter, crushed garlic, rosemary, and thyme. Tilt skillet and continuously spoon foaming herb butter over the steak for 2 minutes until internal temp reaches 130°F.',
          timer: '03:00',
          img: 'assets/ribeye.jpg',
          ingredients: [
            { name: 'Butter & Herbs', amt: '4 tbsp & fresh sprigs' },
            { name: 'Crushed Garlic', amt: '5 cloves' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Rest, Slice & Serve',
          instruction: 'Rest the steak on a warm cutting board for 7 minutes to seal juices before carving into thick tender slices. Finish with flaky salt.',
          timer: '07:00',
          img: 'assets/ribeye.jpg',
          ingredients: [
            { name: 'Flaky Maldon Salt', amt: 'To finish' }
          ]
        }
      ],
      healthScore: {
        score: 8.4,
        rating: 'High Protein',
        ratingSub: 'Keto Friendly',
        macros: {
          protein: { val: '64.5g', pct: 96 },
          carbs: { val: '1.2g', pct: 4 },
          fat: { val: '52.8g', pct: 68 },
          fiber: { val: '0.4g', pct: 8 }
        },
        nutritionTable: [
          { name: 'Calories', val: '740 kcal', pct: '(37% DV)' },
          { name: 'Total Fat', val: '52.80g', pct: '(68% DV)' },
          { name: 'Carbohydrates', val: '1.20g', pct: '(0% DV)' },
          { name: 'Protein', val: '64.50g', pct: '(96% DV)' },
          { name: 'Sodium', val: '580.00mg', pct: '(25% DV)' }
        ]
      },
      community: {
        liked: '512 liked',
        disliked: '8 disliked',
        tags: ['Keto Pure', 'High Protein', 'Steakhouse Quality', 'Cast Iron Sear', 'Chef Basted']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Temper & Season the Steaks",
          durationText: "5 mins",
          timerSeconds: 300,
          timerLabel: "Seasoning Timer",
          description: "Bring <strong>USDA Prime Ribeye</strong> to room temp. Season aggressively with coarse kosher salt and black pepper.",
          image: "assets/ribeye.jpg"
        },
        {
          stepNumber: 2,
          headline: "2. Smoking Cast-Iron Crust Sear",
          durationText: "6 mins",
          timerSeconds: 360,
          timerLabel: "High-Heat Sear Timer",
          description: "Sear in a screaming hot cast-iron skillet for 3 mins per side to develop a dark, caramelized mahogany crust.",
          image: "assets/ribeye.jpg"
        },
        {
          stepNumber: 3,
          headline: "3. French Butter Baste (Arrosé)",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Butter Basting Timer",
          description: "Add butter, garlic, rosemary, and thyme. Continuously spoon foaming butter over steak until medium-rare.",
          image: "assets/ribeye.jpg"
        },
        {
          stepNumber: 4,
          headline: "4. Rest & Carve against Grain",
          durationText: "7 mins",
          timerSeconds: 420,
          timerLabel: "Resting Timer",
          description: "Rest steak for 7 minutes on a warm board to redistribute juices before slicing.",
          image: "assets/ribeye.jpg"
        }
      ]
    },

    'dal-makhani': {
      id: 'dal-makhani',
      slug: 'dal-makhani',
      title: 'Slow-Simmered Dal Makhani',
      subtitle: 'Velvety black urad lentils, churned white butter, rich spiced cream.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      fallbackImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      category: 'INDIAN HERITAGE',
      badge: "Comfort Classic",
      prepTime: '15 min',
      cookTime: '45 min',
      totalTime: '60 minutes',
      servings: 4,
      calories: 420,
      calorieStr: '420 kcal',
      likes: '184.2k',
      intro: 'A legendary North Indian delicacy of whole black lentils and kidney beans slow-cooked with fresh tomato puree, churned butter, and fragrant kasuri methi.',
      ingredients: [
        {
          name: 'Whole Black Urad Lentils',
          qty: '200g soaked',
          amount: '200g soaked',
          base: 200,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Red Kidney Beans (Rajma)',
          qty: '50g soaked',
          amount: '50g soaked',
          base: 50,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Tomato Puree',
          qty: '1 cup ripe puree',
          amount: '1 cup ripe puree',
          base: 1,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'White Churned Butter & Cream',
          qty: '4 tbsp butter + 1/4 cup cream',
          amount: '4 tbsp butter + 1/4 cup cream',
          base: 4,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Ginger-Garlic Paste',
          qty: '2 tbsp',
          amount: '2 tbsp',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Kashmiri Chili & Kasuri Methi',
          qty: '1 tbsp each',
          amount: '1 tbsp each',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Pressure Cook Lentils',
          instruction: 'Pressure cook soaked black lentils and kidney beans with salt and ginger paste until thoroughly tender and mashable.',
          timer: '25:00',
          img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
          ingredients: [
            { name: 'Black Urad & Rajma', amt: '250g total' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Sauté Tomato Makhani Base',
          instruction: 'Melt 2 tbsp butter in a pot. Sauté ginger-garlic paste and fresh tomato puree with Kashmiri red chili powder until oil separates.',
          timer: '12:00',
          img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
          ingredients: [
            { name: 'Tomato Puree', amt: '1 cup' },
            { name: 'Butter & Spices', amt: '2 tbsp' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Slow Simmer & Mash',
          instruction: 'Add cooked lentils and water. Simmer on low flame for 20 minutes, mashing lentils against the sides of the pot to release natural starch.',
          timer: '20:00',
          img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
          ingredients: [
            { name: 'Cooked Lentils', amt: 'From Step 1' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Fold in Cream & Butter',
          instruction: 'Stir in 2 tbsp extra butter, heavy cream, and crushed kasuri methi. Serve hot with garlic naan or basmati rice.',
          timer: '03:00',
          img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
          ingredients: [
            { name: 'Heavy Cream', amt: '1/4 cup' },
            { name: 'Kasuri Methi', amt: '1 tbsp' }
          ]
        }
      ],
      healthScore: {
        score: 8.7,
        rating: 'High Fiber',
        ratingSub: 'Plant Protein',
        macros: {
          protein: { val: '22.4g', pct: 72 },
          carbs: { val: '48.6g', pct: 60 },
          fat: { val: '16.5g', pct: 36 },
          fiber: { val: '14.2g', pct: 98 }
        },
        nutritionTable: [
          { name: 'Calories', val: '420 kcal', pct: '(21% DV)' },
          { name: 'Total Fat', val: '16.50g', pct: '(21% DV)' },
          { name: 'Carbohydrates', val: '48.60g', pct: '(18% DV)' },
          { name: 'Dietary Fiber', val: '14.20g', pct: '(51% DV)' },
          { name: 'Protein', val: '22.40g', pct: '(45% DV)' },
          { name: 'Sodium', val: '460.00mg', pct: '(20% DV)' }
        ]
      },
      community: {
        liked: '342 liked',
        disliked: '5 disliked',
        tags: ['Vegetarian Gold', 'Slow Cooked', 'Comfort Food', 'High Fiber', 'Rich & Spiced']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Pressure Cook Lentils Tender",
          durationText: "25 mins",
          timerSeconds: 1500,
          timerLabel: "Lentil Cooking Timer",
          description: "Pressure cook <strong>soaked black lentils & kidney beans</strong> until ultra soft and creamy.",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"
        },
        {
          stepNumber: 2,
          headline: "2. Sauté Fragrant Makhani Gravy",
          durationText: "12 mins",
          timerSeconds: 720,
          timerLabel: "Tomato Base Simmer",
          description: "Cook pureed tomatoes with ginger-garlic paste and Kashmiri chili in foaming butter until fragrant.",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"
        },
        {
          stepNumber: 3,
          headline: "3. Slow Simmer & Gentle Mash",
          durationText: "20 mins",
          timerSeconds: 1200,
          timerLabel: "Velvet Simmer Timer",
          description: "Combine lentils with gravy and simmer on low heat, gently mashing to create rich, velvety body.",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"
        },
        {
          stepNumber: 4,
          headline: "4. Finish with Churned Cream & Butter",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Cream Finish",
          description: "Fold in heavy cream, churned butter, and crushed roasted kasuri methi. Serve hot with butter naan.",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"
        }
      ]
    },

    'butter-chicken': {
      id: 'butter-chicken',
      slug: 'butter-chicken',
      title: 'Classic Butter Chicken',
      subtitle: 'Tandoori-spiced charred chicken morsels in a velvety tomato makhani cream gravy.',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
      imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
      img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
      fallbackImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
      category: 'INDIAN CLASSIC',
      badge: "World Renowned",
      prepTime: '20 min',
      cookTime: '30 min',
      totalTime: '50 minutes',
      servings: 4,
      calories: 560,
      calorieStr: '560 kcal',
      likes: '410.2k',
      intro: 'Smoky, charred chicken thighs simmered in a silken, mildly spiced tomato sauce enriched with cashew cream, butter, and fragrant fenugreek leaves.',
      ingredients: [
        {
          name: 'Boneless Chicken Thighs',
          qty: '500g cut into cubes',
          amount: '500g cut into cubes',
          base: 500,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Greek Yogurt (for marinade)',
          qty: '1/2 cup thick yogurt',
          amount: '1/2 cup thick yogurt',
          base: 0.5,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Ripe Roma Tomatoes',
          qty: '600g pureed silky',
          amount: '600g pureed silky',
          base: 600,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Unsalted Butter',
          qty: '50g pure butter',
          amount: '50g pure butter',
          base: 50,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Heavy Cream',
          qty: '1/2 cup fresh cream',
          amount: '1/2 cup fresh cream',
          base: 0.5,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Kasuri Methi & Garam Masala',
          qty: '1 tbsp each',
          amount: '1 tbsp each',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Marinate Tandoori Chicken',
          instruction: 'Toss chicken thighs with Greek yogurt, Kashmiri chili, ginger-garlic paste, garam masala, and lemon juice. Rest for 20 minutes.',
          timer: '20:00',
          img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
          ingredients: [
            { name: 'Chicken Thighs', amt: '500g' },
            { name: 'Yogurt & Spices', amt: '1/2 cup' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Pan-Char Chicken',
          instruction: 'Sear chicken pieces in a smoking-hot skillet with ghee until dark charred spots form. Set aside.',
          timer: '08:00',
          img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
          ingredients: [
            { name: 'Marinated Chicken', amt: 'From Step 1' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Cook Silky Makhani Sauce',
          instruction: 'Simmer pureed tomatoes, cashews, cardamom, and cinnamon in butter. Blend smooth and strain back into the pot.',
          timer: '15:00',
          img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
          ingredients: [
            { name: 'Tomato Sauce', amt: '600g' },
            { name: 'Butter', amt: '50g' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Velvet Finish & Plate',
          instruction: 'Add charred chicken to the sauce. Stir in cream, butter, and crushed kasuri methi. Simmer 5 mins and serve.',
          timer: '05:00',
          img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
          ingredients: [
            { name: 'Heavy Cream', amt: '1/2 cup' },
            { name: 'Kasuri Methi', amt: '1 tbsp' }
          ]
        }
      ],
      healthScore: {
        score: 7.9,
        rating: 'High Protein',
        ratingSub: 'Gourmet Curry',
        macros: {
          protein: { val: '48.0g', pct: 90 },
          carbs: { val: '18.2g', pct: 25 },
          fat: { val: '32.0g', pct: 50 },
          fiber: { val: '3.4g', pct: 30 }
        },
        nutritionTable: [
          { name: 'Calories', val: '560 kcal', pct: '(28% DV)' },
          { name: 'Total Fat', val: '32.00g', pct: '(41% DV)' },
          { name: 'Carbohydrates', val: '18.20g', pct: '(7% DV)' },
          { name: 'Protein', val: '48.00g', pct: '(96% DV)' },
          { name: 'Sodium', val: '720.00mg', pct: '(31% DV)' }
        ]
      },
      community: {
        liked: '620 liked',
        disliked: '12 disliked',
        tags: ['Butter Chicken', 'Tandoori Smoked', 'Creamy Makhani', 'Dinner Party', 'Indian Classic']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Marinate Chicken Tandoori-Style",
          durationText: "15 mins",
          timerSeconds: 900,
          timerLabel: "Tandoori Marination Timer",
          description: "Marinate <strong>500g chicken thighs</strong> with Greek yogurt, Kashmiri red chili powder, ginger-garlic paste, garam masala, and lemon juice.",
          image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800"
        },
        {
          stepNumber: 2,
          headline: "2. Char Chicken in Skillet",
          durationText: "8 mins",
          timerSeconds: 480,
          timerLabel: "High-Heat Char Timer",
          description: "Sear marinated chicken pieces in a smoking hot pan with ghee until charred spots develop on all sides. Set aside.",
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"
        },
        {
          stepNumber: 3,
          headline: "3. Simmer Tomato Makhani Gravy",
          durationText: "12 mins",
          timerSeconds: 720,
          timerLabel: "Tomato Base Simmer",
          description: "Simmer pureed ripe tomatoes, cashews, cardamom, and cinnamon in butter until reduced and fragrant.",
          image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800"
        },
        {
          stepNumber: 4,
          headline: "4. Strain & Silk the Sauce",
          durationText: "4 mins",
          timerSeconds: 240,
          timerLabel: "Silky Strain Filter",
          description: "Blend the simmered sauce until silky smooth and pass through a fine sieve back into the hot pot.",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"
        },
        {
          stepNumber: 5,
          headline: "5. Fold in Butter, Cream & Kasuri Methi",
          durationText: "5 mins",
          timerSeconds: 300,
          timerLabel: "Velvet Finish Timer",
          description: "Add <strong>50g unsalted butter</strong>, <strong>1/2 cup heavy cream</strong>, roasted crushed <strong>kasuri methi</strong>, and a pinch of sugar. Simmer charred chicken in the sauce for 5 mins.",
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"
        },
        {
          stepNumber: 6,
          headline: "6. Garnish & Serve with Butter Naan",
          durationText: "2 mins",
          timerSeconds: 120,
          timerLabel: "Plate & Garnish",
          description: "Drizzle with a swirl of fresh cream and fresh coriander leaves. Serve smoking hot with charred garlic naan!",
          image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800"
        }
      ]
    },

    'pad-thai': {
      id: 'pad-thai',
      slug: 'pad-thai',
      title: 'Authentic Thai Pad Thai',
      subtitle: 'Bangkok street-style stir-fried rice noodles with tamarind, tiger prawns, and roasted peanuts.',
      image: 'assets/pad-thai.png',
      imageUrl: 'assets/pad-thai.png',
      img: 'assets/pad-thai.png',
      fallbackImage: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
      category: 'THAI STREET CLASSIC',
      badge: "Chef's Signature",
      prepTime: '15 min',
      cookTime: '10 min',
      totalTime: '25 minutes',
      servings: 2,
      calories: 510,
      calorieStr: '510 kcal',
      likes: '276.1k',
      intro: 'Direct from Bangkok night markets. The signature balance of sour tamarind, salty fish sauce, palm sugar sweet, and fiery crushed chili flakes tossed at high wok heat.',
      ingredients: [
        {
          name: 'Rice Stick Noodles',
          qty: '200g soaked',
          amount: '200g soaked',
          base: 200,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Wild Tiger Prawns',
          qty: '8 large peeled',
          amount: '8 large peeled',
          base: 8,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Tamarind Paste Concentrate',
          qty: '3 tbsp',
          amount: '3 tbsp',
          base: 3,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Firm Tofu & Garlic Chives',
          qty: '100g diced',
          amount: '100g diced',
          base: 100,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Crushed Toasted Peanuts',
          qty: '1/4 cup',
          amount: '1/4 cup',
          base: 0.25,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1567892328733-149f1db12e4f?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Bean Sprouts & Lime',
          qty: '1 cup & 2 wedges',
          amount: '1 cup & 2 wedges',
          base: 1,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Soak Noodles & Whisk Sauce',
          instruction: 'Soak rice stick noodles in warm water for 25 mins. Whisk tamarind concentrate, fish sauce, palm sugar, and warm water until dissolved.',
          timer: '05:00',
          img: 'assets/pad-thai.png',
          ingredients: [
            { name: 'Rice Noodles', amt: '200g' },
            { name: 'Tamarind Sauce', amt: '3 tbsp' }
          ]
        },
        {
          stepNum: 2,
          title: '2. High-Heat Wok Stir-Fry',
          instruction: 'Sear prawns in peanut oil for 90 seconds per side. Push aside, scramble eggs, and add firm tofu cubes.',
          timer: '04:00',
          img: 'assets/pad-thai.png',
          ingredients: [
            { name: 'Tiger Prawns', amt: '8 pieces' },
            { name: 'Firm Tofu', amt: '100g' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Toss Noodles & Tamarind Glaze',
          instruction: 'Toss in drained noodles and pour tamarind sauce all over. Stir-fry vigorously on high flame until noodles absorb the sauce.',
          timer: '03:00',
          img: 'assets/pad-thai.png',
          ingredients: [
            { name: 'Soaked Noodles', amt: 'From Step 1' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Garnish with Peanuts & Lime',
          instruction: 'Fold in bean sprouts and garlic chives. Plate with crushed peanuts and fresh lime wedges.',
          timer: '02:00',
          img: 'assets/pad-thai.png',
          ingredients: [
            { name: 'Crushed Peanuts', amt: '1/4 cup' },
            { name: 'Lime Wedges', amt: '2 wedges' }
          ]
        }
      ],
      healthScore: {
        score: 8.1,
        rating: 'High Protein',
        ratingSub: 'Balanced Macros',
        macros: {
          protein: { val: '32.5g', pct: 75 },
          carbs: { val: '64.0g', pct: 68 },
          fat: { val: '14.8g', pct: 33 },
          fiber: { val: '4.2g', pct: 38 }
        },
        nutritionTable: [
          { name: 'Calories', val: '510 kcal', pct: '(25% DV)' },
          { name: 'Total Fat', val: '14.80g', pct: '(19% DV)' },
          { name: 'Carbohydrates', val: '64.00g', pct: '(23% DV)' },
          { name: 'Protein', val: '32.50g', pct: '(65% DV)' },
          { name: 'Sodium', val: '890.00mg', pct: '(39% DV)' }
        ]
      },
      community: {
        liked: '388 liked',
        disliked: '9 disliked',
        tags: ['Thai Street Food', 'Wok Hei', 'Quick Stir-Fry', 'Prawns', 'Tamarind Sweet & Sour']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Soak Noodles & Blend Tamarind Glaze",
          durationText: "5 mins",
          timerSeconds: 300,
          timerLabel: "Soaking & Sauce",
          description: "Soak <strong>200g rice noodles</strong> in warm water. Whisk tamarind concentrate, fish sauce, and palm sugar until smooth.",
          image: "assets/pad-thai.png"
        },
        {
          stepNumber: 2,
          headline: "2. High Wok-Heat Prawn & Tofu Sear",
          durationText: "4 mins",
          timerSeconds: 240,
          timerLabel: "Wok Searing Timer",
          description: "Sear <strong>tiger prawns</strong> and firm tofu in peanut oil at high wok heat until pink and caramelized.",
          image: "assets/pad-thai.png"
        },
        {
          stepNumber: 3,
          headline: "3. Toss Noodles & Scramble Egg",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Noodle Toss Timer",
          description: "Add drained noodles, push to side to scramble eggs, and glaze with tamarind reduction.",
          image: "assets/pad-thai.png"
        },
        {
          stepNumber: 4,
          headline: "4. Finish with Peanuts & Lime Wedges",
          durationText: "2 mins",
          timerSeconds: 120,
          timerLabel: "Garnish & Serve",
          description: "Toss with bean sprouts, top with crushed roasted peanuts, and serve with fresh lime wedges.",
          image: "assets/pad-thai.png"
        }
      ]
    },

    'birria': {
      id: 'birria',
      slug: 'birria',
      title: 'Traditional Beef Birria Tacos',
      subtitle: 'Slow-braised beef short ribs and chuck roast in rich chili consommé with melted Oaxaca cheese.',
      image: 'assets/birria.png',
      imageUrl: 'assets/birria.png',
      img: 'assets/birria.png',
      fallbackImage: 'assets/birria.png',
      category: 'MEXICAN ARTISAN',
      badge: "Street Legend",
      prepTime: '20 min',
      cookTime: '45 min',
      totalTime: '65 minutes',
      servings: 4,
      calories: 680,
      calorieStr: '680 kcal',
      likes: '450.9k',
      intro: 'Tender shredded beef cooked low and slow in a rich adobo of guajillo, ancho, and chipotle chilies, folded into dipped corn tortillas with melty Oaxaca cheese and served with hot dipping consommé.',
      ingredients: [
        {
          name: 'Beef Chuck & Short Ribs',
          qty: '800g core base',
          amount: '800g core base',
          base: 800,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Dried Guajillo & Ancho Chilies',
          qty: '6 dried pods seeded',
          amount: '6 dried pods seeded',
          base: 6,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Artisan Corn Tortillas',
          qty: '12 tortillas',
          amount: '12 tortillas',
          base: 12,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Oaxaca / Quesadilla Cheese',
          qty: '200g shredded',
          amount: '200g shredded',
          base: 200,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Cilantro & Diced Onions',
          qty: '1 cup finely chopped',
          amount: '1 cup finely chopped',
          base: 1,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1588879462719-74d320ddca2b?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Beef Consommé Broth',
          qty: '3 cups rich broth',
          amount: '3 cups rich broth',
          base: 3,
          unit: 'cups',
          ingredientIcon: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Toast Chilies & Blend Adobo',
          instruction: 'Toast dried guajillo and ancho chilies, soak in hot water, and blend with garlic, cloves, Mexican oregano, and beef broth.',
          timer: '10:00',
          img: 'assets/birria.png',
          ingredients: [
            { name: 'Dried Chilies & Spices', amt: '6 pods' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Braise Beef until Shred-Tender',
          instruction: 'Sear beef chuck in a Dutch oven, pour blended adobo over top, and slow braise until beef falls apart effortlessly.',
          timer: '45:00',
          img: 'assets/birria.png',
          ingredients: [
            { name: 'Beef Chuck & Ribs', amt: '800g' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Dip Tortillas in Consommé Fat',
          instruction: 'Skim seasoned orange fat from top of broth. Dip corn tortillas in fat and griddle in hot pan with Oaxaca cheese and shredded beef.',
          timer: '06:00',
          img: 'assets/birria.png',
          ingredients: [
            { name: 'Corn Tortillas', amt: '12 pieces' },
            { name: 'Oaxaca Cheese', amt: '200g' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Crisp Quesatacos & Serve with Dip',
          instruction: 'Fold tortillas into crispy quesatacos. Serve piping hot alongside bowls of hot consommé with lime and cilantro.',
          timer: '04:00',
          img: 'assets/birria.png',
          ingredients: [
            { name: 'Diced Onion & Cilantro', amt: 'For garnish' }
          ]
        }
      ],
      healthScore: {
        score: 7.5,
        rating: 'High Protein',
        ratingSub: 'Comfort Street Food',
        macros: {
          protein: { val: '52.0g', pct: 92 },
          carbs: { val: '44.0g', pct: 48 },
          fat: { val: '34.0g', pct: 54 },
          fiber: { val: '5.2g', pct: 45 }
        },
        nutritionTable: [
          { name: 'Calories', val: '680 kcal', pct: '(34% DV)' },
          { name: 'Total Fat', val: '34.00g', pct: '(44% DV)' },
          { name: 'Carbohydrates', val: '44.00g', pct: '(16% DV)' },
          { name: 'Protein', val: '52.00g', pct: '(104% DV)' },
          { name: 'Sodium', val: '860.00mg', pct: '(37% DV)' }
        ]
      },
      community: {
        liked: '580 liked',
        disliked: '7 disliked',
        tags: ['Birria Quesatacos', 'Consomme Dip', 'Slow Braised', 'Oaxaca Melt', 'Authentic Mexican']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Toast Chilies & Blend Red Adobo",
          durationText: "10 mins",
          timerSeconds: 600,
          timerLabel: "Adobo Prep Timer",
          description: "Toast <strong>guajillo and ancho chilies</strong>, rehydrate in hot water, and blend with garlic and beef broth.",
          image: "assets/birria.png"
        },
        {
          stepNumber: 2,
          headline: "2. Slow Braise Beef in Rich Broth",
          durationText: "40 mins",
          timerSeconds: 2400,
          timerLabel: "Slow Braise Timer",
          description: "Braise <strong>beef chuck and short ribs</strong> in the chili adobo until meltingly tender and shreddable.",
          image: "assets/birria.png"
        },
        {
          stepNumber: 3,
          headline: "3. Dip Tortillas in Consommé Fat",
          durationText: "5 mins",
          timerSeconds: 300,
          timerLabel: "Griddle Taco Timer",
          description: "Dip corn tortillas into spiced chili oil, place on hot griddle, and load with cheese and shredded beef.",
          image: "assets/birria.png"
        },
        {
          stepNumber: 4,
          headline: "4. Crisp Quesatacos & Serve with Dip",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Plate & Serve",
          description: "Fold into crispy quesatacos. Serve smoking hot with bowls of hot dipping consommé and fresh lime.",
          image: "assets/birria.png"
        }
      ]
    },

    'bourguignon': {
      id: 'bourguignon',
      slug: 'bourguignon',
      title: 'French Beef Bourguignon',
      subtitle: 'Tender beef chuck slow-braised in red Burgundy wine with pearl onions and cremini mushrooms.',
      image: 'assets/bourguignon.png',
      imageUrl: 'assets/bourguignon.png',
      img: 'assets/bourguignon.png',
      fallbackImage: 'assets/bourguignon.png',
      category: 'FRENCH BISTRO',
      badge: "Heritage Masterpiece",
      prepTime: '20 min',
      cookTime: '50 min',
      totalTime: '70 minutes',
      servings: 4,
      calories: 590,
      calorieStr: '590 kcal',
      likes: '298.5k',
      intro: 'The crowning jewel of French country cooking. Thick cubes of marbled beef browned in bacon lardons, simmered gently in full-bodied red Burgundy wine, aromatic mirepoix, and herb bouquets.',
      ingredients: [
        {
          name: 'Marbled Beef Chuck Roast',
          qty: '800g cubed',
          amount: '800g cubed',
          base: 800,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'French Red Burgundy Wine',
          qty: '2 cups dry red wine',
          amount: '2 cups dry red wine',
          base: 2,
          unit: 'cups',
          ingredientIcon: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Smoked Bacon Lardons',
          qty: '150g thick diced',
          amount: '150g thick diced',
          base: 150,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Cremini Mushrooms & Pearl Onions',
          qty: '250g mushrooms + 12 onions',
          amount: '250g mushrooms + 12 onions',
          base: 250,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Beef Stock & Tomato Paste',
          qty: '2 cups broth + 2 tbsp paste',
          amount: '2 cups broth + 2 tbsp paste',
          base: 2,
          unit: 'cups',
          ingredientIcon: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Bouquet Garni (Thyme & Bay)',
          qty: '1 bundle',
          amount: '1 bundle',
          base: 1,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Brown Lardons & Beef Chuck',
          instruction: 'Crisp bacon lardons in a heavy Dutch oven, then brown beef cubes in hot bacon fat in small batches for deep flavor.',
          timer: '15:00',
          img: 'assets/bourguignon.png',
          ingredients: [
            { name: 'Beef Chuck & Lardons', amt: '950g total' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Deglaze with Red Burgundy Wine',
          instruction: 'Add carrots, onions, and tomato paste. Pour in red Burgundy wine and beef broth, scraping all caramelized browned bits.',
          timer: '10:00',
          img: 'assets/bourguignon.png',
          ingredients: [
            { name: 'Red Burgundy Wine', amt: '2 cups' },
            { name: 'Beef Stock', amt: '2 cups' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Slow Simmer Herb Braise',
          instruction: 'Tuck bouquet garni into the pot, cover tightly, and simmer on gentle low heat for 45 minutes until fork-tender.',
          timer: '45:00',
          img: 'assets/bourguignon.png',
          ingredients: [
            { name: 'Bouquet Garni', amt: '1 herb bundle' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Sauté Mushrooms & Plate',
          instruction: 'Sauté pearl onions and mushrooms in butter until golden, fold into the stew, and serve with mashed potatoes.',
          timer: '08:00',
          img: 'assets/bourguignon.png',
          ingredients: [
            { name: 'Cremini Mushrooms & Onions', amt: '250g' }
          ]
        }
      ],
      healthScore: {
        score: 8.3,
        rating: 'High Protein',
        ratingSub: 'French Classic',
        macros: {
          protein: { val: '56.2g', pct: 95 },
          carbs: { val: '18.4g', pct: 26 },
          fat: { val: '28.5g', pct: 44 },
          fiber: { val: '3.8g', pct: 32 }
        },
        nutritionTable: [
          { name: 'Calories', val: '590 kcal', pct: '(29% DV)' },
          { name: 'Total Fat', val: '28.50g', pct: '(36% DV)' },
          { name: 'Carbohydrates', val: '18.40g', pct: '(7% DV)' },
          { name: 'Protein', val: '56.20g', pct: '(112% DV)' },
          { name: 'Sodium', val: '640.00mg', pct: '(28% DV)' }
        ]
      },
      community: {
        liked: '412 liked',
        disliked: '6 disliked',
        tags: ['French Bistro', 'Red Wine Braise', 'Tender Beef', 'Comfort Food', 'Dinner Party']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Brown Bacon Lardons & Beef Chuck",
          durationText: "15 mins",
          timerSeconds: 900,
          timerLabel: "Browning Timer",
          description: "Render <strong>smoked bacon lardons</strong> and sear beef cubes in batches until deeply browned.",
          image: "assets/bourguignon.png"
        },
        {
          stepNumber: 2,
          headline: "2. Deglaze with Red Wine & Aromatics",
          durationText: "10 mins",
          timerSeconds: 600,
          timerLabel: "Deglazing Timer",
          description: "Stir in tomato paste and mirepoix, pouring in <strong>French Red Burgundy wine</strong> and rich beef stock.",
          image: "assets/bourguignon.png"
        },
        {
          stepNumber: 3,
          headline: "3. Slow Wine Braise with Herbs",
          durationText: "40 mins",
          timerSeconds: 2400,
          timerLabel: "Slow Braise Timer",
          description: "Cover and braise on low heat with <strong>thyme, rosemary, and bay leaves</strong> until beef is meltingly tender.",
          image: "assets/bourguignon.png"
        },
        {
          stepNumber: 4,
          headline: "4. Fold in Glazed Mushrooms & Onions",
          durationText: "8 mins",
          timerSeconds: 480,
          timerLabel: "Garnish Finish",
          description: "Sauté <strong>pearl onions and cremini mushrooms</strong> in butter until golden, fold into the stew, and serve.",
          image: "assets/bourguignon.png"
        }
      ]
    },

    'sushi': {
      id: 'sushi',
      slug: 'sushi',
      title: 'Tokyo Master Salmon Sushi',
      subtitle: 'Sashimi-grade salmon nigiri and spicy tuna maki with seasoned Koshihikari sushi rice.',
      image: 'assets/sushi.png',
      imageUrl: 'assets/sushi.png',
      img: 'assets/sushi.png',
      fallbackImage: 'assets/sushi.png',
      category: 'JAPANESE MASTERY',
      badge: "Artisan Raw",
      prepTime: '20 min',
      cookTime: '15 min',
      totalTime: '35 minutes',
      servings: 2,
      calories: 410,
      calorieStr: '410 kcal',
      likes: '340.5k',
      intro: 'Authentic Tokyo Edomae technique. Seasoned Koshihikari rice paired with hand-sliced sashimi-grade Atlantic salmon, freshly grated wasabi, and toasted nori.',
      ingredients: [
        {
          name: 'Sashimi-Grade Atlantic Salmon',
          qty: '300g chilled fillet',
          amount: '300g chilled fillet',
          base: 300,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Japanese Koshihikari Sushi Rice',
          qty: '2 cups cooked & seasoned',
          amount: '2 cups cooked & seasoned',
          base: 2,
          unit: 'cups',
          ingredientIcon: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Rice Vinegar & Mirin Seasoning',
          qty: '3 tbsp seasoned vinegar',
          amount: '3 tbsp seasoned vinegar',
          base: 3,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1589135233689-d562f4e3c3b0?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Toasted Nori Seaweed Sheets',
          qty: '4 sheets',
          amount: '4 sheets',
          base: 4,
          unit: 'sheets',
          ingredientIcon: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Grated Wasabi & Pickled Ginger',
          qty: '2 tbsp each',
          amount: '2 tbsp each',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Season Koshihikari Sushi Rice',
          instruction: 'Fan freshly steamed Koshihikari rice while gently folding in seasoned rice vinegar, sugar, and sea salt with a wooden hangiri paddle.',
          timer: '10:00',
          img: 'assets/sushi.png',
          ingredients: [
            { name: 'Koshihikari Rice', amt: '2 cups' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Precision Slice Salmon Sashimi',
          instruction: 'Using a sharp Yanagiba knife at a 45-degree angle, slice chilled salmon fillet against the grain into 1/4-inch nigiri cuts.',
          timer: '08:00',
          img: 'assets/sushi.png',
          ingredients: [
            { name: 'Atlantic Salmon', amt: '300g' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Hand-Form Nigiri & Roll Maki',
          instruction: 'Shape small oval rice mounds (shari), dab a trace of wasabi, and drape salmon sashimi smoothly over the top.',
          timer: '12:00',
          img: 'assets/sushi.png',
          ingredients: [
            { name: 'Wasabi & Rice', amt: 'As needed' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Plate with Pickled Ginger & Soy',
          instruction: 'Arrange nigiri and maki rolls on a slate board. Serve with aged tamari soy sauce, pickled gari ginger, and wasabi.',
          timer: '03:00',
          img: 'assets/sushi.png',
          ingredients: [
            { name: 'Pickled Ginger & Soy', amt: 'For serving' }
          ]
        }
      ],
      healthScore: {
        score: 9.4,
        rating: 'Omega-3 Rich',
        ratingSub: 'Clean Eating',
        macros: {
          protein: { val: '34.0g', pct: 82 },
          carbs: { val: '48.0g', pct: 52 },
          fat: { val: '9.2g', pct: 20 },
          fiber: { val: '2.4g', pct: 22 }
        },
        nutritionTable: [
          { name: 'Calories', val: '410 kcal', pct: '(20% DV)' },
          { name: 'Total Fat', val: '9.20g', pct: '(12% DV)' },
          { name: 'Carbohydrates', val: '48.00g', pct: '(17% DV)' },
          { name: 'Protein', val: '34.00g', pct: '(68% DV)' },
          { name: 'Omega-3 Fatty Acids', val: '2.80g', pct: '(175% DV)' },
          { name: 'Sodium', val: '480.00mg', pct: '(21% DV)' }
        ]
      },
      community: {
        liked: '460 liked',
        disliked: '4 disliked',
        tags: ['Sushi Mastery', 'Omega 3', 'Fresh Salmon', 'Japanese Artisanal', 'Clean Eating']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Cook & Season Koshihikari Rice",
          durationText: "10 mins",
          timerSeconds: 600,
          timerLabel: "Rice Seasoning Timer",
          description: "Cook <strong>Koshihikari rice</strong> and fold in seasoned rice vinegar and sea salt with a wooden paddle.",
          image: "assets/sushi.png"
        },
        {
          stepNumber: 2,
          headline: "2. Precision Slice Salmon Sashimi",
          durationText: "8 mins",
          timerSeconds: 480,
          timerLabel: "Knife Technique Timer",
          description: "Slice chilled <strong>sashimi-grade salmon</strong> at a 45-degree angle against the grain.",
          image: "assets/sushi.png"
        },
        {
          stepNumber: 3,
          headline: "3. Hand-Form Nigiri Pieces",
          durationText: "10 mins",
          timerSeconds: 600,
          timerLabel: "Hand Crafting Timer",
          description: "Form small oval shari rice mounds, dab a touch of wasabi, and drape salmon sashimi smoothly over.",
          image: "assets/sushi.png"
        },
        {
          stepNumber: 4,
          headline: "4. Arrange & Serve with Tamari Soy",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Plating Timer",
          description: "Arrange cleanly on a slate board with pickled gari ginger and aged tamari soy sauce.",
          image: "assets/sushi.png"
        }
      ]
    },

    'ceviche': {
      id: 'ceviche',
      slug: 'ceviche',
      title: 'Classic Peruvian Ceviche',
      subtitle: 'Fresh cubed white fish cured in sharp lime juice, tossed with red onions, aji limo, and cilantro.',
      image: 'assets/ceviche.png',
      imageUrl: 'assets/ceviche.png',
      img: 'assets/ceviche.png',
      fallbackImage: 'assets/ceviche.png',
      category: 'LATIN SEAFOOD',
      badge: "Fresh & Cold",
      prepTime: '15 min',
      cookTime: '0 min',
      totalTime: '15 minutes',
      servings: 2,
      calories: 220,
      calorieStr: '220 kcal',
      likes: '215.8k',
      intro: 'The national pride of Peru. Ultra-fresh sea bass cubes quickly cured in fresh lime juice (Leche de Tigre), tossed with crisp red onions, fiery aji limo pepper, choclo corn, and sweet potato.',
      ingredients: [
        {
          name: 'Fresh Sea Bass or Corvina Fillet',
          qty: '400g cubed',
          amount: '400g cubed',
          base: 400,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1534940381023-74d39f4d7f76?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Key Limes',
          qty: '8-10 freshly squeezed',
          amount: '8-10 freshly squeezed',
          base: 8,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Red Onion',
          qty: '1 medium thinly sliced',
          amount: '1 medium thinly sliced',
          base: 1,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Aji Limo Chili & Cilantro',
          qty: '1 chili finely minced + 1/4 cup cilantro',
          amount: '1 chili finely minced + 1/4 cup cilantro',
          base: 1,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Boiled Sweet Potato & Choclo Corn',
          qty: '1 sweet potato + 1/2 cup corn',
          amount: '1 sweet potato + 1/2 cup corn',
          base: 1,
          unit: 'pieces',
          ingredientIcon: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Slice & Chill Fresh Fish',
          instruction: 'Cut cold fresh sea bass into clean 3/4-inch cubes. Place in a chilled glass bowl over ice.',
          timer: '05:00',
          img: 'assets/ceviche.png',
          ingredients: [
            { name: 'Fresh Sea Bass', amt: '400g' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Squeeze Fresh Lime (Leche de Tigre)',
          instruction: 'Gently squeeze fresh limes over fish without over-squeezing the bitter rind. Add sea salt and minced aji limo.',
          timer: '03:00',
          img: 'assets/ceviche.png',
          ingredients: [
            { name: 'Fresh Limes & Chili', amt: '8 limes & 1 aji limo' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Toss with Crisp Red Onions',
          instruction: 'Toss in soaked red onion julienne and freshly chopped cilantro. Let cure for exactly 3 minutes until exterior turns opaque white.',
          timer: '03:00',
          img: 'assets/ceviche.png',
          ingredients: [
            { name: 'Red Onion & Cilantro', amt: '1 onion & cilantro' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Plate with Sweet Potato & Choclo',
          instruction: 'Spoon ceviche onto chilled shallow bowls with plenty of Leche de Tigre broth. Serve alongside sweet potato rounds and crunchy corn.',
          timer: '02:00',
          img: 'assets/ceviche.png',
          ingredients: [
            { name: 'Sweet Potato & Choclo', amt: 'For serving' }
          ]
        }
      ],
      healthScore: {
        score: 9.6,
        rating: 'Super Clean',
        ratingSub: 'Keto Low Carb',
        macros: {
          protein: { val: '38.0g', pct: 88 },
          carbs: { val: '12.0g', pct: 15 },
          fat: { val: '3.2g', pct: 8 },
          fiber: { val: '2.0g', pct: 18 }
        },
        nutritionTable: [
          { name: 'Calories', val: '220 kcal', pct: '(11% DV)' },
          { name: 'Total Fat', val: '3.20g', pct: '(4% DV)' },
          { name: 'Carbohydrates', val: '12.00g', pct: '(4% DV)' },
          { name: 'Protein', val: '38.00g', pct: '(76% DV)' },
          { name: 'Sodium', val: '320.00mg', pct: '(14% DV)' }
        ]
      },
      community: {
        liked: '310 liked',
        disliked: '3 disliked',
        tags: ['Peruvian Ceviche', 'Leche de Tigre', 'Ultra Fresh', 'Keto', 'No Cook']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Cube Chilled Sea Bass Fillets",
          durationText: "5 mins",
          timerSeconds: 300,
          timerLabel: "Prep Fish Timer",
          description: "Cut fresh <strong>sea bass or corvina</strong> into clean 3/4-inch cubes and keep chilled over ice.",
          image: "assets/ceviche.png"
        },
        {
          stepNumber: 2,
          headline: "2. Flash-Cure in Lime & Aji Limo",
          durationText: "4 mins",
          timerSeconds: 240,
          timerLabel: "Curing Timer",
          description: "Squeeze <strong>fresh key limes</strong> over fish with minced aji limo pepper and sea salt to create Leche de Tigre.",
          image: "assets/ceviche.png"
        },
        {
          stepNumber: 3,
          headline: "3. Toss Crisp Red Onions & Cilantro",
          durationText: "3 mins",
          timerSeconds: 180,
          timerLabel: "Toss & Infuse",
          description: "Toss in washed red onion slices and cilantro leaves for 2 minutes until fish turns delicately opaque.",
          image: "assets/ceviche.png"
        },
        {
          stepNumber: 4,
          headline: "4. Serve with Sweet Potato & Choclo",
          durationText: "2 mins",
          timerSeconds: 120,
          timerLabel: "Plating",
          description: "Plate with boiled glazed sweet potato slices and giant Andean choclo corn kernels.",
          image: "assets/ceviche.png"
        }
      ]
    },

    'biryani': {
      id: 'biryani',
      slug: 'biryani',
      title: 'Royal Indian Chicken Biryani',
      subtitle: 'Aromatic long-grain basmati rice layered with spiced marinated chicken, saffron, and fried onions.',
      image: 'assets/biryani.png',
      imageUrl: 'assets/biryani.png',
      img: 'assets/biryani.png',
      fallbackImage: 'assets/biryani.png',
      category: 'INDIAN ROYALTY',
      badge: "For Dinner",
      prepTime: '25 min',
      cookTime: '35 min',
      totalTime: '60 minutes',
      servings: 6,
      calories: 640,
      calorieStr: '640 kcal',
      likes: '388.4k',
      intro: 'Dum-cooked royal Mughal biryani. Layers of fragrant aged basmati rice infused with saffron milk, ghee, caramelized onions (birista), fresh mint, and succulent marinated chicken.',
      ingredients: [
        {
          name: 'Bone-In Chicken Thighs & Drumsticks',
          qty: '800g marinated',
          amount: '800g marinated',
          base: 800,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Aged Long-Grain Basmati Rice',
          qty: '500g half-boiled',
          amount: '500g half-boiled',
          base: 500,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Crispy Fried Onions (Birista)',
          qty: '1 cup golden fried',
          amount: '1 cup golden fried',
          base: 1,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Pure Desi Ghee & Saffron Milk',
          qty: '4 tbsp ghee + 1/4 cup saffron milk',
          amount: '4 tbsp ghee + 1/4 cup saffron milk',
          base: 4,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Mint & Cilantro Leaves',
          qty: '1 cup chopped',
          amount: '1 cup chopped',
          base: 1,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1588879462719-74d320ddca2b?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Whole Spices (Cardamom, Star Anise)',
          qty: '1 tbsp mixed',
          amount: '1 tbsp mixed',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Marinate Chicken in Spiced Yogurt',
          instruction: 'Marinate chicken with thick yogurt, ginger-garlic paste, red chili, garam masala, mint, and fried onions for 30 minutes.',
          timer: '20:00',
          img: 'assets/biryani.png',
          ingredients: [
            { name: 'Chicken & Yogurt', amt: '800g' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Parboil Basmati Rice with Whole Spices',
          instruction: 'Boil basmati rice with whole cardamom, cinnamon, cloves, and bay leaf until 70% cooked (grain breaks into 3 pieces).',
          timer: '10:00',
          img: 'assets/biryani.png',
          ingredients: [
            { name: 'Basmati Rice & Whole Spices', amt: '500g' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Layer Chicken, Rice & Saffron Dum',
          instruction: 'In a heavy pot, layer marinated chicken, topped with parboiled rice, fried onions, mint, melted ghee, and saffron milk.',
          timer: '08:00',
          img: 'assets/biryani.png',
          ingredients: [
            { name: 'Ghee & Saffron Milk', amt: '4 tbsp' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Seal Dum Steam & Fluff',
          instruction: 'Seal lid with dough or foil. Cook on high for 5 mins, then low for 25 mins. Rest 10 mins before gently fluffing rice.',
          timer: '25:00',
          img: 'assets/biryani.png',
          ingredients: [
            { name: 'Fresh Mint & Fried Onions', amt: 'Garnish' }
          ]
        }
      ],
      healthScore: {
        score: 7.8,
        rating: 'High Protein',
        ratingSub: 'Royal Feast',
        macros: {
          protein: { val: '46.0g', pct: 88 },
          carbs: { val: '72.0g', pct: 75 },
          fat: { val: '22.0g', pct: 35 },
          fiber: { val: '4.8g', pct: 36 }
        },
        nutritionTable: [
          { name: 'Calories', val: '640 kcal', pct: '(32% DV)' },
          { name: 'Total Fat', val: '22.00g', pct: '(28% DV)' },
          { name: 'Carbohydrates', val: '72.00g', pct: '(26% DV)' },
          { name: 'Protein', val: '46.00g', pct: '(92% DV)' },
          { name: 'Sodium', val: '680.00mg', pct: '(30% DV)' }
        ]
      },
      community: {
        liked: '540 liked',
        disliked: '8 disliked',
        tags: ['Hyderabadi Dum', 'Saffron Rice', 'Biryani Royalty', 'Weekend Feast', 'Authentic Spices']
      },
      steps: [
        {
          stepNumber: 1,
          headline: "1. Marinate Spiced Royal Chicken",
          durationText: "20 mins",
          timerSeconds: 1200,
          timerLabel: "Marination Timer",
          description: "Marinate <strong>800g bone-in chicken</strong> with thick yogurt, birista fried onions, mint, and whole aromatic spices.",
          image: "assets/biryani.png"
        },
        {
          stepNumber: 2,
          headline: "2. Parboil Aromatic Basmati Rice",
          durationText: "8 mins",
          timerSeconds: 480,
          timerLabel: "Rice Parboil Timer",
          description: "Boil <strong>aged long-grain basmati</strong> in fragrant spiced water until 70% cooked (firm bite).",
          image: "assets/biryani.png"
        },
        {
          stepNumber: 3,
          headline: "3. Layer Rice, Chicken & Saffron Milk",
          durationText: "7 mins",
          timerSeconds: 420,
          timerLabel: "Layering Prep",
          description: "Layer marinated chicken and rice in heavy pot, drizzling with <strong>desi ghee and warm saffron milk</strong>.",
          image: "assets/biryani.png"
        },
        {
          stepNumber: 4,
          headline: "4. Slow Dum Steam & Fluff",
          durationText: "25 mins",
          timerSeconds: 1500,
          timerLabel: "Dum Cooking Timer",
          description: "Seal pot tightly and slow cook on gentle dum heat for 25 minutes. Fluff carefully with a flat spoon.",
          image: "assets/biryani.png"
        }
      ]
    },

    'pizza-authentic': {
      id: 'pizza-authentic',
      slug: 'pizza-authentic',
      title: 'Authentic Pizza',
      subtitle: 'Woodfired Neapolitan crust with San Marzano tomatoes, fresh buffalo mozzarella, and sweet basil.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      category: 'ITALIAN ARTISAN',
      badge: "Chef's Classic",
      prepTime: '15 min',
      cookTime: '20 min',
      totalTime: '35 minutes',
      servings: 4,
      calories: 520,
      calorieStr: '520 kcal',
      likes: '389.2k',
      intro: 'The authentic standard of artisan pizza napoletana. Fermented Caputo 00 dough blistered at 900°F with sweet San Marzano tomato coulis, creamy buffalo mozzarella, and aromatic sweet Genovese basil.',
      ingredients: [
        {
          name: 'Tipo 00 Pizza Flour',
          qty: '500g fine ground',
          amount: '500g fine ground',
          base: 500,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'San Marzano DOP Tomatoes',
          qty: '400g hand crushed',
          amount: '400g hand crushed',
          base: 400,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Buffalo Mozzarella DOP',
          qty: '250g torn fresh',
          amount: '250g torn fresh',
          base: 250,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Fresh Sweet Basil Leaves',
          qty: '12 fresh whole leaves',
          amount: '12 fresh whole leaves',
          base: 12,
          unit: 'leaves',
          ingredientIcon: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Extra Virgin Olive Oil',
          qty: '2 tbsp cold pressed',
          amount: '2 tbsp cold pressed',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Flaky Sea Salt & Yeast',
          qty: '1 tsp each',
          amount: '1 tsp each',
          base: 1,
          unit: 'tsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Ferment & Stretch Dough',
          instruction: 'Mix Tipo 00 flour with yeast and water. Allow 24-hour slow cold fermentation. Stretch by hand from center outward, preserving the airy cornicione crust rim.',
          timer: '15:00',
          img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'Tipo 00 Flour', amt: '500g' },
            { name: 'Active Yeast', amt: '1 tsp' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Sauce & Top with Mozzarella',
          instruction: 'Spoon hand-crushed San Marzano tomatoes over center. Distribute torn fresh buffalo mozzarella evenly and drizzle with extra virgin olive oil.',
          timer: '05:00',
          img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'San Marzano Tomatoes', amt: '400g' },
            { name: 'Buffalo Mozzarella', amt: '250g' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Woodfired High-Heat Bake',
          instruction: 'Slide onto a preheated baking steel or pizza stone at 500°F (or woodfired oven) for 6-8 minutes until crust blisters with leopard spotting.',
          timer: '08:00',
          img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'Olive Oil Drizzle', amt: '1 tbsp' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Garnish with Sweet Basil & Slice',
          instruction: 'Scatter fresh sweet basil leaves over the bubbling cheese immediately upon removal. Slice into crisp triangles and serve steaming.',
          timer: '02:00',
          img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'Sweet Basil Leaves', amt: '12 leaves' },
            { name: 'Flaky Maldon Salt', amt: 'To finish' }
          ]
        }
      ],
      healthScore: {
        score: 7.9,
        rating: 'Balanced',
        ratingSub: 'Artisan Neapolitan',
        macros: {
          protein: { val: '24.0g', pct: 55 },
          carbs: { val: '68.0g', pct: 70 },
          fat: { val: '16.5g', pct: 32 },
          fiber: { val: '4.5g', pct: 40 }
        },
        nutritionTable: [
          { name: 'Calories', val: '520 kcal', pct: '(26% DV)' },
          { name: 'Total Fat', val: '16.50g', pct: '(21% DV)' },
          { name: 'Carbohydrates', val: '68.00g', pct: '(25% DV)' },
          { name: 'Protein', val: '24.00g', pct: '(48% DV)' },
          { name: 'Sodium', val: '620.00mg', pct: '(27% DV)' }
        ]
      },
      community: {
        liked: '412 liked',
        disliked: '7 disliked',
        tags: ['Woodfired Pizza', 'Italian Heritage', 'San Marzano', 'Crispy Crust', 'Neapolitan Masterclass']
      },
      steps: [
        {
          stepNumber: 1,
          headline: '1. Hand-Stretch the Fermented Dough',
          durationText: '15 mins',
          timerSeconds: 900,
          timerLabel: 'Dough Stretch Timer',
          description: 'Stretch <strong>Caputo 00 dough</strong> into a 12-inch disc, pushing air towards the raised outer cornicione rim.',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
        },
        {
          stepNumber: 2,
          headline: '2. Layer Tomato Coulis & Buffalo Mozzarella',
          durationText: '5 mins',
          timerSeconds: 300,
          timerLabel: 'Topping Timer',
          description: 'Ladle <strong>San Marzano tomato coulis</strong> in spiral motions. Top with torn <strong>buffalo mozzarella</strong>.',
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80'
        },
        {
          stepNumber: 3,
          headline: '3. Blistering Hot High-Heat Bake',
          durationText: '8 mins',
          timerSeconds: 480,
          timerLabel: 'Baking Timer',
          description: 'Bake at maximum heat on a preheated pizza stone until bubbly cheese and leopard-spotted char appears.',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
        },
        {
          stepNumber: 4,
          headline: '4. Crown with Fresh Basil & Serve',
          durationText: '2 mins',
          timerSeconds: 120,
          timerLabel: 'Plating Timer',
          description: 'Garnish with fragrant <strong>sweet basil leaves</strong> and a swirl of extra virgin olive oil.',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'pizza-skillet': {
      id: 'pizza-skillet',
      slug: 'pizza-skillet',
      title: 'Quick Pan-Seared Pizza',
      subtitle: 'Crispy cast-iron skillet pizza with charred bottom, molten mozzarella, and fresh herbs in under 15 minutes.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
      img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
      category: 'SKILLET ARTISAN',
      badge: '15-Min Skillet',
      prepTime: '5 min',
      cookTime: '10 min',
      totalTime: '15 minutes',
      servings: 2,
      calories: 440,
      calorieStr: '440 kcal',
      likes: '214.5k',
      intro: 'A lightning-fast pan-seared skillet pizza technique. High-conductivity cast iron delivers a shatteringly crisp bottom crust with gooey melted mozzarella in under 15 minutes.',
      ingredients: [
        {
          name: 'Artisan Dough / Flatbread',
          qty: '250g dough base',
          amount: '250g dough base',
          base: 250,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Crushed San Marzano Sauce',
          qty: '1/2 cup herb tomato sauce',
          amount: '1/2 cup herb tomato sauce',
          base: 0.5,
          unit: 'cup',
          ingredientIcon: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Low-Moisture Whole Mozzarella',
          qty: '180g shredded',
          amount: '180g shredded',
          base: 180,
          unit: 'g',
          ingredientIcon: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Pecorino Romano & Oregano',
          qty: '2 tbsp grated + 1 tsp herb',
          amount: '2 tbsp grated + 1 tsp herb',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Extra Virgin Olive Oil',
          qty: '1.5 tbsp in skillet',
          amount: '1.5 tbsp in skillet',
          base: 1.5,
          unit: 'tbsp',
          ingredientIcon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: '1. Sear Crust in Smoking Skillet',
          instruction: 'Heat olive oil in a heavy 10-inch cast iron skillet over medium-high heat. Press dough flat and sear for 3 minutes until bottom is deeply golden and crispy.',
          timer: '05:00',
          img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'Pizza Dough Base', amt: '250g' },
            { name: 'Olive Oil', amt: '1.5 tbsp' }
          ]
        },
        {
          stepNum: 2,
          title: '2. Top with Sauce, Cheese & Herbs',
          instruction: 'Flip dough or keep searing side down. Quickly spread tomato sauce, shredded mozzarella, grated Pecorino, and dried oregano across the top.',
          timer: '02:00',
          img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'Crushed Tomato Sauce', amt: '1/2 cup' },
            { name: 'Mozzarella & Pecorino', amt: '180g + 2 tbsp' }
          ]
        },
        {
          stepNum: 3,
          title: '3. Broil or Lid-Cover to Melt',
          instruction: 'Cover with a metal lid for 4 minutes or place skillet under high broiler until cheese is bubbling with golden brown spots.',
          timer: '05:00',
          img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'Dried Oregano & Chili', amt: '1 tsp' }
          ]
        },
        {
          stepNum: 4,
          title: '4. Slide onto Board & Slice',
          instruction: 'Slide the pizza onto a wooden carving board. Rest for 1 minute before slicing into crispy quarters.',
          timer: '02:00',
          img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
          ingredients: [
            { name: 'Fresh Basil / Pepper', amt: 'To garnish' }
          ]
        }
      ],
      healthScore: {
        score: 7.5,
        rating: 'Medium',
        ratingSub: 'Fast Comfort',
        macros: {
          protein: { val: '22.0g', pct: 52 },
          carbs: { val: '54.0g', pct: 58 },
          fat: { val: '14.0g', pct: 28 },
          fiber: { val: '3.8g', pct: 34 }
        },
        nutritionTable: [
          { name: 'Calories', val: '440 kcal', pct: '(22% DV)' },
          { name: 'Total Fat', val: '14.00g', pct: '(18% DV)' },
          { name: 'Carbohydrates', val: '54.00g', pct: '(20% DV)' },
          { name: 'Protein', val: '22.00g', pct: '(44% DV)' },
          { name: 'Sodium', val: '580.00mg', pct: '(25% DV)' }
        ]
      },
      community: {
        liked: '298 liked',
        disliked: '5 disliked',
        tags: ['Cast Iron Skillet', 'Fast 15 Mins', 'Crisp Base', 'Weeknight Dinner', 'Cheese Melt']
      },
      steps: [
        {
          stepNumber: 1,
          headline: '1. Cast-Iron High-Heat Sear',
          durationText: '5 mins',
          timerSeconds: 300,
          timerLabel: 'Skillet Sear Timer',
          description: 'Heat olive oil in cast iron skillet. Press dough in and sear bottom until crispy and golden brown.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
        },
        {
          stepNumber: 2,
          headline: '2. Sauce, Cheese & Herb Layer',
          durationText: '2 mins',
          timerSeconds: 120,
          timerLabel: 'Layering Timer',
          description: 'Evenly spread seasoned tomato sauce, shredded mozzarella, and grated Pecorino.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
        },
        {
          stepNumber: 3,
          headline: '3. Melt & Bubble under Broiler',
          durationText: '5 mins',
          timerSeconds: 300,
          timerLabel: 'Broil Melt Timer',
          description: 'Cover or broil for 4-5 minutes until cheese melts and bubbles with golden crust edges.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
        },
        {
          stepNumber: 4,
          headline: '4. Rest, Slice & Serve Crispy',
          durationText: '2 mins',
          timerSeconds: 120,
          timerLabel: 'Slice Timer',
          description: 'Transfer to cutting board, rest 60 seconds, and slice into crispy triangular wedges.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
        }
      ]
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. THEMEALDB LIVE API DATA PIPELINE & 7-STAR VISUAL ASSET ENGINE
  // ═══════════════════════════════════════════════════════════════════════════
  const THEMEALDB_LOOKUP_URL = 'https://wowfoodrecipes.com/api/json/v1/1/lookup.php?i=';
  const THEMEALDB_SEARCH_URL = 'https://wowfoodrecipes.com/api/json/v1/1/search.php?s=';
  const THEMEALDB_ING_IMG_URL = 'https://wowfoodrecipes.com/images/ingredients/';

  // High-Resolution Local FHD Fallback Asset Map
  const LOCAL_FHD_ASSETS = {
    'pizza-authentic': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    'authentic-pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    'pizza-classic': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    'pizza-napoletana': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    '53014': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    'pizza-skillet': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
    'quick-pan-seared-pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
    'pan-seared-pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
    'pizza-chicago': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
    'chicago-pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
    'pizza-new-york': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
    'new-york-pizza': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
    'pizza-keto': 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
    'high-protein-pizza': 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
    'pizza-gourmet': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
    'gourmet-pizza': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
    'spaghetti-carbonara': 'assets/carbonara.png',
    'carbonara': 'assets/carbonara.png',
    '52982': 'assets/carbonara.png',
    'sesame-chicken': 'assets/sesame-chicken.png',
    'teriyaki-chicken': 'assets/sesame-chicken.png',
    '52772': 'assets/sesame-chicken.png',
    'ribeye': 'assets/ribeye.jpg',
    'steak': 'assets/ribeye.jpg',
    '52878': 'assets/ribeye.jpg',
    '52881': 'assets/ribeye.jpg',
    'biryani': 'assets/biryani.png',
    '53088': 'assets/biryani.png',
    'sushi': 'assets/sushi.png',
    'salmon': 'assets/sushi.png',
    '52819': 'assets/sushi.png',
    'ceviche': 'assets/ceviche.png',
    'pad-thai': 'assets/pad-thai.png',
    '52818': 'assets/pad-thai.png',
    'bourguignon': 'assets/bourguignon.png',
    '52904': 'assets/bourguignon.png',
    'birria': 'assets/birria.png',
    'avocado-toast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    '52960': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800'
  };

  // Mapping of common slugs to official TheMealDB Free API IDs
  const KNOWN_THEMEALDB_IDS = {
    'pizza-authentic': '53014',
    'authentic-pizza': '53014',
    'pizza-classic': '53014',
    'pizza-napoletana': '53014',
    'pizza': '53014',
    '53014': '53014',
    'pizza-skillet': '53014',
    'quick-pan-seared-pizza': '53014',
    'pan-seared-pizza': '53014',
    'pizza-chicago': '53014',
    'pizza-new-york': '53014',
    'pizza-keto': '53014',
    'pizza-gourmet': '53014',
    'spaghetti-carbonara': '52982',
    'carbonara': '52982',
    'sesame-chicken': '52772',
    'teriyaki-chicken': '52772',
    'chicken': '52772',
    'ribeye': '52878',
    'steak': '52878',
    'dal-makhani': '52807',
    'bourguignon': '52904',
    'pad-thai': '52818',
    'biryani': '53088',
    'sushi': '52819',
    'salmon': '52819',
    'avocado-toast': '52960'
  };

  /**
   * Resolves a local crisp FHD image asset fallback.
   */
  function getHighResFallbackAsset(identifier, defaultImg) {
    if (!identifier) return defaultImg || 'assets/sesame-chicken.png';
    const raw = String(identifier).trim();
    const norm = normalizeKey(raw);

    if (LOCAL_FHD_ASSETS[raw]) return LOCAL_FHD_ASSETS[raw];
    if (LOCAL_FHD_ASSETS[norm]) return LOCAL_FHD_ASSETS[norm];

    for (const key in LOCAL_FHD_ASSETS) {
      if (norm.includes(key) || key.includes(norm)) {
        return LOCAL_FHD_ASSETS[key];
      }
    }
    return defaultImg || 'assets/sesame-chicken.png';
  }

  /**
   * Injects the ultra-premium 7-Star Cyber-Gastronomy visual styling engine.
   */
  function inject7StarVisualEngineStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('wow-7star-visual-engine')) return;

    const style = document.createElement('style');
    style.id = 'wow-7star-visual-engine';
    style.textContent = `
      /* ─── 7-Star Cyber-Gastronomy Dual-Layer Background & Asset Quality Engine ─── */
      #recipe-header,
      .recipe-detail-header-frame {
        background: linear-gradient(180deg, #0B0F14 0%, #131920 60%, #1A232E 100%) !important;
      }

      .media-container,
      .step-media-container,
      .card-photo-wrap {
        border: 1.5px solid rgba(61, 242, 224, 0.45) !important;
        box-shadow: 0 0 20px rgba(61, 242, 224, 0.25), 0 8px 32px rgba(0, 0, 0, 0.7) !important;
        border-radius: 14px !important;
        overflow: hidden !important;
        background-color: #0B0F14 !important;
      }
      
      .card-photo-container {
        position: relative !important;
        overflow: visible !important;
      }

      .media-cover-img,
      .card-photo,
      .step-photo-img,
      .search-card-thumb,
      .slot-food-thumb img {
        filter: contrast(1.05) brightness(0.95) saturate(1.1) !important;
        object-fit: cover !important;
        object-position: center !important;
        background-position: center !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease !important;
      }

      .recipe-card,
      .meal-slot-card,
      .search-grid-card {
        background: linear-gradient(180deg, #131920 0%, #0B0F14 100%) !important;
        border: 1px solid rgba(61, 242, 224, 0.35) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 16px rgba(61, 242, 224, 0.15) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Transforms a raw TheMealDB API meal object into wow Food standard schema.
   */
  function transformTheMealDBPayload(meal, requestedId) {
    if (!meal || typeof meal !== 'object') return null;

    const id = meal.idMeal || requestedId || 'themealdb-recipe';
    const title = meal.strMeal || 'Gourmet Meal Creation';
    const category = (meal.strCategory || 'CHEF ARTISAN').toUpperCase();
    const area = meal.strArea || 'International';
    const fallbackImage = getHighResFallbackAsset(id, meal.strMealThumb || 'assets/sesame-chicken.png');
    const image = meal.strMealThumb || fallbackImage;

    // 1. Extract ingredients and measurements (strIngredient1..20, strMeasure1..20)
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingName = meal[`strIngredient${i}`];
      const ingMeasure = meal[`strMeasure${i}`];

      if (ingName && typeof ingName === 'string' && ingName.trim().length > 0) {
        const cleanName = ingName.trim();
        const cleanMeasure = (ingMeasure && typeof ingMeasure === 'string' && ingMeasure.trim().length > 0)
          ? ingMeasure.trim()
          : 'To taste';
        
        // Compute base numeric and unit
        let baseVal = 1;
        let unitStr = 'g';
        const numMatch = cleanMeasure.match(/^([\d\.\/\s]+)/);
        if (numMatch) {
          try {
            const rawNum = numMatch[1].trim();
            if (rawNum.includes('/')) {
              const parts = rawNum.split('/');
              baseVal = parseFloat(parts[0]) / parseFloat(parts[1]);
            } else {
              baseVal = parseFloat(rawNum) || 1;
            }
          } catch (e) {
            baseVal = 1;
          }
        }

        if (/cup/i.test(cleanMeasure)) unitStr = 'cup';
        else if (/tbsp|tablespoon/i.test(cleanMeasure)) unitStr = 'tbsp';
        else if (/tsp|teaspoon/i.test(cleanMeasure)) unitStr = 'tsp';
        else if (/clove/i.test(cleanMeasure)) unitStr = 'cloves';
        else if (/piece|slice|item/i.test(cleanMeasure)) unitStr = 'pieces';

        ingredients.push({
          name: cleanName,
          qty: cleanMeasure,
          amount: cleanMeasure,
          base: baseVal,
          unit: unitStr,
          ingredientIcon: `${THEMEALDB_ING_IMG_URL}${encodeURIComponent(cleanName)}.png`,
          icon: `${THEMEALDB_ING_IMG_URL}${encodeURIComponent(cleanName)}.png`
        });
      }
    }

    // 2. Parse and split instructions into step-by-step preparation flow
    const rawInstructions = meal.strInstructions || '';
    let instructionLines = [];

    // Check for STEP 1, STEP 2 markers or newlines
    if (/STEP\s*\d+/i.test(rawInstructions)) {
      instructionLines = rawInstructions.split(/STEP\s*\d+[:.]?/i)
        .map(s => s.trim())
        .filter(s => s.length > 5);
    } else if (/\r?\n\s*\r?\n/.test(rawInstructions)) {
      instructionLines = rawInstructions.split(/\r?\n\s*\r?\n/)
        .map(s => s.trim())
        .filter(s => s.length > 5);
    } else if (/\r?\n/.test(rawInstructions)) {
      instructionLines = rawInstructions.split(/\r?\n/)
        .map(s => s.trim())
        .filter(s => s.length > 5);
    } else {
      // Split by sentence if single huge paragraph
      instructionLines = rawInstructions.split(/\.\s+(?=[A-Z0-9])/)
        .map(s => s.trim())
        .filter(s => s.length > 5);
    }

    if (instructionLines.length === 0) {
      instructionLines = [rawInstructions || 'Prepare all ingredients and cook according to traditional technique until thoroughly finished.'];
    }

    const instructions = instructionLines.map((text, idx) => {
      const stepNum = idx + 1;
      let minutes = 5;
      const minMatch = text.match(/(\d+)\s*(?:min|minute)/i);
      if (minMatch) {
        minutes = parseInt(minMatch[1], 10);
        if (minutes > 60) minutes = 15;
      } else {
        minutes = Math.min(15, Math.max(3, 4 + idx * 2));
      }

      const timerStr = (minutes < 10 ? '0' : '') + minutes + ':00';
      const timerSec = minutes * 60;

      let headline = text.slice(0, 45).trim();
      if (!headline.endsWith('.')) headline += '...';
      const firstWords = text.split(/\s+/).slice(0, 4).join(' ');

      return {
        stepNum: stepNum,
        stepNumber: stepNum,
        title: `${stepNum}. ${firstWords || 'Culinary Preparation'}`,
        headline: `${stepNum}. ${firstWords || 'Culinary Preparation'}`,
        instruction: text,
        description: text,
        timer: timerStr,
        durationText: `${minutes} mins`,
        timerSeconds: timerSec,
        timerLabel: `Step ${stepNum} Timer`,
        img: image,
        image: image,
        ingredients: ingredients.slice(0, 3).map(i => ({ name: i.name, amt: i.qty }))
      };
    });

    // 3. Extract or compute community tags
    const tagList = [];
    if (meal.strTags) {
      meal.strTags.split(',').forEach(t => {
        if (t.trim()) tagList.push(t.trim());
      });
    }
    if (area) tagList.push(`${area} Cuisine`);
    if (category) tagList.push(category);
    tagList.push('TheMealDB Verified', 'Chef AI Precision');

    // 4. Generate structured wow Health Score & Macro Matrix
    const healthScoreVal = (7.5 + (ingredients.length % 3) * 0.7).toFixed(1);
    const totalMinutes = instructions.reduce((acc, curr) => acc + (parseInt(curr.durationText, 10) || 5), 0);

    return {
      id: id,
      slug: normalizeKey(title),
      title: title,
      strMeal: title,
      subtitle: `Authentic ${area} ${category.toLowerCase()} crafted with fresh seasonings and precision technique.`,
      image: image,
      imageUrl: image,
      img: image,
      fallbackImage: fallbackImage,
      strMealThumb: image,
      category: `${category} • ${area.toUpperCase()}`,
      badge: `${area} Standard`,
      prepTime: `${Math.max(5, Math.round(totalMinutes * 0.3))} min`,
      cookTime: `${Math.max(10, Math.round(totalMinutes * 0.7))} min`,
      totalTime: `${totalMinutes || 30} minutes`,
      servings: 4,
      calories: 520,
      calorieStr: '520 kcal',
      likes: `${(150 + (parseInt(id, 10) || 42) % 300).toFixed(1)}k`,
      intro: `A freshly resolved culinary masterpiece from TheMealDB: ${title}. Featuring ${ingredients.length} precision-measured ingredients cooked in ${instructions.length} orchestrated steps.`,
      ingredients: ingredients,
      instructions: instructions,
      steps: instructions,
      healthScore: {
        score: parseFloat(healthScoreVal),
        rating: parseFloat(healthScoreVal) > 8.0 ? 'High Protein' : 'Balanced',
        ratingSub: `${category} Matrix`,
        macros: {
          protein: { val: '38.0g', pct: 76 },
          carbs: { val: '45.0g', pct: 50 },
          fat: { val: '18.0g', pct: 35 },
          fiber: { val: '6.5g', pct: 60 }
        },
        nutritionTable: [
          { name: 'Calories', val: '520 kcal', pct: '(26% DV)' },
          { name: 'Total Fat', val: '18.00g', pct: '(23% DV)' },
          { name: 'Carbohydrates', val: '45.00g', pct: '(16% DV)' },
          { name: 'Dietary Fiber', val: '6.50g', pct: '(23% DV)' },
          { name: 'Protein', val: '38.00g', pct: '(76% DV)' },
          { name: 'Sodium', val: '540.00mg', pct: '(23% DV)' }
        ]
      },
      community: {
        liked: `${250 + (parseInt(id, 10) || 12) % 200} liked`,
        disliked: '5 disliked',
        tags: tagList
      },
      fromApi: true
    };
  }

  /**
   * Async fetch request targeting TheMealDB's live free endpoints:
   * - Lookup by ID: https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}
   * - Search by Name: https://www.themealdb.com/api/json/v1/1/search.php?s=${name}
   */
  async function fetchTheMealDBRecipe(identifier) {
    if (!identifier) return RECIPE_DB['sesame-chicken'];

    const rawStr = String(identifier).trim();
    const cleanKey = normalizeKey(rawStr);
    let isNumeric = /^\d+$/.test(rawStr);

    // 1. Check in-memory DB first (handcrafted high-precision recipes or cached models)
    if (!isNumeric && RECIPE_DB[rawStr]) return RECIPE_DB[rawStr];
    if (!isNumeric && RECIPE_DB[cleanKey]) return RECIPE_DB[cleanKey];
    if (RECIPE_DB[rawStr] && RECIPE_DB[rawStr].fromApi) return RECIPE_DB[rawStr];
    if (RECIPE_DB[cleanKey] && RECIPE_DB[cleanKey].fromApi) return RECIPE_DB[cleanKey];

    // 2. Resolve query parameters
    let targetQuery = rawStr;
    if (!isNumeric && KNOWN_THEMEALDB_IDS[cleanKey]) {
      targetQuery = KNOWN_THEMEALDB_IDS[cleanKey];
      isNumeric = true;
    }

    // 3. Check MealDBCacheEngine 7-Day Local Cache before Network Execution
    const cacheKey = `recipe_${isNumeric ? 'id_' : 'query_'}${targetQuery.toLowerCase().trim()}`;
    if (typeof window !== 'undefined' && window.MealDBCacheEngine) {
      const cached = window.MealDBCacheEngine.get(cacheKey);
      if (cached && !cached.isExpired && cached.data) {
        console.log(`[recipe-controller] Returning 7-day cached recipe for: ${targetQuery}`);
        RECIPE_DB[cached.data.id || targetQuery] = cached.data;
        return cached.data;
      }
    }

    try {
      let targetUrl = '';
      if (isNumeric) {
        targetUrl = `${THEMEALDB_LOOKUP_URL}${encodeURIComponent(targetQuery)}`;
      } else {
        const searchTerms = rawStr.replace(/[-_]+/g, ' ');
        targetUrl = `${THEMEALDB_SEARCH_URL}${encodeURIComponent(searchTerms)}`;
      }

      let data = null;
      if (typeof window !== 'undefined' && window.MealDBCacheEngine) {
        data = await window.MealDBCacheEngine.fetchWithCache(targetUrl, cacheKey);
      } else {
        const response = await fetch(targetUrl);
        if (response.ok) data = await response.json();
      }

      if (data && Array.isArray(data.meals) && data.meals.length > 0) {
        const meal = data.meals[0];
        const normalized = transformTheMealDBPayload(meal, rawStr);
        
        // Cache in memory for instant subsequent lookups
        RECIPE_DB[meal.idMeal] = normalized;
        RECIPE_DB[rawStr] = normalized;
        if (cleanKey) RECIPE_DB[cleanKey] = normalized;
        if (normalized.slug) RECIPE_DB[normalized.slug] = normalized;

        if (typeof window !== 'undefined' && window.MealDBCacheEngine) {
          window.MealDBCacheEngine.set(cacheKey, normalized);
          window.MealDBCacheEngine.set(`recipe_id_${meal.idMeal}`, normalized);
        }

        return normalized;
      }
    } catch (fetchErr) {
      console.warn('[recipe-controller] TheMealDB live fetch notice (falling back to local cache):', fetchErr);
    }

    // 4. Stale cache fallback check on error
    if (typeof window !== 'undefined' && window.MealDBCacheEngine) {
      const staleCached = window.MealDBCacheEngine.get(cacheKey);
      if (staleCached && staleCached.data) {
        console.log(`[recipe-controller] Stale cache fallback for: ${targetQuery}`);
        return staleCached.data;
      }
    }

    // 5. Fallback to local DB resolution
    return resolveRecipe(rawStr);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. RECIPE IDENTITY RESOLVER & CONTEXTUAL FALLBACK GENERATOR
  // ═══════════════════════════════════════════════════════════════════════════
  function normalizeKey(str) {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function resolveRecipe(keyOrObject) {
    if (!keyOrObject) return RECIPE_DB['sesame-chicken'];

    if (typeof keyOrObject === 'object' && keyOrObject !== null) {
      if (keyOrObject.id && RECIPE_DB[keyOrObject.id]) return RECIPE_DB[keyOrObject.id];
      if (keyOrObject.slug && RECIPE_DB[keyOrObject.slug]) return RECIPE_DB[keyOrObject.slug];
      if (keyOrObject.title) {
        const norm = normalizeKey(keyOrObject.title);
        if (RECIPE_DB[norm]) return RECIPE_DB[norm];
      }
      return keyOrObject;
    }

    const rawStr = String(keyOrObject).trim();
    const cleanKey = normalizeKey(rawStr);

    // Direct key lookup
    if (RECIPE_DB[cleanKey]) return RECIPE_DB[cleanKey];
    if (RECIPE_DB[rawStr]) return RECIPE_DB[rawStr];

    // Check cached recipes in localStorage
    try {
      const cached = localStorage.getItem(`wow_recipe_cache_${rawStr}`) || localStorage.getItem('wow_active_recipe');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.id === rawStr || parsed.id === cleanKey || parsed.slug === cleanKey)) {
          RECIPE_DB[rawStr] = parsed;
          return parsed;
        }
      }
    } catch (e) {}

    // Alias and partial matches
    for (const k in RECIPE_DB) {
      const item = RECIPE_DB[k];
      if (k === cleanKey || item.slug === cleanKey || item.id === cleanKey || item.id === rawStr) {
        return item;
      }
      if (cleanKey.includes(k) || k.includes(cleanKey)) {
        return item;
      }
      if (item.title && normalizeKey(item.title).includes(cleanKey)) {
        return item;
      }
    }

    // Specific common aliases with local high-res fallbacks
    if (/pan.*seared.*pizza|quick.*pan.*pizza|pizza.*skillet/i.test(cleanKey)) return RECIPE_DB['pizza-skillet'];
    if (/authentic.*pizza|pizza.*authentic|pizza.*classic|53014|pizza.*napoletana/i.test(cleanKey)) return RECIPE_DB['pizza-authentic'];
    if (/pizza/i.test(cleanKey)) return RECIPE_DB['pizza-authentic'];
    if (/carbonara|spaghetti|52982/i.test(cleanKey)) return RECIPE_DB['spaghetti-carbonara'];
    if (/avocado|toast|52960/i.test(cleanKey)) return RECIPE_DB['avocado-toast'];
    if (/sesame|teriyaki|52772/i.test(cleanKey)) return RECIPE_DB['sesame-chicken'];
    if (/ribeye|steak|52878|52881/i.test(cleanKey)) return RECIPE_DB['ribeye'];
    if (/dal|makhani|52807/i.test(cleanKey)) return RECIPE_DB['dal-makhani'];
    if (/butter.*chicken|makhani.*chicken/i.test(cleanKey)) return RECIPE_DB['butter-chicken'];
    if (/pad.*thai|52818/i.test(cleanKey)) return RECIPE_DB['pad-thai'];
    if (/birria|taco/i.test(cleanKey)) return RECIPE_DB['birria'];
    if (/bourguignon|52904/i.test(cleanKey)) return RECIPE_DB['bourguignon'];
    if (/sushi|salmon|52819/i.test(cleanKey)) return RECIPE_DB['sushi'];
    if (/ceviche/i.test(cleanKey)) return RECIPE_DB['ceviche'];
    if (/biryani|53088/i.test(cleanKey)) return RECIPE_DB['biryani'];

    // Contextual clean fallback recipe
    const prettyTitle = rawStr.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const fallbackImage = getHighResFallbackAsset(rawStr, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
    return {
      id: cleanKey || 'gourmet-recipe',
      slug: cleanKey || 'gourmet-recipe',
      title: prettyTitle || 'Chef AI Signature Recipe',
      subtitle: 'Nutrient-rich, precision crafted gourmet creation tailored by wow Food Engine.',
      image: fallbackImage,
      imageUrl: fallbackImage,
      img: fallbackImage,
      fallbackImage: fallbackImage,
      category: 'GOURMET CHEF AI',
      badge: "Chef's Innovation",
      prepTime: '15 min',
      cookTime: '20 min',
      totalTime: '35 minutes',
      servings: 4,
      calories: 460,
      calorieStr: '460 kcal',
      likes: '195.4k',
      intro: `A freshly calculated culinary composition of ${prettyTitle}, engineered for maximum palate enjoyment and balanced macronutrient profiles.`,
      ingredients: [
        { name: 'Fresh Core Base Ingredients', qty: '400g core base', amount: '400g core base', base: 400, unit: 'g', ingredientIcon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
        { name: 'Aromatic Olive Oil & Seasoning', qty: '2 tbsp', amount: '2 tbsp', base: 2, unit: 'tbsp', ingredientIcon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
        { name: 'Fresh Herbs & Garlic', qty: '3 cloves & sprigs', amount: '3 cloves & sprigs', base: 3, unit: 'cloves', ingredientIcon: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80' },
        { name: 'Sea Salt & Cracked Pepper', qty: 'To taste', amount: 'To taste', base: 1, unit: 'taste', ingredientIcon: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80' }
      ],
      instructions: [
        { stepNum: 1, title: '1. Prep & Mise en Place', instruction: 'Gather and prepare all fresh ingredients. Measure exact seasonings.', timer: '05:00', img: fallbackImage },
        { stepNum: 2, title: '2. Sauté & Infuse Aromatics', instruction: 'Gently heat olive oil and infuse with garlic and seasonings on medium flame.', timer: '08:00', img: fallbackImage },
        { stepNum: 3, title: '3. Cook & Emulsify Glaze', instruction: 'Simmer core ingredients until tender and flavorful.', timer: '10:00', img: fallbackImage },
        { stepNum: 4, title: '4. Garnish & Serve', instruction: 'Finish with fresh herbs and flaky salt. Serve immediately.', timer: '02:00', img: fallbackImage }
      ],
      healthScore: {
        score: 8.5,
        rating: 'High Protein',
        ratingSub: 'Balanced Profile',
        macros: {
          protein: { val: '36.0g', pct: 75 },
          carbs: { val: '40.0g', pct: 45 },
          fat: { val: '16.0g', pct: 30 },
          fiber: { val: '6.0g', pct: 50 }
        },
        nutritionTable: [
          { name: 'Calories', val: '460 kcal', pct: '(23% DV)' },
          { name: 'Total Fat', val: '16.00g', pct: '(20% DV)' },
          { name: 'Carbohydrates', val: '40.00g', pct: '(15% DV)' },
          { name: 'Protein', val: '36.00g', pct: '(72% DV)' }
        ]
      },
      community: {
        liked: '190 liked',
        disliked: '5 disliked',
        tags: ['Chef AI Special', 'Fresh', 'Balanced Health']
      },
      steps: [
        { stepNumber: 1, headline: '1. Prep & Season Core Base', durationText: '5 mins', timerSeconds: 300, timerLabel: 'Prep Timer', description: 'Prepare all base ingredients and season thoroughly.', image: fallbackImage },
        { stepNumber: 2, headline: '2. Cook & Caramelize', durationText: '10 mins', timerSeconds: 600, timerLabel: 'Cook Timer', description: 'Simmer on medium heat to develop rich savory flavor notes.', image: fallbackImage },
        { stepNumber: 3, headline: '3. Garnish & Plate', durationText: '2 mins', timerSeconds: 120, timerLabel: 'Plating', description: 'Plate hot with fresh herbs and seasoning.', image: fallbackImage }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. PARAMETER PARSER & NAVIGATION ROUTER
  // ═══════════════════════════════════════════════════════════════════════════
  function getActiveUrlRecipeId() {
    if (typeof window === 'undefined') return '52772';
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('name') || params.get('recipe') || params.get('slug') || '52772';
  }

  async function navigateToRecipeDetail(recipeIdentifier) {
    let targetId = recipeIdentifier || '52772';
    if (typeof targetId === 'object' && targetId !== null) {
      targetId = targetId.id || targetId.slug || '52772';
    }

    // Persist active selection
    try {
      localStorage.setItem('wow_active_recipe_id', String(targetId));
      sessionStorage.setItem('wow_active_recipe_id', String(targetId));
    } catch (e) {}

    const isDetailPage = window.location.pathname.endsWith('recipe-detail.html') || !!document.getElementById('recipe-header');
    if (isDetailPage) {
      await injectRecipeDetailView(targetId);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `recipe-detail.html?id=${encodeURIComponent(targetId)}`);
      }
    } else {
      window.location.href = `recipe-detail.html?id=${encodeURIComponent(targetId)}`;
    }
  }

  function navigateToImmersiveCooking(recipeIdentifier, stepNumber) {
    const targetId = recipeIdentifier || getActiveUrlRecipeId() || '52772';
    const targetStep = stepNumber || 1;

    try {
      localStorage.setItem('wow_active_recipe_id', String(targetId));
    } catch (e) {}

    const isImmersiveFile = window.location.pathname.includes('immersive-cooking.html');
    const targetPage = isImmersiveFile ? 'immersive-cooking.html' : 'cooking-guide.html';
    window.location.href = `${targetPage}?id=${encodeURIComponent(targetId)}&step=${targetStep}`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. DETAIL VIEW DYNAMIC DATA INJECTION ENGINE (recipe-detail.html)
  // ═══════════════════════════════════════════════════════════════════════════
  async function injectRecipeDetailView(optionalId) {
    try {
      // Ensure 7-star visual styling engine is active
      inject7StarVisualEngineStyles();

      const activeId = optionalId || getActiveUrlRecipeId();
      
      // Live fetch from TheMealDB API with local fallback
      const recipe = await fetchTheMealDBRecipe(activeId);
      if (!recipe) return;

      // ─── 5A. Page Title & Meta ──────────────────────────────────────────
      document.title = `wow | ${recipe.strMeal || recipe.title}`;

      // ─── 5B. Dual-Layer Background & 7-Star Media Cover Shield ───────────
      const recipeHeader = document.getElementById('recipe-header');
      if (recipeHeader) {
        recipeHeader.style.background = 'linear-gradient(180deg, #0B0F14 0%, #131920 60%, #1A232E 100%)';
      }

      const coverImg = document.querySelector('.media-cover-img');
      const mediaContainer = document.querySelector('.media-container');
      const heroImg = recipe.strMealThumb || recipe.imageUrl || recipe.image || recipe.img || getHighResFallbackAsset(recipe.id, 'assets/sesame-chicken.png');
      
      if (mediaContainer) {
        mediaContainer.setAttribute('data-active-recipe', recipe.id);
        mediaContainer.style.border = '1.5px solid rgba(61, 242, 224, 0.45)';
        mediaContainer.style.boxShadow = '0 0 20px rgba(61, 242, 224, 0.25), 0 8px 32px rgba(0, 0, 0, 0.7)';
        mediaContainer.style.borderRadius = '14px';
        mediaContainer.style.backgroundColor = '#0B0F14';
      }

      if (coverImg) {
        coverImg.src = heroImg;
        coverImg.alt = recipe.strMeal || recipe.title;
        // Strict 7-star visual filter & anti-distortion constraints
        coverImg.style.filter = 'contrast(1.05) brightness(0.95) saturate(1.1)';
        coverImg.style.objectFit = 'cover';
        coverImg.style.objectPosition = 'center';
        coverImg.style.backgroundPosition = 'center';

        coverImg.onerror = function () {
          this.onerror = null;
          this.src = getHighResFallbackAsset(recipe.id || recipe.slug, recipe.fallbackImage || 'assets/sesame-chicken.png');
        };
      }

      // ─── 5C. Text Headings, Subtitles, Badges & Pills ─────────────────────
      const mainTitle = document.querySelector('.recipe-main-title');
      if (mainTitle) mainTitle.textContent = recipe.strMeal || recipe.title;

      const catBadge = document.querySelector('.live-category-badge span:last-child');
      if (catBadge) catBadge.textContent = recipe.category || 'GOURMET RECIPE';

      const chefPill = document.querySelector('.chef-signature-pill');
      if (chefPill) chefPill.textContent = recipe.badge || "Chef's Signature";

      const caloriePill = document.querySelector('.calorie-pill');
      if (caloriePill) {
        caloriePill.innerHTML = `
          <span class="material-symbols-outlined">local_fire_department</span>
          ${recipe.calorieStr || (recipe.calories ? `${recipe.calories} kcal` : '480 kcal')}
        `;
      }

      const bookmarkCount = document.getElementById('bookmark-count-text');
      if (bookmarkCount) bookmarkCount.textContent = recipe.likes || '240.6k';

      // ─── 5D. Tab 0: Ingredients Stack ───────────────────────────────────
      const introEl = document.querySelector('.recipe-intro-text');
      if (introEl && recipe.intro) {
        introEl.innerHTML = `
          ${recipe.intro} 
          <button class="see-more-link" onclick="switchRecipeTab(1)">See more</button>
        `;
      }

      const timeRow = document.querySelector('#tab-panel-0 .time-info-row span:last-child');
      if (timeRow) {
        timeRow.innerHTML = `Prep: ${recipe.prepTime || '10 min'} &nbsp;•&nbsp; Cook: ${recipe.cookTime || '20 min'}`;
      }

      const servingsDisplay = document.getElementById('servings-display');
      if (servingsDisplay) {
        servingsDisplay.textContent = `${recipe.servings || 4} servings`;
      }

      const ingStack = document.querySelector('.ingredients-stack');
      if (ingStack && Array.isArray(recipe.ingredients)) {
        ingStack.innerHTML = '';
        recipe.ingredients.forEach(item => {
          const card = document.createElement('div');
          card.className = 'ingredient-card';

          const iconSrc = item.ingredientIcon || item.icon || item.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
          const itemName = item.name || 'Fresh Ingredient';
          const itemQty = item.qty || item.amount || 'To taste';
          const itemBase = item.base || 1;
          const itemUnit = item.unit || '';

          card.innerHTML = `
            <div class="ingredient-left">
              <div class="ingredient-img-wrapper">
                <img src="${iconSrc}" alt="${itemName}" class="round-shape" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';" />
              </div>
              <span class="ingredient-name">${itemName}</span>
            </div>
            <span class="ingredient-amount" data-base="${itemBase}" data-unit="${itemUnit}">${itemQty}</span>
          `;
          ingStack.appendChild(card);
        });
      }

      // ─── 5E. Tab 1: Preparation Instructions ────────────────────────────
      const instPanel = document.getElementById('tab-panel-1');
      if (instPanel && Array.isArray(recipe.instructions)) {
        const stepCountBadge = document.getElementById('step-count-badge') || instPanel.querySelector('.instructions-header-bar > span:last-child');
        if (stepCountBadge) {
          stepCountBadge.textContent = `${recipe.instructions.length} Steps`;
        }

        const totalTimeText = document.getElementById('step-total-time') || instPanel.querySelector('.instructions-header-bar .time-info-row span:last-child');
        if (totalTimeText) {
          totalTimeText.textContent = `Total Time: ${recipe.totalTime || '30 minutes'}`;
        }

        // Clean out previous cards and rebuild
        const oldCards = instPanel.querySelectorAll('.instruction-step-card');
        oldCards.forEach(c => c.remove());

        recipe.instructions.forEach((step, idx) => {
          const stepNum = step.stepNum || (idx + 1);
          const card = document.createElement('div');
          card.className = 'instruction-step-card';
          const stepImg = step.img || step.image || '';
          const stepTimer = step.timer || step.durationText || '05:00';

          card.innerHTML = `
            <div class="step-number-badge">${stepNum}</div>
            <div class="step-content">
              <h4 class="step-title">${step.title}</h4>
              <p class="step-desc">${step.instruction}</p>
              <div class="step-timer-chip">
                <span class="material-symbols-outlined">timer</span>
                <span>${stepTimer}</span>
              </div>
              ${stepImg ? `
                <div class="step-img-wrapper" style="margin-top:10px;border-radius:12px;overflow:hidden;">
                  <img src="${stepImg}" alt="${step.title}" onerror="this.parentNode.style.display='none';" style="width:100%;height:130px;object-fit:cover;" />
                </div>
              ` : ''}
            </div>
          `;
          instPanel.appendChild(card);
        });
      }

      // ─── 5F. Tab 2: Health Score & WOW MATRIX ───────────────────────────
      const matrix = recipe.healthScore || {};
      let rawScore = matrix.score !== undefined ? matrix.score : 94;
      // Normalize score to integer 0-100 for display
      let displayScore = (rawScore <= 10) ? Math.round(rawScore * 10) : Math.round(rawScore);
      displayScore = Math.max(0, Math.min(100, displayScore));

      const ringScoreEl = document.getElementById('matrix-ring-score') || document.querySelector('.matrix-ring-number') || document.querySelector('.score-large');
      if (ringScoreEl) ringScoreEl.textContent = displayScore;

      const progressCircle = document.getElementById('matrix-progress-circle') || document.querySelector('.matrix-ring-progress');
      if (progressCircle) {
        // Circumference for r=36 is 2 * PI * 36 ≈ 226.19
        const circumference = 226.19;
        const offset = circumference - (circumference * (displayScore / 100));
        progressCircle.style.strokeDashoffset = offset;
      }

      const scoreTitle = document.getElementById('matrix-score-title') || document.querySelector('.matrix-score-heading') || document.querySelector('.rating-level');
      if (scoreTitle) {
        scoreTitle.textContent = `Health Score: ${displayScore}/100`;
      }

      const scoreSubtext = document.getElementById('matrix-score-subtext') || document.querySelector('.matrix-score-subtext') || document.querySelector('.rating-sub');
      if (scoreSubtext) {
        scoreSubtext.textContent = matrix.ratingSub || (matrix.rating ? `${matrix.rating} • Heart Healthy` : 'High Protein • Heart Healthy');
      }

      if (matrix.macros) {
        const macroCards = document.querySelectorAll('.macro-grid-2x2 .macro-card');
        const keys = ['protein', 'carbs', 'fat', 'fiber'];
        macroCards.forEach((card, i) => {
          const key = keys[i];
          const data = matrix.macros[key];
          if (data) {
            const val = card.querySelector('.macro-val');
            const fill = card.querySelector('.macro-bar-fill');
            if (val) val.textContent = data.val;
            if (fill) fill.style.width = `${data.pct || 50}%`;
          }
        });
      }

      if (Array.isArray(matrix.nutritionTable)) {
        const nutritionCard = document.querySelector('.nutrition-table-card');
        if (nutritionCard) {
          nutritionCard.innerHTML = '';
          matrix.nutritionTable.forEach(row => {
            const r = document.createElement('div');
            r.className = 'nutrition-row';
            r.innerHTML = `
              <span class="nutrition-name">${row.name}</span>
              <div><span class="nutrition-val">${row.val}</span><span class="nutrition-pct">${row.pct}</span></div>
            `;
            nutritionCard.appendChild(r);
          });
        }
      }

      // ─── 5G. Community Tags ─────────────────────────────────────────────
      const tagCloud = document.querySelector('.tag-cloud');
      if (tagCloud) {
        const tags = recipe.community?.tags || ['Chef AI Innovation', 'TheMealDB Live', 'Balanced Health'];
        tagCloud.innerHTML = '';
        tags.forEach(t => {
          const s = document.createElement('span');
          s.className = 'recipe-tag';
          s.textContent = t;
          tagCloud.appendChild(s);
        });
      }

      // ─── 5H. Configure "Start Cooking Session" Action Button ────────────
      const startCookingBtn = document.getElementById('start-cooking-action-btn');
      if (startCookingBtn) {
        startCookingBtn.onclick = function (e) {
          e.preventDefault();
          navigateToImmersiveCooking(recipe.id || recipe.slug || activeId, 1);
        };
      }

      // Synchronize in-modal steps if present
      if (Array.isArray(recipe.instructions)) {
        global.cookingSteps = recipe.instructions.map((s, idx) => ({
          stepNum: s.stepNum || (idx + 1),
          title: s.title,
          instruction: s.instruction,
          timer: s.timer || '05:00',
          img: s.img || s.image || '',
          ingredients: s.ingredients || []
        }));
      }

    } catch (err) {
      console.error('[recipe-controller] injectRecipeDetailView error:', err);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. IMMERSIVE COOKING MODE DATA INJECTION (cooking-guide.html / Screen 4)
  // ═══════════════════════════════════════════════════════════════════════════
  async function injectImmersiveCookingView() {
    try {
      // Ensure 7-star visual styling engine is active
      inject7StarVisualEngineStyles();

      const activeId = getActiveUrlRecipeId();
      const recipe = await fetchTheMealDBRecipe(activeId);
      if (!recipe) return;

      const titleHeader = document.getElementById('label-recipe-title');
      if (titleHeader) titleHeader.textContent = (recipe.strMeal || recipe.title || 'GOURMET RECIPE').toUpperCase();

      const celebrationTag = document.getElementById('celebration-recipe-tag');
      if (celebrationTag) celebrationTag.textContent = `${recipe.strMeal || recipe.title} Mastered`;

      // Update exit cook mode link to retain active recipe ID
      const exitCookBtn = document.getElementById('btn-close-cook');
      if (exitCookBtn) {
        exitCookBtn.href = `recipe-detail.html?id=${encodeURIComponent(recipe.id || recipe.slug || activeId)}`;
      }

      // Update celebration share links
      const shareCelebration = document.getElementById('btn-share-celebration');
      if (shareCelebration) {
        shareCelebration.href = `social-feed.html?post=${encodeURIComponent(recipe.id || recipe.slug || activeId)}`;
      }

      // 7-Star Step Media Shield & Visual Asset Filter
      const stepMediaFrame = document.getElementById('step-media-frame') || document.querySelector('.step-media-container');
      if (stepMediaFrame) {
        stepMediaFrame.style.border = '1.5px solid rgba(61, 242, 224, 0.45)';
        stepMediaFrame.style.boxShadow = '0 0 20px rgba(61, 242, 224, 0.25), 0 8px 32px rgba(0, 0, 0, 0.7)';
        stepMediaFrame.style.borderRadius = '14px';
        stepMediaFrame.style.backgroundColor = '#0B0F14';
      }

      const stepMediaPhoto = document.getElementById('step-media-photo') || document.querySelector('.step-photo-img');
      if (stepMediaPhoto) {
        stepMediaPhoto.style.filter = 'contrast(1.05) brightness(0.95) saturate(1.1)';
        stepMediaPhoto.style.objectFit = 'cover';
        stepMediaPhoto.style.objectPosition = 'center';
        stepMediaPhoto.style.backgroundPosition = 'center';

        const defaultHero = recipe.strMealThumb || recipe.imageUrl || recipe.image || getHighResFallbackAsset(recipe.id, 'assets/sesame-chicken.png');
        stepMediaPhoto.onerror = function () {
          this.onerror = null;
          this.src = getHighResFallbackAsset(recipe.id || recipe.slug, defaultHero);
        };
      }

      // If page has a dynamic step renderer, trigger re-render with the live recipe steps
      if (typeof window.renderDynamicCookingStep === 'function' && Array.isArray(recipe.steps)) {
        window.activeRecipeSteps = recipe.steps;
      }

    } catch (err) {
      console.error('[recipe-controller] injectImmersiveCookingView error:', err);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. GLOBAL RECIPE CARD RE-ROUTING & TRIGGER INTERCEPTOR
  // ═══════════════════════════════════════════════════════════════════════════
  function bindDynamicRecipeCardTriggers() {
    // 1. Dynamic Anchor Tag Rewriting on DOM Ready
    const cardAnchors = document.querySelectorAll('a[href*="recipe-detail.html"]');
    cardAnchors.forEach(a => {
      const href = a.getAttribute('href');
      if (href === 'recipe-detail.html' || href === 'recipe-detail.html#') {
        const parentCard = a.closest('[data-recipe-id], [id^="card-"], [id^="slot-"], .meal-slot-card, .recipe-card, .match-card');
        if (parentCard) {
          const id = parentCard.getAttribute('data-recipe-id') || parentCard.id.replace(/^(card|slot)-/, '');
          a.setAttribute('href', `recipe-detail.html?id=${encodeURIComponent(id)}`);
        }
      } else if (href.includes('recipe=')) {
        a.setAttribute('href', href.replace('recipe=', 'id='));
      }
    });

    // 2. Global Event Delegation on All Card Containers
    document.addEventListener('click', function (e) {
      const card = e.target.closest('.recipe-card, .match-card, .meal-slot-card, .search-grid-card, [data-recipe-id]');
      if (!card) return;

      // Do not intercept actions on bookmark buttons, swap buttons, or direct sub-links
      if (e.target.closest('.wow-bookmark-btn, .bookmark-btn, .btn-swap-meal, .btn-cook-mode-launch, #btn-start-cook-lunch, .tag-remove')) {
        return;
      }

      // Check if clicking inside an explicit anchor tag with its own href
      const anchor = e.target.closest('a');
      if (anchor && anchor.getAttribute('href') && !anchor.getAttribute('href').startsWith('#')) {
        return;
      }

      e.preventDefault();

      // Resolve recipe identifier
      let targetId = card.getAttribute('data-recipe-id');
      if (!targetId && card.id) {
        targetId = card.id.replace(/^(card|slot)-/, '');
      }
      if (!targetId) {
        const titleEl = card.querySelector('.card-title, .slot-recipe-title, .search-card-title, h2, h3, h4');
        if (titleEl && titleEl.textContent) {
          targetId = titleEl.textContent.trim();
        }
      }

      navigateToRecipeDetail(targetId || '52772');
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. INITIALIZATION & AUTO-DISPATCH
  // ═══════════════════════════════════════════════════════════════════════════
  function initRecipeController() {
    bindDynamicRecipeCardTriggers();

    const path = window.location.pathname;

    if (path.endsWith('recipe-detail.html') || document.getElementById('recipe-header')) {
      injectRecipeDetailView();
    }

    if (path.endsWith('cooking-guide.html') || path.endsWith('immersive-cooking.html') || document.querySelector('.cook-top-bar')) {
      injectImmersiveCookingView();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRecipeController);
  } else {
    initRecipeController();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. PUBLIC EXPORTS
  // ═══════════════════════════════════════════════════════════════════════════
  global.RECIPE_DB = RECIPE_DB;
  global.KNOWN_THEMEALDB_IDS = KNOWN_THEMEALDB_IDS;
  global.fetchTheMealDBRecipe = fetchTheMealDBRecipe;
  global.transformTheMealDBPayload = transformTheMealDBPayload;
  global.resolveRecipe = resolveRecipe;
  global.getActiveUrlRecipeId = getActiveUrlRecipeId;
  global.navigateToRecipeDetail = navigateToRecipeDetail;
  global.navigateToImmersiveCooking = navigateToImmersiveCooking;
  global.injectRecipeDetailView = injectRecipeDetailView;
  global.injectImmersiveCookingView = injectImmersiveCookingView;
  global.bindDynamicRecipeCardTriggers = bindDynamicRecipeCardTriggers;
  global.openRecipeDetail = navigateToRecipeDetail;

})(typeof window !== 'undefined' ? window : this);
