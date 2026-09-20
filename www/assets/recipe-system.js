/**
 * wow Food Recipes — Global State Dynamic Parameter System & Routing Engine
 * Provides unified openRecipeDetail() routing, centralized master catalog,
 * dedicated raw ingredient icon tracking, and dynamic DOM injection across
 * Screens 3A (Ingredients), 3B (Instructions), and 3C (Health Score).
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. FULL HIGH-DEFINITION (FHD) REAL-IMAGE ASSET PIPELINE & SANITIZER ENGINE
  // ═══════════════════════════════════════════════════════════════════════════
  const FHD_RAW_DATABASE = {
    // Poultry & Meats
    chicken_breast: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    chicken_thigh: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    chicken_generic: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    ribeye_steak: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    beef_chuck: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80',
    guanciale_pork: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=600&q=80',
    pancetta_bacon: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=600&q=80',
    meat_generic: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    
    // Seafood
    salmon_fillet: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    tuna_fillet: 'https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=600&q=80',
    corvina_seabass: 'https://images.unsplash.com/photo-1534940381023-74d39f4d7f76?auto=format&fit=crop&w=600&q=80',
    prawn_shrimp: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    seafood_generic: 'https://images.unsplash.com/photo-1534940381023-74d39f4d7f76?auto=format&fit=crop&w=600&q=80',

    // Pastas & Grains
    spaghetti_pasta: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
    rice_noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    basmati_rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    sushi_rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
    corn_tortilla: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    choclo_corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    sweet_potato: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=80',

    // Dairy, Eggs & Cheeses
    egg_yolks: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
    pecorino_cheese: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
    oaxaca_cheese: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80',
    butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    ghee: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    yogurt: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',

    // Aromatics, Herbs & Fungi
    garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
    yellow_onion: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=600&q=80',
    red_onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    fried_birista_onion: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=600&q=80',
    rosemary_thyme: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=600&q=80',
    cilantro_mint: 'https://images.unsplash.com/photo-1588879462719-74d320ddca2b?auto=format&fit=crop&w=600&q=80',
    chili_pepper: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    dried_chilies: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=600&q=80',
    cremini_mushrooms: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    tofu: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    bean_sprouts: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    lime_citrus: 'https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=600&q=80',
    nori_seaweed: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80',
    wasabi_ginger: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',

    // Condiments, Oils, Wines & Spices
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    soy_sauce: 'https://images.unsplash.com/photo-1589135233689-d562f4e3c3b0?auto=format&fit=crop&w=600&q=80',
    tamarind_paste: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    wine_broth: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    broth_consomme: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    cooking_oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    black_pepper: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    sea_salt: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80',
    sesame_seeds: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    peanuts: 'https://images.unsplash.com/photo-1567892328733-149f1db12e4f?auto=format&fit=crop&w=600&q=80',
    saffron: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
    whole_spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    generic_culinary: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  };

  const FHD_IMAGE_CACHE = {};

  /**
   * Strips numerical quantities, metric units, packaging descriptors, and prep modifiers
   * e.g., "800g marinated Bone-In Chicken Thighs" -> "chicken thighs"
   */
  function sanitizeIngredientName(rawName) {
    if (!rawName || typeof rawName !== 'string') return '';
    let cleaned = rawName.toLowerCase();
    cleaned = cleaned.replace(/\([^)]*\)/g, ' ');
    cleaned = cleaned.replace(/\b\d+(\.\d+)?(\/\d+)?\s*(g|kg|mg|oz|lb|lbs|ml|l|cl|cups?|tbsps?|tsps?|tablespoons?|teaspoons?|cloves?|pieces?|pcs|sprigs?|sheets?|bottles?|pinches?|handfuls?|slices?|cans?|can|bunch|bunches|sticks?)\b/gi, ' ');
    cleaned = cleaned.replace(/\b\d+(\.\d+)?(\/\d+)?\b/g, ' ');
    cleaned = cleaned.replace(/\b(g|kg|mg|oz|lb|lbs|ml|l|cl|cups?|tbsps?|tsps?|tablespoons?|teaspoons?|cloves?|pieces?|pcs|sprigs?|sheets?|bottles?|pinches?|handfuls?|slices?|cans?|can|bunch|bunches|sticks?)\b/gi, ' ');
    
    const stripped = cleaned.replace(/\b(raw|cooked|marinated|bone-in|boneless|skinless|fresh|freshly|dried|dry|frozen|thawed|cubed|diced|sliced|minced|chopped|shredded|grated|finely|coarsely|crushed|toasted|steamed|boiled|braised|fried|roasted|aged|smoked|cured|soaked|melted|peeled|warm|hot|cold|to\s+taste|for\s+serving|for\s+garnish|garnish|to\s+serve|accompaniment|extra|pure|organic|premium|artisanal|authentic|classic|wild|grass-fed|usda|dop)\b/gi, ' ')
      .replace(/[^a-z\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (stripped.length > 0) {
      return stripped;
    }

    cleaned = cleaned.replace(/[^a-z\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned || rawName.toLowerCase().trim();
  }

  /**
   * Dynamic automated FHD Real Food Photography Pipeline
   * Resolves clean, 1080p-grade real ingredient photography with instant O(1) cache.
   */
  function getFHDIngredientPhoto(ingredientName) {
    if (!ingredientName) return FHD_RAW_DATABASE.generic_culinary;
    const rawKey = ingredientName.trim();
    if (FHD_IMAGE_CACHE[rawKey]) {
      return FHD_IMAGE_CACHE[rawKey];
    }

    const clean = sanitizeIngredientName(rawKey);
    let photoUrl = '';

    if (/tortilla|taco|bread|dough/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.corn_tortilla;
    } else if (/spaghetti|pasta|linguine|penne|macaroni|fettuccine|tagliatelle/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.spaghetti_pasta;
    } else if (/noodle|ramen|rice stick/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.rice_noodles;
    } else if (/chicken breast|breast/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.chicken_breast;
    } else if (/chicken thigh|thigh|drumstick|wing/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.chicken_thigh;
    } else if (/chicken|poultry/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.chicken_generic;
    } else if (/prawn|shrimp|lobster|crab|crawfish/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.prawn_shrimp;
    } else if (/salmon/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.salmon_fillet;
    } else if (/tuna/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.tuna_fillet;
    } else if (/sea bass|corvina|fish|snapper|cod|halibut/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.corvina_seabass;
    } else if (/ribeye|steak/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.ribeye_steak;
    } else if (/guanciale|pancetta|lardon|bacon/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.guanciale_pork;
    } else if (/chuck|short rib|beef|meat|pork|lamb|mutton/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.beef_chuck;
    } else if (/egg|yolk|sabayon/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.egg_yolks;
    } else if (/pecorino|parmesan/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.pecorino_cheese;
    } else if (/oaxaca|mozzarella|cheese|queso/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.oaxaca_cheese;
    } else if (/butter/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.butter;
    } else if (/ghee/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.ghee;
    } else if (/yogurt|curd/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.yogurt;
    } else if (/garlic/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.garlic;
    } else if (/birista|fried onion/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.fried_birista_onion;
    } else if (/red onion/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.red_onion;
    } else if (/onion|shallot|scallion|leek/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.yellow_onion;
    } else if (/rosemary|thyme/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.rosemary_thyme;
    } else if (/cilantro|mint|parsley|basil|herb|chive/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.cilantro_mint;
    } else if (/guajillo|ancho|dried chili/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.dried_chilies;
    } else if (/chili|chile|pepper|aji|jalapeno|poblano|habanero|cayenne/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.chili_pepper;
    } else if (/mushroom|cremini|porcini|shiitake|fungus|truffle/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.cremini_mushrooms;
    } else if (/honey|sugar|syrup|sweetener/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.honey;
    } else if (/soy sauce|tamari/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.soy_sauce;
    } else if (/tamarind/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.tamarind_paste;
    } else if (/wine|pinot noir/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.wine_broth;
    } else if (/broth|stock|consomm|fish sauce|leche de tigre|vinegar|shari/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.broth_consomme;
    } else if (/oil|olive oil|sesame oil|avocado oil/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.cooking_oil;
    } else if (/tofu/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.tofu;
    } else if (/bean sprout|sprout/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.bean_sprouts;
    } else if (/lime|lemon|citrus/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.lime_citrus;
    } else if (/choclo|corn/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.choclo_corn;
    } else if (/camote|sweet potato/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.sweet_potato;
    } else if (/basmati/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.basmati_rice;
    } else if (/sushi rice|koshihikari|rice|grain|quinoa/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.sushi_rice;
    } else if (/saffron/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.saffron;
    } else if (/nori|seaweed/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.nori_seaweed;
    } else if (/wasabi|ginger|gari/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.wasabi_ginger;
    } else if (/black pepper|peppercorn|cracked pepper/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.black_pepper;
    } else if (/salt|sea salt|kosher salt/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.sea_salt;
    } else if (/sesame/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.sesame_seeds;
    } else if (/peanut/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.peanuts;
    } else if (/spice|seasoning|cardamom|clove|cinnamon|anise|garam masala/i.test(clean)) {
      photoUrl = FHD_RAW_DATABASE.whole_spices;
    } else {
      photoUrl = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(clean)}.png`;
    }

    FHD_IMAGE_CACHE[rawKey] = photoUrl;
    return photoUrl;
  }

  function resolveIngredientIcon(ingredientItem, parentRecipe) {
    if (!ingredientItem) return FHD_RAW_DATABASE.generic_culinary;

    const parentImg = parentRecipe
      ? (parentRecipe.imageUrl || parentRecipe.image || parentRecipe.img || '')
      : '';

    const explicitIcon = ingredientItem.ingredientIcon || ingredientItem.icon || ingredientItem.imageUrl || ingredientItem.image || ingredientItem.img;
    if (explicitIcon && explicitIcon !== parentImg && typeof explicitIcon === 'string' && !explicitIcon.startsWith('data:image/svg+xml')) {
      return explicitIcon;
    }

    return getFHDIngredientPhoto(ingredientItem.name);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. MASTER RECIPE CATALOG (Comprehensive structured datasets with raw icons)
  // ═══════════════════════════════════════════════════════════════════════════
  const RECIPE_CATALOG = {
    'sesame-chicken': {
      id: 3,
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
      intro: 'To freeze simply follow all directions except cooking. Place chicken and aromatic marinade in a gallon freezer bag. Be sure to glaze thoroughly before skillet searing for maximum caramelized crust.',
      ingredients: [
        {
          name: 'Boneless Chicken Breasts',
          qty: '4 pieces',
          amount: '4 pieces',
          base: 4,
          unit: 'pieces',
          ingredientIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX_diutDHz4MOqm15UGcP9m7lVCQX39FnQ-8JkAyedPkqmP8HY1PIxrCobyQ-wlRA-oJ30G1EJeotiIszl4d7i9DdH1xo8-rHLKug7JRfy0zm1AX4Cgjyk8_8n3WfIjumjnqaYVG_K5pQqdappUxFBwgVu3d7L-eaUNreUD2ZIu63Uipclc7clhwpV9aRnoqymv8PnnFdv20CcQKoMw-X4nZBOVP8qQwdZ1J8tqdpfWoVVLoKr7_UcSA',
          icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX_diutDHz4MOqm15UGcP9m7lVCQX39FnQ-8JkAyedPkqmP8HY1PIxrCobyQ-wlRA-oJ30G1EJeotiIszl4d7i9DdH1xo8-rHLKug7JRfy0zm1AX4Cgjyk8_8n3WfIjumjnqaYVG_K5pQqdappUxFBwgVu3d7L-eaUNreUD2ZIu63Uipclc7clhwpV9aRnoqymv8PnnFdv20CcQKoMw-X4nZBOVP8qQwdZ1J8tqdpfWoVVLoKr7_UcSA',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX_diutDHz4MOqm15UGcP9m7lVCQX39FnQ-8JkAyedPkqmP8HY1PIxrCobyQ-wlRA-oJ30G1EJeotiIszl4d7i9DdH1xo8-rHLKug7JRfy0zm1AX4Cgjyk8_8n3WfIjumjnqaYVG_K5pQqdappUxFBwgVu3d7L-eaUNreUD2ZIu63Uipclc7clhwpV9aRnoqymv8PnnFdv20CcQKoMw-X4nZBOVP8qQwdZ1J8tqdpfWoVVLoKr7_UcSA'
        },
        {
          name: 'Pure Blossom Honey',
          qty: '1/3 cup honey',
          amount: '1/3 cup honey',
          base: 0.333,
          unit: 'cup',
          ingredientIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9219aaAAqKy8S_OkjV4UxH-7mY5GFCwtauoM0zQtyz2Kdv2m4pb3FYws1LCHP6MMZN9elG82rVj3xIOcI_TqaJX7FyUKEbeml4M_xhrKsjwTfUqBpBwOxTZJGXNpt7vVDB-STjoqUDcF2Q7VA6_kKLdBkQuRxKw1xRcxEpukaKUFV-hmDpRf2_BqZouFW_ayOxdWfFWEh1R-iijyarBsagVoEqJCJ3F8OOkQdPQpZbsCtn8y11nO_w',
          icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9219aaAAqKy8S_OkjV4UxH-7mY5GFCwtauoM0zQtyz2Kdv2m4pb3FYws1LCHP6MMZN9elG82rVj3xIOcI_TqaJX7FyUKEbeml4M_xhrKsjwTfUqBpBwOxTZJGXNpt7vVDB-STjoqUDcF2Q7VA6_kKLdBkQuRxKw1xRcxEpukaKUFV-hmDpRf2_BqZouFW_ayOxdWfFWEh1R-iijyarBsagVoEqJCJ3F8OOkQdPQpZbsCtn8y11nO_w',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9219aaAAqKy8S_OkjV4UxH-7mY5GFCwtauoM0zQtyz2Kdv2m4pb3FYws1LCHP6MMZN9elG82rVj3xIOcI_TqaJX7FyUKEbeml4M_xhrKsjwTfUqBpBwOxTZJGXNpt7vVDB-STjoqUDcF2Q7VA6_kKLdBkQuRxKw1xRcxEpukaKUFV-hmDpRf2_BqZouFW_ayOxdWfFWEh1R-iijyarBsagVoEqJCJ3F8OOkQdPQpZbsCtn8y11nO_w'
        },
        {
          name: 'Dark Aged Soy Sauce',
          qty: '1/4 cup soy sauce',
          amount: '1/4 cup soy sauce',
          base: 0.25,
          unit: 'cup',
          ingredientIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV5_qgMP5M5LFjuU65rVQ3n8VpaUldiF6kWeISyo6Bjmnd3U4SWTASQOkPPqAkGgB7wZWoKh__aBhNDAUeMs_fCZeblR5r4sOfS9CC124B1i1C6XHaPddpGMu7tF2bUH9DQzzkeVj7kMtl9yiZbiRgw-OjpJRaAUkzxYKXYJqLCr2-MrSYzHYHy7JABNLXo_tFAk0Ec4v76NFMIkRqySyFvg9iiPzDS3eNpoBzbI-8Md1OQI84olE_eQ',
          icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV5_qgMP5M5LFjuU65rVQ3n8VpaUldiF6kWeISyo6Bjmnd3U4SWTASQOkPPqAkGgB7wZWoKh__aBhNDAUeMs_fCZeblR5r4sOfS9CC124B1i1C6XHaPddpGMu7tF2bUH9DQzzkeVj7kMtl9yiZbiRgw-OjpJRaAUkzxYKXYJqLCr2-MrSYzHYHy7JABNLXo_tFAk0Ec4v76NFMIkRqySyFvg9iiPzDS3eNpoBzbI-8Md1OQI84olE_eQ',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV5_qgMP5M5LFjuU65rVQ3n8VpaUldiF6kWeISyo6Bjmnd3U4SWTASQOkPPqAkGgB7wZWoKh__aBhNDAUeMs_fCZeblR5r4sOfS9CC124B1i1C6XHaPddpGMu7tF2bUH9DQzzkeVj7kMtl9yiZbiRgw-OjpJRaAUkzxYKXYJqLCr2-MrSYzHYHy7JABNLXo_tFAk0Ec4v76NFMIkRqySyFvg9iiPzDS3eNpoBzbI-8Md1OQI84olE_eQ'
        },
        {
          name: 'Diced Yellow Onions',
          qty: '1/4 cup diced',
          amount: '1/4 cup diced',
          base: 0.25,
          unit: 'cup',
          ingredientIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_I4nRDt5F-xByh916kDP4YEjJP4TYpLp4EBBynR3dQq4xCvZjx6GGHAKjTV97SajdG1E7JAEYMevRQTlOIFgbLljMZFmkAofhPa4eKzyaFKZinIdz1SQEMcdHX0YTVpCw_Lq1oLy3T2eTdyt5rhkPsV9mIPjqxoe4PPb-1ItR7i-KwT9rCtEF-CXVYkC3szGxXPFbLNy6nywBeEM3IGWxoN3hd8cppF4uxO7fhWS_seMR70aIHFSsZw',
          icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_I4nRDt5F-xByh916kDP4YEjJP4TYpLp4EBBynR3dQq4xCvZjx6GGHAKjTV97SajdG1E7JAEYMevRQTlOIFgbLljMZFmkAofhPa4eKzyaFKZinIdz1SQEMcdHX0YTVpCw_Lq1oLy3T2eTdyt5rhkPsV9mIPjqxoe4PPb-1ItR7i-KwT9rCtEF-CXVYkC3szGxXPFbLNy6nywBeEM3IGWxoN3hd8cppF4uxO7fhWS_seMR70aIHFSsZw',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_I4nRDt5F-xByh916kDP4YEjJP4TYpLp4EBBynR3dQq4xCvZjx6GGHAKjTV97SajdG1E7JAEYMevRQTlOIFgbLljMZFmkAofhPa4eKzyaFKZinIdz1SQEMcdHX0YTVpCw_Lq1oLy3T2eTdyt5rhkPsV9mIPjqxoe4PPb-1ItR7i-KwT9rCtEF-CXVYkC3szGxXPFbLNy6nywBeEM3IGWxoN3hd8cppF4uxO7fhWS_seMR70aIHFSsZw'
        },
        {
          name: 'Toasted White Sesame',
          qty: '2 tbsp seeds',
          amount: '2 tbsp seeds',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSNbbnj_Pt8MBJeE3qfB-vlkWcoZWgOW3S6uJGITZbcBVMWRwRChCoc_-01_2Z5RkpiPmCk54Vl7XXEfQ4M_KNSUei9fgGdf4oRrO8Lx3yj4JaLdkpwN958PCj6BeHlX_XBbe0XSy_QXzBeHBr2hzQ2Rd7-aVDHfOyMi6xnIAkfZOjXmhNhyJtxkeCkBSyTKO-0kNOc4fFAtwBkJbsRNOAZo73JikzRMdMY_H6bhYqDuHwRaq3qbEHLQ',
          icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSNbbnj_Pt8MBJeE3qfB-vlkWcoZWgOW3S6uJGITZbcBVMWRwRChCoc_-01_2Z5RkpiPmCk54Vl7XXEfQ4M_KNSUei9fgGdf4oRrO8Lx3yj4JaLdkpwN958PCj6BeHlX_XBbe0XSy_QXzBeHBr2hzQ2Rd7-aVDHfOyMi6xnIAkfZOjXmhNhyJtxkeCkBSyTKO-0kNOc4fFAtwBkJbsRNOAZo73JikzRMdMY_H6bhYqDuHwRaq3qbEHLQ',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSNbbnj_Pt8MBJeE3qfB-vlkWcoZWgOW3S6uJGITZbcBVMWRwRChCoc_-01_2Z5RkpiPmCk54Vl7XXEfQ4M_KNSUei9fgGdf4oRrO8Lx3yj4JaLdkpwN958PCj6BeHlX_XBbe0XSy_QXzBeHBr2hzQ2Rd7-aVDHfOyMi6xnIAkfZOjXmhNhyJtxkeCkBSyTKO-0kNOc4fFAtwBkJbsRNOAZo73JikzRMdMY_H6bhYqDuHwRaq3qbEHLQ'
        },
        {
          name: 'Minced Garlic Cloves',
          qty: '2 cloves',
          amount: '2 cloves',
          base: 2,
          unit: 'cloves',
          ingredientIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ2sHb1gmOj8nMAVHCGPXUrZDrkzXTE_AnANvmAYDSshQHii8prIaVgyMb2VMDZPEOF5m28crIaW9Vm-qBxEVT7LVIIxrIFGGDYbZ0P0QBVHmuJq1Yc8j1W8GTJc7RRyj3Xicd5FX9vAW7eYGcCyrn6GkjsN-p8rFpGkNi29wfO0sqIfvjRHl-B6HaQvNJBwlkcXk0mLmK1nZJBGwU1waquSmPhRFw0wuh1DsUOIzwEj5P4H4x_gT_yQ',
          icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ2sHb1gmOj8nMAVHCGPXUrZDrkzXTE_AnANvmAYDSshQHii8prIaVgyMb2VMDZPEOF5m28crIaW9Vm-qBxEVT7LVIIxrIFGGDYbZ0P0QBVHmuJq1Yc8j1W8GTJc7RRyj3Xicd5FX9vAW7eYGcCyrn6GkjsN-p8rFpGkNi29wfO0sqIfvjRHl-B6HaQvNJBwlkcXk0mLmK1nZJBGwU1waquSmPhRFw0wuh1DsUOIzwEj5P4H4x_gT_yQ',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ2sHb1gmOj8nMAVHCGPXUrZDrkzXTE_AnANvmAYDSshQHii8prIaVgyMb2VMDZPEOF5m28crIaW9Vm-qBxEVT7LVIIxrIFGGDYbZ0P0QBVHmuJq1Yc8j1W8GTJc7RRyj3Xicd5FX9vAW7eYGcCyrn6GkjsN-p8rFpGkNi29wfO0sqIfvjRHl-B6HaQvNJBwlkcXk0mLmK1nZJBGwU1waquSmPhRFw0wuh1DsUOIzwEj5P4H4x_gT_yQ'
        },
        {
          name: 'Sea Salt & Cracked Pepper',
          qty: 'To taste',
          amount: 'To taste',
          base: 1,
          unit: 'taste',
          ingredientIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3l0C-cZh-RzxY0aHwbdqAApsbdPAlnbvd9rCwhjArbUuHDQd2yOfEjRelyzYePUnI0b_9txeXx_-caA9C8DL92Hf-7t2rpgHgEVdRnPRBgR0PGd7bubyWHlafblvqMIfl9pWp9NufUEJO1YcTCBvymoj3kKGpmlA3yS3jItoQdT-70sYNw-TSGfDdh3xESi2zjKDfb0UI9LzFfFSVN3U9GnfqTd0k1pEyn09nchs6uCIJFKsVDzP1EA',
          icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3l0C-cZh-RzxY0aHwbdqAApsbdPAlnbvd9rCwhjArbUuHDQd2yOfEjRelyzYePUnI0b_9txeXx_-caA9C8DL92Hf-7t2rpgHgEVdRnPRBgR0PGd7bubyWHlafblvqMIfl9pWp9NufUEJO1YcTCBvymoj3kKGpmlA3yS3jItoQdT-70sYNw-TSGfDdh3xESi2zjKDfb0UI9LzFfFSVN3U9GnfqTd0k1pEyn09nchs6uCIJFKsVDzP1EA',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3l0C-cZh-RzxY0aHwbdqAApsbdPAlnbvd9rCwhjArbUuHDQd2yOfEjRelyzYePUnI0b_9txeXx_-caA9C8DL92Hf-7t2rpgHgEVdRnPRBgR0PGd7bubyWHlafblvqMIfl9pWp9NufUEJO1YcTCBvymoj3kKGpmlA3yS3jItoQdT-70sYNw-TSGfDdh3xESi2zjKDfb0UI9LzFfFSVN3U9GnfqTd0k1pEyn09nchs6uCIJFKsVDzP1EA'
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Prepare Chicken & Sauce',
          instruction: 'Cut chicken breasts into bite-sized 1-inch cubes. Season evenly with salt and pepper. In a medium bowl, whisk together honey, soy sauce, and minced garlic until dissolved.',
          timer: '10:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Chicken Breasts', amt: '4 pieces (diced)' },
            { name: 'Sea Salt & Pepper', amt: 'To taste' },
            { name: 'Cornstarch / Coating', amt: '2 tbsp' }
          ]
        },
        {
          stepNum: 2,
          title: 'Sear in Skillet',
          instruction: 'Heat 1 tbsp cooking oil in a large skillet over medium-high heat. Add diced chicken pieces in a single layer and sear undisturbed for 3–4 minutes until golden browned on all sides.',
          timer: '04:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Cooking Oil', amt: '1 tbsp' },
            { name: 'Coated Chicken Cubes', amt: 'From Step 1' }
          ]
        },
        {
          stepNum: 3,
          title: 'Glaze & Simmer',
          instruction: 'Pour the prepared honey soy glaze over the chicken. Lower the heat to medium-low. Let the sauce simmer gently for 5–6 minutes until bubbly and thickened into a glossy coating.',
          timer: '06:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Blossom Honey', amt: '1/3 cup' },
            { name: 'Soy Sauce & Garlic', amt: '1/4 cup & 2 cloves' }
          ]
        },
        {
          stepNum: 4,
          title: 'Garnish & Plate',
          instruction: 'Remove the skillet from heat. Generously sprinkle 2 tbsp toasted sesame seeds and chopped scallions over the top. Serve immediately over warm jasmine rice or noodles.',
          timer: '02:00',
          img: 'assets/sesame-chicken.png',
          ingredients: [
            { name: 'Toasted Sesame Seeds', amt: '2 tbsp' },
            { name: 'Fresh Scallions', amt: 'Garnish' },
            { name: 'Jasmine Rice', amt: 'For serving' }
          ]
        }
      ],
      healthScore: {
        score: 7.2,
        rating: 'Medium',
        ratingSub: 'Rating',
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
          { name: 'Sodium', val: '820.00mg', pct: '(35% DV)' },
          { name: 'Dietary Fiber', val: '1.80g', pct: '(6% DV)' }
        ]
      },
      community: {
        liked: '367 liked',
        disliked: '20 disliked',
        tags: ['Delicious', 'Go-to Classic', 'Quick Prep', 'Great Leftovers', 'One-Pan Dish']
      }
    },

    'carbonara': {
      id: 2,
      slug: 'carbonara',
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
          qty: '400g pasta',
          amount: '400g pasta',
          base: 400,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.spaghetti_pasta,
          icon: FHD_RAW_DATABASE.spaghetti_pasta,
          img: FHD_RAW_DATABASE.spaghetti_pasta
        },
        {
          name: 'Cured Guanciale / Pancetta',
          qty: '200g cubed',
          amount: '200g cubed',
          base: 200,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.guanciale_pork,
          icon: FHD_RAW_DATABASE.guanciale_pork,
          img: FHD_RAW_DATABASE.guanciale_pork
        },
        {
          name: 'Fresh Farm Egg Yolks',
          qty: '4 large yolks + 1 whole',
          amount: '4 large yolks + 1 whole',
          base: 4,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.egg_yolks,
          icon: FHD_RAW_DATABASE.egg_yolks,
          img: FHD_RAW_DATABASE.egg_yolks
        },
        {
          name: 'Pecorino Romano DOP',
          qty: '100g finely grated',
          amount: '100g finely grated',
          base: 100,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.pecorino_cheese,
          icon: FHD_RAW_DATABASE.pecorino_cheese,
          img: FHD_RAW_DATABASE.pecorino_cheese
        },
        {
          name: 'Coarsely Cracked Black Pepper',
          qty: '2 tsp freshly toasted',
          amount: '2 tsp freshly toasted',
          base: 2,
          unit: 'tsp',
          ingredientIcon: FHD_RAW_DATABASE.black_pepper,
          icon: FHD_RAW_DATABASE.black_pepper,
          img: FHD_RAW_DATABASE.black_pepper
        },
        {
          name: 'Flaky Sea Salt (for pasta water)',
          qty: '1 tbsp',
          amount: '1 tbsp',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.sea_salt,
          icon: FHD_RAW_DATABASE.sea_salt,
          img: FHD_RAW_DATABASE.sea_salt
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: "1. Prep & Ingredient Mise en Place",
          instruction: "Cook spaghetti in boiling salted water until al dente. Whisk egg yolks and Pecorino Romano cheese in a separate bowl with black pepper.",
          timer: "09:00",
          img: "",
          ingredients: [{ name: "Bronze-Cut Spaghetti", amt: "400g" }, { name: "Egg Yolks", amt: "4 yolks + 1 whole" }, { name: "Pecorino Romano", amt: "100g" }, { name: "Black Pepper", amt: "2 tsp" }]
        },
        {
          stepNum: 2,
          title: "2. Aromatics & Skillet Sauté",
          instruction: "Crisp the diced guanciale (or pancetta) in a skillet over medium heat until the fat renders out and the meat becomes beautifully golden brown.",
          timer: "08:00",
          img: "assets/images/cooking-skillet.jpg",
          ingredients: [{ name: "Cured Guanciale", amt: "200g cubed" }]
        },
        {
          stepNum: 3,
          title: "3. Emulsify Sauce",
          instruction: "Drain pasta, reserving a cup of cooking water. Toss hot pasta into the skillet fat off the heat. Pour the egg mix in and stir rapidly to create a rich, creamy sauce.",
          timer: "03:00",
          img: "assets/images/pasta-emulsify.jpg",
          ingredients: [{ name: "Hot Starchy Pasta Water", amt: "1/2 cup" }, { name: "Egg-Cheese Cream", amt: "From Step 1" }]
        },
        {
          stepNum: 4,
          title: "4. Garnish & Serve",
          instruction: "Plate the creamy pasta immediately. Top with an extra dusting of grated Pecorino Romano cheese and freshly cracked black pepper. Serve hot!",
          timer: "02:00",
          img: "assets/carbonara.png",
          ingredients: [{ name: "Grated Pecorino", amt: "To dust" }, { name: "Cracked Black Pepper", amt: "To finish" }]
        }
      ],
      healthScore: {
        score: 6.8,
        rating: 'Medium',
        ratingSub: 'Rating',
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
          { name: 'Sodium', val: '760.00mg', pct: '(33% DV)' },
          { name: 'Dietary Fiber', val: '3.20g', pct: '(11% DV)' }
        ]
      },
      community: {
        liked: '489 liked',
        disliked: '14 disliked',
        tags: ['Authentic Italian', 'Rich & Creamy', 'Comfort Food', 'Guanciale Gold', 'Date Night']
      }
    },

    'ribeye': {
      id: 'ribeye',
      slug: 'ribeye',
      title: 'Prime Bone In Ribeye',
      subtitle: 'Dry-aged USDA Prime ribeye with garlic-herb butter baste and charred crust.',
      image: 'assets/ribeye.jpg',
      imageUrl: 'assets/ribeye.jpg',
      img: 'assets/ribeye.jpg',
      fallbackImage: 'assets/ribeye.jpg',
      category: 'STEAKHOUSE SIGNATURE',
      badge: 'RECIPE INCOMING',
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
          qty: '2 steaks (16 oz each)',
          amount: '2 steaks (16 oz each)',
          base: 2,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.ribeye_steak,
          icon: FHD_RAW_DATABASE.ribeye_steak,
          img: FHD_RAW_DATABASE.ribeye_steak
        },
        {
          name: 'European Unsalted Butter',
          qty: '4 tbsp',
          amount: '4 tbsp',
          base: 4,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.butter,
          icon: FHD_RAW_DATABASE.butter,
          img: FHD_RAW_DATABASE.butter
        },
        {
          name: 'Fresh Rosemary & Thyme',
          qty: '4 sprigs',
          amount: '4 sprigs',
          base: 4,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.rosemary_thyme,
          icon: FHD_RAW_DATABASE.rosemary_thyme,
          img: FHD_RAW_DATABASE.rosemary_thyme
        },
        {
          name: 'Crushed Garlic Cloves',
          qty: '5 cloves',
          amount: '5 cloves',
          base: 5,
          unit: 'cloves',
          ingredientIcon: FHD_RAW_DATABASE.garlic,
          icon: FHD_RAW_DATABASE.garlic,
          img: FHD_RAW_DATABASE.garlic
        },
        {
          name: 'Coarse Kosher Salt',
          qty: '1 tbsp',
          amount: '1 tbsp',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.sea_salt,
          icon: FHD_RAW_DATABASE.sea_salt,
          img: FHD_RAW_DATABASE.sea_salt
        },
        {
          name: 'Coarsely Cracked Black Pepper',
          qty: '1 tbsp',
          amount: '1 tbsp',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.black_pepper,
          icon: FHD_RAW_DATABASE.black_pepper,
          img: FHD_RAW_DATABASE.black_pepper
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Temper & Season',
          instruction: 'Bring ribeye steaks to room temperature for 30 minutes. Pat thoroughly dry with paper towels and coat heavily with kosher salt and freshly cracked black pepper.',
          timer: '05:00',
          img: 'assets/ribeye.jpg',
          ingredients: [{ name: 'Ribeye Steaks', amt: '2 steaks' }, { name: 'Salt & Pepper', amt: 'Generously' }]
        },
        {
          stepNum: 2,
          title: 'Cast Iron High-Heat Sear',
          instruction: 'Heat a heavy cast-iron skillet over high heat until smoking hot. Add 1 tbsp avocado oil and sear steak undisturbed for 3 minutes per side to build a dark mahogany crust.',
          timer: '06:00',
          img: 'assets/ribeye.jpg',
          ingredients: [{ name: 'High Smoke Point Oil', amt: '1 tbsp' }]
        },
        {
          stepNum: 3,
          title: 'Butter Baste (Arrosé)',
          instruction: 'Drop heat to medium. Add butter, crushed garlic, rosemary, and thyme sprigs. Tilt skillet and continuously spoon foaming herb butter over the steak for 2 minutes until internal temp reaches 130°F (Medium-Rare).',
          timer: '03:00',
          img: 'assets/ribeye.jpg',
          ingredients: [{ name: 'Butter', amt: '4 tbsp' }, { name: 'Garlic & Herbs', amt: '5 cloves & 4 sprigs' }]
        },
        {
          stepNum: 4,
          title: 'Rest & Carve',
          instruction: 'Transfer steak to a warm cutting board. Rest for 7 minutes to redistribute juices before carving against the grain into thick, succulent slices.',
          timer: '07:00',
          img: 'assets/ribeye.jpg',
          ingredients: [{ name: 'Flaky Maldon Salt', amt: 'For finish' }]
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
          { name: 'Sugars', val: '0.20g', pct: '(0% DV)' },
          { name: 'Protein', val: '64.50g', pct: '(96% DV)' },
          { name: 'Sodium', val: '580.00mg', pct: '(25% DV)' },
          { name: 'Dietary Fiber', val: '0.40g', pct: '(2% DV)' }
        ]
      },
      community: {
        liked: '512 liked',
        disliked: '8 disliked',
        tags: ['Keto Pure', 'High Protein', 'Steakhouse Quality', 'Cast Iron Sear', 'Chef Basted']
      }
    },

    'pad-thai': {
      id: 5,
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
          ingredientIcon: FHD_RAW_DATABASE.rice_noodles,
          icon: FHD_RAW_DATABASE.rice_noodles,
          img: FHD_RAW_DATABASE.rice_noodles
        },
        {
          name: 'Wild Tiger Prawns',
          qty: '8 large peeled',
          amount: '8 large peeled',
          base: 8,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.prawn_shrimp,
          icon: FHD_RAW_DATABASE.prawn_shrimp,
          img: FHD_RAW_DATABASE.prawn_shrimp
        },
        {
          name: 'Tamarind Paste Concentrate',
          qty: '3 tbsp',
          amount: '3 tbsp',
          base: 3,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.tamarind_paste,
          icon: FHD_RAW_DATABASE.tamarind_paste,
          img: FHD_RAW_DATABASE.tamarind_paste
        },
        {
          name: 'Thai Fish Sauce & Palm Sugar',
          qty: '2 tbsp each',
          amount: '2 tbsp each',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.broth_consomme,
          icon: FHD_RAW_DATABASE.broth_consomme,
          img: FHD_RAW_DATABASE.broth_consomme
        },
        {
          name: 'Firm Tofu & Garlic Chives',
          qty: '100g diced',
          amount: '100g diced',
          base: 100,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.tofu,
          icon: FHD_RAW_DATABASE.tofu,
          img: FHD_RAW_DATABASE.tofu
        },
        {
          name: 'Crushed Toasted Peanuts',
          qty: '1/4 cup',
          amount: '1/4 cup',
          base: 0.25,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.peanuts,
          icon: FHD_RAW_DATABASE.peanuts,
          img: FHD_RAW_DATABASE.peanuts
        },
        {
          name: 'Fresh Bean Sprouts & Lime',
          qty: '1 cup & 2 wedges',
          amount: '1 cup & 2 wedges',
          base: 1,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.lime_citrus,
          icon: FHD_RAW_DATABASE.lime_citrus,
          img: FHD_RAW_DATABASE.lime_citrus
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Soak Noodles & Blend Sauce',
          instruction: 'Soak dried rice noodles in warm water for 25 minutes until pliable but firm. Whisk tamarind concentrate, fish sauce, palm sugar, and warm water in a bowl until smooth.',
          timer: '05:00',
          img: 'assets/pad-thai.png',
          ingredients: [{ name: 'Rice Noodles', amt: '200g' }, { name: 'Tamarind Sauce', amt: '3 tbsp' }]
        },
        {
          stepNum: 2,
          title: 'Sear Prawns & Tofu',
          instruction: 'Heat peanut oil in a smoking-hot wok. Sear tiger prawns for 1.5 minutes per side until pink and curled; remove. Toss diced tofu and shallots in remaining oil until golden.',
          timer: '03:00',
          img: 'assets/pad-thai.png',
          ingredients: [{ name: 'Tiger Prawns', amt: '8 pcs' }, { name: 'Tofu & Shallots', amt: '100g' }]
        },
        {
          stepNum: 3,
          title: 'Wok Stir-Fry & Egg Ribbon',
          instruction: 'Add soaked noodles and tamarind sauce to the wok. Toss vigorously until sauce is fully absorbed. Push noodles to the side, scramble 2 eggs, and fold into noodle ribbons.',
          timer: '04:00',
          img: 'assets/pad-thai.png',
          ingredients: [{ name: 'Eggs', amt: '2 pcs' }, { name: 'Sauce', amt: 'All' }]
        },
        {
          stepNum: 4,
          title: 'Fold In Sprouts & Garnish',
          instruction: 'Return prawns to wok. Add bean sprouts and garlic chives; toss for 30 seconds. Serve topped with crushed roasted peanuts, fresh coriander, and lime wedges.',
          timer: '02:00',
          img: 'assets/pad-thai.png',
          ingredients: [{ name: 'Peanuts & Chives', amt: 'Garnish' }, { name: 'Lime Wedges', amt: '2 pcs' }]
        }
      ],
      healthScore: {
        score: 7.9,
        rating: 'Balanced',
        ratingSub: 'Thai Wok',
        macros: {
          protein: { val: '32.6g', pct: 72 },
          carbs: { val: '58.4g', pct: 64 },
          fat: { val: '16.8g', pct: 36 },
          fiber: { val: '4.5g', pct: 52 }
        },
        nutritionTable: [
          { name: 'Calories', val: '510 kcal', pct: '(25% DV)' },
          { name: 'Total Fat', val: '16.80g', pct: '(22% DV)' },
          { name: 'Carbohydrates', val: '58.40g', pct: '(21% DV)' },
          { name: 'Sugars', val: '12.60g', pct: '(25% DV)' },
          { name: 'Protein', val: '32.60g', pct: '(65% DV)' },
          { name: 'Sodium', val: '940.00mg', pct: '(41% DV)' },
          { name: 'Dietary Fiber', val: '4.50g', pct: '(16% DV)' }
        ]
      },
      community: {
        liked: '418 liked',
        disliked: '12 disliked',
        tags: ['Street Food Hero', 'Tamarind Tang', 'Wok Hei Char', 'Quick Stir-Fry', 'Thai Royalty']
      }
    },

    'ceviche': {
      id: 6,
      slug: 'ceviche',
      title: 'Classic Peruvian Ceviche',
      subtitle: 'Fresh Pacific sea bass cured in vibrant citrus leche de tigre with red onions, choclo corn, and sweet potato.',
      image: 'assets/ceviche.png',
      imageUrl: 'assets/ceviche.png',
      img: 'assets/ceviche.png',
      fallbackImage: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=800',
      category: 'PERUVIAN SEAFOOD',
      badge: "Chef's Signature",
      prepTime: '15 min',
      cookTime: '0 min',
      totalTime: '15 minutes',
      servings: 2,
      calories: 280,
      calorieStr: '280 kcal',
      likes: '315.2k',
      intro: 'The crown jewel of coastal Peruvian gastronomy. Ultra-fresh sea bass gently cold-cured in tart freshly squeezed lime juice infused with fiery aji limo chilies, ginger, and garlic.',
      ingredients: [
        {
          name: 'Fresh Sea Bass / Corvina Fillet',
          qty: '350g cubed',
          amount: '350g cubed',
          base: 350,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.corvina_seabass,
          icon: FHD_RAW_DATABASE.corvina_seabass,
          img: FHD_RAW_DATABASE.corvina_seabass
        },
        {
          name: 'Fresh Key Lime Juice (Leche de Tigre)',
          qty: '3/4 cup squeezed',
          amount: '3/4 cup squeezed',
          base: 0.75,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.lime_citrus,
          icon: FHD_RAW_DATABASE.lime_citrus,
          img: FHD_RAW_DATABASE.lime_citrus
        },
        {
          name: 'Sliced Red Onion',
          qty: '1/2 onion sliced',
          amount: '1/2 onion sliced',
          base: 0.5,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.red_onion,
          icon: FHD_RAW_DATABASE.red_onion,
          img: FHD_RAW_DATABASE.red_onion
        },
        {
          name: 'Fresh Aji Limo Chili',
          qty: '1 pepper minced',
          amount: '1 pepper minced',
          base: 1,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.chili_pepper,
          icon: FHD_RAW_DATABASE.chili_pepper,
          img: FHD_RAW_DATABASE.chili_pepper
        },
        {
          name: 'Peruvian Choclo Giant Corn',
          qty: '1/2 cup cooked',
          amount: '1/2 cup cooked',
          base: 0.5,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.choclo_corn,
          icon: FHD_RAW_DATABASE.choclo_corn,
          img: FHD_RAW_DATABASE.choclo_corn
        },
        {
          name: 'Steamed Sweet Potato (Camote)',
          qty: '1 medium sliced',
          amount: '1 medium sliced',
          base: 1,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.sweet_potato,
          icon: FHD_RAW_DATABASE.sweet_potato,
          img: FHD_RAW_DATABASE.sweet_potato
        },
        {
          name: 'Fresh Cilantro Leaves & Sea Salt',
          qty: 'To garnish',
          amount: 'To garnish',
          base: 1,
          unit: 'taste',
          ingredientIcon: FHD_RAW_DATABASE.cilantro_mint,
          icon: FHD_RAW_DATABASE.cilantro_mint,
          img: FHD_RAW_DATABASE.cilantro_mint
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Slice Fish & Chill',
          instruction: 'Cut fresh sea bass into uniform 3/4-inch cubes. Season lightly with sea salt and chill in an iced glass bowl for 5 minutes.',
          timer: '05:00',
          img: 'assets/ceviche.png',
          ingredients: [{ name: 'Sea Bass Fillet', amt: '350g' }, { name: 'Sea Salt', amt: '1/2 tsp' }]
        },
        {
          stepNum: 2,
          title: 'Extract Leche de Tigre',
          instruction: 'Gently squeeze fresh key limes without crushing the bitter pith. Whisk the lime juice with a crushed garlic clove, microplaned ginger, and a fresh cilantro sprig.',
          timer: '04:00',
          img: 'assets/ceviche.png',
          ingredients: [{ name: 'Key Lime Juice', amt: '3/4 cup' }, { name: 'Ginger & Garlic', amt: 'Aromatics' }]
        },
        {
          stepNum: 3,
          title: 'Flash Citrus Cure',
          instruction: 'Pour the cold leche de tigre over the fish cubes with sliced aji limo. Gently toss for 2–3 minutes until the fish exterior becomes opaque and firm.',
          timer: '03:00',
          img: 'assets/ceviche.png',
          ingredients: [{ name: 'Aji Limo Chili', amt: '1 minced' }]
        },
        {
          stepNum: 4,
          title: 'Plate Chilled with Camote & Choclo',
          instruction: 'Fold in thinly sliced red onions and chopped cilantro. Plate immediately alongside boiled choclo corn kernels and sweet potato rounds. Spoon remaining leche de tigre over the fish.',
          timer: '03:00',
          img: 'assets/ceviche.png',
          ingredients: [{ name: 'Red Onion & Cilantro', amt: 'Garnish' }, { name: 'Choclo & Sweet Potato', amt: 'Sides' }]
        }
      ],
      healthScore: {
        score: 9.6,
        rating: 'Optimal',
        ratingSub: 'Low Calorie',
        macros: {
          protein: { val: '38.5g', pct: 88 },
          carbs: { val: '12.4g', pct: 16 },
          fat: { val: '3.2g', pct: 8 },
          fiber: { val: '2.8g', pct: 35 }
        },
        nutritionTable: [
          { name: 'Calories', val: '280 kcal', pct: '(14% DV)' },
          { name: 'Total Fat', val: '3.20g', pct: '(4% DV)' },
          { name: 'Carbohydrates', val: '12.40g', pct: '(4% DV)' },
          { name: 'Sugars', val: '2.10g', pct: '(4% DV)' },
          { name: 'Protein', val: '38.50g', pct: '(77% DV)' },
          { name: 'Sodium', val: '420.00mg', pct: '(18% DV)' },
          { name: 'Dietary Fiber', val: '2.80g', pct: '(10% DV)' }
        ]
      },
      community: {
        liked: '495 liked',
        disliked: '4 disliked',
        tags: ['Keto Pure', 'Gluten Free', 'Zero Cook', 'Fresh Seafood', 'Lime Cured', 'Peruvian Classic']
      }
    },

    'biryani': {
      id: 4,
      slug: 'biryani',
      title: 'Royal Indian Chicken Biryani',
      subtitle: 'Hyderabadi Dum style aged basmati rice layered with saffron, rose water, and spiced chicken.',
      image: 'assets/biryani.png',
      imageUrl: 'assets/biryani.png',
      img: 'assets/biryani.png',
      fallbackImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
      category: 'INDIAN ROYALTY',
      badge: "Chef's Signature",
      prepTime: '25 min',
      cookTime: '35 min',
      totalTime: '60 minutes',
      servings: 4,
      calories: 540,
      calorieStr: '540 kcal',
      likes: '385.2k',
      intro: 'Slow-cooked Dum Biryani perfected with aged long-grain basmati, Kashmiri saffron infused milk, ghee fried onions (birista), and fragrant whole spices sealed in heavy copper.',
      ingredients: [
        {
          name: 'Aged Long-Grain Basmati Rice',
          qty: '2 cups soaked',
          amount: '2 cups soaked',
          base: 2,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.basmati_rice,
          icon: FHD_RAW_DATABASE.basmati_rice,
          img: FHD_RAW_DATABASE.basmati_rice
        },
        {
          name: 'Bone-In Chicken Thighs',
          qty: '800g marinated',
          amount: '800g marinated',
          base: 800,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.chicken_thigh,
          icon: FHD_RAW_DATABASE.chicken_thigh,
          img: FHD_RAW_DATABASE.chicken_thigh
        },
        {
          name: 'Pure Cow Ghee & Saffron Milk',
          qty: '3 tbsp & 1/4 cup',
          amount: '3 tbsp & 1/4 cup',
          base: 3,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.ghee,
          icon: FHD_RAW_DATABASE.ghee,
          img: FHD_RAW_DATABASE.ghee
        },
        {
          name: 'Golden Crispy Fried Onions (Birista)',
          qty: '1 cup',
          amount: '1 cup',
          base: 1,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.fried_birista_onion,
          icon: FHD_RAW_DATABASE.fried_birista_onion,
          img: FHD_RAW_DATABASE.fried_birista_onion
        },
        {
          name: 'Fresh Mint & Coriander Leaves',
          qty: '1/2 cup chopped',
          amount: '1/2 cup chopped',
          base: 0.5,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.cilantro_mint,
          icon: FHD_RAW_DATABASE.cilantro_mint,
          img: FHD_RAW_DATABASE.cilantro_mint
        },
        {
          name: 'Whole Spices (Cardamom, Star Anise, Cloves)',
          qty: '1 tbsp blend',
          amount: '1 tbsp blend',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.whole_spices,
          icon: FHD_RAW_DATABASE.whole_spices,
          img: FHD_RAW_DATABASE.whole_spices
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Marinate Chicken in Spiced Yogurt',
          instruction: 'Marinate chicken thighs with Greek yogurt, ginger-garlic paste, red chili, garam masala, mint, and lemon juice for at least 30 minutes.',
          timer: '15:00',
          img: 'assets/biryani.png',
          ingredients: [{ name: 'Chicken Thighs', amt: '800g' }, { name: 'Yogurt & Spices', amt: '1 cup' }]
        },
        {
          stepNum: 2,
          title: 'Parboil Basmati with Aromatics',
          instruction: 'Boil soaked basmati rice with whole cardamom, cinnamon, and star anise for 6 minutes until 70% cooked (grain breaks into 3 pieces). Drain immediately.',
          timer: '08:00',
          img: 'assets/biryani.png',
          ingredients: [{ name: 'Basmati Rice', amt: '2 cups' }, { name: 'Whole Spices', amt: '1 tbsp' }]
        },
        {
          stepNum: 3,
          title: 'Layer for Dum Cooking',
          instruction: 'In a heavy-bottomed pot, spread marinated chicken as base layer. Layer parboiled rice over top. Drizzle with saffron milk, ghee, fried onions, and fresh mint.',
          timer: '05:00',
          img: 'assets/biryani.png',
          ingredients: [{ name: 'Saffron Milk & Ghee', amt: '3 tbsp' }, { name: 'Birista Onions', amt: '1 cup' }]
        },
        {
          stepNum: 4,
          title: 'Dum Steam & Serve',
          instruction: 'Seal lid tightly with foil or dough. Cook on high heat for 5 minutes, then low heat on a tawa for 25 minutes. Rest 10 minutes before gently fluffing layers.',
          timer: '25:00',
          img: 'assets/biryani.png',
          ingredients: [{ name: 'Raita / Mirchi Ka Salan', amt: 'Accompaniment' }]
        }
      ],
      healthScore: {
        score: 8.2,
        rating: 'Nutrient Rich',
        ratingSub: 'Ayurvedic Spiced',
        macros: {
          protein: { val: '38.2g', pct: 76 },
          carbs: { val: '62.0g', pct: 68 },
          fat: { val: '15.4g', pct: 34 },
          fiber: { val: '3.8g', pct: 42 }
        },
        nutritionTable: [
          { name: 'Calories', val: '540 kcal', pct: '(27% DV)' },
          { name: 'Total Fat', val: '15.40g', pct: '(20% DV)' },
          { name: 'Carbohydrates', val: '62.00g', pct: '(23% DV)' },
          { name: 'Sugars', val: '3.20g', pct: '(6% DV)' },
          { name: 'Protein', val: '38.20g', pct: '(76% DV)' },
          { name: 'Sodium', val: '640.00mg', pct: '(28% DV)' },
          { name: 'Dietary Fiber', val: '3.80g', pct: '(14% DV)' }
        ]
      },
      community: {
        liked: '620 liked',
        disliked: '10 disliked',
        tags: ['Dum Pukht', 'Saffron Fragrant', 'Royal Feast', 'Authentic Hyderabadi', 'Celebration Dish']
      }
    },

    'sushi': {
      id: 7,
      slug: 'sushi',
      title: 'Japanese Premium Sushi Platter',
      subtitle: 'Artisanal hand-pressed nigiri and maki rolls with sashimi-grade Atlantic salmon and bluefin tuna.',
      image: 'assets/sushi.png',
      imageUrl: 'assets/sushi.png',
      img: 'assets/sushi.png',
      fallbackImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
      category: 'JAPANESE ARTISAN',
      badge: 'Premium Selection',
      prepTime: '25 min',
      cookTime: '15 min',
      totalTime: '40 minutes',
      servings: 3,
      calories: 420,
      calorieStr: '420 kcal',
      likes: '294.5k',
      intro: 'Traditional Edomae precision. Seasoned Koshihikari sushi rice paired with flash-sliced sashimi, real Hon-wasabi, and pickled young ginger.',
      ingredients: [
        {
          name: 'Sashimi-Grade Atlantic Salmon',
          qty: '250g sliced',
          amount: '250g sliced',
          base: 250,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.salmon_fillet,
          icon: FHD_RAW_DATABASE.salmon_fillet,
          img: FHD_RAW_DATABASE.salmon_fillet
        },
        {
          name: 'Bluefin Tuna Loin',
          qty: '200g sliced',
          amount: '200g sliced',
          base: 200,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.tuna_fillet,
          icon: FHD_RAW_DATABASE.tuna_fillet,
          img: FHD_RAW_DATABASE.tuna_fillet
        },
        {
          name: 'Koshihikari Short-Grain Rice',
          qty: '2 cups cooked',
          amount: '2 cups cooked',
          base: 2,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.sushi_rice,
          icon: FHD_RAW_DATABASE.sushi_rice,
          img: FHD_RAW_DATABASE.sushi_rice
        },
        {
          name: 'Seasoned Rice Vinegar (Shari)',
          qty: '3 tbsp',
          amount: '3 tbsp',
          base: 3,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.broth_consomme,
          icon: FHD_RAW_DATABASE.broth_consomme,
          img: FHD_RAW_DATABASE.broth_consomme
        },
        {
          name: 'Nori Seaweed Sheets',
          qty: '4 sheets',
          amount: '4 sheets',
          base: 4,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.nori_seaweed,
          icon: FHD_RAW_DATABASE.nori_seaweed,
          img: FHD_RAW_DATABASE.nori_seaweed
        },
        {
          name: 'Fresh Wasabi & Pickled Ginger (Gari)',
          qty: 'To serve',
          amount: 'To serve',
          base: 1,
          unit: 'serve',
          ingredientIcon: FHD_RAW_DATABASE.wasabi_ginger,
          icon: FHD_RAW_DATABASE.wasabi_ginger,
          img: FHD_RAW_DATABASE.wasabi_ginger
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Prepare Sushi Rice (Shari)',
          instruction: 'Cook washed Koshihikari rice. While warm, fold in seasoned rice vinegar with a cutting motion in a wooden hangiri bowl until glossy.',
          timer: '15:00',
          img: 'assets/sushi.png',
          ingredients: [{ name: 'Koshihikari Rice', amt: '2 cups' }, { name: 'Rice Vinegar', amt: '3 tbsp' }]
        },
        {
          stepNum: 2,
          title: 'Slice Sashimi with Yanagiba',
          instruction: 'Slice fresh salmon and tuna against the grain at a 45-degree angle in a single smooth pull into 1/4-inch thick nigiri cuts.',
          timer: '10:00',
          img: 'assets/sushi.png',
          ingredients: [{ name: 'Salmon & Tuna', amt: '450g total' }]
        },
        {
          stepNum: 3,
          title: 'Form Nigiri Mounds',
          instruction: 'Dampen hands with tezu water. Form a 20g pillow of rice, dab with a speck of fresh wasabi, and press the fish slice securely on top.',
          timer: '08:00',
          img: 'assets/sushi.png',
          ingredients: [{ name: 'Wasabi', amt: '1 tsp' }, { name: 'Shari Rice', amt: 'Per piece' }]
        },
        {
          stepNum: 4,
          title: 'Plate & Serve',
          instruction: 'Arrange nigiri and maki rolls on a chilled slate platter. Serve alongside tamari soy sauce, gari ginger, and roasted sesame.',
          timer: '05:00',
          img: 'assets/sushi.png',
          ingredients: [{ name: 'Tamari Soy & Gari', amt: 'To serve' }]
        }
      ],
      healthScore: {
        score: 9.4,
        rating: 'Optimal',
        ratingSub: 'Omega-3 Rich',
        macros: {
          protein: { val: '36.4g', pct: 82 },
          carbs: { val: '48.2g', pct: 54 },
          fat: { val: '8.6g', pct: 18 },
          fiber: { val: '2.4g', pct: 30 }
        },
        nutritionTable: [
          { name: 'Calories', val: '420 kcal', pct: '(21% DV)' },
          { name: 'Total Fat', val: '8.60g', pct: '(11% DV)' },
          { name: 'Carbohydrates', val: '48.20g', pct: '(17% DV)' },
          { name: 'Sugars', val: '4.10g', pct: '(8% DV)' },
          { name: 'Protein', val: '36.40g', pct: '(73% DV)' },
          { name: 'Sodium', val: '480.00mg', pct: '(21% DV)' },
          { name: 'Dietary Fiber', val: '2.40g', pct: '(9% DV)' }
        ]
      },
      community: {
        liked: '584 liked',
        disliked: '6 disliked',
        tags: ['Clean Eating', 'Omega-3 Power', 'Edomae Tradition', 'Sashimi Grade', 'Michelin Level']
      }
    },

    'birria': {
      id: 8,
      slug: 'birria',
      title: 'Authentic Mexican Birria Tacos',
      subtitle: 'Tender slow-braised beef inside crispy chili-dipped tortillas with melted Oaxaca cheese and consommé.',
      image: 'assets/birria.png',
      imageUrl: 'assets/birria.png',
      img: 'assets/birria.png',
      fallbackImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
      category: 'MEXICAN TRADITION',
      badge: 'Slow Cooked',
      prepTime: '20 min',
      cookTime: '160 min',
      totalTime: '3 Hours',
      servings: 4,
      calories: 680,
      calorieStr: '680 kcal',
      likes: '349.8k',
      intro: 'Jalisco style slow-braised beef chuck and short ribs simmered in a smoky broth of Guajillo, Ancho, and Chipotle chilies with cinnamon and Mexican oregano.',
      ingredients: [
        {
          name: 'Beef Chuck Roast & Short Ribs',
          qty: '1.2 kg cut in chunks',
          amount: '1.2 kg cut in chunks',
          base: 1200,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.beef_chuck,
          icon: FHD_RAW_DATABASE.beef_chuck,
          img: FHD_RAW_DATABASE.beef_chuck
        },
        {
          name: 'Dried Guajillo & Ancho Chilies',
          qty: '6 peppers stemmed',
          amount: '6 peppers stemmed',
          base: 6,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.dried_chilies,
          icon: FHD_RAW_DATABASE.dried_chilies,
          img: FHD_RAW_DATABASE.dried_chilies
        },
        {
          name: 'Oaxaca / Quesadilla Melting Cheese',
          qty: '300g shredded',
          amount: '300g shredded',
          base: 300,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.oaxaca_cheese,
          icon: FHD_RAW_DATABASE.oaxaca_cheese,
          img: FHD_RAW_DATABASE.oaxaca_cheese
        },
        {
          name: 'White Corn Tortillas',
          qty: '12 tortillas',
          amount: '12 tortillas',
          base: 12,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.corn_tortilla,
          icon: FHD_RAW_DATABASE.corn_tortilla,
          img: FHD_RAW_DATABASE.corn_tortilla
        },
        {
          name: 'Mexican Oregano & Cinnamon',
          qty: '1 stick & 1 tbsp',
          amount: '1 stick & 1 tbsp',
          base: 1,
          unit: 'tbsp',
          ingredientIcon: FHD_RAW_DATABASE.whole_spices,
          icon: FHD_RAW_DATABASE.whole_spices,
          img: FHD_RAW_DATABASE.whole_spices
        },
        {
          name: 'Diced White Onions & Cilantro',
          qty: 'For garnish',
          amount: 'For garnish',
          base: 1,
          unit: 'garnish',
          ingredientIcon: FHD_RAW_DATABASE.yellow_onion,
          icon: FHD_RAW_DATABASE.yellow_onion,
          img: FHD_RAW_DATABASE.yellow_onion
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Toast & Blend Chili Adobo',
          instruction: 'Toast dried chilies in a dry pan for 1 minute. Rehydrate in boiling water, then blend with garlic, roasted tomatoes, vinegar, and Mexican spices into a deep red marinade.',
          timer: '15:00',
          img: 'assets/birria.png',
          ingredients: [{ name: 'Dried Chilies', amt: '6 pcs' }, { name: 'Aromatics & Spices', amt: '1 bowl' }]
        },
        {
          stepNum: 2,
          title: 'Slow Braise the Beef',
          instruction: 'Sear seasoned beef chunks. Pour chili adobo and beef stock over the meat. Cover tightly and simmer on low for 2.5–3 hours until fork-tender and shreddable.',
          timer: '150:00',
          img: 'assets/birria.png',
          ingredients: [{ name: 'Beef Chuck', amt: '1.2 kg' }, { name: 'Chili Broth', amt: 'All' }]
        },
        {
          stepNum: 3,
          title: 'Shred & Dip Tortillas',
          instruction: 'Shred the tender beef. Skim rich red chili oil from top of consommé. Dip corn tortillas into the oil and place on a hot flat-top griddle.',
          timer: '10:00',
          img: 'assets/birria.png',
          ingredients: [{ name: 'Tortillas', amt: '12 pcs' }, { name: 'Chili Oil', amt: 'For dipping' }]
        },
        {
          stepNum: 4,
          title: 'Melt Quesatacos & Serve',
          instruction: 'Top tortillas with Oaxaca cheese and shredded beef. Fold into crispy tacos. Serve immediately with hot bowls of rich consommé for dipping.',
          timer: '05:00',
          img: 'assets/birria.png',
          ingredients: [{ name: 'Oaxaca Cheese', amt: '300g' }, { name: 'Consommé & Lime', amt: 'For dipping' }]
        }
      ],
      healthScore: {
        score: 7.6,
        rating: 'Hearty',
        ratingSub: 'High Protein',
        macros: {
          protein: { val: '46.8g', pct: 88 },
          carbs: { val: '38.0g', pct: 48 },
          fat: { val: '34.2g', pct: 54 },
          fiber: { val: '5.2g', pct: 60 }
        },
        nutritionTable: [
          { name: 'Calories', val: '680 kcal', pct: '(34% DV)' },
          { name: 'Total Fat', val: '34.20g', pct: '(44% DV)' },
          { name: 'Carbohydrates', val: '38.00g', pct: '(14% DV)' },
          { name: 'Sugars', val: '3.80g', pct: '(7% DV)' },
          { name: 'Protein', val: '46.80g', pct: '(93% DV)' },
          { name: 'Sodium', val: '880.00mg', pct: '(38% DV)' },
          { name: 'Dietary Fiber', val: '5.20g', pct: '(19% DV)' }
        ]
      },
      community: {
        liked: '592 liked',
        disliked: '7 disliked',
        tags: ['Slow Braised', 'Dipping Consommé', 'Crispy Quesataco', 'Jalisco Gold', 'Street Legend']
      }
    },

    'bourguignon': {
      id: 1,
      slug: 'bourguignon',
      title: 'Classic French Beef Bourguignon',
      subtitle: 'Slow-braised beef chuck in Burgundy red wine with pearl onions, cremini mushrooms, and smoky lardons.',
      image: 'assets/bourguignon.png',
      imageUrl: 'assets/bourguignon.png',
      img: 'assets/bourguignon.png',
      fallbackImage: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800',
      category: 'FRENCH HERITAGE',
      badge: 'Slow Cooked',
      prepTime: '25 min',
      cookTime: '150 min',
      totalTime: '2.5 Hours',
      servings: 4,
      calories: 590,
      calorieStr: '590 kcal',
      likes: '221.8k',
      intro: 'The crown jewel of Burgundian gastronomy. Beef chuck slowly tenderized in full-bodied Pinot Noir with caramelised pearl onions and golden butter-sautéed mushrooms.',
      ingredients: [
        {
          name: 'Beef Chuck (cut in 2-inch chunks)',
          qty: '1 kg',
          amount: '1 kg',
          base: 1000,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.beef_chuck,
          icon: FHD_RAW_DATABASE.beef_chuck,
          img: FHD_RAW_DATABASE.beef_chuck
        },
        {
          name: 'Smoky Bacon Lardons',
          qty: '180g diced',
          amount: '180g diced',
          base: 180,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.guanciale_pork,
          icon: FHD_RAW_DATABASE.guanciale_pork,
          img: FHD_RAW_DATABASE.guanciale_pork
        },
        {
          name: 'Burgundy Pinot Noir Red Wine',
          qty: '1 bottle (750ml)',
          amount: '1 bottle (750ml)',
          base: 1,
          unit: 'bottle',
          ingredientIcon: FHD_RAW_DATABASE.wine_broth,
          icon: FHD_RAW_DATABASE.wine_broth,
          img: FHD_RAW_DATABASE.wine_broth
        },
        {
          name: 'Pearl Onions & Cremini Mushrooms',
          qty: '250g each',
          amount: '250g each',
          base: 250,
          unit: 'g',
          ingredientIcon: FHD_RAW_DATABASE.cremini_mushrooms,
          icon: FHD_RAW_DATABASE.cremini_mushrooms,
          img: FHD_RAW_DATABASE.cremini_mushrooms
        },
        {
          name: 'Fresh Thyme & Bay Leaves',
          qty: 'Herb bouquet',
          amount: 'Herb bouquet',
          base: 1,
          unit: 'pieces',
          ingredientIcon: FHD_RAW_DATABASE.rosemary_thyme,
          icon: FHD_RAW_DATABASE.rosemary_thyme,
          img: FHD_RAW_DATABASE.rosemary_thyme
        },
        {
          name: 'Rich Veal / Beef Stock',
          qty: '2 cups',
          amount: '2 cups',
          base: 2,
          unit: 'cup',
          ingredientIcon: FHD_RAW_DATABASE.broth_consomme,
          icon: FHD_RAW_DATABASE.broth_consomme,
          img: FHD_RAW_DATABASE.broth_consomme
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Render Lardons & Brown Beef',
          instruction: 'Crisp diced bacon lardons in a heavy Dutch oven. Remove lardons and brown dry beef chunks in single batches until deeply caramelized on all sides.',
          timer: '15:00',
          img: 'assets/bourguignon.png',
          ingredients: [{ name: 'Bacon Lardons', amt: '180g' }, { name: 'Beef Chuck', amt: '1 kg' }]
        },
        {
          stepNum: 2,
          title: 'Deglaze & Simmer in Wine',
          instruction: 'Sauté carrots and sliced onions. Stir in tomato paste and flour. Pour in the full bottle of Burgundy red wine and stock, scraping up all browned fond from the pot bottom.',
          timer: '10:00',
          img: 'assets/bourguignon.png',
          ingredients: [{ name: 'Red Wine', amt: '750ml' }, { name: 'Beef Stock', amt: '2 cups' }]
        },
        {
          stepNum: 3,
          title: 'Slow Braise with Herb Bouquet',
          instruction: 'Add herb bouquet. Cover tightly and simmer on low heat or bake at 325°F for 2.5 hours until beef is melt-in-the-mouth tender.',
          timer: '150:00',
          img: 'assets/bourguignon.png',
          ingredients: [{ name: 'Thyme & Bay Leaves', amt: '1 bouquet' }]
        },
        {
          stepNum: 4,
          title: 'Fold In Sautéed Mushrooms & Garnish',
          instruction: 'In a separate skillet, brown pearl onions and quartered mushrooms in butter. Gently fold into the stew before serving over buttery mashed potatoes or egg noodles.',
          timer: '10:00',
          img: 'assets/bourguignon.png',
          ingredients: [{ name: 'Mushrooms & Pearl Onions', amt: '250g each' }, { name: 'Fresh Parsley', amt: 'Garnish' }]
        }
      ],
      healthScore: {
        score: 8.0,
        rating: 'Nutritious',
        ratingSub: 'Classic Stew',
        macros: {
          protein: { val: '44.2g', pct: 86 },
          carbs: { val: '18.6g', pct: 24 },
          fat: { val: '28.4g', pct: 46 },
          fiber: { val: '3.6g', pct: 40 }
        },
        nutritionTable: [
          { name: 'Calories', val: '590 kcal', pct: '(29% DV)' },
          { name: 'Total Fat', val: '28.40g', pct: '(36% DV)' },
          { name: 'Carbohydrates', val: '18.60g', pct: '(7% DV)' },
          { name: 'Sugars', val: '4.20g', pct: '(8% DV)' },
          { name: 'Protein', val: '44.20g', pct: '(88% DV)' },
          { name: 'Sodium', val: '680.00mg', pct: '(30% DV)' },
          { name: 'Dietary Fiber', val: '3.60g', pct: '(13% DV)' }
        ]
      },
      community: {
        liked: '410 liked',
        disliked: '9 disliked',
        tags: ['French Heritage', 'Pinot Noir Braise', 'Sunday Supper', 'Comfort Classic', 'Julia Child Heritage']
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ALIAS DICTIONARY (Supports IDs 1-9, card IDs, slugs, and title variants)
  // ═══════════════════════════════════════════════════════════════════════════
  const RECIPE_ALIASES = {
    '1': 'bourguignon',
    '2': 'carbonara',
    '3': 'sesame-chicken',
    '4': 'biryani',
    '5': 'pad-thai',
    '6': 'ceviche',
    '7': 'sushi',
    '8': 'birria',
    '9': 'ribeye',
    'bourguignon': 'bourguignon',
    'beefbourguignon': 'bourguignon',
    'beef-bourguignon': 'bourguignon',
    'card-bourguignon': 'bourguignon',
    'classic-french-beef-bourguignon': 'bourguignon',
    'carbonara': 'carbonara',
    'spaghetticarbonara': 'carbonara',
    'spaghetti-carbonara': 'carbonara',
    'card-carbonara': 'carbonara',
    'card-spaghetti-carbonara': 'carbonara',
    'roman-spaghetti-carbonara': 'carbonara',
    'pasta': 'carbonara',
    'curated-pasta-creation': 'carbonara',
    'curatedpastacreation': 'carbonara',
    'curated-creations': 'carbonara',
    'sesame-chicken': 'sesame-chicken',
    'sesamechicken': 'sesame-chicken',
    'card-sesamechicken': 'sesame-chicken',
    'card-sesame-chicken': 'sesame-chicken',
    'honey-sesame-chicken': 'sesame-chicken',
    'biryani': 'biryani',
    'chickenbiryani': 'biryani',
    'chicken-biryani': 'biryani',
    'card-biryani': 'biryani',
    'royal-indian-chicken-biryani': 'biryani',
    'pad-thai': 'pad-thai',
    'padthai': 'pad-thai',
    'card-padthai': 'pad-thai',
    'card-pad-thai': 'pad-thai',
    'authentic-thai-pad-thai': 'pad-thai',
    'ceviche': 'ceviche',
    'peruvian-ceviche': 'ceviche',
    'peruvianceviche': 'ceviche',
    'card-ceviche': 'ceviche',
    'classic-peruvian-ceviche': 'ceviche',
    'sushi': 'sushi',
    'sushiplatter': 'sushi',
    'sushi-platter': 'sushi',
    'card-sushi': 'sushi',
    'japanese-premium-sushi-platter': 'sushi',
    'birria': 'birria',
    'birriatacos': 'birria',
    'birria-tacos': 'birria',
    'card-birria': 'birria',
    'authentic-mexican-birria-tacos': 'birria',
    'ribeye': 'ribeye',
    'card-ribeye': 'ribeye',
    'prime-pan-seared-ribeye': 'ribeye',
    'prime-bone-in-ribeye': 'ribeye',
    'prime bone in ribeye': 'ribeye',
    'prime bone-in ribeye': 'ribeye',
    'primeboneinribeye': 'ribeye',
    'bone-in-ribeye': 'ribeye',
    'bone in ribeye': 'ribeye',
    'prime-ribeye': 'ribeye',
    'prime ribeye': 'ribeye'
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. ROBUST METHOD PARSER & METRIC EVALUATOR ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Safe Method Parser Engine
   * Slices unstructured strings, paragraphs, or raw arrays into clean, sequential, numbered step cards
   */
  function parseInstructionSteps(raw, defaultImg) {
    const defaultStepImages = [
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
      defaultImg || 'assets/carbonara.png'
    ];

    if (!raw) {
      return [
        { stepNum: 1, title: '1. Prep & Ingredient Mise en Place', instruction: 'Gather, wash, and uniformly slice all fresh components according to chef ratios.', timer: '05:00', img: defaultStepImages[0] },
        { stepNum: 2, title: '2. Aromatics & Skillet Sauté', instruction: 'Warm cooking oil in a skillet over medium heat and gently sauté aromatics until fragrant.', timer: '08:00', img: defaultStepImages[1] },
        { stepNum: 3, title: '3. Combine & Emulsify', instruction: 'Add core ingredients, season with sea salt and cracked pepper, and simmer until flavors marry.', timer: '12:00', img: defaultStepImages[2] },
        { stepNum: 4, title: '4. Garnish & Serve', instruction: 'Transfer hot to warmed plates, garnish with freshly chopped herbs, and enjoy immediately.', timer: '02:00', img: defaultStepImages[3] }
      ];
    }

    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((step, idx) => {
        const stepFallback = defaultStepImages[idx % defaultStepImages.length];
        if (typeof step === 'string') {
          return {
            stepNum: idx + 1,
            title: `Step ${idx + 1}`,
            instruction: step.trim(),
            timer: idx === 0 ? '05:00' : (idx === raw.length - 1 ? '02:00' : '08:00'),
            img: stepFallback,
            ingredients: []
          };
        }
        return {
          stepNum: step.stepNum || (idx + 1),
          title: step.title || `Step ${idx + 1}`,
          instruction: step.instruction || step.desc || step.text || 'Execute step according to chef instructions.',
          timer: step.timer || '05:00',
          img: (step.img !== undefined && step.img !== null) ? step.img : (step.imageUrl || step.image || stepFallback),
          ingredients: step.ingredients || []
        };
      });
    }

    if (typeof raw === 'string') {
      const text = raw.trim();
      let chunks = text.split(/(?:(?:\r?\n){2,}|(?:\bStep\s*\d+[:.]?\s*)|(?:^\d+[\.\)]\s*)|(?:\n\d+[\.\)]\s*))/i)
        .map(s => s.trim())
        .filter(s => s.length > 15);

      if (chunks.length <= 1) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        chunks = [];
        let cur = '';
        sentences.forEach(s => {
          cur += (cur ? ' ' : '') + s.trim();
          if (cur.length > 60) {
            chunks.push(cur);
            cur = '';
          }
        });
        if (cur) chunks.push(cur);
      }

      if (chunks.length === 0) chunks = [text];

      const stepTitles = [
        'Prep & Mise en Place',
        'Sear & Sauté Aromatics',
        'Combine, Simmer & Emulsify',
        'Finish, Garnish & Plate',
        'Final Chef Touch'
      ];

      return chunks.map((chunk, idx) => ({
        stepNum: idx + 1,
        title: stepTitles[idx] || `Step ${idx + 1}: Culinary Execution`,
        instruction: chunk,
        timer: idx === 0 ? '05:00' : (idx === chunks.length - 1 ? '02:00' : '08:00'),
        img: fallbackImage,
        ingredients: []
      }));
    }

    return [
      { stepNum: 1, title: 'Execute Culinary Method', instruction: String(raw), timer: '05:00', img: fallbackImage, ingredients: [] }
    ];
  }

  /**
   * Safe Metric Number Evaluator
   * Safely parses numerical variables or string expressions with fallback protection
   */
  function formatMetricCount(val, fallbackVal, defaultCount, suffix) {
    const raw = (val !== undefined && val !== null) ? val : fallbackVal;
    if (raw === undefined || raw === null || raw === '') {
      return `${defaultCount} ${suffix}`;
    }
    if (typeof raw === 'number') {
      if (isNaN(raw)) return `${defaultCount} ${suffix}`;
      return `${raw} ${suffix}`;
    }
    const str = String(raw).trim();
    if (str.toLowerCase().includes(suffix.toLowerCase())) {
      if (/[\d.]/.test(str)) {
        return str;
      }
      return `${defaultCount} ${suffix}`;
    }
    const parsedNum = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (!isNaN(parsedNum) && /[\d.]/.test(str)) {
      return `${parsedNum} ${suffix}`;
    }
    return `${defaultCount} ${suffix}`;
  }

  /**
   * Contextual Fallback Recipe Generator
   * Generates a polished, rich recipe placeholder ("Recipe incoming! We are refining this dish...")
   * for any niche, uncatalogued, or null search payload.
   */
  function createContextualFallbackRecipe(query) {
    let cleanQuery = (query || 'Gourmet Creation').trim();
    let variationIndex = 0;
    let variationPrefix = '';

    if (/-classic$/i.test(cleanQuery)) {
      cleanQuery = cleanQuery.replace(/-classic$/i, '');
      variationIndex = 0;
      variationPrefix = 'Authentic ';
    } else if (/-skillet$/i.test(cleanQuery)) {
      cleanQuery = cleanQuery.replace(/-skillet$/i, '');
      variationIndex = 1;
      variationPrefix = 'Quick Pan-Seared ';
    } else if (/-gourmet$/i.test(cleanQuery)) {
      cleanQuery = cleanQuery.replace(/-gourmet$/i, '');
      variationIndex = 2;
      variationPrefix = 'Chef AI Gourmet ';
    } else if (/-keto$/i.test(cleanQuery)) {
      cleanQuery = cleanQuery.replace(/-keto$/i, '');
      variationIndex = 3;
      variationPrefix = 'High-Protein ';
    }

    const baseTitle = cleanQuery
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim();

    const fullTitle = variationPrefix ? `${variationPrefix}${baseTitle}` : baseTitle;

    const slug = (query || 'gourmet-creation')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const photos = getDishPhotosForQuery(cleanQuery);
    const heroPhoto = photos[variationIndex] || photos[0];

    return {
      id: slug,
      slug: slug,
      title: fullTitle,
      subtitle: `Recipe incoming! We are refining this dish with our culinary masters & wow Chef AI.`,
      image: heroPhoto,
      imageUrl: heroPhoto,
      img: heroPhoto,
      fallbackImage: heroPhoto || 'assets/ribeye.jpg',
      category: 'CHEF AI INCOMING',
      badge: "RECIPE INCOMING",
      prepTime: '15 min',
      cookTime: '20 min',
      totalTime: '35 minutes',
      servings: 4,
      calories: 520,
      calorieStr: '520 kcal',
      likes: '128.5k',
      intro: `Recipe incoming! We are refining this dish with our culinary masters & wow Chef AI. Here is an optimized chef preview featuring freshly balanced macro ratios and high-definition preparation guidance.`,
      ingredients: [
        {
          name: `${baseTitle} Core Base`,
          qty: '400g',
          amount: '400g',
          base: 400,
          unit: 'g',
          ingredientIcon: getFHDIngredientPhoto(baseTitle),
          icon: getFHDIngredientPhoto(baseTitle),
          img: getFHDIngredientPhoto(baseTitle)
        },
        {
          name: 'Aromatic Garlic & Fresh Herbs',
          qty: '2 tbsp',
          amount: '2 tbsp',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: getFHDIngredientPhoto('garlic herbs'),
          icon: getFHDIngredientPhoto('garlic herbs'),
          img: getFHDIngredientPhoto('garlic herbs')
        },
        {
          name: 'Extra Virgin Cold-Pressed Oil / Ghee',
          qty: '2 tbsp',
          amount: '2 tbsp',
          base: 2,
          unit: 'tbsp',
          ingredientIcon: getFHDIngredientPhoto('olive oil'),
          icon: getFHDIngredientPhoto('olive oil'),
          img: getFHDIngredientPhoto('olive oil')
        },
        {
          name: 'Flaky Sea Salt & Toasted Peppercorn',
          qty: 'To taste',
          amount: 'To taste',
          base: 1,
          unit: 'taste',
          ingredientIcon: getFHDIngredientPhoto('sea salt black pepper'),
          icon: getFHDIngredientPhoto('sea salt black pepper'),
          img: getFHDIngredientPhoto('sea salt black pepper')
        }
      ],
      instructions: [
        {
          stepNum: 1,
          title: 'Prep & Ingredient Mise en Place',
          instruction: `Gather and measure your fresh ingredients for ${fullTitle}. Wash and uniformly prep fresh produce and aromatics.`,
          timer: '05:00',
          img: heroPhoto
        },
        {
          stepNum: 2,
          title: 'Aromatics & Skillet Sauté',
          instruction: 'Warm 2 tbsp of cooking oil or butter in a skillet over medium heat. Sauté aromatics for 2–3 minutes until fragrant.',
          timer: '06:00',
          img: heroPhoto
        },
        {
          stepNum: 3,
          title: 'Simmer & Harmonize Flavors',
          instruction: `Fold in the main ${fullTitle} components. Simmer gently while tasting and adjusting sea salt and cracked pepper to taste.`,
          timer: '12:00',
          img: heroPhoto
        },
        {
          stepNum: 4,
          title: 'Plate, Garnish & Serve Hot',
          instruction: 'Transfer to pre-warmed plates, finish with a drizzle of virgin oil and fresh herbs. Serve immediately.',
          timer: '02:00',
          img: heroPhoto
        }
      ],
      healthScore: {
        score: 8.8,
        rating: 'Optimal',
        ratingSub: 'Balanced Energy',
        macros: {
          protein: { val: '36.0g', pct: 76 },
          carbs: { val: '42.0g', pct: 52 },
          fat: { val: '14.0g', pct: 28 },
          fiber: { val: '4.2g', pct: 48 }
        },
        nutritionTable: [
          { name: 'Calories', val: '520 kcal', pct: '(26% DV)' },
          { name: 'Total Fat', val: '14.00g', pct: '(18% DV)' },
          { name: 'Carbohydrates', val: '42.00g', pct: '(15% DV)' },
          { name: 'Sugars', val: '4.80g', pct: '(10% DV)' },
          { name: 'Protein', val: '36.00g', pct: '(72% DV)' },
          { name: 'Sodium', val: '520.00mg', pct: '(23% DV)' },
          { name: 'Dietary Fiber', val: '4.20g', pct: '(15% DV)' }
        ]
      },
      community: {
        liked: '280 liked',
        disliked: '6 disliked',
        tags: ['Recipe Incoming', 'Chef AI Innovation', 'Fresh Ingredients', 'Healthy Macro Balance']
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. UNIFIED GLOBAL ROUTING & ASYNC SEARCH ENGINE
  // ═══════════════════════════════════════════════════════════════════════════
  function resolveRecipeObject(input) {
    if (!input) return RECIPE_CATALOG['sesame-chicken'];

    // Handle number inputs (e.g. 5, 6, 9)
    if (typeof input === 'number') {
      const strId = String(input);
      if (RECIPE_ALIASES[strId] && RECIPE_CATALOG[RECIPE_ALIASES[strId]]) {
        return RECIPE_CATALOG[RECIPE_ALIASES[strId]];
      }
    }

    if (typeof input === 'string') {
      const rawClean = input.trim().toLowerCase();
      const slugClean = rawClean.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const plainClean = rawClean.replace(/[^a-z0-9]/g, '');

      // Check direct catalog keys
      if (RECIPE_CATALOG[rawClean]) return RECIPE_CATALOG[rawClean];
      if (RECIPE_CATALOG[slugClean]) return RECIPE_CATALOG[slugClean];

      // Check alias dictionary
      if (RECIPE_ALIASES[rawClean] && RECIPE_CATALOG[RECIPE_ALIASES[rawClean]]) {
        return RECIPE_CATALOG[RECIPE_ALIASES[rawClean]];
      }
      if (RECIPE_ALIASES[slugClean] && RECIPE_CATALOG[RECIPE_ALIASES[slugClean]]) {
        return RECIPE_CATALOG[RECIPE_ALIASES[slugClean]];
      }
      if (RECIPE_ALIASES[plainClean] && RECIPE_CATALOG[RECIPE_ALIASES[plainClean]]) {
        return RECIPE_CATALOG[RECIPE_ALIASES[plainClean]];
      }

      // Check semantic dictionary variants
      for (const dictKey in SEMANTIC_FOOD_DICTIONARY) {
        const dict = SEMANTIC_FOOD_DICTIONARY[dictKey];
        const matchedVariant = dict.variants.find(v => {
          const vSlug = (v.slug || '').toLowerCase();
          const vId = (v.id || '').toLowerCase();
          const vTitle = (v.title || '').toLowerCase();
          return vSlug === slugClean || vId === rawClean || vSlug === rawClean || vTitle.includes(rawClean) || rawClean.includes(vSlug);
        });
        if (matchedVariant) return matchedVariant;
      }

      // Fuzzy matching across catalog titles and slugs
      const foundKey = Object.keys(RECIPE_CATALOG).find(k => {
        const item = RECIPE_CATALOG[k];
        const titleLower = (item.title || '').toLowerCase();
        const idStr = String(item.id);
        return k === slugClean ||
               k.includes(slugClean) ||
               slugClean.includes(k) ||
               idStr === rawClean ||
               titleLower.includes(rawClean) ||
               rawClean.includes(titleLower);
      });
      if (foundKey) return RECIPE_CATALOG[foundKey];

      // Return contextual fallback recipe for uncatalogued/niche queries
      return createContextualFallbackRecipe(input);
    }

    // If structured object is provided
    if (typeof input === 'object') {
      const targetImg = input.imageUrl || input.image || input.img || 'assets/sesame-chicken.png';
      const baseCatalogItem = (input.id && (RECIPE_CATALOG[input.id] || RECIPE_CATALOG[RECIPE_ALIASES[input.id]]))
        ? (RECIPE_CATALOG[input.id] || RECIPE_CATALOG[RECIPE_ALIASES[input.id]])
        : RECIPE_CATALOG['sesame-chicken'];

      const parsedSteps = parseInstructionSteps(input.instructions || baseCatalogItem.instructions, targetImg);

      return {
        ...baseCatalogItem,
        ...input,
        image: targetImg,
        imageUrl: targetImg,
        img: targetImg,
        ingredients: (input.ingredients || baseCatalogItem.ingredients || []).map(ing => {
          const rawIcon = resolveIngredientIcon(ing, { imageUrl: targetImg, image: targetImg, img: targetImg });
          return {
            ...ing,
            qty: ing.qty || ing.amount || 'To taste',
            amount: ing.amount || ing.qty || 'To taste',
            ingredientIcon: rawIcon,
            icon: rawIcon,
            image: rawIcon,
            imageUrl: rawIcon,
            img: rawIcon
          };
        }),
        instructions: parsedSteps,
        healthScore: input.healthScore || baseCatalogItem.healthScore,
        community: input.community || baseCatalogItem.community
      };
    }

    return RECIPE_CATALOG['sesame-chicken'];
  }

  /**
   * Robust Asynchronous Search Exception Handler
   * Safely queries local catalog, caches, and fallback endpoints with full try/catch protection
   */
  async function searchRecipesAsync(query, timeoutMs) {
    const limitMs = typeof timeoutMs === 'number' ? timeoutMs : 2500;
    try {
      if (!query || typeof query !== 'string' || query.trim() === '') {
        return RECIPE_CATALOG['sesame-chicken'];
      }

      const rawClean = query.trim().toLowerCase();
      
      // Check local catalog first (instant O(1) hit)
      const directHit = resolveRecipeObject(rawClean);
      if (directHit && RECIPE_CATALOG[directHit.slug || directHit.id]) {
        return directHit;
      }

      // Fetch / Promise wrapper with timeout protection
      const fetchPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(resolveRecipeObject(query));
        }, 10);
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Search query timed out')), limitMs);
      });

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      return result || createContextualFallbackRecipe(query);
    } catch (err) {
      console.warn('searchRecipesAsync exception caught gracefully:', err);
      return createContextualFallbackRecipe(query);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4B. ADVANCED SEMANTIC FOOD DICTIONARY & TARGETED CULINARY ENGINE
  // ═══════════════════════════════════════════════════════════════════════════
  const SEMANTIC_FOOD_DICTIONARY = {
    pizza: {
      canonical: 'pizza',
      categoryName: 'PIZZA & ARTISAN FLATBREADS',
      keywords: ['pizza', 'pizzas', 'margherita', 'neapolitan', 'deep dish', 'chicago style', 'detroit style', 'new york style', 'calzone', 'focaccia', 'flatbread', 'burrata pizza'],
      conflictKeywords: ['burger', 'sandwich', 'taco', 'birria', 'steak', 'ribeye', 'ceviche', 'pad thai', 'curry', 'biryani', 'ramen', 'salmon fillet', 'chicken breast', 'soup', 'salad bowl'],
      variants: [
        {
          id: 'pizza-authentic',
          slug: 'pizza-authentic',
          title: 'Authentic Neapolitan Artisan Pizza',
          subtitle: 'San Marzano D.O.P. tomato coulis, fresh Fior di Latte mozzarella, fragrant sweet basil, and extra virgin olive oil on blistered sourdough crust.',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
          img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
          strMealThumb: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
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
          community: { liked: '312 liked', disliked: '4 disliked', tags: ['Neapolitan', 'Wood-Fired', 'Fior di Latte', 'San Marzano', 'High Protein'] }
        },
        {
          id: 'pizza-skillet',
          slug: 'pizza-skillet',
          title: 'Quick Pan-Seared Skillet Pizza (Detroit Style)',
          subtitle: 'Thick airy focaccia dough baked in seasoned cast iron skillet with caramelized Wisconsin brick cheese perimeter and twin racing tomato stripes.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
          imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
          img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
          strMealThumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
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
          community: { liked: '215 liked', disliked: '3 disliked', tags: ['Detroit Style', 'Cast Iron', 'Crispy Edge', 'Pepperoni'] }
        },
        {
          id: 'pizza-chicago',
          slug: 'pizza-chicago',
          title: 'Chicago Style Deep Dish Pizza',
          subtitle: 'Buttery cornmeal crust walls loaded with sliced whole-milk mozzarella, savory fennel sausage crumble, and chunky sweet-herb tomato sauce.',
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
          img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
          strMealThumb: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
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
        {
          id: 'pizza-new-york',
          slug: 'pizza-new-york',
          title: 'New York Style Classic Thin Crust Pizza',
          subtitle: 'Extra-large foldable hand-tossed thin crust with rich low-moisture whole milk mozzarella, oregano sauce, and savory char.',
          image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
          imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
          img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
          strMealThumb: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
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
        {
          id: 'pizza-keto',
          slug: 'pizza-keto',
          title: 'High-Protein Crisp Artisan Pizza',
          subtitle: 'Low-carb golden almond-flour & egg-white protein crust topped with lean chicken breast, low-fat mozzarella, and fresh arugula.',
          image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
          imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
          img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
          strMealThumb: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
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
        {
          id: 'pizza-gourmet',
          slug: 'pizza-gourmet',
          title: 'Wow Chef AI Gourmet Truffle & Burrata Pizza',
          subtitle: 'Black winter truffle cream base, creamy Puglia burrata, wild porcini mushrooms, and 24-month aged Prosciutto di Parma.',
          image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
          imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
          img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
          strMealThumb: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85',
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
        }
      ]
    }
  };

  const FHD_DISH_GALLERY = {
    pizza: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85'
    ],
    pasta: [
      'assets/carbonara.png',
      'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85'
    ],
    chicken: [
      'assets/sesame-chicken.png',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=85'
    ],
    steak: [
      'assets/ribeye.jpg',
      'assets/ribeye.jpg',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=1200&q=85'
    ],
    taco: [
      'assets/birria.png',
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=1200&q=85'
    ],
    burger: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=1200&q=85'
    ],
    salmon: [
      'assets/ceviche.png',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85'
    ],
    salad: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85'
    ],
    curry: [
      'assets/biryani.png',
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=85'
    ],
    dessert: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85'
    ],
    generic: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85'
    ]
  };

  function getDishPhotosForQuery(query) {
    const q = (query || '').toLowerCase();
    if (/pizza/i.test(q)) return FHD_DISH_GALLERY.pizza;
    if (/pasta|spaghetti|carbonara|linguine|penne|tagliat|noodle|ramen/i.test(q)) return FHD_DISH_GALLERY.pasta;
    if (/chicken|poultry|wings|breast|thigh/i.test(q)) return FHD_DISH_GALLERY.chicken;
    if (/steak|ribeye|beef|tenderloin|meat|bourguignon/i.test(q)) return FHD_DISH_GALLERY.steak;
    if (/taco|birria|quesadilla|burrito|mexican|fajita/i.test(q)) return FHD_DISH_GALLERY.taco;
    if (/burger|sandwich|slider/i.test(q)) return FHD_DISH_GALLERY.burger;
    if (/salmon|fish|seafood|tuna|ceviche|shrimp|prawn|crab/i.test(q)) return FHD_DISH_GALLERY.salmon;
    if (/salad|healthy|greens|vegan|bowl/i.test(q)) return FHD_DISH_GALLERY.salad;
    if (/curry|dal|makhani|biryani|soup|stew|broth/i.test(q)) return FHD_DISH_GALLERY.curry;
    if (/cake|dessert|sweet|chocolate|pastry|pie/i.test(q)) return FHD_DISH_GALLERY.dessert;
    return FHD_DISH_GALLERY.generic;
  }

  /**
   * Validates search results against the Semantic Food Dictionary to guarantee zero cross-category pollution.
   */
  function validateAndFilterSearchResults(query, rawList) {
    const cleanQ = (query || '').toLowerCase().trim();
    if (!cleanQ) return rawList || [];

    // Check if query is in our semantic dictionary
    for (const key in SEMANTIC_FOOD_DICTIONARY) {
      const dict = SEMANTIC_FOOD_DICTIONARY[key];
      const matchesDict = dict.keywords.some(k => cleanQ.includes(k) || k.includes(cleanQ));
      if (matchesDict) {
        // Filter out any raw items that match conflict keywords
        const filtered = (rawList || []).filter(item => {
          const title = (item.title || item.strMeal || '').toLowerCase();
          const category = (item.category || item.strCategory || '').toLowerCase();
          const hasConflict = dict.conflictKeywords.some(c => (title.includes(c) || category.includes(c)) && !dict.keywords.some(k => title.includes(k)));
          return !hasConflict;
        });

        // If filtered list is empty or search is directly for the domain (like "pizza"), return targeted variants
        if (filtered.length === 0 || cleanQ.includes(key)) {
          return dict.variants;
        }
        return filtered;
      }
    }
    return rawList || [];
  }

  /**
   * Generates multiple chef variations for any search query with distinct FHD photography
   */
  function createContextualVariations(query) {
    const rawClean = (query || 'Gourmet Dish').trim();
    const lowerClean = rawClean.toLowerCase();

    // Check if query matches a semantic dictionary domain
    for (const key in SEMANTIC_FOOD_DICTIONARY) {
      const dict = SEMANTIC_FOOD_DICTIONARY[key];
      if (dict.keywords.some(k => lowerClean.includes(k) || k.includes(lowerClean))) {
        return dict.variants;
      }
    }

    const baseTitle = rawClean
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim();

    const baseRecipe = createContextualFallbackRecipe(baseTitle);
    const photos = getDishPhotosForQuery(rawClean);

    const variations = [
      {
        ...baseRecipe,
        id: `${baseRecipe.slug}-classic`,
        slug: `${baseRecipe.slug}-classic`,
        title: `Authentic ${baseTitle}`,
        image: photos[0],
        imageUrl: photos[0],
        img: photos[0],
        strMealThumb: photos[0],
        badge: "Chef's Classic",
        prepTime: '15 min',
        cookTime: '20 min',
        totalTime: '35 minutes',
        calories: 520,
        calorieStr: '520 kcal'
      },
      {
        ...baseRecipe,
        id: `${baseRecipe.slug}-skillet`,
        slug: `${baseRecipe.slug}-skillet`,
        title: `Quick Pan-Seared ${baseTitle}`,
        image: photos[1] || photos[0],
        imageUrl: photos[1] || photos[0],
        img: photos[1] || photos[0],
        strMealThumb: photos[1] || photos[0],
        badge: '15-Min Skillet',
        prepTime: '5 min',
        cookTime: '10 min',
        totalTime: '15 minutes',
        calories: 440,
        calorieStr: '440 kcal'
      },
      {
        ...baseRecipe,
        id: `${baseRecipe.slug}-gourmet`,
        slug: `${baseRecipe.slug}-gourmet`,
        title: `Chef AI Gourmet ${baseTitle}`,
        image: photos[2] || photos[0],
        imageUrl: photos[2] || photos[0],
        img: photos[2] || photos[0],
        strMealThumb: photos[2] || photos[0],
        badge: 'Michelin Style',
        prepTime: '20 min',
        cookTime: '30 min',
        totalTime: '50 minutes',
        calories: 580,
        calorieStr: '580 kcal'
      },
      {
        ...baseRecipe,
        id: `${baseRecipe.slug}-keto`,
        slug: `${baseRecipe.slug}-keto`,
        title: `High-Protein ${baseTitle}`,
        image: photos[3] || photos[0],
        imageUrl: photos[3] || photos[0],
        img: photos[3] || photos[0],
        strMealThumb: photos[3] || photos[0],
        badge: 'Keto & Lean',
        prepTime: '10 min',
        cookTime: '15 min',
        totalTime: '25 minutes',
        calories: 390,
        calorieStr: '390 kcal'
      }
    ];

    return variations;
  }

  /**
   * Multi-Result Async Search Query Engine
   * Returns array of matching catalog items or synthesized chef variations with strict relevance validation
   */
  async function searchRecipesMultipleAsync(query, timeoutMs) {
    const limitMs = typeof timeoutMs === 'number' ? timeoutMs : 2500;
    try {
      if (!query || typeof query !== 'string' || query.trim() === '') {
        return Object.values(RECIPE_CATALOG).slice(0, 6);
      }

      const rawClean = query.trim().toLowerCase();

      // Check semantic dictionary immediately (e.g. for "pizza" returns all 6 variants)
      for (const key in SEMANTIC_FOOD_DICTIONARY) {
        const dict = SEMANTIC_FOOD_DICTIONARY[key];
        if (dict.keywords.some(k => rawClean.includes(k) || k.includes(rawClean))) {
          return dict.variants;
        }
      }

      const stopWords = new Set(['white', 'fresh', 'freshly', 'and', 'or', 'the', 'in', 'with', 'a', 'an', 'for', 'to', 'of', 'cut', 'pure', 'style', 'real', 'best', 'hot', 'warm', 'cold']);
      const terms = rawClean.split(/[\s,+/]+/).filter(t => t.length > 1 && !stopWords.has(t));

      // 1. Check exact / strong catalog matches
      const catalogList = Object.values(RECIPE_CATALOG);
      const exactTitleMatches = catalogList.filter(recipe => {
        const title = (recipe.title || '').toLowerCase();
        const slug = (recipe.slug || '').toLowerCase();
        return title.includes(rawClean) || rawClean.includes(title) || slug.includes(rawClean) || rawClean.includes(slug);
      });

      if (exactTitleMatches.length > 0) {
        return validateAndFilterSearchResults(rawClean, exactTitleMatches);
      }

      // 2. Check significant terms against catalog
      if (terms.length > 0) {
        const keywordMatches = catalogList.filter(recipe => {
          const title = (recipe.title || '').toLowerCase();
          const cat = (recipe.category || '').toLowerCase();
          const cuisine = (recipe.cuisine || '').toLowerCase();
          const ingNames = (recipe.ingredients || []).map(i => (i.name || '').toLowerCase()).join(' ');

          // Must match at least one significant keyword in title or main cuisine/category
          const titleOrCatMatch = terms.some(t => title.includes(t) || cat.includes(t) || cuisine.includes(t));
          if (titleOrCatMatch) return true;

          // Or if multiple terms match ingredients
          const matchedTermsCount = terms.filter(t => ingNames.includes(t)).length;
          return matchedTermsCount >= Math.min(2, terms.length);
        });

        if (keywordMatches.length > 0) {
          return keywordMatches;
        }
      }

      // 3. Synthesize multi-variation contextual recipes for niche/custom queries
      return createContextualVariations(query);
    } catch (err) {
      console.warn('searchRecipesMultipleAsync caught exception:', err);
      return createContextualVariations(query);
    }
  }

  let toastTimeoutId = null;

  /**
   * Elegant Pop-up Toast Notification Component
   * Suspended on viewport for exactly 2.5 seconds (2500ms) with spring ease
   */
  function showSavedToast(message) {
    try {
      const text = message || 'Saved to Collection!';
      let toastEl = document.getElementById('wow-toast-notification');
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.id = 'wow-toast-notification';
        toastEl.className = 'wow-toast-notification';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        const viewport = document.getElementById('viewport') || document.body;
        viewport.appendChild(toastEl);
      }

      toastEl.innerHTML = `
        <span class="toast-check-icon material-symbols-outlined" aria-hidden="true">check</span>
        <span class="toast-text">${text}</span>
      `;

      // Trigger reflow to restart CSS transition smoothly if rapidly toggled
      toastEl.classList.remove('show');
      void toastEl.offsetWidth;
      toastEl.classList.add('show');

      if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
        toastTimeoutId = null;
      }

      toastTimeoutId = setTimeout(() => {
        if (toastEl) {
          toastEl.classList.remove('show');
        }
      }, 2500);
    } catch (err) {
      console.warn('showSavedToast error:', err);
    }
  }

  /**
   * Particle Burst Micro-Interaction Engine
   * Shoots a ring of 8 glowing Neon Cyan (#3DF2E0) dots radiating outward for 400ms
   */
  function triggerHeartParticleBurst(buttonEl) {
    if (!buttonEl) return;
    const particleCount = 8;
    const radius = 34; // outward explosion radius in pixels
    for (let i = 0; i < particleCount; i++) {
      const dot = document.createElement('span');
      dot.className = 'cyan-particle-dot';
      const angle = (i * (360 / particleCount)) * (Math.PI / 180);
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      dot.style.setProperty('--tx', `${tx.toFixed(1)}px`);
      dot.style.setProperty('--ty', `${ty.toFixed(1)}px`);
      buttonEl.appendChild(dot);
      setTimeout(() => {
        if (dot && dot.parentNode) dot.parentNode.removeChild(dot);
      }, 400);
    }
  }
  global.triggerHeartParticleBurst = triggerHeartParticleBurst;

  /**
   * Save / Bookmark Collection Manager (Floating Action Heart Architecture)
   * Two-State Micro-Interaction: Resting (Semi-transparent Charcoal + #3DF2E0 border + White outline heart)
   *                             <-> Active (Solid #3DF2E0 + Void Black #0B0F14 heart + 400ms Particle Burst)
   */
  function toggleSaveCollection(recipeId, btnEl) {
    try {
      const cleanId = String(recipeId || '').toLowerCase().trim();
      let saved = [];
      try {
        const raw = localStorage.getItem('wow_saved_recipes');
        if (raw) saved = JSON.parse(raw);
      } catch (e) {
        saved = [];
      }

      if (!Array.isArray(saved)) saved = [];

      const idx = saved.indexOf(cleanId);
      const isNowSaved = idx === -1;

      if (isNowSaved) {
        saved.push(cleanId);
      } else {
        saved.splice(idx, 1);
      }

      localStorage.setItem('wow_saved_recipes', JSON.stringify(saved));

      // Synchronize all visible heart buttons on page with this recipeId
      const matchingBtns = document.querySelectorAll(`.wow-bookmark-btn[data-recipe-id="${cleanId}"]`);
      matchingBtns.forEach(btn => {
        if (isNowSaved) {
          btn.classList.add('saved');
          btn.setAttribute('aria-label', 'Saved to collection');
          triggerHeartParticleBurst(btn);
        } else {
          btn.classList.remove('saved');
          btn.setAttribute('aria-label', 'Save to collection');
        }
      });

      // Trigger elegant toast notification only when entering State B (Saved)
      if (isNowSaved) {
        showSavedToast('Saved to Collection!');
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wowRecipeSavedStateChanged', { detail: { recipeId: cleanId, isSaved: isNowSaved } }));
      }
      return isNowSaved;
    } catch (err) {
      console.warn('toggleSaveCollection error:', err);
    }
  }

  function isRecipeSaved(recipeId) {
    try {
      const cleanId = String(recipeId || '').toLowerCase().trim();
      const raw = localStorage.getItem('wow_saved_recipes');
      if (!raw) return false;
      const saved = JSON.parse(raw);
      return Array.isArray(saved) && saved.includes(cleanId);
    } catch (e) {
      return false;
    }
  }

  function syncSavedButtonStates() {
    try {
      const buttons = document.querySelectorAll('.wow-bookmark-btn[data-recipe-id]');
      buttons.forEach(btn => {
        if (!btn.querySelector('.wow-btn-check')) {
          const checkSpan = document.createElement('span');
          checkSpan.className = 'wow-btn-check material-symbols-outlined';
          checkSpan.setAttribute('aria-hidden', 'true');
          checkSpan.textContent = 'check';
          btn.appendChild(checkSpan);
        }
        const id = btn.getAttribute('data-recipe-id');
        if (id && isRecipeSaved(id)) {
          btn.classList.add('saved');
        } else {
          btn.classList.remove('saved');
        }
      });
    } catch (e) {
      console.warn('syncSavedButtonStates error:', e);
    }
  }

  /**
   * Universal Single-Column Full-Width Search Results List Renderer
   * Renders spacious 16:9 aspect-ratio cards matching Curated Creations
   * with signature 44x44 circular "wow" brand bookmark button
   */
  function renderSearchResultsGrid(recipes, containerEl, onSelectCallback) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    if (!Array.isArray(recipes) || recipes.length === 0) {
      containerEl.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: #8E8E93; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
          <span class="material-symbols-outlined" style="font-size: 40px; color: #3DF2E0; margin-bottom: 4px;">search_off</span>
          <div style="font-size: 15px; font-weight: 700; color: #FFFFFF;">No Recipes Found</div>
          <div style="font-size: 12px; color: #8E8E93;">Try searching for pizza, pasta, steak, salmon, or chicken.</div>
        </div>
      `;
      return;
    }

    recipes.forEach(recipe => {
      const card = document.createElement('article');
      card.className = 'search-grid-card tap-effect';
      const recipeSlug = recipe.slug || recipe.id || 'sesame-chicken';
      card.setAttribute('data-recipe-id', recipeSlug);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      // Dynamic Image Binding: Map directly to item's API / photograph string
      const coverSrc = recipe.strMealThumb || recipe.imageUrl || recipe.image || recipe.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
      const fallbackSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
      const cookTime = recipe.cookTime || recipe.totalTime || (recipe.prepTime ? `${recipe.prepTime}` : '25 min');
      const calories = recipe.calorieStr || (recipe.calories ? `${recipe.calories} kcal` : '480 kcal');
      const badge = recipe.badge || (recipe.category ? recipe.category.toUpperCase() : "Chef's Choice");
      const isSaved = isRecipeSaved(recipeSlug);

      card.innerHTML = `
        <a href="recipe-detail.html?name=${encodeURIComponent(recipeSlug)}" class="search-card-link-wrapper" style="text-decoration:none;color:inherit;display:block;width:100%;">
          <div class="search-card-thumb-wrap">
            <!-- Layer 1 (Backdrop): Blurred duplicate scale stretched fully -->
            <img src="${coverSrc}" alt="" class="search-card-thumb-backdrop" aria-hidden="true" onerror="this.onerror=null; this.src='${fallbackSrc}'" loading="lazy" />
            <!-- Layer 2 (Foreground Showcase): Actual unblurred recipe food image crisp and centered -->
            <img src="${coverSrc}" alt="${recipe.title}" class="search-card-thumb" onerror="this.onerror=null; this.src='${fallbackSrc}'" loading="lazy" />
            <span class="search-card-badge">${badge}</span>
          </div>
          <div class="search-card-content">
            <div class="search-card-info-col">
              <h3 class="search-card-title">${recipe.title}</h3>
              <div class="search-card-metrics">
                <span class="search-metric-pill time">
                  <span class="material-symbols-outlined">schedule</span>
                  <span>${cookTime}</span>
                </span>
                <span class="search-metric-pill cal">
                  <span class="material-symbols-outlined">local_fire_department</span>
                  <span>${calories}</span>
                </span>
              </div>
            </div>
            <button class="recipe-heart-fab wow-bookmark-btn tap-effect ${isSaved ? 'saved' : ''}" aria-label="Save ${recipe.title} to collection" onclick="event.stopPropagation(); event.preventDefault(); toggleSaveCollection('${recipeSlug}', this);" data-recipe-id="${recipeSlug}">
              <span class="heart-icon-wrap">
                <svg class="heart-icon heart-icon-outline" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <svg class="heart-icon heart-icon-filled" viewBox="0 0 24 24" width="20" height="20" fill="#0B0F14" stroke="#0B0F14" stroke-width="1">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </span>
            </button>
          </div>
        </a>
      `;

      card.addEventListener('click', (e) => {
        // Ignore clicks on bookmark button
        if (e.target.closest('.wow-bookmark-btn, .bookmark-btn')) return;
        e.preventDefault();
        if (typeof onSelectCallback === 'function') {
          onSelectCallback(recipe);
        } else if (typeof window.navigateToRecipeDetail === 'function') {
          window.navigateToRecipeDetail(recipeSlug);
        } else {
          openRecipeDetail(recipe);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.target.closest('.wow-bookmark-btn, .bookmark-btn')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof onSelectCallback === 'function') {
            onSelectCallback(recipe);
          } else if (typeof window.navigateToRecipeDetail === 'function') {
            window.navigateToRecipeDetail(recipeSlug);
          } else {
            openRecipeDetail(recipe);
          }
        }
      });

      containerEl.appendChild(card);
    });
  }

  function resolveRecipeObject(input) {
    if (!input) return RECIPE_CATALOG['sesame-chicken'];
    if (typeof input === 'object' && input !== null) {
      if (input.slug && RECIPE_CATALOG[input.slug]) return RECIPE_CATALOG[input.slug];
      if (input.id && RECIPE_CATALOG[input.id]) return RECIPE_CATALOG[input.id];
      return input;
    }
    const clean = String(input).toLowerCase().trim();
    if (RECIPE_CATALOG[clean]) return RECIPE_CATALOG[clean];
    
    // Check slug, title, or alias match in master catalog
    for (const key in RECIPE_CATALOG) {
      const r = RECIPE_CATALOG[key];
      if (r.slug === clean || String(r.id) === clean || (r.title && r.title.toLowerCase() === clean)) {
        return r;
      }
    }
    for (const key in RECIPE_CATALOG) {
      const r = RECIPE_CATALOG[key];
      if (r.title && r.title.toLowerCase().includes(clean)) {
        return r;
      }
    }
    if (/^\d+$/.test(clean)) {
      return null;
    }
    return createContextualFallbackRecipe(input);
  }

  function openRecipeDetail(recipeData) {
    try {
      const active = resolveRecipeObject(recipeData);

      // 1. Set global state cache
      window.activeRecipe = active;

      // 2. Persist to storage for multi-screen navigation
      try {
        localStorage.setItem('wow_active_recipe_id', active.slug || active.id || 'pizza-authentic');
        localStorage.setItem('wow_active_recipe', JSON.stringify(active));
        localStorage.setItem(`wow_recipe_cache_${active.slug || active.id}`, JSON.stringify(active));
        sessionStorage.setItem('wow_active_recipe', JSON.stringify(active));
      } catch (e) {
        console.warn('Storage persistence warning:', e);
      }

      // 3. If currently on recipe-detail.html, dynamically re-render immediately
      if (window.location.pathname.endsWith('recipe-detail.html') || document.getElementById('recipe-header')) {
        renderActiveRecipeDetail(active);
      } else {
        window.location.href = `recipe-detail.html?recipe=${encodeURIComponent(active.slug || active.id)}`;
      }
    } catch (err) {
      console.error('openRecipeDetail error caught gracefully:', err);
      window.location.href = 'recipe-detail.html?recipe=carbonara';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. SCREEN 9: SAVED RECIPES LIBRARY & SCREEN 9C EMPTY FALLBACK ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  // Simulated AI Camera Pantry Storage (cross-reference data layer)
  if (typeof window !== 'undefined') {
    if (!window.scannedIngredients || !Array.isArray(window.scannedIngredients)) {
      try {
        const stored = localStorage.getItem('wow_scanned_ingredients');
        window.scannedIngredients = stored ? JSON.parse(stored) : ["garlic", "tomato", "onion", "chicken", "beef"];
      } catch (e) {
        window.scannedIngredients = ["garlic", "tomato", "onion", "chicken", "beef"];
      }
    }
  }

  /**
   * Filters saved recipes by cross-referencing their ingredients with window.scannedIngredients
   */
  function filterByPantryMatches(savedRecipesArray) {
    if (!Array.isArray(savedRecipesArray)) return [];
    const scanned = (typeof window !== 'undefined' && Array.isArray(window.scannedIngredients))
      ? window.scannedIngredients
      : ["garlic", "tomato", "onion", "chicken", "beef"];

    const cleanScanned = scanned.map(s => String(s).toLowerCase().trim()).filter(Boolean);
    if (cleanScanned.length === 0) return [];

    return savedRecipesArray.filter(recipe => {
      if (!recipe) return false;
      const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients.map(i => (typeof i === 'string' ? i : (i.name || '')).toLowerCase())
        : [];

      const title = (recipe.title || '').toLowerCase();
      const desc = (recipe.description || recipe.intro || '').toLowerCase();
      const allText = ingredients.join(' ') + ' ' + title + ' ' + desc;

      return cleanScanned.some(scannedItem => {
        return allText.includes(scannedItem) || ingredients.some(ing => ing.includes(scannedItem) || scannedItem.includes(ing));
      });
    });
  }

  /**
   * Renders saved recipes library from localStorage['wow_saved_recipes']
   * If empty, renders Screen 9C: Empty Collection Fallback State Canvas
   */
  function renderSavedCollection(containerEl, emptyFallbackEl, categoryFilter) {
    const grid = containerEl || document.getElementById('collection-grid') || document.getElementById('search-results-grid');
    if (!grid) return;

    let saved = [];
    try {
      const raw = localStorage.getItem('wow_saved_recipes');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      saved = [];
    }
    if (!Array.isArray(saved)) saved = [];

    // Filter unique valid non-empty IDs
    const uniqueSavedIds = Array.from(new Set(saved.filter(id => id && String(id).trim().length > 0)));

    // Update count badges in DOM if present
    const countBadges = document.querySelectorAll('#collection-count-badge, .collection-count-pill, #saved-recipes-count');
    countBadges.forEach(badge => {
      badge.textContent = `${uniqueSavedIds.length} Saved`;
    });

    // Handle Screen 9C: Empty Collection Fallback State Canvas
    if (uniqueSavedIds.length === 0) {
      grid.innerHTML = `
        <div class="empty-collection-canvas" id="collection-empty-fallback">
          <div class="empty-collection-icon-wrap">
            <span class="material-symbols-outlined">bookmark_border</span>
          </div>
          <h2 class="empty-collection-title">Your kitchen collection is empty!</h2>
          <p class="empty-collection-subtitle">Save your favorite culinary recipes with the signature wow bookmark button to build your personal cookbook.</p>
          <a href="dashboard.html" class="empty-collection-cta" onclick="if (typeof closeCollectionScreen === 'function') { closeCollectionScreen(); }">
            <span class="material-symbols-outlined" style="font-size: 18px;">explore</span>
            <span>Discover Recipes</span>
          </a>
        </div>
      `;
      if (emptyFallbackEl) {
        emptyFallbackEl.style.display = 'flex';
      }
      return;
    }

    if (emptyFallbackEl) {
      emptyFallbackEl.style.display = 'none';
    }

    // Resolve recipe objects
    let resolvedList = uniqueSavedIds.map(id => resolveRecipeObject(id));

    // Optional category & smart dynamic tag filtering
    if (categoryFilter && categoryFilter !== 'all') {
      const filterKey = categoryFilter.toLowerCase().trim().replace(/^[⚡🤖]\s*/, '');

      // Smart Tag: In My Fridge (Direct Pantry Cross-Reference)
      if (filterKey.includes('fridge') || filterKey.includes('pantry')) {
        resolvedList = filterByPantryMatches(resolvedList);
      } else {
        resolvedList = resolvedList.filter(recipe => {
          const title = (recipe.title || '').toLowerCase();
          const cat = (recipe.category || '').toLowerCase();
          const cuisine = (recipe.cuisine || '').toLowerCase();
          const badge = (recipe.badge || '').toLowerCase();
          const desc = (recipe.description || recipe.intro || '').toLowerCase();
          const cookTimeStr = (recipe.cookTime || recipe.totalTime || recipe.prepTime || '').toLowerCase();
          const ingredients = (recipe.ingredients || []).map(i => (i.name || '').toLowerCase()).join(' ');

          // Smart Tag: Under 15 Mins
          if (filterKey.includes('15') || filterKey === 'under 15 mins') {
            const minMatch = cookTimeStr.match(/(\d+)\s*min/);
            if (minMatch && parseInt(minMatch[1], 10) <= 15) return true;
            return /10 min|15 min|quick|express|skillet/i.test(cookTimeStr + ' ' + title + ' ' + badge);
          }

          // Smart Tag: Under 30 Mins
          if (filterKey.includes('30') || filterKey === 'under 30 mins') {
            const minMatch = cookTimeStr.match(/(\d+)\s*min/);
            if (minMatch && parseInt(minMatch[1], 10) <= 30) return true;
            return !/45 min|50 min|60 min|1 hr|2 hr|3 hr|slow cooker/i.test(cookTimeStr);
          }

          // Pizza & Flatbreads
          if (filterKey.includes('pizza') || filterKey.includes('flatbread')) {
            return /pizza|flatbread|bianco|focaccia|dough|neapolitan|margherita|crust/i.test(title + ' ' + cat + ' ' + cuisine + ' ' + ingredients);
          }

          // Burgers & Sliders
          if (filterKey.includes('burger') || filterKey.includes('slider')) {
            return /burger|slider|patty|bun|sandwich/i.test(title + ' ' + cat + ' ' + cuisine);
          }

          // Snacks & Starters
          if (filterKey.includes('snack') || filterKey.includes('starter') || filterKey.includes('appetizer')) {
            return /snack|starter|appetizer|dip|taco|skewer|ceviche|wing|bites/i.test(title + ' ' + cat + ' ' + cuisine + ' ' + badge);
          }

          // Breakfast & Brunch
          if (filterKey.includes('breakfast') || filterKey.includes('brunch')) {
            return /breakfast|brunch|egg|pancake|waffle|toast|bacon|omelet|scramble/i.test(title + ' ' + cat + ' ' + ingredients);
          }

          // Desserts & Baking
          if (filterKey.includes('dessert') || filterKey.includes('baking') || filterKey.includes('sweet') || filterKey.includes('cake')) {
            return /dessert|baking|cake|pie|pastry|cookie|chocolate|sweet|tart/i.test(title + ' ' + cat + ' ' + cuisine);
          }

          // Poultry
          if (filterKey === 'poultry' || filterKey.includes('chicken') || filterKey.includes('turkey')) {
            return /chicken|poultry|turkey|duck|thigh|breast|tikka|biryani/i.test(title + ' ' + cat + ' ' + ingredients);
          }

          // Pasta
          if (filterKey === 'pasta' || filterKey.includes('noodle')) {
            return /pasta|spaghetti|carbonara|linguine|fettuccine|penne|tagliat|noodle|ramen|pad thai/i.test(title + ' ' + cat + ' ' + ingredients);
          }

          // Seafood
          if (filterKey === 'seafood' || filterKey.includes('fish') || filterKey.includes('salmon')) {
            return /seafood|salmon|fish|tuna|ceviche|shrimp|prawn|crab|lobster|cod|seabass/i.test(title + ' ' + cat + ' ' + cuisine + ' ' + ingredients);
          }

          // Comfort
          if (filterKey === 'comfort') {
            return /comfort|curry|makhani|biryani|soup|stew|bourguignon|pasta|carbonara|cheesy|braised|casserole/i.test(title + ' ' + cat + ' ' + cuisine + ' ' + badge + ' ' + desc);
          }

          return cat.includes(filterKey) || cuisine.includes(filterKey) || title.includes(filterKey) || ingredients.includes(filterKey);
        });
      }
    }

    if (resolvedList.length === 0) {
      const isFridgeFilter = categoryFilter && /fridge|pantry/i.test(categoryFilter);
      if (isFridgeFilter) {
        grid.innerHTML = `
          <div class="empty-collection-canvas" id="pantry-empty-fallback" style="padding: 48px 20px; text-align: center;">
            <div class="empty-collection-icon-wrap" style="background: radial-gradient(circle, rgba(0, 230, 118, 0.18) 0%, rgba(0, 230, 118, 0.05) 70%, transparent 100%); border-color: rgba(0, 230, 118, 0.35); box-shadow: 0 0 24px rgba(0, 230, 118, 0.2);">
              <span class="material-symbols-outlined" style="color: #00E676; font-size: 38px;">kitchen</span>
            </div>
            <h2 class="empty-collection-title" style="font-size: 18px; max-width: 320px; margin: 0 auto 10px; line-height: 1.35;">No matches found for your current fridge items! Try updating your AI Pantry Scanner 🌿</h2>
            <p class="empty-collection-subtitle" style="margin-bottom: 20px; font-size: 13px;">Scan new ingredients in your kitchen or update your pantry items to find instant recipe matches.</p>
            <a href="scanner.html" class="empty-collection-cta" style="background: linear-gradient(135deg, #00E676 0%, #00B359 100%); color: #000000; font-weight: 800; box-shadow: 0 4px 18px rgba(0, 230, 118, 0.4);">
              <span class="material-symbols-outlined" style="font-size: 18px;">photo_camera</span>
              <span>Open AI Pantry Scanner</span>
            </a>
          </div>
        `;
      } else {
        grid.innerHTML = `
          <div style="text-align: center; padding: 48px 20px; color: #8E8E93; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
            <span class="material-symbols-outlined" style="font-size: 36px; color: #FF5500; margin-bottom: 4px;">filter_alt_off</span>
            <div style="font-size: 15px; font-weight: 700; color: #FFFFFF;">No "${categoryFilter}" Recipes in Collection</div>
            <div style="font-size: 12px; color: #8E8E93;">Save more recipes to expand your kitchen vault.</div>
          </div>
        `;
      }
      return;
    }

    grid.innerHTML = '';

    resolvedList.forEach(recipe => {
      const card = document.createElement('article');
      card.className = 'search-grid-card tap-effect';
      const recipeSlug = recipe.slug || recipe.id || 'sesame-chicken';
      card.setAttribute('data-recipe-id', recipeSlug);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const coverSrc = recipe.strMealThumb || recipe.imageUrl || recipe.image || recipe.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
      const fallbackSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
      const cookTime = recipe.cookTime || recipe.totalTime || (recipe.prepTime ? `${recipe.prepTime}` : '25 min');
      const calories = recipe.calorieStr || (recipe.calories ? `${recipe.calories} kcal` : '480 kcal');
      const badge = recipe.badge || (recipe.category ? recipe.category.toUpperCase() : "Chef's Choice");

      card.innerHTML = `
        <div class="search-card-thumb-wrap">
          <!-- Layer 1 (Backdrop): Blurred duplicate scale stretched fully -->
          <img src="${coverSrc}" alt="" class="search-card-thumb-backdrop" aria-hidden="true" onerror="this.onerror=null; this.src='${fallbackSrc}'" loading="lazy" />
          <!-- Layer 2 (Foreground Showcase): Actual unblurred recipe food image crisp and centered -->
          <img src="${coverSrc}" alt="${recipe.title}" class="search-card-thumb" onerror="this.onerror=null; this.src='${fallbackSrc}'" loading="lazy" />
          <span class="search-card-badge">${badge}</span>
        </div>
        <div class="search-card-content">
          <div class="search-card-info-col">
            <h3 class="search-card-title">${recipe.title}</h3>
            <div class="search-card-metrics">
              <span class="search-metric-pill time">
                <span class="material-symbols-outlined">schedule</span>
                <span>${cookTime}</span>
              </span>
              <span class="search-metric-pill cal">
                <span class="material-symbols-outlined">local_fire_department</span>
                <span>${calories}</span>
              </span>
            </div>
          </div>
          <button class="recipe-heart-fab wow-bookmark-btn tap-effect saved" aria-label="Saved to collection" onclick="event.stopPropagation(); toggleSaveCollection('${recipeSlug}', this);" data-recipe-id="${recipeSlug}">
            <span class="heart-icon-wrap">
              <svg class="heart-icon heart-icon-outline" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <svg class="heart-icon heart-icon-filled" viewBox="0 0 24 24" width="20" height="20" fill="#0B0F14" stroke="#0B0F14" stroke-width="1">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
            </span>
          </button>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.wow-bookmark-btn, .bookmark-btn')) return;
        e.preventDefault();
        openRecipeDetail(recipe);
      });

      card.addEventListener('keydown', (e) => {
        if (e.target.closest('.wow-bookmark-btn, .bookmark-btn')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openRecipeDetail(recipe);
        }
      });

      grid.appendChild(card);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER CURATED CREATIONS DATASET & DYNAMIC INJECTION ENGINE (Screen 2A)
  // ═══════════════════════════════════════════════════════════════════════════
  const CURATED_CREATIONS = [
    {
      id: 'carbonara',
      cardId: 'card-carbonara',
      slug: 'carbonara',
      title: 'Spaghetti Carbonara',
      subtitle: 'Roman-style. Guanciale, egg yolks, Pecorino.',
      image: 'assets/carbonara.png',
      fallbackImage: 'assets/carbonara.png',
      cookTime: '25 Min',
      servings: 'Serves 4',
      tags: ['all', 'dinner', 'pasta', 'comfort', 'italian'],
      badges: [
        { text: 'FOR DINNER', type: 'red' },
        { text: 'PASTA & GRAINS', type: 'green' }
      ],
      cuisine: 'italian',
      diet: 'pasta'
    },
    {
      id: 'ribeye',
      cardId: 'card-ribeye',
      slug: 'ribeye',
      title: 'Prime Pan-Seared Ribeye',
      subtitle: 'Dry-aged cut, garlic herb basting, flaky sea salt.',
      image: 'assets/ribeye.png',
      fallbackImage: 'assets/ribeye.png',
      cookTime: '20 Min',
      servings: 'Serves 2',
      tags: ['all', 'dinner', 'meat', 'healthy', 'keto', 'steakhouse', 'comfort'],
      badges: [
        { text: "CHEF'S PICK", type: 'red' },
        { text: 'STEAKHOUSE', type: 'green' }
      ],
      cuisine: 'steakhouse',
      diet: 'keto high-protein'
    },
    {
      id: 'sesame',
      cardId: 'card-sesame',
      slug: 'sesame-chicken',
      title: 'Honey Sesame Chicken',
      subtitle: 'Crispy sweet-savory glaze, toasted sesame seeds, green scallions.',
      image: 'assets/sesame-chicken.png',
      fallbackImage: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
      cookTime: '30 Min',
      servings: 'Serves 4',
      tags: ['all', 'dinner', 'healthy', 'poultry', 'asian', 'chicken'],
      badges: [
        { text: 'POPULAR', type: 'red' },
        { text: 'ASIAN INSPIRED', type: 'green' }
      ],
      cuisine: 'asian',
      diet: 'high-protein'
    },
    {
      id: 'biryani',
      cardId: 'card-biryani',
      slug: 'biryani',
      title: 'Royal Indian Chicken Biryani',
      subtitle: 'Aromatic long-grain basmati rice layered with spiced marinated chicken, saffron, and crispy fried onions.',
      image: 'assets/biryani.png',
      fallbackImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
      cookTime: '50 Min',
      servings: 'Serves 6',
      tags: ['all', 'dinner', 'poultry', 'indian', 'comfort', 'chicken'],
      badges: [
        { text: 'FOR DINNER', type: 'red' },
        { text: 'INDIAN CLASSIC', type: 'green' }
      ],
      cuisine: 'indian',
      diet: 'high-protein'
    },
    {
      id: 'padthai',
      cardId: 'card-padthai',
      slug: 'pad-thai',
      title: 'Authentic Thai Pad Thai',
      subtitle: 'Stir-fried rice noodles tossed with plump prawns, scrambled eggs, tofu, tangy tamarind, and crushed peanuts.',
      image: 'assets/pad-thai.png',
      fallbackImage: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
      cookTime: '20 Min',
      servings: 'Serves 2',
      tags: ['all', 'dinner', 'healthy', 'quick', 'thai', 'seafood', 'noodles'],
      badges: [
        { text: 'QUICK MEAL', type: 'red' },
        { text: 'THAI FAVORITE', type: 'green' }
      ],
      cuisine: 'thai',
      diet: 'quick'
    },
    {
      id: 'ceviche',
      cardId: 'card-ceviche',
      slug: 'ceviche',
      title: 'Classic Peruvian Ceviche',
      subtitle: 'Fresh cubed white fish cured in sharp lime juice, tossed with thinly sliced red onions, aji limo, and cilantro.',
      image: 'assets/ceviche.png',
      fallbackImage: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800',
      cookTime: '15 Min',
      servings: 'Serves 2',
      tags: ['all', 'healthy', 'keto', 'seafood', 'quick', 'latin'],
      badges: [
        { text: 'FRESH & COLD', type: 'red' },
        { text: 'LATIN AMER.', type: 'green' }
      ],
      cuisine: 'peruvian',
      diet: 'keto healthy'
    },
    {
      id: 'sushi',
      cardId: 'card-sushi',
      slug: 'sushi',
      title: 'Japanese Premium Sushi Platter',
      subtitle: 'An elegant assortment of hand-formed salmon and tuna nigiri served with vinegared rice, wasabi, and pickled ginger.',
      image: 'assets/sushi.png',
      fallbackImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
      cookTime: '40 Min',
      servings: 'Serves 3',
      tags: ['all', 'healthy', 'dinner', 'japanese', 'seafood'],
      badges: [
        { text: 'PREMIUM SELECTION', type: 'red' },
        { text: 'JAPANESE', type: 'green' }
      ],
      cuisine: 'japanese',
      diet: 'high-protein'
    },
    {
      id: 'birria',
      cardId: 'card-birria',
      slug: 'birria',
      title: 'Authentic Mexican Birria Tacos',
      subtitle: 'Tender slow-braised beef inside crispy corn tortillas dipped in chili fat, packed with melted Oaxaca cheese.',
      image: 'assets/birria.png',
      fallbackImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
      cookTime: '3 Hrs',
      servings: 'Serves 4',
      tags: ['all', 'dinner', 'mexican', 'beef', 'comfort', 'meat'],
      badges: [
        { text: 'SLOW COOKED', type: 'red' },
        { text: 'MEXICAN TASTE', type: 'green' }
      ],
      cuisine: 'mexican',
      diet: 'slow-cooked'
    },
    {
      id: 'bourguignon',
      cardId: 'card-bourguignon',
      slug: 'beef-bourguignon',
      title: 'Classic French Beef Bourguignon',
      subtitle: 'Slow-braised beef chuck in red wine with pearl onions, mushrooms, and smoky lardons.',
      image: 'assets/bourguignon.png',
      fallbackImage: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800',
      cookTime: '2.5 Hrs',
      servings: 'Serves 4',
      tags: ['all', 'dinner', 'french', 'beef', 'comfort', 'meat'],
      badges: [
        { text: 'SLOW COOKED', type: 'red' },
        { text: 'FRENCH CLASSIC', type: 'green' }
      ],
      cuisine: 'french',
      diet: 'slow-cooked'
    },
    {
      id: 'burger',
      cardId: 'card-burger',
      slug: 'wagyu-burger',
      title: 'Truffle Wagyu Gourmet Burger',
      subtitle: 'Flame-broiled prime Wagyu beef patty topped with aged sharp cheddar, black truffle aioli, and brioche bun.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      cookTime: '20 Min',
      servings: 'Serves 2',
      tags: ['all', 'burger', 'dinner', 'beef', 'comfort', 'meat'],
      badges: [
        { text: 'CHEF\'S PICK', type: 'red' },
        { text: 'GOURMET BURGER', type: 'green' }
      ],
      cuisine: 'american',
      diet: 'high-protein'
    },
    {
      id: 'pizza',
      cardId: 'card-pizza',
      slug: 'margherita-pizza',
      title: 'Artisanal Neapolitan Margherita Pizza',
      subtitle: 'Wood-fired sourdough crust topped with San Marzano tomatoes, fresh buffalo mozzarella, and fragrant basil leaves.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      cookTime: '25 Min',
      servings: 'Serves 3',
      tags: ['all', 'pizza', 'dinner', 'pasta', 'italian', 'comfort'],
      badges: [
        { text: 'WOOD FIRED', type: 'red' },
        { text: 'NEAPOLITAN', type: 'green' }
      ],
      cuisine: 'italian',
      diet: 'vegetarian'
    },
    {
      id: 'tiramisu',
      cardId: 'card-tiramisu',
      slug: 'tiramisu',
      title: 'Artisanal Venetian Tiramisu',
      subtitle: 'Espresso-soaked savoiardi ladyfingers layered with velvety mascarpone sabayon and dusted dark cocoa.',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
      cookTime: '20 Min',
      servings: 'Serves 6',
      tags: ['all', 'desserts', 'dessert', 'sweet', 'italian', 'baking'],
      badges: [
        { text: 'SWEET TREAT', type: 'red' },
        { text: 'ITALIAN DESSERT', type: 'green' }
      ],
      cuisine: 'italian',
      diet: 'dessert'
    },
    {
      id: 'lava-cake',
      cardId: 'card-lava-cake',
      slug: 'lava-cake',
      title: 'Molten Dark Chocolate Lava Cake',
      subtitle: 'Decadent 70% dark chocolate souffle cake with a rich molten center and vanilla bean gelato.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
      cookTime: '18 Min',
      servings: 'Serves 2',
      tags: ['all', 'desserts', 'dessert', 'sweet', 'chocolate', 'baking'],
      badges: [
        { text: 'WARM DESSERT', type: 'red' },
        { text: 'VALRHONA CHOCO', type: 'green' }
      ],
      cuisine: 'french',
      diet: 'dessert'
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION: CURATED CREATIONS CATEGORY FILTER & DYNAMIC FEED COMPILER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Primary dynamic card compiler for Curated Creations feed
   */
  function renderCuratedFeed(categoryKey, containerEl) {
    const feedContainer = containerEl || document.getElementById('main-recipe-feed');
    if (!feedContainer) return;

    // 1. Before painting the cards to the DOM container, completely clear the innerHTML contents
    feedContainer.innerHTML = '';

    const rawCategory = (categoryKey || 'all').toLowerCase().trim();
    const cleanCategory = rawCategory.replace(/^#?pill-/, '').replace(/^pill--/, '');

    // 2. Filter logic:
    // If "all", loop through baseline 9 curated creations (excluding desserts and extra categories)
    // If a specific filter is clicked, filter cleanly using recipe.tags.includes(cleanCategory)
    let filteredRecipes = [];
    if (cleanCategory === 'all') {
      filteredRecipes = CURATED_CREATIONS.slice(0, 9);
    } else if (cleanCategory === 'dinner') {
      filteredRecipes = CURATED_CREATIONS.slice(0, 9).filter(recipe => recipe.tags.includes('dinner'));
    } else {
      filteredRecipes = CURATED_CREATIONS.filter(recipe => {
        if (!recipe.tags || !Array.isArray(recipe.tags)) return false;
        return recipe.tags.includes(cleanCategory) || (cleanCategory === 'desserts' && recipe.tags.includes('dessert'));
      });
    }

    if (filteredRecipes.length === 0) {
      feedContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: #8E8E93; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
          <span class="material-symbols-outlined" style="font-size: 36px; color: #FF5500; margin-bottom: 4px;">filter_alt_off</span>
          <div style="font-size: 15px; font-weight: 700; color: #FFFFFF;">No "${categoryKey.toUpperCase()}" Recipes Found</div>
          <div style="font-size: 12px; color: #8E8E93;">Try selecting ALL, DINNER, HEALTHY, or KETO.</div>
        </div>
      `;
      return;
    }

    // 3. Loop through ONLY this new filteredRecipes payload array to generate the vertical list stack one-by-one
    filteredRecipes.forEach(recipe => {
      const card = document.createElement('article');
      card.className = 'recipe-card';
      const slug = recipe.slug || recipe.id || 'sesame-chicken';
      card.id = recipe.cardId || `card-${slug}`;
      card.setAttribute('data-recipe-id', slug);
      card.setAttribute('data-category', (recipe.tags || []).join(' '));
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${recipe.title} recipe card`);

      const isSaved = typeof isRecipeSaved === 'function' ? isRecipeSaved(slug) : false;
      let photoUrl = recipe.image || 'assets/sesame-chicken.png';
      const isTandoori = (recipe.title && recipe.title.trim() === "Tandoori Chicken Skewers") || (recipe.strMeal && recipe.strMeal.trim() === "Tandoori Chicken Skewers");
      const isTurkeyPotPie = (recipe.title && (recipe.title.trim() === "Turkey Pot Pie Classic" || recipe.title.trim() === "Turkey Pot Pie")) || (recipe.strMeal && (recipe.strMeal.trim() === "Turkey Pot Pie Classic" || recipe.strMeal.trim() === "Turkey Pot Pie"));
      const isSauteedKale = (recipe.title && (recipe.title.trim() === "Sautéed Kale with Garlic" || recipe.title.trim() === "Sauteed Kale with Garlic")) || (recipe.strMeal && (recipe.strMeal.trim() === "Sautéed Kale with Garlic" || recipe.strMeal.trim() === "Sauteed Kale with Garlic"));
      const isGomaaeSpinach = (recipe.title && (recipe.title.trim() === "Gomaae Sesame Spinach" || recipe.title.trim() === "Goma-ae Sesame Spinach")) || (recipe.strMeal && (recipe.strMeal.trim() === "Gomaae Sesame Spinach" || recipe.strMeal.trim() === "Goma-ae Sesame Spinach"));
      if (isTurkeyPotPie) {
        photoUrl = "assets/images/poultry/turkey_pot_pie.jpg";
      } else if (isTandoori) {
        photoUrl = "assets/images/poultry/tandoori_chicken.jpg";
      } else if (isSauteedKale) {
        photoUrl = "assets/images/veggies/sauteed_kale.jpg";
      } else if (isGomaaeSpinach) {
        photoUrl = "assets/images/veggies/gomaae_spinach.jpg";
      }
      const fallbackUrl = isTurkeyPotPie ? "assets/images/poultry/turkey_pot_pie.jpg" : (isTandoori ? "assets/images/poultry/tandoori_chicken.jpg" : (isSauteedKale ? "assets/images/veggies/sauteed_kale.jpg" : (isGomaaeSpinach ? "assets/images/veggies/gomaae_spinach.jpg" : (recipe.fallbackImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'))));
      const suppressAlt = isTurkeyPotPie || isTandoori || isSauteedKale || isGomaaeSpinach;
      const cookTime = recipe.cookTime || '20 Min';
      const servings = recipe.servings || 'Serves 2';

      const tag1 = recipe.badges && recipe.badges[0] ? recipe.badges[0] : { text: "CHEF'S PICK", type: 'red' };
      const tag2 = recipe.badges && recipe.badges[1] ? recipe.badges[1] : { text: 'FEATURED', type: 'green' };

      card.innerHTML = `
        <!-- Food photo container with overlapping Floating Action Heart FAB -->
        <div class="card-photo-container relative w-full">
          <div class="card-photo-wrap">
            <img class="card-photo" style="width: 100%; height: 200px; object-fit: cover; background-color: #171E26; border-top-left-radius: 20px; border-top-right-radius: 20px;" src="${photoUrl}" alt="${suppressAlt ? '' : recipe.title}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='${fallbackUrl}'" />
          </div>
          <!-- Premium Floating Action Heart Component -->
          <button class="recipe-heart-fab wow-bookmark-btn tap-effect ${isSaved ? 'saved' : ''}" aria-label="${isSaved ? 'Saved to collection' : 'Save ' + recipe.title + ' to collection'}" onclick="event.stopPropagation(); toggleSaveCollection('${slug}', this);" data-recipe-id="${slug}">
            <span class="heart-icon-wrap">
              <svg class="heart-icon heart-icon-outline" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <svg class="heart-icon heart-icon-filled" viewBox="0 0 24 24" width="20" height="20" fill="#0B0F14" stroke="#0B0F14" stroke-width="1">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
            </span>
          </button>
        </div>

        <!-- Card body: Clean Text Layout -->
        <div class="card-body">
          <div class="card-info-col">
            <!-- Metrics row: stopwatch cooking time icon ("20 Min") + servings badge ("Serves 2") -->
            <div class="metrics-pill" aria-label="${cookTime}, ${servings}">
              <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
              <span>${cookTime}</span>
              <span class="metrics-dot" aria-hidden="true">•</span>
              <span class="material-symbols-outlined" aria-hidden="true">group</span>
              <span>${servings}</span>
            </div>

            <!-- Tags group / Pills Container right above the title layout block -->
            <div class="tags-group">
              <span class="tag tag--${tag1.type === 'green' ? 'green' : 'red'}">${tag1.text}</span>
              <span class="tag tag--${tag2.type === 'red' ? 'red' : 'green'}">${tag2.text}</span>
            </div>

            <!-- Dynamic recipe name title block on the left in the exact bold white typography font size -->
            <div>
              <h2 class="card-title">${recipe.title}</h2>
              <p class="card-desc">${recipe.subtitle || ''}</p>
            </div>
          </div>
        </div><!-- /.card-body -->
      `;

      card.addEventListener('click', function (e) {
        if (e.target.closest('.wow-bookmark-btn, .bookmark-btn')) return;
        e.preventDefault();
        if (typeof openRecipeDetail === 'function') {
          openRecipeDetail(slug);
        } else if (typeof window.openRecipeDetail === 'function') {
          window.openRecipeDetail(slug);
        } else {
          window.location.href = 'recipe-detail.html?recipe=' + encodeURIComponent(slug);
        }
      });

      card.addEventListener('keydown', function (e) {
        if (e.target.closest('.wow-bookmark-btn, .bookmark-btn')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof openRecipeDetail === 'function') {
            openRecipeDetail(slug);
          } else if (typeof window.openRecipeDetail === 'function') {
            window.openRecipeDetail(slug);
          } else {
            window.location.href = 'recipe-detail.html?recipe=' + encodeURIComponent(slug);
          }
        }
      });

      feedContainer.appendChild(card);
    });
  }

  /**
   * Force-Render Injection Script (filterDashboardFeed)
   * Executed when a horizontal category pill is tapped or directly invoked
   */
  function filterDashboardFeed(category) {
    const selectedCat = (category || 'all').toLowerCase().trim().replace(/^#?pill-/, '').replace(/^pill--/, '');
    
    // Step A: Use document.querySelectorAll('.category-pill, .pill') to strip the active color style from all chips, and apply solid highlight ONLY to clicked chip
    const pills = document.querySelectorAll('.category-pill, .pill');
    pills.forEach(pill => {
      const pText = pill.textContent.trim().toLowerCase();
      const pId = pill.id ? pill.id.replace(/^pill-/, '').toLowerCase() : '';
      const matches = (pText === selectedCat || pId === selectedCat);
      if (matches) {
        pill.classList.remove('pill--inactive');
        pill.classList.add('pill--active', 'active');
        pill.setAttribute('aria-selected', 'true');
      } else {
        pill.classList.remove('pill--active', 'active');
        pill.classList.add('pill--inactive');
        pill.setAttribute('aria-selected', 'false');
      }
    });

    const feedContainer = document.getElementById('recipe-feed-container') || document.getElementById('main-recipe-feed');
    renderCuratedFeed(selectedCat, feedContainer);
  }

  function onCategoryPillClick(category) {
    filterDashboardFeed(category);
  }

  /**
   * Route Handler Logic: Smooth sliding transition to bring Screen 9
   * (Saved Recipes Library Collection Grid Container) onto the main viewport canvas
   * and turn Collection tab Neon Orange (#FF5500)
   */
  function navigateToCollectionScreen() {
    const collectionScreen = document.getElementById('collection-screen');
    if (collectionScreen) {
      // Close search screen if open
      const searchScreen = document.getElementById('search-results-screen');
      if (searchScreen) {
        searchScreen.classList.remove('active');
      }

      collectionScreen.classList.add('active');

      // Update Nav Bar Tab States
      const navTabs = document.querySelectorAll('#app-nav .nav-tab');
      navTabs.forEach(tab => {
        tab.classList.remove('nav-tab--active', 'nav-tab--active-orange', 'nav-tab--collection-active');
        const dot = tab.querySelector('.nav-active-dot');
        if (dot) dot.style.display = 'none';
      });

      const colTab = document.getElementById('nav-collection') || document.querySelector('#app-nav [data-tab="collection"]');
      if (colTab) {
        colTab.classList.add('nav-tab--active', 'nav-tab--active-orange', 'nav-tab--collection-active');
        let dot = colTab.querySelector('.nav-active-dot');
        if (!dot) {
          dot = document.createElement('span');
          dot.className = 'nav-active-dot';
          dot.setAttribute('aria-hidden', 'true');
          colTab.appendChild(dot);
        }
        dot.style.display = 'block';
      }

      // Populate Collection Grid
      renderSavedCollection();
    } else {
      // Direct page navigation fallback
      window.location.href = 'collection.html';
    }
  }

  function closeCollectionScreen() {
    const collectionScreen = document.getElementById('collection-screen');
    if (collectionScreen) {
      collectionScreen.classList.remove('active');

      // Restore Home Tab as active on Dashboard
      const navTabs = document.querySelectorAll('#app-nav .nav-tab');
      navTabs.forEach(tab => {
        tab.classList.remove('nav-tab--active', 'nav-tab--active-orange', 'nav-tab--collection-active');
        const dot = tab.querySelector('.nav-active-dot');
        if (dot) dot.style.display = 'none';
      });

      const homeTab = document.getElementById('nav-home') || document.querySelector('#app-nav [data-tab="home"]');
      if (homeTab) {
        homeTab.classList.add('nav-tab--active');
        const dot = homeTab.querySelector('.nav-active-dot');
        if (dot) dot.style.display = 'block';
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. AUTOMATED DOM TEMPLATE INJECTION ENGINE (Screens 3A, 3B, 3C)
  // ═══════════════════════════════════════════════════════════════════════════
  function getActiveRecipeState() {
    // 1. Check URL search parameters first (highest priority)
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const paramRecipe = urlParams.get('id') || urlParams.get('name') || urlParams.get('recipe') || urlParams.get('slug');
      if (paramRecipe) {
        const resolved = resolveRecipeObject(paramRecipe);
        if (resolved) {
          window.activeRecipe = resolved;
          return window.activeRecipe;
        }
        try {
          const cached = localStorage.getItem(`wow_recipe_cache_${paramRecipe}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            window.activeRecipe = parsed;
            return parsed;
          }
        } catch (e) {}

        if (/^\d+$/.test(paramRecipe)) {
          return null;
        }
      }
    }

    if (window.activeRecipe) return window.activeRecipe;

    // 2. Check stored session
    try {
      const stored = localStorage.getItem('wow_active_recipe') || sessionStorage.getItem('wow_active_recipe');
      if (stored) {
        const parsed = JSON.parse(stored);
        window.activeRecipe = parsed;
        return parsed;
      }
    } catch (e) {
      console.warn('Failed reading stored active recipe:', e);
    }

    // 3. Default to Sesame Chicken
    window.activeRecipe = RECIPE_CATALOG['sesame-chicken'];
    return window.activeRecipe;
  }

  function renderActiveRecipeDetail(customRecipe) {
    try {
      const recipe = customRecipe || getActiveRecipeState();
      if (!recipe) return;

      const heroImageSrc = recipe.imageUrl || recipe.image || recipe.img || 'assets/sesame-chicken.png';
      const defaultHeroFallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';

      // ─── A. Header & Meta Injection ─────────────────────────────────────────
      const pageTitle = document.querySelector('title');
      if (pageTitle) pageTitle.textContent = `wow | ${recipe.title}`;

      const mainTitleEl = document.querySelector('.recipe-main-title');
      if (mainTitleEl) mainTitleEl.textContent = recipe.title;

      const coverImg = document.querySelector('.media-cover-img');
      if (coverImg) {
        coverImg.src = heroImageSrc;
        coverImg.alt = recipe.title;
        coverImg.onerror = function () {
          const fallback = recipe.fallbackImage || defaultHeroFallback;
          if (this.src !== fallback) {
            this.src = fallback;
          } else {
            this.onerror = null;
          }
        };
      }

      const categoryBadge = document.querySelector('.live-category-badge span:last-child');
      if (categoryBadge) categoryBadge.textContent = recipe.category || 'GOURMET RECIPE';

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

      // ─── B. Screen 3A (Ingredients Tab) Dynamic Injection ──────────────────
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

      // Populate Ingredients Stack with clean raw FHD photography
      const ingStack = document.querySelector('.ingredients-stack');
      if (ingStack && Array.isArray(recipe.ingredients)) {
        ingStack.innerHTML = '';
        recipe.ingredients.forEach(item => {
          const ingCard = document.createElement('div');
          ingCard.className = 'ingredient-card';

          const rawIcon = resolveIngredientIcon(item, recipe);
          const itemName = item.name || 'Fresh Ingredient';
          const itemQty = item.qty || item.amount || 'To taste';
          const itemBase = item.base || 1;
          const itemUnit = item.unit || '';
          const fallbackPhoto = getFHDIngredientPhoto(itemName);

          ingCard.innerHTML = `
            <div class="ingredient-left">
              <div class="ingredient-img-wrapper">
                <img src="${rawIcon}" alt="${itemName}" class="round-shape" onerror="this.onerror=null; this.src='${fallbackPhoto}'" />
              </div>
              <span class="ingredient-name">${itemName}</span>
            </div>
            <span class="ingredient-amount" data-base="${itemBase}" data-unit="${itemUnit}">${itemQty}</span>
          `;
          ingStack.appendChild(ingCard);
        });
      }

      // ─── C. Screen 3B (Instructions Tab) Dynamic Injection ─────────────────
      const instPanel = document.getElementById('tab-panel-1');
      if (instPanel) {
        const parsedInstructions = parseInstructionSteps(recipe.instructions);

        const stepCountBadge = document.getElementById('step-count-badge') || instPanel.querySelector('.instructions-header-bar > span:last-child') || instPanel.querySelector('.instructions-header-bar > span');
        if (stepCountBadge) {
          stepCountBadge.textContent = `${parsedInstructions.length} Steps`;
        }

        const totalTimeText = document.getElementById('step-total-time') || instPanel.querySelector('.instructions-header-bar .time-info-row span:last-child');
        if (totalTimeText) {
          totalTimeText.textContent = `Total Time: ${recipe.totalTime || '30 minutes'}`;
        }

        // Clear existing instruction cards (keep header bar)
        const existingCards = instPanel.querySelectorAll('.instruction-step-card');
        existingCards.forEach(c => c.remove());

        parsedInstructions.forEach((step, idx) => {
          const stepNum = step.stepNum || (idx + 1);
          const card = document.createElement('div');
          card.className = 'instruction-step-card';
          const cardImg = step.img || step.imageUrl || step.image || '';
          card.innerHTML = `
            <div class="step-number-badge">${stepNum}</div>
            <div class="step-content">
              <h4 class="step-title">${step.title}</h4>
              <p class="step-desc">${step.instruction}</p>
              ${cardImg ? `
                <div class="step-img-wrapper" style="margin-top:10px;border-radius:12px;overflow:hidden;">
                  <img src="${cardImg}" alt="${step.title}" onerror="this.parentNode.style.display='none';" style="width:100%;height:130px;object-fit:cover;" />
                </div>
              ` : ''}
            </div>
          `;
          instPanel.appendChild(card);
        });

        // Synchronize cooking steps for Screen 4A modal session
        if (typeof window.cookingSteps !== 'undefined') {
          window.cookingSteps = parsedInstructions.map((s, idx) => ({
            stepNum: s.stepNum || (idx + 1),
            title: s.title,
            instruction: s.instruction,
            timer: s.timer || '05:00',
            img: s.img || s.imageUrl || s.image || '',
            ingredients: s.ingredients || []
          }));
        }
      }

      // ─── D. Screen 3C (Health Score WOW MATRIX Tab) Dynamic Injection ──────
      const matrixScore = recipe.healthScore || {};
      const scoreLarge = document.querySelector('.score-large');
      if (scoreLarge) scoreLarge.textContent = matrixScore.score || '7.2';

      const ratingLevel = document.querySelector('.rating-level');
      if (ratingLevel) ratingLevel.textContent = matrixScore.rating || 'Medium';

      const ratingSub = document.querySelector('.rating-sub');
      if (ratingSub) ratingSub.textContent = matrixScore.ratingSub || 'Rating';

      // Macros 2x2 Grid
      if (matrixScore.macros) {
        const macroCards = document.querySelectorAll('.macro-grid-2x2 .macro-card');
        const macroKeys = ['protein', 'carbs', 'fat', 'fiber'];
        macroCards.forEach((card, idx) => {
          const key = macroKeys[idx];
          const data = matrixScore.macros[key];
          if (data) {
            const valEl = card.querySelector('.macro-val');
            const fillEl = card.querySelector('.macro-bar-fill');
            if (valEl) valEl.textContent = data.val;
            if (fillEl) fillEl.style.width = `${data.pct || 50}%`;
          }
        });
      }

      // Detailed Nutrition Table
      if (Array.isArray(matrixScore.nutritionTable)) {
        const nutritionCard = document.querySelector('.nutrition-table-card');
        if (nutritionCard) {
          nutritionCard.innerHTML = '';
          matrixScore.nutritionTable.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'nutrition-row';
            rowDiv.innerHTML = `
              <span class="nutrition-name">${row.name}</span>
              <div><span class="nutrition-val">${row.val}</span><span class="nutrition-pct">${row.pct}</span></div>
            `;
            nutritionCard.appendChild(rowDiv);
          });
        }
      }

      // ─── E. Community Tags & Feedback (With Safe Numerical Evaluation) ────
      const likedStr = formatMetricCount(recipe.community?.liked, recipe.likes, 367, 'liked');
      const dislikedStr = formatMetricCount(recipe.community?.disliked, recipe.dislikes, 20, 'disliked');

      const likedPill = document.getElementById('liked-count-text') || 
                        document.querySelector('.like-dislike-row .feedback-pill.liked .feedback-metric-text') ||
                        document.querySelector('.like-dislike-row .feedback-pill:first-child .feedback-metric-text') ||
                        document.querySelector('.like-dislike-row .feedback-pill:first-child > span:not(.feedback-icon-box)');
      if (likedPill) likedPill.textContent = likedStr;

      const dislikedPill = document.getElementById('disliked-count-text') || 
                           document.querySelector('.like-dislike-row .feedback-pill.disliked .feedback-metric-text') ||
                           document.querySelector('.like-dislike-row .feedback-pill:last-child .feedback-metric-text') ||
                           document.querySelector('.like-dislike-row .feedback-pill:last-child > span:not(.feedback-icon-box)');
      if (dislikedPill) dislikedPill.textContent = dislikedStr;

      const tagCloud = document.querySelector('.tag-cloud');
      if (tagCloud) {
        const tags = (recipe.community && Array.isArray(recipe.community.tags))
          ? recipe.community.tags
          : ['Chef AI Innovation', 'Fresh Ingredients', 'Healthy Macro Balance', 'Quick Prep'];
        tagCloud.innerHTML = '';
        tags.forEach(t => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'recipe-tag';
          tagSpan.textContent = t;
          tagCloud.appendChild(tagSpan);
        });
      }
    } catch (err) {
      console.error('renderActiveRecipeDetail error caught gracefully:', err);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. UNIVERSAL CARD BINDING & EVENT DELEGATION
  // ═══════════════════════════════════════════════════════════════════════════
  function bindUniversalRecipeClicks() {
    document.addEventListener('click', function (e) {
      const recipeCard = e.target.closest('.recipe-card, .match-card, [data-recipe-id]');
      if (!recipeCard) return;

      // Ignore bookmark button clicks
      if (e.target.closest('.wow-bookmark-btn, .bookmark-btn, .suggested-bookmark, .tag-remove')) return;

      e.preventDefault();

      // Find recipe identity
      const dataAttr = recipeCard.getAttribute('data-recipe-id');
      const titleEl = recipeCard.querySelector('.card-title, .match-title, h2, h4');
      const idAttr = recipeCard.id;
      let targetId = 'sesame-chicken';

      if (dataAttr) {
        targetId = dataAttr;
      } else if (idAttr && idAttr.startsWith('card-')) {
        targetId = idAttr.replace(/^card-/, '');
      } else if (titleEl && titleEl.textContent && titleEl.textContent.trim()) {
        targetId = titleEl.textContent.trim();
      } else if (idAttr) {
        targetId = idAttr.replace(/^card-/, '');
      }

      openRecipeDetail(targetId);
    });
  }

  // Listen for real-time save updates across tabs and views
  if (typeof window !== 'undefined') {
    window.addEventListener('wowRecipeSavedStateChanged', () => {
      const collectionScreen = document.getElementById('collection-screen');
      if (document.getElementById('collection-grid') || (collectionScreen && collectionScreen.classList.contains('active'))) {
        renderSavedCollection();
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'wow_saved_recipes') {
        syncSavedButtonStates();
        renderSavedCollection();
      }
    });
  }

  // Auto-initialize when DOM is ready
  function applyInstructionStepImageFix() {
    const stepCards = document.querySelectorAll("#tab-panel-1 .instruction-step-card");
    if (stepCards && stepCards.length >= 4) {
      const step2Img = stepCards[1].querySelector("img");
      if (step2Img) {
        step2Img.style.display = "block";
        step2Img.src = "assets/images/cooking-skillet.jpg";
      }
      const step3Img = stepCards[2].querySelector("img");
      if (step3Img) {
        step3Img.style.display = "block";
        step3Img.src = "assets/images/pasta-emulsify.jpg";
      }
      const step4Img = stepCards[3].querySelector("img");
      if (step4Img) {
        step4Img.style.display = "block";
        step4Img.src = "assets/carbonara.png";
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindUniversalRecipeClicks();
      syncSavedButtonStates();
      if (window.location.pathname.endsWith('recipe-detail.html') || document.getElementById('recipe-header')) {
        renderActiveRecipeDetail();
      }
      if (window.location.pathname.endsWith('collection.html')) {
        renderSavedCollection();
      }
      applyInstructionStepImageFix();
    });
  } else {
    bindUniversalRecipeClicks();
    syncSavedButtonStates();
    if (window.location.pathname.endsWith('recipe-detail.html') || document.getElementById('recipe-header')) {
      renderActiveRecipeDetail();
    }
    if (window.location.pathname.endsWith('collection.html')) {
      renderSavedCollection();
    }
    applyInstructionStepImageFix();
  }

  // Export to global scope
  global.FHD_RAW_DATABASE = FHD_RAW_DATABASE;
  global.getFHDIngredientPhoto = getFHDIngredientPhoto;
  global.getFallbackVectorIcon = getFHDIngredientPhoto;
  global.sanitizeIngredientName = sanitizeIngredientName;
  global.resolveIngredientIcon = resolveIngredientIcon;
  global.parseInstructionSteps = parseInstructionSteps;
  global.formatMetricCount = formatMetricCount;
  global.createContextualFallbackRecipe = createContextualFallbackRecipe;
  global.createContextualVariations = createContextualVariations;
  global.searchRecipesAsync = searchRecipesAsync;
  global.searchRecipesMultipleAsync = searchRecipesMultipleAsync;
  global.renderSearchResultsGrid = renderSearchResultsGrid;
  global.renderSavedCollection = renderSavedCollection;
  global.filterByPantryMatches = filterByPantryMatches;
  global.scannedIngredients = (typeof window !== 'undefined') ? window.scannedIngredients : ["garlic", "tomato", "onion", "chicken", "beef"];
  global.navigateToCollectionScreen = navigateToCollectionScreen;
  global.closeCollectionScreen = closeCollectionScreen;
  global.toggleSaveCollection = toggleSaveCollection;
  global.showSavedToast = showSavedToast;
  global.isRecipeSaved = isRecipeSaved;
  global.syncSavedButtonStates = syncSavedButtonStates;
  global.CURATED_CREATIONS = CURATED_CREATIONS;
  global.renderCuratedFeed = renderCuratedFeed;
  global.filterDashboardFeed = filterDashboardFeed;
  global.onCategoryPillClick = onCategoryPillClick;
  global.RECIPE_CATALOG = RECIPE_CATALOG;
  global.resolveRecipeObject = resolveRecipeObject;
  global.openRecipeDetail = openRecipeDetail;
  global.renderActiveRecipeDetail = renderActiveRecipeDetail;
  global.getActiveRecipeState = getActiveRecipeState;

})(typeof window !== 'undefined' ? window : this);

