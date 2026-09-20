const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, '..', 'dashboard.html');
let html = fs.readFileSync(dashboardPath, 'utf8');

// 1. Check HTML primary button & subfilter strip
const oldAromaticsPill = `<button class="filter-pill" data-primary-filter="aromatics">
            <span>Aromatics</span>
          </button>`;

const newAromaticsPill = `<button class="filter-pill" id="primary-pill-aromatics" data-primary-filter="aromatics" aria-expanded="false"
            aria-controls="aromatics-subfilter-strip">
            <span class="material-symbols-outlined filter-icon--orange">skillet</span>
            <span>Aromatics</span>
          </button>`;

if (!html.includes('id="primary-pill-aromatics"')) {
  if (html.includes(oldAromaticsPill)) {
    html = html.replace(oldAromaticsPill, newAromaticsPill);
    console.log('Replaced old Aromatics pill with new ID & icon pill.');
  } else {
    console.error('Could not find oldAromaticsPill in HTML');
  }
}

// 2. Add Aromatics Sub-Filter Category Strip directly beneath base-carb-subfilter-strip
const aromaticsSubStripHTML = `        <!-- Aromatics Sub-Filter Category Strip (French Mirepoix, Holy Trinity, Asian Trio, South Asian Base, Latin Sofrito) - Hidden by default -->
        <div id="aromatics-subfilter-strip" class="subfilter-scroll-row" style="display: none;"
          aria-label="Aromatics Sub-Category Filters">
          <button class="subfilter-pill" data-aromatics-sub="french-mirepoix">
            <span class="material-symbols-outlined">soup_kitchen</span>
            <span>French Mirepoix</span>
          </button>
          <button class="subfilter-pill" data-aromatics-sub="holy-trinity">
            <span class="material-symbols-outlined">restaurant</span>
            <span>Holy Trinity</span>
          </button>
          <button class="subfilter-pill" data-aromatics-sub="asian-trio">
            <span class="material-symbols-outlined">ramen_dining</span>
            <span>Asian Trio</span>
          </button>
          <button class="subfilter-pill" data-aromatics-sub="south-asian-base">
            <span class="material-symbols-outlined">dinner_dining</span>
            <span>South Asian Base</span>
          </button>
          <button class="subfilter-pill" data-aromatics-sub="latin-sofrito" style="margin-right: 16px;">
            <span class="material-symbols-outlined">local_fire_department</span>
            <span>Latin Sofrito</span>
          </button>
        </div>`;

if (!html.includes('id="aromatics-subfilter-strip"')) {
  const targetSubStripAnchor = `        <!-- Base / Carb Sub-Filter Category Strip (Rice-Based, Flour & Pasta, Potato-Centric, Corn & Maize) - Hidden by default -->`;
  const baseCarbStripEnd = `          <button class="subfilter-pill" data-carb-sub="corn-maize" style="margin-right: 16px;">
            <span class="material-symbols-outlined">grass</span>
            <span>Corn &amp; Maize</span>
          </button>
        </div>`;

  if (html.includes(baseCarbStripEnd)) {
    html = html.replace(baseCarbStripEnd, baseCarbStripEnd + '\n\n' + aromaticsSubStripHTML);
    console.log('Inserted aromatics-subfilter-strip directly beneath base-carb-subfilter-strip.');
  } else {
    console.error('Could not find baseCarbStripEnd anchor!');
  }
}

// 3. Define the comprehensive 50-recipe AROMATICS_GROUPS dataset
const aromaticsGroupsCode = `
      // ==========================================================================
      // 🌿 EXPANDED AROMATICS CULINARY DATA MATRIX (50 Iconic Global Dishes)
      // ==========================================================================
      const AROMATICS_GROUPS = {
        // ==========================================================================
        // 🇫🇷 THE FRENCH MIREPOIX (10 Famous Recipes)
        // Ratio: 2 parts Onion, 1 part Carrot, 1 part Celery in rich butter / stock
        // ==========================================================================
        "french-mirepoix": [
          {
            title: "Classic Beef Bourguignon",
            searchTerm: "Beef Bourguignon",
            group: "french-mirepoix",
            fallbackImage: "assets/bourguignon.png",
            time: "150 Min",
            serves: "4",
            badge: "Burgundy Heritage",
            desc: "Tender beef chuck slow-braised in red Burgundy wine, rich mirepoix aromatics, garlic, lardons, pearl onions, and sautéed mushrooms.",
            calories: "680 kcal",
            protein: "54g",
            fat: "32g",
            carbs: "18g",
            health: "9.1/10",
            sub: "Burgundy Wine & Mirepoix Braise",
            ingredients: [
              "Prime Beef Chuck Roast Cubed (800g)",
              "French Mirepoix: Diced Onions, Carrots, Celery (2 cups)",
              "Full-Bodied Burgundy Pinot Noir Wine (750ml)",
              "Smoked Pork Lardons & Button Mushrooms (200g)",
              "Fresh Thyme, Bay Leaves & Beef Bone Broth (500ml)"
            ],
            steps: [
              "Render lardons until crisp; sear seasoned beef chunks in sizzling drippings until deep mahogany brown.",
              "Sauté finely diced onion, carrot, and celery mirepoix with minced garlic and tomato paste until caramelized.",
              "Pour Burgundy wine and rich stock; braise slowly in Dutch oven for 2.5 hours until fork-meltingly tender."
            ]
          },
          {
            title: "Chicken Noodle Soup",
            searchTerm: "Chicken Noodle Soup",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "4",
            badge: "Comfort Classic",
            desc: "Golden simmered chicken broth built on sweet diced mirepoix aromatics, tender shredded roast chicken, egg noodles, and fresh dill.",
            calories: "340 kcal",
            protein: "32g",
            fat: "10g",
            carbs: "34g",
            health: "9.8/10",
            sub: "Golden Mirepoix Herb Broth",
            ingredients: [
              "Shredded Free-Range Chicken Meat (400g)",
              "Classic Mirepoix: Yellow Onion, Carrots, Celery (2 cups)",
              "Rich Golden Chicken Bone Broth (1.5L)",
              "Traditional Broad Egg Noodles (200g)",
              "Fresh Dill, Parsley & Sea Salt (0.5 cup)"
            ],
            steps: [
              "Gently sweat diced onion, sliced carrots, and celery in butter until aromatic and sweet without browning.",
              "Pour rich chicken bone broth, bring to a rolling simmer, and cook egg noodles al dente.",
              "Fold in shredded tender chicken and finish with generous handfuls of chopped fresh dill and parsley."
            ]
          },
          {
            title: "Bolognese Ragù",
            searchTerm: "Bolognese",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1621996346565-e3adc644d942?auto=format&fit=crop&w=1200&q=80",
            time: "180 Min",
            serves: "6",
            badge: "Emilian Masterpiece",
            desc: "Authentic slow-simmered ragù of finely minced beef and pork, aromatic battuto mirepoix, whole milk, dry white wine, and San Marzano tomatoes.",
            calories: "590 kcal",
            protein: "42g",
            fat: "28g",
            carbs: "46g",
            health: "9.0/10",
            sub: "Slow-Simmered Battuto Meat Sauce",
            ingredients: [
              "Minced Beef Chuck & Pork Shoulder (600g)",
              "Finely Minced Soffritto: Onion, Carrot, Celery (2 cups)",
              "Whole Milk & Dry White Wine (1 cup each)",
              "San Marzano Crushed Tomatoes (400g)",
              "Fresh Tagliatelle & Aged Parmigiano-Reggiano (1 cup)"
            ],
            steps: [
              "Sweat finely minced onion, carrot, and celery in butter and olive oil until sweet and translucent.",
              "Brown minced meats gently; pour dry white wine and cook until evaporated, then simmer with whole milk.",
              "Add tomatoes and slow simmer on lowest flame for 3 hours; toss with handmade egg tagliatelle."
            ]
          },
          {
            title: "French Onion Soup",
            searchTerm: "French Onion Soup",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "60 Min",
            serves: "4",
            badge: "Parisian Gratinée",
            desc: "Slow-caramelized sweet yellow onions deglazed with Cognac and rich beef broth, topped with toasted baguette and broiled bubbly Gruyère cheese.",
            calories: "420 kcal",
            protein: "18g",
            fat: "22g",
            carbs: "38g",
            health: "8.9/10",
            sub: "Caramelized Onion & Broiled Gruyère",
            ingredients: [
              "Thinly Sliced Yellow & Vidalia Onions (1.2 kg)",
              "Cultured Butter & Fresh Thyme Sprigs (4 tbsp)",
              "Cognac or French Brandy & Dry Sherry (0.5 cup)",
              "Simmered Roasted Beef Bone Broth (1.2L)",
              "Toasted Baguette Slices & Aged Cave Gruyère (200g)"
            ],
            steps: [
              "Caramelize onions slowly in butter with fresh thyme for 45 minutes until deep mahogany and sweet.",
              "Deglaze pan with splash of Cognac and sherry, then simmer in rich beef broth for 20 minutes.",
              "Ladle into oven-safe crocks, top with crusty baguette slices and grated Gruyère, and broil until bubbling golden."
            ]
          },
          {
            title: "Coq au Vin",
            searchTerm: "Coq au Vin",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80",
            time: "75 Min",
            serves: "4",
            badge: "French Bistro",
            desc: "Succulent bone-in chicken thighs braised in red Burgundy wine with a rich aromatic mirepoix base, smoky lardons, and glazed pearl onions.",
            calories: "620 kcal",
            protein: "52g",
            fat: "24g",
            carbs: "12g",
            health: "9.2/10",
            sub: "Burgundy Braised Heritage",
            ingredients: [
              "Bone-In Skin-On Chicken Thighs & Drumsticks (800g)",
              "Diced Mirepoix: Onion, Carrots, Celery (2 cups)",
              "Smoked Bacon Lardons & Button Mushrooms (200g)",
              "Burgundy Pinot Noir Wine & Chicken Broth (500ml)",
              "Glazed Pearl Onions & Fresh Thyme (1 cup)"
            ],
            steps: [
              "Crisp lardons in a heavy cocotte; sear seasoned chicken pieces in fragrant rendered fat.",
              "Sauté mirepoix vegetables and cremini mushrooms with minced garlic and flour.",
              "Pour Burgundy wine and stock, cover, and gently braise for 45 minutes until meltingly succulent."
            ]
          },
          {
            title: "Classic Pot Roast",
            searchTerm: "Pot Roast",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
            time: "180 Min",
            serves: "6",
            badge: "Sunday Roast",
            desc: "Fork-tender chuck roast braised with sweet chunky carrots, celery, pearl onions, garlic cloves, and a rich rosemary red wine gravy.",
            calories: "640 kcal",
            protein: "58g",
            fat: "34g",
            carbs: "16g",
            health: "9.1/10",
            sub: "Slow-Braised Chuck & Chunky Mirepoix",
            ingredients: [
              "Boneless Beef Chuck Roast (1.5 kg)",
              "Chunky Cut Mirepoix: Onions, Carrots, Celery (3 cups)",
              "Beef Stock & Dry Red Wine (750ml)",
              "Worcestershire Sauce & Tomato Paste (2 tbsp)",
              "Fresh Rosemary, Thyme & Garlic Head (1 each)"
            ],
            steps: [
              "Sear chuck roast aggressively on all sides in hot Dutch oven until a deep caramelized crust forms.",
              "Surround beef with chunky mirepoix vegetables, halved garlic head, and fresh herbs.",
              "Add broth and red wine; braise covered in 150°C (300°F) oven for 3 hours until effortlessly shreddable."
            ]
          },
          {
            title: "Creamy Vegetable Chowder",
            searchTerm: "Vegetable Chowder",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "4",
            badge: "Velvety Harvest",
            desc: "Hearty country chowder loaded with tender mirepoix aromatics, Yukon gold potatoes, sweet corn, heavy cream, and fresh garden thyme.",
            calories: "380 kcal",
            protein: "10g",
            fat: "18g",
            carbs: "46g",
            health: "9.4/10",
            sub: "Sweet Mirepoix Corn & Potato Cream",
            ingredients: [
              "Finely Diced Mirepoix: Yellow Onion, Carrots, Celery (2 cups)",
              "Yukon Gold Potatoes Diced (300g)",
              "Sweet Corn Kernels & Green Peas (1.5 cups)",
              "Heavy Cream & Rich Vegetable Broth (800ml)",
              "Fresh Thyme Leaves & Garlic Butter (3 tbsp)"
            ],
            steps: [
              "Sweat aromatic mirepoix in garlic butter with fresh thyme until fragrant and softened.",
              "Stir in flour to form a light blond roux; pour vegetable broth and simmer diced potatoes until tender.",
              "Fold in sweet corn, green peas, and heavy cream; simmer 5 minutes until rich and velvety."
            ]
          },
          {
            title: "Braised Lamb Shanks",
            searchTerm: "Lamb Shanks",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
            time: "160 Min",
            serves: "4",
            badge: "Gourmet Reserve",
            desc: "Rich cross-cut lamb shanks slow-simmered in Cabernet Sauvignon, aromatic mirepoix, rosemary, and San Marzano tomatoes until falling off bone.",
            calories: "710 kcal",
            protein: "62g",
            fat: "38g",
            carbs: "14g",
            health: "8.8/10",
            sub: "Cabernet Sauvignon & Rosemary Reduction",
            ingredients: [
              "Fresh Australian Lamb Shanks (4 shanks)",
              "Diced Mirepoix: Onions, Carrots, Celery (2.5 cups)",
              "Cabernet Sauvignon Wine & Lamb Broth (750ml)",
              "San Marzano Tomato Paste & Crushed Tomatoes (1 cup)",
              "Fresh Rosemary, Thyme & Whole Garlic Cloves (6 cloves)"
            ],
            steps: [
              "Brown lamb shanks deeply on all sides in a heavy Dutch oven; remove and set aside.",
              "Sauté mirepoix aromatics and garlic in pan drippings until lightly caramelized.",
              "Pour red wine and lamb stock; return shanks and slow-braise for 2.5 hours until meat melts off the bone."
            ]
          },
          {
            title: "Split Pea and Ham Soup",
            searchTerm: "Split Pea Soup",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "70 Min",
            serves: "6",
            badge: "Hearthside Classic",
            desc: "Earthy dried green split peas simmered with a smoked ham hock, sweet mirepoix vegetables, bay leaves, and cracked black pepper.",
            calories: "390 kcal",
            protein: "28g",
            fat: "12g",
            carbs: "48g",
            health: "9.6/10",
            sub: "Smoked Ham Hock & Green Pea Pot",
            ingredients: [
              "Green Split Peas Rinsed (400g)",
              "Smoked Pork Ham Hock (1 large)",
              "Mirepoix: Chopped Onions, Carrots, Celery (2 cups)",
              "Low-Sodium Broth & Water (1.8L)",
              "Fresh Bay Leaves & Ground Black Pepper (1 tbsp)"
            ],
            steps: [
              "Sauté chopped mirepoix in olive oil with minced garlic until softened.",
              "Add split peas, smoked ham hock, bay leaves, and broth; bring to a boil.",
              "Simmer gently for 60 minutes until peas break down into a thick comforting pot; shred ham into soup."
            ]
          },
          {
            title: "Traditional Minestrone",
            searchTerm: "Minestrone",
            group: "french-mirepoix",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "4",
            badge: "Tuscan Garden",
            desc: "Hearty Italian vegetable stew anchored by a sweet sautéed mirepoix base, cannellini beans, zucchini, ditalini pasta, and aged Parmigiano rind.",
            calories: "320 kcal",
            protein: "14g",
            fat: "8g",
            carbs: "52g",
            health: "9.9/10",
            sub: "Cannellini Bean & Ditalini Herb Pot",
            ingredients: [
              "Finely Diced Mirepoix: Onion, Carrots, Celery (2 cups)",
              "Cannellini White Beans & Diced Zucchini (2 cups)",
              "San Marzano Diced Tomatoes & Broth (1L)",
              "Ditalini Pasta & Parmigiano-Reggiano Rind (1 cup)",
              "Fresh Basil, Tuscan Kale & Olive Oil (2 tbsp)"
            ],
            steps: [
              "Sauté aromatic mirepoix in extra virgin olive oil with minced garlic until fragrant and sweet.",
              "Add crushed tomatoes, vegetable broth, cannellini beans, and parmesan rind; simmer 20 minutes.",
              "Stir in ditalini pasta and chopped kale; cook until pasta is al dente and finish with torn basil."
            ]
          }
        ],

        // ==========================================================================
        // 🇺🇸 THE HOLY TRINITY (10 Famous Recipes)
        // Ratio: 2 parts Onion, 1 part Green Bell Pepper, 1 part Celery (Cajun/Creole)
        // ==========================================================================
        "holy-trinity": [
          {
            title: "Louisiana Gumbo",
            searchTerm: "Gumbo",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
            time: "90 Min",
            serves: "6",
            badge: "Cajun Cornerstone",
            desc: "Deep dark chocolate roux simmered with the holy trinity aromatics, spicy andouille sausage, tender Gulf shrimp, okra, and file powder.",
            calories: "540 kcal",
            protein: "38g",
            fat: "26g",
            carbs: "38g",
            health: "9.1/10",
            sub: "Dark Roux & Andouille Seafood Pot",
            ingredients: [
              "Smoked Andouille Sausage Sliced (300g)",
              "Gulf Shrimps & Chicken Thighs (400g)",
              "Holy Trinity: Onion, Green Bell Pepper, Celery (2.5 cups)",
              "Dark Mahogany Oil-Flour Roux (0.75 cup each)",
              "Rich Seafood/Chicken Stock & Okra (1.5L)"
            ],
            steps: [
              "Whisk flour and oil continuously over medium-low heat for 30 minutes until dark chocolate brown.",
              "Immediately stir in chopped holy trinity vegetables to stop the roux from burning; cook until tender.",
              "Whisk in warm stock, browned andouille, chicken, and okra; simmer 45 minutes and finish with shrimp."
            ]
          },
          {
            title: "Cajun Jambalaya",
            searchTerm: "Jambalaya",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "4",
            badge: "Bayou Signature",
            desc: "Long grain rice cooked in seasoned chicken broth with holy trinity aromatics, smoky andouille, seared chicken, and zesty Creole spices.",
            calories: "560 kcal",
            protein: "36g",
            fat: "22g",
            carbs: "56g",
            health: "9.3/10",
            sub: "Spiced Andouille & Trinity Rice",
            ingredients: [
              "Long Grain White Rice (350g)",
              "Holy Trinity: Chopped Onion, Green Bell Pepper, Celery (2 cups)",
              "Smoked Andouille Sausage & Chicken Breast (400g)",
              "Crushed Tomatoes & Chicken Broth (800ml)",
              "Cajun Spice Blend, Garlic & Scallions (3 tbsp)"
            ],
            steps: [
              "Brown sliced andouille sausage and seasoned chicken chunks in cast iron pot; remove.",
              "Sauté holy trinity vegetables and garlic in rendered drippings until softened and aromatic.",
              "Add rice, tomatoes, broth, and meats; cover tightly and simmer undisturbed for 25 minutes."
            ]
          },
          {
            title: "Crawfish Étouffée",
            searchTerm: "Etouffee",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "4",
            badge: "Lafayette Classic",
            desc: "Plump Louisiana crawfish tails smothered in a golden blond roux infused with holy trinity aromatics, garlic, cayenne, and steamed rice.",
            calories: "480 kcal",
            protein: "34g",
            fat: "20g",
            carbs: "42g",
            health: "9.2/10",
            sub: "Golden Butter Roux Smothered Tails",
            ingredients: [
              "Louisiana Crawfish Tails with Fat (450g)",
              "Holy Trinity: Minced Onion, Bell Pepper, Celery (2 cups)",
              "Golden Butter Roux: Butter & Flour (4 tbsp each)",
              "Seafood Broth & Worcestershire Sauce (500ml)",
              "Cayenne, Green Scallions & Steamed Rice (1 cup)"
            ],
            steps: [
              "Melt butter and whisk in flour to create a fragrant golden copper roux.",
              "Fold in minced holy trinity and garlic, cooking gently until sweet and translucent.",
              "Pour seafood stock, simmer until velvety, and fold in crawfish tails for 6 minutes; serve over white rice."
            ]
          },
          {
            title: "Shrimp Creole",
            searchTerm: "Shrimp Creole",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "4",
            badge: "New Orleans Creole",
            desc: "Jumbo Gulf shrimp simmered in a spicy, piquant tomato sauce built on the holy trinity, garlic, Worcestershire, and cayenne pepper.",
            calories: "420 kcal",
            protein: "36g",
            fat: "14g",
            carbs: "38g",
            health: "9.5/10",
            sub: "Piquant Tomato Pepper Creole Sauce",
            ingredients: [
              "Wild Gulf Shrimp Peeled & Deveined (500g)",
              "Holy Trinity: Onion, Green Bell Pepper, Celery (2 cups)",
              "San Marzano Diced Tomatoes & Tomato Sauce (600g)",
              "Garlic, Thyme, Bay Leaf & Hot Pepper Sauce (2 tbsp)",
              "Fluffy Long-Grain White Rice for Serving (2 cups)"
            ],
            steps: [
              "Sauté diced holy trinity in butter and olive oil for 8 minutes until tender and sweet.",
              "Add garlic, crushed tomatoes, bay leaves, thyme, cayenne, and Worcestershire; simmer 20 minutes.",
              "Drop in raw shrimp and cook gently for 4 minutes until pink and tender; ladle over fluffy white rice."
            ]
          },
          {
            title: "Cajun Dirty Rice",
            searchTerm: "Dirty Rice",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Bayou Heritage",
            desc: "Traditional rice dish colored by finely minced pork sausage and chicken livers, sauteed holy trinity aromatics, garlic, and scallions.",
            calories: "460 kcal",
            protein: "26g",
            fat: "18g",
            carbs: "48g",
            health: "9.0/10",
            sub: "Savory Minced Liver & Trinity Rice",
            ingredients: [
              "Minced Pork Breakfast Sausage & Chicken Livers (300g)",
              "Holy Trinity: Finely Diced Onion, Bell Pepper, Celery (2 cups)",
              "Cooked Long Grain White Rice (4 cups)",
              "Rich Chicken Broth & Garlic (1 cup)",
              "Creole Seasoning & Chopped Green Scallions (4 tbsp)"
            ],
            steps: [
              "Brown finely minced sausage and livers in skillet until deep golden, breaking into tiny crumbs.",
              "Add holy trinity aromatics and minced garlic; cook until softened and caramelized.",
              "Pour chicken broth to deglaze, then fold in warm cooked white rice and sliced green scallions."
            ]
          },
          {
            title: "Blackened Catfish PoBoy",
            searchTerm: "Po Boy",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "2",
            badge: "French Quarter",
            desc: "Cast-iron blackened catfish fillets over holy trinity sautéed slaw, crispy pickles, and spicy remoulade inside crusty French bread.",
            calories: "580 kcal",
            protein: "38g",
            fat: "24g",
            carbs: "52g",
            health: "8.9/10",
            sub: "Blackened Catfish & Remoulade Baguette",
            ingredients: [
              "Fresh Catfish Fillets (350g)",
              "Holy Trinity Relish: Fine Onion, Pepper, Celery (1 cup)",
              "Cast-Iron Blackening Spice Rub (3 tbsp)",
              "Crusty French Baguette Rolls (2 large)",
              "Zesty Creole Remoulade & Pickles (0.5 cup)"
            ],
            steps: [
              "Coat catfish fillets heavily in melted butter and Cajun blackening seasoning.",
              "Sear in smoking cast iron skillet for 3 minutes per side until charred and flaky.",
              "Spread remoulade on toasted French bread, add holy trinity relish, pickles, and blackened catfish."
            ]
          },
          {
            title: "Red Beans and Rice",
            searchTerm: "Red Beans and Rice",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
            time: "90 Min",
            serves: "6",
            badge: "Monday Tradition",
            desc: "Creamy slow-simmered Louisiana red kidney beans with pickled pork, smoked andouille, holy trinity aromatics, and fragrant white rice.",
            calories: "510 kcal",
            protein: "28g",
            fat: "16g",
            carbs: "64g",
            health: "9.5/10",
            sub: "Slow-Simmered Creamy Kidney Beans",
            ingredients: [
              "Camellia Louisiana Red Kidney Beans (450g)",
              "Smoked Andouille Sausage & Pickled Pork (300g)",
              "Holy Trinity: Diced Onion, Bell Pepper, Celery (2 cups)",
              "Chicken Stock, Bay Leaves & Garlic (1.5L)",
              "Steamed Jasmine/Long Grain White Rice (3 cups)"
            ],
            steps: [
              "Sauté holy trinity and garlic in rendered sausage drippings until fragrant.",
              "Add soaked red beans, smoked meats, bay leaves, and broth; simmer for 1.5 hours.",
              "Mash a portion of the beans against the pot side with a wooden spoon for classic creamy texture; serve over rice."
            ]
          },
          {
            title: "Southern Cornbread Dressing",
            searchTerm: "Cornbread Dressing",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "6",
            badge: "Holiday Soul",
            desc: "Skillet baked crumbly cornbread baked with sautéed holy trinity aromatics, fresh sage, rich poultry broth, and golden butter.",
            calories: "340 kcal",
            protein: "8g",
            fat: "16g",
            carbs: "42g",
            health: "8.8/10",
            sub: "Herbed Cornbread & Sage Trinity Bake",
            ingredients: [
              "Crumpled Day-Old Skillet Cornbread (5 cups)",
              "Holy Trinity: Finely Chopped Onion, Pepper, Celery (2 cups)",
              "Cultured Butter & Minced Fresh Sage (4 tbsp)",
              "Rich Poultry Herb Broth (2.5 cups)",
              "Pasture Eggs Beaten & Black Pepper (2 eggs)"
            ],
            steps: [
              "Sauté holy trinity vegetables in butter with minced fresh sage and thyme until very tender.",
              "Toss vegetables with crumbled cornbread, beaten eggs, and warm poultry broth until moist.",
              "Transfer to baking dish and bake at 190°C (375°F) for 35 minutes until golden on top and set in center."
            ]
          },
          {
            title: "Cajun Chicken Maque Choux",
            searchTerm: "Maque Choux",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Acadian Sweet Corn",
            desc: "Braised fresh sweet corn kernels smothered in cream and bacon fat with the holy trinity, seared chicken strips, garlic, and cayenne.",
            calories: "420 kcal",
            protein: "32g",
            fat: "18g",
            carbs: "36g",
            health: "9.3/10",
            sub: "Sweet Corn & Bacon Fat Braise",
            ingredients: [
              "Fresh Sweet Corn Shucked & Scraped for Milk (4 ears)",
              "Holy Trinity: Diced Onion, Green Pepper, Celery (1.5 cups)",
              "Seared Chicken Breast Strips (300g)",
              "Bacon Drippings & Heavy Cream (3 tbsp each)",
              "Diced Ripe Tomatoes & Cayenne Pepper (1 cup)"
            ],
            steps: [
              "Crisp bacon in skillet; sauté diced holy trinity in drippings for 5 minutes.",
              "Add fresh corn kernels, corn milk, diced tomatoes, cayenne, and chicken strips.",
              "Simmer covered for 15 minutes, finish with a splash of cream, and serve warm."
            ]
          },
          {
            title: "Smoked Sausage Skillet",
            searchTerm: "Sausage Skillet",
            group: "holy-trinity",
            fallbackImage: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
            time: "20 Min",
            serves: "3",
            badge: "Cast-Iron Sizzle",
            desc: "Charred smoked pork and beef sausage coins flash-fried with holy trinity aromatics, crispy diced potatoes, and spicy Creole seasoning.",
            calories: "480 kcal",
            protein: "24g",
            fat: "28g",
            carbs: "34g",
            health: "9.0/10",
            sub: "Crispy Potato & Andouille Sizzle",
            ingredients: [
              "Smoked Louisiana Sausage Sliced (350g)",
              "Holy Trinity: Sliced Onion, Bell Pepper, Celery (2 cups)",
              "Parboiled Diced Russet Potatoes (250g)",
              "Garlic Butter & Smoked Paprika (2 tbsp)",
              "Fresh Parsley & Hot Sauce (1 tbsp)"
            ],
            steps: [
              "Sear sliced sausage in smoking cast iron skillet until caramelized; remove.",
              "Add potatoes and holy trinity to skillet, cooking on high heat until potatoes crisp and peppers char.",
              "Toss sausage back in with garlic butter and Creole seasoning; serve sizzling directly from pan."
            ]
          }
        ],

        // ==========================================================================
        // 🇨🇳 THE ASIAN TRIO (10 Famous Recipes)
        // Ratio: Fresh Ginger, Fresh Garlic, Green Scallions / Spring Onions
        // ==========================================================================
        "asian-trio": [
          {
            title: "Sichuan Mapo Tofu",
            searchTerm: "Mapo Tofu",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
            time: "20 Min",
            serves: "3",
            badge: "Chengdu Icon",
            desc: "Silken tofu cubes in a blazing crimson sauce of minced beef, fermented Pixian broad bean paste, Asian trio aromatics, and numbing Sichuan peppercorn.",
            calories: "380 kcal",
            protein: "24g",
            fat: "22g",
            carbs: "18g",
            health: "9.3/10",
            sub: "Pixian Doubanjiang & Numbing Pepper",
            ingredients: [
              "Fresh Silken Tofu Cut into Cubes (450g)",
              "Asian Trio: Minced Ginger, Garlic & Scallion Whites (4 tbsp)",
              "Pixian Doubanjiang Fermented Chili Paste (2.5 tbsp)",
              "Minced Beef Chuck (120g)",
              "Toasted Ground Sichuan Peppercorn & Scallion Greens (1 tbsp)"
            ],
            steps: [
              "Crisp minced beef in wok; add Pixian doubanjiang until oil turns brilliant crimson red.",
              "Add minced ginger, garlic, and scallion whites, stirring rapidly until fragrant.",
              "Add stock and simmer silken tofu; thicken with cornstarch slurry in three stages and dust with numbing peppercorn."
            ]
          },
          {
            title: "Kung Pao Chicken",
            searchTerm: "Kung Pao Chicken",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
            time: "20 Min",
            serves: "3",
            badge: "Sichuan Flame",
            desc: "Velveted diced chicken wok-tossed with aromatic ginger, garlic, scallions, dried red facing-heaven chilies, and crunchy roasted peanuts.",
            calories: "510 kcal",
            protein: "42g",
            fat: "22g",
            carbs: "28g",
            health: "8.9/10",
            sub: "Sichuan Chili & Peanut Wok",
            ingredients: [
              "Diced Chicken Thigh Meat (450g)",
              "Asian Trio: Sliced Ginger, Sliced Garlic & Scallion Batons (1 cup)",
              "Dried Sichuan Red Chilies & Peppercorns (15 pcs)",
              "Crunchy Roasted Peanuts (0.5 cup)",
              "Sweet-Sour Kung Pao Sauce (Chinkiang Vinegar, Soy, Sugar) (4 tbsp)"
            ],
            steps: [
              "Marinate diced chicken with soy sauce, Shaoxing wine, and potato starch for 15 minutes.",
              "Flash fry dried chilies and Sichuan peppercorns in screaming hot wok until dark and fragrant.",
              "Add chicken, toss with ginger, garlic, and scallions; swirl in kung pao sauce and roasted peanuts."
            ]
          },
          {
            title: "Basic Fried Rice",
            searchTerm: "Fried Rice",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
            time: "12 Min",
            serves: "2",
            badge: "Wok Hei Essence",
            desc: "Golden day-old Jasmine rice tossed over scorching heat with scrambled eggs, fragrant Asian trio aromatics, light soy sauce, and scallions.",
            calories: "410 kcal",
            protein: "14g",
            fat: "14g",
            carbs: "56g",
            health: "9.1/10",
            sub: "Wok-Hei Fragrant Rice",
            ingredients: [
              "Chilled Day-Old Jasmine Rice (3.5 cups)",
              "Asian Trio: Minced Ginger, Garlic & Scallions (4 tbsp)",
              "Pasture Eggs Beaten (3 large)",
              "Light Soy Sauce & Toasted Sesame Oil (2 tbsp)",
              "White Pepper & Sweet Peas (0.5 cup)"
            ],
            steps: [
              "Scramble beaten eggs soft in smoking wok with hot oil; remove.",
              "Infuse oil with minced ginger, garlic, and scallion whites for 30 seconds.",
              "Add cold rice, breaking grains apart; toss with soy sauce, eggs, green scallions, and white pepper."
            ]
          },
          {
            title: "Ginger Scallion Noodles",
            searchTerm: "Scallion Noodles",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
            time: "15 Min",
            serves: "2",
            badge: "Cantonese Bistro",
            desc: "Springy wheat noodles dressed in sizzling aromatic oil infused with finely grated fresh ginger, minced garlic, scallions, and light soy.",
            calories: "420 kcal",
            protein: "12g",
            fat: "16g",
            carbs: "58g",
            health: "9.2/10",
            sub: "Sizzling Aromatic Oil Toss",
            ingredients: [
              "Fresh Hong Kong Style Wheat Noodles (300g)",
              "Asian Trio: Finely Grated Ginger, Garlic & Scallions (1 cup)",
              "High-Smoke Point Peanut Oil (4 tbsp)",
              "Light Soy Sauce & Sugar (2 tbsp)",
              "Toasted White Sesame Seeds (1 tbsp)"
            ],
            steps: [
              "Boil fresh noodles for 2 minutes until chewy al dente; rinse in cold water and drain well.",
              "Place grated ginger, garlic, scallions, and salt in a heatproof ceramic bowl.",
              "Pour smoking hot peanut oil over aromatics to sizzle instantly; toss sauce through springy noodles."
            ]
          },
          {
            title: "Garlic Steamed Dumplings",
            searchTerm: "Dumplings",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Dim Sum Artisan",
            desc: "Handcrafted dumplings filled with seasoned ground pork, shrimp, Asian trio aromatics, and steamed in bamboo baskets with ginger-soy dip.",
            calories: "390 kcal",
            protein: "22g",
            fat: "14g",
            carbs: "44g",
            health: "9.4/10",
            sub: "Bamboo Steamed Ginger Pork",
            ingredients: [
              "Round Dumpling Wrappers (24 wrappers)",
              "Minced Pork Shoulder & Shrimps (350g)",
              "Asian Trio: Grated Ginger, Garlic & Scallions (4 tbsp)",
              "Shaoxing Wine, Sesame Oil & White Pepper (2 tbsp)",
              "Chinkiang Black Vinegar & Chili Crisp Dip (4 tbsp)"
            ],
            steps: [
              "Mix pork, shrimp, ginger, garlic, scallions, sesame oil, and Shaoxing wine in one direction until sticky.",
              "Pleat spoonfuls of filling into dumpling skins, moistening edges to seal tightly.",
              "Steam in parchment-lined bamboo basket for 8 minutes until skins are translucent and glossy."
            ]
          },
          {
            title: "Beef and Broccoli StirFry",
            searchTerm: "Beef and Broccoli",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
            time: "18 Min",
            serves: "3",
            badge: "Wok Master",
            desc: "Velveted flank steak slices and crisp broccoli florets wok-seared with aromatic ginger, garlic, and scallions in glossy oyster sauce.",
            calories: "460 kcal",
            protein: "42g",
            fat: "18g",
            carbs: "26g",
            health: "9.5/10",
            sub: "Velveted Flank Steak & Crisp Florets",
            ingredients: [
              "Thinly Sliced Flank Steak (400g)",
              "Fresh Crisp Broccoli Florets (3 cups)",
              "Asian Trio: Sliced Ginger, Minced Garlic & Scallions (0.5 cup)",
              "Premium Oyster Sauce & Dark Soy Sauce (3 tbsp)",
              "Toasted Sesame Oil & Shaoxing Wine (2 tbsp)"
            ],
            steps: [
              "Velvet flank steak with baking soda, soy sauce, and cornstarch for 15 minutes; blanch broccoli 60 seconds.",
              "Sear marinated beef in smoking hot wok for 90 seconds until charred; set aside.",
              "Stir fry Asian trio aromatics, return beef and broccoli, and glaze with savory oyster sauce reduction."
            ]
          },
          {
            title: "Hot and Sour Soup",
            searchTerm: "Hot and Sour Soup",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "4",
            badge: "Beijing Heritage",
            desc: "Velvety spiced broth loaded with Asian trio aromatics, wood ear mushrooms, tofu ribbons, bamboo shoots, Chinkiang vinegar, and egg ribbons.",
            calories: "280 kcal",
            protein: "16g",
            fat: "10g",
            carbs: "28g",
            health: "9.7/10",
            sub: "Chinkiang Vinegar & Pepper Broth",
            ingredients: [
              "Firm Tofu Ribbons & Wood Ear Mushrooms (2 cups)",
              "Asian Trio: Fresh Ginger Matchsticks, Garlic & Scallions (4 tbsp)",
              "Chinkiang Black Vinegar & White Pepper (3 tbsp each)",
              "Rich Chicken Broth & Bamboo Shoots (1L)",
              "Pasture Eggs Beaten for Ribbons (2 eggs)"
            ],
            steps: [
              "Simmer chicken broth with ginger matchsticks, garlic, bamboo shoots, and sliced wood ear mushrooms.",
              "Stir in soy sauce, Chinkiang black vinegar, and generous white pepper for authentic heat and tang.",
              "Thicken with potato starch slurry and swirl in beaten eggs to form delicate silky ribbons."
            ]
          },
          {
            title: "Scallion Pancakes",
            searchTerm: "Scallion Pancakes",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Street Hawker Crunch",
            desc: "Crisp, flaky layered flatbread rolled with finely sliced green scallions, ginger-infused sesame oil, and pan-fried until golden blistered.",
            calories: "320 kcal",
            protein: "6g",
            fat: "14g",
            carbs: "42g",
            health: "9.0/10",
            sub: "Flaky Layered Sesame Flatbread",
            ingredients: [
              "All-Purpose Flour & Hot Boiling Water (300g)",
              "Asian Trio: Finely Sliced Green Scallions & Ginger Oil (1.5 cups)",
              "Toasted Sesame Oil & Flaky Sea Salt (3 tbsp)",
              "High Heat Frying Oil (3 tbsp)",
              "Garlic Ginger Soy Dipping Sauce (4 tbsp)"
            ],
            steps: [
              "Knead hot water dough until pliable; roll thin, brush with ginger-sesame oil, and scatter scallions.",
              "Roll into a tight spiral cylinder, flatten into round pancake disc to create dozens of flaky layers.",
              "Pan-fry in hot oil for 3 minutes per side until golden brown, blistered, and crispy; slice into wedges."
            ]
          },
          {
            title: "General Tso Chicken",
            searchTerm: "General Tso",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "3",
            badge: "Sweet & Spicy",
            desc: "Crispy battered dark meat chicken tossed in a glossy, spicy-sweet glaze infused with minced ginger, garlic, scallions, and whole dried chilies.",
            calories: "560 kcal",
            protein: "38g",
            fat: "24g",
            carbs: "48g",
            health: "8.6/10",
            sub: "Crisp Battered Ginger Chili Glaze",
            ingredients: [
              "Boneless Chicken Thighs Chunks (500g)",
              "Asian Trio: Minced Ginger, Garlic & Sliced Scallions (0.5 cup)",
              "Dried Red Chilies & Shaoxing Wine (2 tbsp)",
              "Sweet-Spicy Soy Tomato Glaze (4 tbsp)",
              "Cornstarch & Egg White for Crispy Coating (0.5 cup)"
            ],
            steps: [
              "Dredge seasoned chicken in cornstarch and egg white; deep fry twice at 180°C for ultra-crispy crust.",
              "In clean wok, sauté minced ginger, garlic, scallions, and dried chilies until fragrant.",
              "Pour sweet and savory sauce, toss crispy fried chicken vigorously until fully glazed, and serve immediately."
            ]
          },
          {
            title: "Cantonese Steamed Fish",
            searchTerm: "Steamed Fish",
            group: "asian-trio",
            fallbackImage: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
            time: "15 Min",
            serves: "2",
            badge: "Banquet Purity",
            desc: "Delicate whole sea bass or flounder steamed to perfection with julienned fresh ginger, scallions, and finished with sizzling hot oil and sweet soy.",
            calories: "310 kcal",
            protein: "44g",
            fat: "12g",
            carbs: "6g",
            health: "9.9/10",
            sub: "Sizzling Scallion Ginger Sweet Soy",
            ingredients: [
              "Whole Fresh Sea Bass or Snapper Cleaned (600g)",
              "Asian Trio: Julienned Ginger Matchsticks, Garlic & Scallions (1.5 cups)",
              "Premium Sweet Seasoned Soy Sauce (4 tbsp)",
              "High Heat Pure Peanut Oil (3 tbsp)",
              "Fresh Cilantro Sprigs (0.5 cup)"
            ],
            steps: [
              "Stuff fish cavity with ginger matchsticks and steam over boiling water for precisely 9 minutes.",
              "Discard steaming water, scatter fresh scallion curls and cilantro over the hot fish.",
              "Pour smoking hot peanut oil over the greens to sizzle and release aromas; drizzle with sweet soy sauce."
            ]
          }
        ],

        // ==========================================================================
        // 🇮🇳 THE SOUTH ASIAN BASE (10 Famous Recipes)
        // Ratio: Sautéed Onions, Ginger, Garlic + Ground Cumin, Coriander & Turmeric
        // ==========================================================================
        "south-asian-base": [
          {
            title: "Chicken Tikka Masala",
            searchTerm: "Chicken Tikka Masala",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "4",
            badge: "Global Phenomenon",
            desc: "Tandoori-charred marinated chicken chunks simmered in a velvety sauce of browned onion masala, ginger, garlic, tomatoes, and cream.",
            calories: "580 kcal",
            protein: "48g",
            fat: "28g",
            carbs: "18g",
            health: "8.8/10",
            sub: "Browned Onion Gravy & Tandoori Char",
            ingredients: [
              "Boneless Chicken Thigh Chunks (600g)",
              "South Asian Base: Minced Onions, Ginger, Garlic (2 cups)",
              "San Marzano Tomato Puree & Heavy Cream (1.5 cups)",
              "Garam Masala, Kashmiri Chili & Kasuri Methi (2 tbsp)",
              "Greek Yogurt & Lemon Juice Marinade (1 cup)"
            ],
            steps: [
              "Marinate and broil spiced chicken skewers until lightly charred.",
              "Brown minced onions slow and deep; cook ginger-garlic paste until raw aroma vanishes, then add spices and tomatoes.",
              "Fold in charred chicken and finish with heavy cream and crushed aromatic fenugreek leaves (kasuri methi)."
            ]
          },
          {
            title: "Chana Masala Curry",
            searchTerm: "Chana Masala",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "4",
            badge: "Punjabi Classic",
            desc: "Tender chickpeas simmered in a dark, tangy onion-tomato bhuna masala infused with ginger, garlic, pomegranate seeds, and fresh cilantro.",
            calories: "380 kcal",
            protein: "18g",
            fat: "10g",
            carbs: "54g",
            health: "9.8/10",
            sub: "Bhuna Onion Masala Chickpeas",
            ingredients: [
              "Cooked Kabuli Chickpeas (3 cups)",
              "South Asian Base: Finely Chopped Onions, Ginger, Garlic (2 cups)",
              "San Marzano Tomatoes & Green Chilies (1.5 cups)",
              "Chana Masala Spices, Anardana & Cumin (2 tbsp)",
              "Ghee & Fresh Coriander Leaves (3 tbsp)"
            ],
            steps: [
              "Sauté chopped onions in hot ghee until deep golden brown; add ginger-garlic paste and cook 2 minutes.",
              "Stir in tomatoes, turmeric, coriander, and anardana pomegranate powder until oil separates (bhuna).",
              "Add chickpeas and broth; simmer for 20 minutes, mashing slightly for thick gravy, and top with ginger juliennes."
            ]
          },
          {
            title: "Aromatic Chicken Biryani",
            searchTerm: "Chicken Biryani",
            group: "south-asian-base",
            fallbackImage: "assets/biryani.png",
            time: "55 Min",
            serves: "4",
            badge: "Dum Royal",
            desc: "Royal Hyderabadi basmati rice layered with spiced chicken yakhni, caramelized onions, ginger-garlic paste, saffron milk, and fresh mint.",
            calories: "590 kcal",
            protein: "42g",
            fat: "22g",
            carbs: "62g",
            health: "9.1/10",
            sub: "Saffron Dum Basmati Rice",
            ingredients: [
              "Extra Long Grain Basmati Rice (400g)",
              "Chicken Pieces Marinated in Spiced Yogurt (600g)",
              "South Asian Base: Browned Onions (Birista), Ginger, Garlic (2 cups)",
              "Saffron Infused Milk & Ghee (4 tbsp)",
              "Fresh Mint, Coriander & Whole Spices (0.5 cup)"
            ],
            steps: [
              "Sauté chicken with ginger-garlic paste, yogurt, whole green cardamom, cinnamon, and browned onions.",
              "Parboil aged basmati rice to 70% in salted water scented with whole spices.",
              "Layer rice over chicken, drizzle with saffron milk and ghee, seal with dough, and cook on dum for 25 minutes."
            ]
          },
          {
            title: "Classic Butter Chicken",
            searchTerm: "Butter Chicken",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "4",
            badge: "Delhi Icon",
            desc: "Velvety smooth makhani sauce of ripe tomatoes, butter, cashew cream, ginger-garlic aromatics, and tender tandoori chicken chunks.",
            calories: "670 kcal",
            protein: "46g",
            fat: "36g",
            carbs: "20g",
            health: "8.3/10",
            sub: "Velvety Murgh Makhani Gravy",
            ingredients: [
              "Charred Tandoori Chicken Thighs (600g)",
              "Ripe San Marzano Tomato Puree (2 cups)",
              "South Asian Base: Ginger-Garlic Paste & Onions (4 tbsp)",
              "Cultured Butter & Heavy Cream (0.5 cup each)",
              "Cashew Nut Paste, Honey & Kasuri Methi (2 tbsp)"
            ],
            steps: [
              "Simmer tomato puree with ginger-garlic paste, green cardamoms, and Kashmiri chili for 20 minutes.",
              "Blend gravy completely silky with soaked cashew paste and strain through fine mesh.",
              "Fold in butter, cream, honey, tandoori chicken chunks, and crushed kasuri methi leaves."
            ]
          },
          {
            title: "Palak Paneer Spinach",
            searchTerm: "Palak Paneer",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Vibrant Greens",
            desc: "Fresh golden-seared paneer cheese cubes folded into a silky emerald spinach sauce seasoned with ginger, garlic, green chilies, and cumin.",
            calories: "410 kcal",
            protein: "22g",
            fat: "26g",
            carbs: "18g",
            health: "9.8/10",
            sub: "Emerald Garlic Ginger Spinach Gravy",
            ingredients: [
              "Fresh Malai Paneer Cubes (300g)",
              "Organic Spinach Leaves Blanched & Pureed (500g)",
              "South Asian Base: Finely Diced Onions, Ginger, Garlic (1.5 cups)",
              "Green Chilies, Cumin Seeds & Garam Masala (2 tbsp)",
              "Fresh Heavy Cream & Butter (3 tbsp)"
            ],
            steps: [
              "Blanch spinach 2 minutes in boiling water; shock in ice water and blend into vibrant emerald purée.",
              "Sauté cumin seeds, finely diced onions, ginger, and garlic in butter until fragrant.",
              "Add pureed spinach and spices, gently simmer, and fold in pan-seared paneer cheese cubes and cream."
            ]
          },
          {
            title: "Spicy Lamb Rogan Josh",
            searchTerm: "Rogan Josh",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
            time: "80 Min",
            serves: "4",
            badge: "Kashmiri Masterpiece",
            desc: "Tender lamb chunks slow-cooked in a deep red gravy flavored with browned onions, ginger paste, fennel powder, Kashmiri chilies, and yogurt.",
            calories: "620 kcal",
            protein: "52g",
            fat: "32g",
            carbs: "14g",
            health: "8.9/10",
            sub: "Kashmiri Red Chili & Fennel Stew",
            ingredients: [
              "Bone-In Tender Lamb Shoulder (700g)",
              "South Asian Base: Onion Purée, Ginger-Garlic Paste (1.5 cups)",
              "Whisked Yogurt & Kashmiri Chili Powder (1 cup)",
              "Ground Fennel & Dry Ginger Powder (Saunth) (2 tbsp)",
              "Mustard Oil & Whole Black Cardamoms (3 tbsp)"
            ],
            steps: [
              "Sear lamb pieces in smoking mustard oil with whole cardamoms, cloves, and bay leaves.",
              "Add onion-ginger paste and cook until deeply browned; stir in Kashmiri chili and fennel powder.",
              "Fold in whisked yogurt gradually, cover, and slow simmer for 1 hour until lamb is tender and oil floats on top."
            ]
          },
          {
            title: "Dal Makhani SlowCooked",
            searchTerm: "Dal Makhani",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
            time: "90 Min",
            serves: "4",
            badge: "Luxe Black Lentils",
            desc: "Whole black urad lentils slow-simmered over low embers with butter, cream, ginger-garlic paste, and San Marzano tomato puree.",
            calories: "450 kcal",
            protein: "18g",
            fat: "22g",
            carbs: "46g",
            health: "9.4/10",
            sub: "Creamy Slow-Cooked Urad Dal",
            ingredients: [
              "Whole Black Urad Lentils & Kidney Beans Soaked (300g)",
              "South Asian Base: Ginger-Garlic Paste (4 tbsp)",
              "San Marzano Tomato Puree (1.5 cups)",
              "Cultured Butter (Makhan) & Heavy Cream (0.5 cup each)",
              "Kashmiri Chili & Kasuri Methi (1 tbsp)"
            ],
            steps: [
              "Pressure cook soaked black lentils and kidney beans until ultra-soft and creamy.",
              "Sauté ginger-garlic paste and tomato puree in butter with Kashmiri chili for 15 minutes.",
              "Combine with cooked dal and slow simmer on lowest heat for 60 minutes, finishing with cream and butter."
            ]
          },
          {
            title: "Aloo Gobi Cumin StirFry",
            searchTerm: "Aloo Gobi",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "3",
            badge: "Homestyle Vegan",
            desc: "Tender cauliflower florets and roasted potatoes dry-sautéed with aromatic cumin seeds, onions, ginger juliennes, garlic, and turmeric.",
            calories: "280 kcal",
            protein: "8g",
            fat: "10g",
            carbs: "42g",
            health: "9.7/10",
            sub: "Spiced Cauliflower & Potato Sauté",
            ingredients: [
              "Cauliflower Florets & Diced Potatoes (500g)",
              "South Asian Base: Diced Onions, Ginger Juliennes, Garlic (1.5 cups)",
              "Cumin Seeds, Turmeric & Coriander Powder (2 tbsp)",
              "Green Chilies & Fresh Cilantro (0.5 cup)",
              "Mustard Oil & Amchur Mango Powder (2 tbsp)"
            ],
            steps: [
              "Sizzle cumin seeds and green chilies in hot mustard oil; sauté onions and ginger juliennes.",
              "Add turmeric, coriander powder, diced potatoes, and cauliflower florets; toss to coat evenly.",
              "Cover and cook on low steam for 18 minutes until tender; sprinkle tangy amchur mango powder and cilantro."
            ]
          },
          {
            title: "Tandoori Chicken Skewers",
            searchTerm: "Tandoori Chicken",
            group: "south-asian-base",
            fallbackImage: "assets/images/poultry/tandoori_chicken.jpg",
            time: "35 Min",
            serves: "4",
            badge: "Charred Tandoor",
            desc: "Succulent chicken chunks marinated in ginger, garlic, Greek yogurt, and Kashmiri red spices, charred on skewers with mint chutney.",
            calories: "460 kcal",
            protein: "48g",
            fat: "16g",
            carbs: "8g",
            health: "9.3/10",
            sub: "Charred Clay-Oven Skewers",
            ingredients: [
              "Chicken Breast & Thigh Chunks (600g)",
              "South Asian Base: Ginger-Garlic Paste (3 tbsp)",
              "Spiced Tandoori Yogurt Marinade (1 cup)",
              "Kashmiri Chili & Chaat Masala (2 tbsp)",
              "Fresh Coriander Mint Chutney (0.5 cup)"
            ],
            steps: [
              "Marinate chicken in ginger-garlic paste, yogurt, mustard oil, and red spices for at least 1 hour.",
              "Thread onto skewers and broil or grill at high heat until deeply charred and juicy.",
              "Dust with tangy chaat masala, squeeze fresh lemon, and serve with chilled mint chutney."
            ]
          },
          {
            title: "Malai Kofta Dumplings",
            searchTerm: "Malai Kofta",
            group: "south-asian-base",
            fallbackImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "4",
            badge: "Mughlai Feast",
            desc: "Crispy fried paneer and potato dumplings stuffed with cashews and raisins, served in a rich cashew onion ginger-garlic gravy.",
            calories: "540 kcal",
            protein: "16g",
            fat: "32g",
            carbs: "48g",
            health: "8.6/10",
            sub: "Mughlai Cashew & Paneer Dumplings",
            ingredients: [
              "Paneer & Mashed Potatoes for Koftas (300g)",
              "Stuffed Cashews, Raisins & Cardamom (0.5 cup)",
              "South Asian Base: Onion Gravy, Ginger, Garlic (1.5 cups)",
              "Cashew Nut Paste & Heavy Cream (0.5 cup)",
              "Ghee & Saffron Strands (2 tbsp)"
            ],
            steps: [
              "Shape paneer and potato dough around cashew-raisin filling; deep fry until crispy and golden brown.",
              "Cook onion paste, ginger-garlic, and cashew purée in ghee until fragrant and velvety.",
              "Ladle warm cashew gravy into serving bowls, gently nestle crisp kofta dumplings, and drizzle with saffron cream."
            ]
          }
        ],

        // ==========================================================================
        // 🇨🇺 THE LATIN SOFRITO (10 Famous Recipes)
        // Ratio: Sautéed Onions, Garlic, Bell Peppers (Ají Dulce), Tomatoes, Cilantro/Culantro
        // ==========================================================================
        "latin-sofrito": [
          {
            title: "Arroz con Pollo Latin",
            searchTerm: "Arroz con Pollo",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "4",
            badge: "Caribbean Heritage",
            desc: "Golden saffron-seasoned rice cooked with tender chicken pieces, aromatic Latin sofrito, alcaparrado (olives & capers), and sweet red pimentos.",
            calories: "540 kcal",
            protein: "38g",
            fat: "18g",
            carbs: "56g",
            health: "9.3/10",
            sub: "Aromatic Sofrito & Saffron Chicken Rice",
            ingredients: [
              "Bone-In Chicken Thighs & Breasts (600g)",
              "Latin Sofrito: Onion, Garlic, Bell Pepper, Culantro (1.5 cups)",
              "Long Grain White Rice (350g)",
              "Achiote Oil, Sazón with Annatto & Broth (750ml)",
              "Alcaparrado Olives, Capers & Sweet Pimentos (0.5 cup)"
            ],
            steps: [
              "Brown seasoned chicken in achiote oil; remove.",
              "Sauté Latin sofrito in remaining oil until deeply fragrant; add sazón, olives, capers, and rice.",
              "Pour chicken broth, return chicken, cover tightly, and simmer on low heat for 25 minutes until rice is fluffy."
            ]
          },
          {
            title: "Cuban Ropa Vieja",
            searchTerm: "Ropa Vieja",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
            time: "120 Min",
            serves: "4",
            badge: "Havana National Dish",
            desc: "Shredded flank steak slow-braised in a rich tomato sofrito with roasted bell peppers, Spanish onions, garlic, white wine, and green pimiento olives.",
            calories: "520 kcal",
            protein: "48g",
            fat: "22g",
            carbs: "24g",
            health: "9.4/10",
            sub: "Shredded Beef & Tomato Sofrito Braise",
            ingredients: [
              "Flank Steak or Chuck Roast (800g)",
              "Latin Sofrito: Onions, Garlic, Green & Red Bell Peppers (2 cups)",
              "San Marzano Tomato Sauce & Dry White Wine (1.5 cups)",
              "Spanish Manzanilla Olives & Capers (0.5 cup)",
              "Cumin, Oregano, Bay Leaves & Olive Oil (3 tbsp)"
            ],
            steps: [
              "Simmer flank steak in seasoned broth for 90 minutes until tender; pull apart into long shreds with forks.",
              "Sauté sliced bell peppers, onions, and garlic in olive oil until sweet and caramelized.",
              "Add shredded beef, tomato sauce, wine, cumin, oregano, and olives; simmer 20 minutes until flavors marry."
            ]
          },
          {
            title: "Classic Beef Empanadas",
            searchTerm: "Empanadas",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "4",
            badge: "Golden Pastry",
            desc: "Flaky golden pastry dough pockets stuffed with seasoned minced beef picadillo, Latin sofrito aromatics, green olives, raisins, and hard-boiled eggs.",
            calories: "440 kcal",
            protein: "22g",
            fat: "24g",
            carbs: "38g",
            health: "8.9/10",
            sub: "Flaky Pastry Picadillo Pockets",
            ingredients: [
              "Empanada Dough Discs (12 discs)",
              "Minced Beef Picadillo (400g)",
              "Latin Sofrito: Onion, Bell Pepper, Garlic, Cilantro (1 cup)",
              "Spanish Olives, Raisins & Boiled Eggs Diced (0.5 cup)",
              "Cumin, Smoked Paprika & Egg Wash (2 tbsp)"
            ],
            steps: [
              "Sauté Latin sofrito with minced beef, cumin, and paprika; fold in diced olives, raisins, and hard-boiled eggs.",
              "Spoon filling into center of dough discs, fold over, and crimp edges tightly with a fork.",
              "Brush with egg wash and bake at 200°C (400°F) for 20 minutes until golden brown and flaky."
            ]
          },
          {
            title: "Puerto Rican Asopao",
            searchTerm: "Asopao",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "4",
            badge: "San Juan Stew",
            desc: "Hearty, comforting Puerto Rican soupy rice stew loaded with chicken, Latin sofrito aromatics, sweet green peas, olives, and plantains.",
            calories: "460 kcal",
            protein: "34g",
            fat: "14g",
            carbs: "50g",
            health: "9.5/10",
            sub: "Comforting Soupy Sofrito Rice",
            ingredients: [
              "Chicken Thighs Cubed (500g)",
              "Puerto Rican Recaito Sofrito: Culantro, Onion, Peppers, Garlic (1.5 cups)",
              "Medium Grain White Rice (1 cup)",
              "Rich Chicken Broth & Tomato Sauce (1.2L)",
              "Green Pimento Olives, Sweet Peas & Tostones (1 cup)"
            ],
            steps: [
              "Sauté sofrito in achiote oil until intensely aromatic; add seasoned chicken and sear lightly.",
              "Pour tomato sauce, chicken broth, and medium-grain rice; simmer gently for 25 minutes until soupy and rich.",
              "Garnish with green peas, sliced pimentos, and serve piping hot with crispy fried tostones."
            ]
          },
          {
            title: "Carne Asada Tacos",
            searchTerm: "Carne Asada",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "3",
            badge: "Taquería Classic",
            desc: "Charred citrus-marinated flank steak sliced thin on warm corn tortillas with sautéed sofrito onions, fresh cilantro, and roasted salsa.",
            calories: "480 kcal",
            protein: "32g",
            fat: "18g",
            carbs: "46g",
            health: "9.4/10",
            sub: "Charred Flank Steak & Sofrito Corn Tacos",
            ingredients: [
              "Citrus-Marinated Flank Steak (450g)",
              "Sautéed Sofrito Onions & Charred Peppers (1.5 cups)",
              "Warm Stone-Ground Corn Tortillas (6 tortillas)",
              "Fresh Chopped Cilantro & Lime Wedges (0.5 cup)",
              "Roasted Molcajete Salsa Roja (0.5 cup)"
            ],
            steps: [
              "Grill marinated flank steak over high heat for 4 minutes per side until charred on exterior and medium-rare inside.",
              "Sauté sliced onions and peppers on comal until caramelized and sweet.",
              "Slice steak across the grain, fill double warm corn tortillas, and top with sofrito relish, cilantro, and salsa."
            ]
          },
          {
            title: "Mexican Arroz Rojo",
            searchTerm: "Arroz Rojo",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Authentic Red Rice",
            desc: "Long grain rice toasted golden in oil, simmered in a blended sofrito of roasted tomatoes, onions, garlic, cumin, and chicken broth.",
            calories: "320 kcal",
            protein: "6g",
            fat: "10g",
            carbs: "52g",
            health: "9.3/10",
            sub: "Toasted Golden Tomato Rice",
            ingredients: [
              "Long Grain White Rice (300g)",
              "Blended Sofrito: Ripe Tomatoes, White Onion, Garlic (1.5 cups)",
              "Warm Chicken Broth (500ml)",
              "Diced Carrots, Peas & Whole Jalapeno (1 cup)",
              "High-Smoke Point Cooking Oil (3 tbsp)"
            ],
            steps: [
              "Toast dry raw rice in hot oil, stirring continuously for 8 minutes until golden blonde.",
              "Blend fresh tomatoes, onion, and garlic; pour over toasted rice and cook until tomato paste reduces.",
              "Add warm broth, vegetables, and whole jalapeno; cover and simmer on low for 20 minutes undisturbed."
            ]
          },
          {
            title: "Smoky Picadillo Cubano",
            searchTerm: "Picadillo",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Cuban Homestyle",
            desc: "Savory minced beef simmered in a rich tomato sofrito with sweet golden raisins, briny green Spanish olives, diced potatoes, and cumin.",
            calories: "450 kcal",
            protein: "36g",
            fat: "20g",
            carbs: "32g",
            health: "9.2/10",
            sub: "Sweet & Briny Beef Picadillo",
            ingredients: [
              "Lean Minced Beef Chuck (500g)",
              "Latin Sofrito: Diced Onions, Bell Pepper, Garlic (1.5 cups)",
              "San Marzano Tomato Sauce & White Wine (1 cup)",
              "Manzanilla Olives, Capers & Golden Raisins (0.5 cup)",
              "Diced Fried Potatoes & Cumin (1 cup)"
            ],
            steps: [
              "Sauté Latin sofrito in olive oil until soft and translucent; add minced beef and brown thoroughly.",
              "Add tomato sauce, white wine, cumin, oregano, olives, and golden raisins; simmer 15 minutes.",
              "Fold in crispy fried potato cubes and serve with fluffy white rice and sweet fried plantains."
            ]
          },
          {
            title: "Stuffed Yuca Fritters",
            searchTerm: "Yuca Fritters",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "4",
            badge: "Crispy Cassava",
            desc: "Golden fried cassava (yuca) fritters stuffed with savory sofrito-seasoned picadillo beef and served with garlic mojo dipping sauce.",
            calories: "380 kcal",
            protein: "14g",
            fat: "18g",
            carbs: "44g",
            health: "9.1/10",
            sub: "Crispy Yuca & Mojo Dipping Sauce",
            ingredients: [
              "Fresh Yuca Root Boiled & Mashed (500g)",
              "Sofrito Seasoned Minced Beef Filling (250g)",
              "Farm Egg & Cornstarch (1 egg, 2 tbsp)",
              "Citrus Garlic Mojo Dipping Sauce (0.5 cup)",
              "High Heat Oil for Frying (2 cups)"
            ],
            steps: [
              "Boil peeled yuca until fork tender; remove fibrous core and mash smooth with egg and pinch of salt.",
              "Form yuca dough into cups, stuff with savory beef sofrito picadillo, and seal into oblong fritters.",
              "Deep fry at 180°C (350°F) for 4 minutes until crisp and golden brown; dip in citrus garlic mojo sauce."
            ]
          },
          {
            title: "Brazilian Feijoada Stew",
            searchTerm: "Feijoada",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
            time: "150 Min",
            serves: "6",
            badge: "National Treasure",
            desc: "Slow-simmered black beans and assorted smoked meats (pork ribs, carne seca, sausages) cooked in a fragrant garlic, onion, and bay leaf sofrito.",
            calories: "680 kcal",
            protein: "56g",
            fat: "32g",
            carbs: "42g",
            health: "9.0/10",
            sub: "Slow-Simmered Black Bean & Smoked Meat Pot",
            ingredients: [
              "Brazilian Black Beans Soaked (500g)",
              "Assorted Smoked Meats (Pork Ribs, Paio, Carne Seca) (700g)",
              "Latin Sofrito Refogado: Minced Onions, Garlic, Bacon Fat (1.5 cups)",
              "Bay Leaves & Fresh Orange Halves (2 each)",
              "Toasted Farofa & Sautéed Collard Greens for Serving (2 cups)"
            ],
            steps: [
              "Simmer soaked black beans and desalted smoked meats with bay leaves and halved orange for 2 hours.",
              "In a skillet, make refogado: sauté generous minced garlic and onions in bacon fat until golden brown.",
              "Ladle a cup of beans into the skillet, mash into a paste, and return to main pot to thicken into rich glossy stew."
            ]
          },
          {
            title: "Spanish Tortilla Classic",
            searchTerm: "Spanish Tortilla",
            group: "latin-sofrito",
            fallbackImage: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Madrid Classic",
            desc: "Iconic Spanish potato and sweet onion omelette slowly poached in extra virgin olive oil and folded with custardy farm eggs.",
            calories: "340 kcal",
            protein: "14g",
            fat: "22g",
            carbs: "24g",
            health: "9.3/10",
            sub: "Slow-Poached Potato & Onion Omelette",
            ingredients: [
              "Yukon Gold Potatoes Thinly Sliced (600g)",
              "Sweet Spanish Yellow Onions Sliced (2 medium)",
              "Pasture Farm Eggs Beaten (6 large)",
              "Extra Virgin Spanish Olive Oil (1 cup)",
              "Flaky Sea Salt (1 tsp)"
            ],
            steps: [
              "Slowly poach sliced potatoes and onions in warm olive oil until meltingly tender without browning; drain oil.",
              "Gently fold warm potatoes and onions into beaten eggs; let rest 10 minutes so eggs absorb heat.",
              "Cook in non-stick skillet for 2 minutes, flip with plate, and cook reverse side 1 minute for custardy center."
            ]
          }
        ]
      };
`;

// Insert AROMATICS_GROUPS right after BASE_CARB_GROUPS closing in dashboard.html
if (!html.includes('const AROMATICS_GROUPS = {')) {
  const baseCarbGroupsAnchor = `const BASE_CARB_GROUPS = {`;
  const baseCarbGroupsEndAnchor = `        ]\n      };`;
  
  if (html.includes('const BASE_CARB_GROUPS = {')) {
    // Find the end of BASE_CARB_GROUPS (before wowPremiumImageRegistry)
    const pos = html.indexOf('const wowPremiumImageRegistry = {');
    if (pos !== -1) {
      html = html.slice(0, pos) + aromaticsGroupsCode + '\n      ' + html.slice(pos);
      console.log('Inserted AROMATICS_GROUPS before wowPremiumImageRegistry.');
    } else {
      console.error('Could not find wowPremiumImageRegistry position!');
    }
  }
}

// 4. Update wowPremiumImageRegistry with all 50 Aromatics entries
const aromaticsImageRegistryEntries = `
        // ==========================================================================
        // 🌿 AROMATICS OVERRIDE REGISTRY (50 Famous Global Dishes)
        // ==========================================================================
        // 🇫🇷 French Mirepoix
        "Classic Beef Bourguignon": "assets/bourguignon.png",
        "Beef Bourguignon": "assets/bourguignon.png",
        "Chicken Noodle Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Bolognese Ragù": "https://images.unsplash.com/photo-1621996346565-e3adc644d942?auto=format&fit=crop&w=1200&q=80",
        "Bolognese Ragu": "https://images.unsplash.com/photo-1621996346565-e3adc644d942?auto=format&fit=crop&w=1200&q=80",
        "Bolognese": "https://images.unsplash.com/photo-1621996346565-e3adc644d942?auto=format&fit=crop&w=1200&q=80",
        "French Onion Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Classic Pot Roast": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Pot Roast": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Creamy Vegetable Chowder": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Vegetable Chowder": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Braised Lamb Shanks": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Lamb Shanks": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Split Pea and Ham Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Split Pea Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Traditional Minestrone": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Minestrone": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",

        // 🇺🇸 The Holy Trinity
        "Louisiana Gumbo": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Gumbo": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Cajun Jambalaya": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Crawfish Étouffée": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
        "Crawfish Etouffee": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
        "Étouffée": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
        "Shrimp Creole": "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
        "Cajun Dirty Rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "Dirty Rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "Blackened Catfish PoBoy": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
        "Blackened Catfish": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
        "Red Beans and Rice": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Southern Cornbread Dressing": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "Cornbread Dressing": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "Cajun Chicken Maque Choux": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Chicken Maque Choux": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Maque Choux": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Smoked Sausage Skillet": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
        "Sausage Skillet": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",

        // 🇨🇳 The Asian Trio
        "Sichuan Mapo Tofu": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Mapo Tofu": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Basic Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
        "Ginger Scallion Noodles": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
        "Scallion Noodles": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
        "Garlic Steamed Dumplings": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80",
        "Steamed Dumplings": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80",
        "Beef and Broccoli StirFry": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Beef and Broccoli": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Hot and Sour Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Scallion Pancakes": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "General Tso Chicken": "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
        "Cantonese Steamed Fish": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
        "Steamed Fish": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",

        // 🇮🇳 The South Asian Base
        "Chana Masala Curry": "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=1200&q=80",
        "Chana Masala": "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=1200&q=80",
        "Aromatic Chicken Biryani": "assets/biryani.png",
        "Classic Butter Chicken": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80",
        "Palak Paneer Spinach": "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=1200&q=80",
        "Spicy Lamb Rogan Josh": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Rogan Josh": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Dal Makhani SlowCooked": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Dal Makhani": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Aloo Gobi Cumin StirFry": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
        "Malai Kofta Dumplings": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Malai Kofta": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",

        // 🇨🇺 The Latin Sofrito
        "Arroz con Pollo Latin": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Arroz con Pollo": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Cuban Ropa Vieja": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Ropa Vieja": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Classic Beef Empanadas": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Beef Empanadas": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Empanadas": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Puerto Rican Asopao": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Asopao": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Carne Asada Tacos": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Carne Asada": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Mexican Arroz Rojo": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "Arroz Rojo": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "Smoky Picadillo Cubano": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Picadillo Cubano": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Picadillo": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        "Stuffed Yuca Fritters": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Yuca Fritters": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Brazilian Feijoada Stew": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Brazilian Feijoada": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Feijoada": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Spanish Tortilla Classic": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
`;

if (!html.includes('"Louisiana Gumbo":')) {
  const regPos = html.indexOf('// 🍚 Rice-Based Classics');
  if (regPos !== -1) {
    html = html.slice(0, regPos) + aromaticsImageRegistryEntries + '\n        ' + html.slice(regPos);
    console.log('Inserted Aromatics into wowPremiumImageRegistry.');
  } else {
    console.error('Could not find wowPremiumImageRegistry anchor for insertion');
  }
}

// 5. Add Aromatics JS async fetch and rendering module
const aromaticsJSFunctions = `
      // ==========================================
      // 🌿 AROMATICS ASYNC FETCH & RENDERING MODULES
      // ==========================================
      const AROMATICS_SUBCATEGORY_CACHE = {};

      async function fetchAromaticsTheMealDBItem(item) {
        const recipeTitleKey = item.title ? item.title.trim() : (item.strMeal ? item.strMeal.trim() : "");

        // Interception Check: If registered in wowPremiumImageRegistry, bypass raw API thumb directly
        if (wowPremiumImageRegistry[recipeTitleKey]) {
          const verifiedAsset = wowPremiumImageRegistry[recipeTitleKey];
          return {
            ...item,
            idMeal: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            strMealThumb: verifiedAsset,
            resolvedImage: verifiedAsset,
            fallbackImage: verifiedAsset
          };
        }

        try {
          const url = \`https://www.themealdb.com/api/json/v1/1/search.php?s=\${encodeURIComponent(item.searchTerm)}\`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (data && data.meals && data.meals.length > 0) {
              const matched = data.meals.find(m => m.strMeal && (m.strMeal.toLowerCase().includes(item.title.toLowerCase()) || item.title.toLowerCase().includes(m.strMeal.toLowerCase()))) || data.meals[0];

              const matchedTitle = matched && matched.strMeal ? matched.strMeal.trim() : "";
              const finalImage = wowPremiumImageRegistry[matchedTitle]
                || wowPremiumImageRegistry[recipeTitleKey]
                || (matched && matched.strMealThumb && typeof matched.strMealThumb === 'string' && matched.strMealThumb.trim().length > 0 ? matched.strMealThumb : null)
                || item.fallbackImage;

              if (matched) {
                return {
                  ...item,
                  idMeal: matched.idMeal || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  strMealThumb: finalImage,
                  resolvedImage: finalImage
                };
              }
            }
          }
        } catch (e) {
          console.warn('TheMealDB async query fallback for aromatics', item.title, e);
        }
        return {
          ...item,
          idMeal: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          strMealThumb: wowPremiumImageRegistry[recipeTitleKey] || item.fallbackImage,
          resolvedImage: wowPremiumImageRegistry[recipeTitleKey] || item.fallbackImage
        };
      }

      async function ensureAromaticsSubgroupResolved(subGroup) {
        const groupKey = (subGroup || 'french-mirepoix').toLowerCase().trim();
        if (AROMATICS_SUBCATEGORY_CACHE[groupKey]) {
          return AROMATICS_SUBCATEGORY_CACHE[groupKey];
        }

        const items = AROMATICS_GROUPS[groupKey] || [];
        const resolvedList = await Promise.all(items.map(item => fetchAromaticsTheMealDBItem(item)));

        // Populate dictionary & lookup maps
        resolvedList.forEach(item => {
          const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          recipeImageLookup[item.title] = item.resolvedImage;
          recipeDescLookup[item.title] = item.desc;
          if (!CULINARY_DICTIONARY[slug]) {
            CULINARY_DICTIONARY[slug] = {
              title: item.title,
              sub: item.sub || item.badge,
              image: item.resolvedImage,
              calories: item.calories,
              time: item.time,
              serves: item.serves,
              health: item.health,
              fat: item.fat,
              protein: item.protein,
              carbs: item.carbs,
              ingredients: item.ingredients,
              steps: item.steps
            };
          }
          if (item.idMeal && !CULINARY_DICTIONARY[item.idMeal]) {
            CULINARY_DICTIONARY[item.idMeal] = CULINARY_DICTIONARY[slug];
          }
        });

        AROMATICS_SUBCATEGORY_CACHE[groupKey] = resolvedList;
        return resolvedList;
      }

      async function renderAromaticsCards(subGroup) {
        const feedContainer = document.getElementById('recipe-feed-container') || document.getElementById('main-recipe-feed');
        if (!feedContainer) return;

        const targetGroup = (subGroup || 'french-mirepoix').toLowerCase().trim();
        let displayGroupName = targetGroup.replace('-', ' ').toUpperCase();
        if (targetGroup === 'french-mirepoix') displayGroupName = 'FRENCH MIREPOIX';
        if (targetGroup === 'holy-trinity') displayGroupName = 'HOLY TRINITY';
        if (targetGroup === 'asian-trio') displayGroupName = 'ASIAN TRIO';
        if (targetGroup === 'south-asian-base') displayGroupName = 'SOUTH ASIAN BASE';
        if (targetGroup === 'latin-sofrito') displayGroupName = 'LATIN SOFRITO';

        // Clean Feed Refresh: Clear out all elements completely and show sleek loading spinner
        feedContainer.innerHTML = \`
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 20px; gap: 12px; width: 100%;">
            <div style="width: 28px; height: 28px; border: 3px solid rgba(61, 242, 224, 0.2); border-top-color: #3DF2E0; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <span style="font-size: 12px; color: #8E9AA6; font-weight: 600; letter-spacing: 0.02em;">Fetching 10 Gourmet \${displayGroupName} Creations...</span>
          </div>
        \`;

        const filteredItems = await ensureAromaticsSubgroupResolved(targetGroup);
        feedContainer.innerHTML = '';

        if (filteredItems.length === 0) {
          feedContainer.innerHTML = \`
            <div style="text-align: center; padding: 48px 20px; color: #8E8E93; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
              <span class="material-symbols-outlined" style="font-size: 36px; color: #3DF2E0; margin-bottom: 4px;">search_off</span>
              <div style="font-size: 15px; font-weight: 700; color: #FFFFFF;">No "\${displayGroupName}" Dishes Found</div>
              <div style="font-size: 12px; color: #8E9AA6;">Try selecting French Mirepoix, Holy Trinity, Asian Trio, South Asian Base, or Latin Sofrito.</div>
            </div>
          \`;
          return;
        }

        filteredItems.forEach(function (meal) {
          const mealTitle = meal.title || (meal.strMeal ? meal.strMeal.trim() : 'Gourmet Aromatics');
          const slug = mealTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const cardId = 'card-' + slug;
          const isSaved = typeof window.isRecipeSaved === 'function' ? window.isRecipeSaved(slug) : false;

          const recipeTitleKey = meal.strMeal ? meal.strMeal.trim() : (meal.title ? meal.title.trim() : "");
          let displayImage = wowPremiumImageRegistry[recipeTitleKey] || meal.resolvedImage || meal.strMealThumb || meal.fallbackImage;

          let fallbackUrl = wowPremiumImageRegistry[recipeTitleKey] || meal.fallbackImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200';
          let onerrorSnippet = \`this.onerror=null; this.src=handleImageFallback(this, '\${fallbackUrl}');\`;
          let altText = mealTitle;

          const cookTime = meal.time || '25 Min';
          const servesCount = meal.serves || '2';
          const itemDesc = meal.desc || 'Gourmet artisanal aromatic recipe.';
          const groupName = displayGroupName;

          const card = document.createElement('article');
          card.className = 'recipe-card glass-panel-neon animate-fade-in duration-300 transform scale-98 transition-all relative overflow-hidden rounded-2xl border border-[#3DF2E0]/35 hover:border-[#3DF2E0]/70 shadow-[0_0_24px_rgba(61,242,224,0.22)] mb-4';
          card.id = cardId;
          card.setAttribute('data-recipe-id', slug);
          card.setAttribute('data-category', 'aromatics ' + (meal.group || targetGroup));
          card.setAttribute('role', 'button');
          card.setAttribute('tabindex', '0');
          card.setAttribute('aria-label', \`\${mealTitle} recipe card\`);
          card.setAttribute('onclick', \`openRecipeDetails('\${slug}')\`);
          card.style.cursor = 'pointer';

          card.innerHTML = \`
            <!-- Food photo container with overlapping Floating Action Heart FAB -->
            <div class="card-photo-container relative w-full">
              <div class="card-photo-wrap relative w-full overflow-hidden" style="aspect-ratio: 16/9; height: 200px;">
                <img class="card-photo w-full h-full object-cover" style="width: 100%; height: 200px; object-fit: cover; background-color: #171E26; border-top-left-radius: 20px; border-top-right-radius: 20px;" src="\${displayImage}" alt="\${altText}" loading="lazy" decoding="async" onerror="\${onerrorSnippet}" data-fallback="\${fallbackUrl}" />
                
                <!-- wow Chef AI SPARKLES overlay pill badge -->
                <div class="absolute top-3 left-3 z-10">
                  <div class="bg-black/60 border border-[#3DF2E0]/30 rounded-full px-3 py-1 flex items-center shadow-[0_0_12px_rgba(61,242,224,0.15)] cursor-pointer" onclick="event.stopPropagation(); openRecipeDetails('\${slug}')">
                    <img src="assets/chef_ai_robot.png" alt="Chef AI Assistant" class="w-4 h-4 object-contain mr-1.5 animate-pulse" onerror="this.onerror=null; this.src='https://unsplash.com';" />
                    <span style="font-family: 'Plus Jakarta Sans', sans-serif !important;" class="text-[9px] font-black tracking-wider text-white select-none">wow Chef AI <span class="text-[#3DF2E0] font-bold">S</span><span class="text-[#3DF2E0] font-bold">P</span><span class="text-[#3DF2E0] font-bold">A</span><span class="text-[#3DF2E0] font-bold">RKLES</span></span>
                  </div>
                </div>
              </div>
              
              <!-- Premium Floating Action Heart Component -->
              <button class="recipe-heart-fab wow-bookmark-btn tap-effect flex-shrink-0 \${isSaved ? 'saved' : ''}" aria-label="Save \${mealTitle} to collection" onclick="event.stopPropagation(); if (typeof toggleSaveCollection === 'function') toggleSaveCollection('\${slug}', this);" data-recipe-id="\${slug}">
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

            <!-- Card body with recipe metadata lines -->
            <div class="card-body p-4 flex items-center justify-between gap-3">
              <div class="card-info-col flex-1 min-w-0 flex flex-col gap-1.5">
                <!-- Metadata line: Cook time & Servings -->
                <div class="metrics-pill inline-flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                  <span class="material-symbols-outlined text-[15px] text-[#3DF2E0]">schedule</span>
                  <span>\${cookTime}</span>
                  <span class="metrics-dot text-neutral-600">•</span>
                  <span class="material-symbols-outlined text-[15px] text-[#3DF2E0]">group</span>
                  <span>Serves \${servesCount}</span>
                </div>

                <!-- Tag badges -->
                <div class="tags-group flex items-center gap-2">
                  <span class="tag tag--red text-[10px] font-bold px-2 py-0.5 rounded bg-[#3DF2E0]/20 text-[#3DF2E0] border border-[#3DF2E0]/30">AROMATICS</span>
                  <span class="tag tag--green text-[10px] font-bold px-2 py-0.5 rounded bg-amber-600/25 text-amber-400 border border-amber-500/30">\${groupName}</span>
                </div>

                <!-- Title and description lines -->
                <div>
                  <h2 class="card-title text-base font-bold text-white tracking-tight truncate">\${mealTitle}</h2>
                  <p class="card-desc text-xs text-neutral-400 truncate mt-0.5">\${itemDesc}</p>
                </div>
              </div>
            </div>
          \`;

          card.addEventListener('click', function (e) {
            if (e.target.closest('.wow-bookmark-btn, .bookmark-btn')) return;
            e.preventDefault();
            if (typeof window.openRecipeDetails === 'function') {
              window.openRecipeDetails(slug);
            } else if (typeof window.openRecipeDetail === 'function') {
              window.openRecipeDetail(slug);
            } else {
              window.location.href = 'recipe-detail.html?recipe=' + encodeURIComponent(slug);
            }
          });

          feedContainer.appendChild(card);
        });
      }
      window.renderAromaticsCards = renderAromaticsCards;

      function initAromaticsFilterEngine() {
        const aromaticsBtn = document.getElementById('primary-pill-aromatics') || document.querySelector('[data-primary-filter="aromatics"]');
        const aromaticsStrip = document.getElementById('aromatics-subfilter-strip');
        const aromaticsSubPills = document.querySelectorAll('.subfilter-pill[data-aromatics-sub]');
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const poultryStrip = document.getElementById('poultry-subfilter-strip');
        const poultrySubPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-aromatics)');

        if (!aromaticsBtn || !aromaticsStrip) return;

        // ══════════════════════════════════════════════════════════════════════
        // STRICT INITIAL STATE MASKING
        // Ensure aromatics sub-category container is completely hidden on init
        // ══════════════════════════════════════════════════════════════════════
        aromaticsStrip.style.display = 'none';
        aromaticsStrip.classList.remove('visible');
        aromaticsStrip.setAttribute('aria-hidden', 'true');

        // ══════════════════════════════════════════════════════════════════════
        // TIER 1 OPERATION: Tapping "Aromatics"
        // - Instantly set active Neon Cyan style state
        // - Slide open sub-category scroll line directly underneath
        // - Close Poultry, Veggies & Base/Carb sub-filter strips if open
        // - DO NOT execute API search queries or clear/populate feed yet!
        // ══════════════════════════════════════════════════════════════════════
        aromaticsBtn.addEventListener('click', function (e) {
          e.preventDefault();
          const isCurrentlyActive = aromaticsBtn.classList.contains('active');

          if (isCurrentlyActive) {
            // Condition A: Deactivate Aromatics filter -> slide closed and restore default feed
            aromaticsBtn.classList.remove('active');
            aromaticsBtn.setAttribute('aria-expanded', 'false');
            aromaticsStrip.style.display = 'none';
            aromaticsStrip.classList.remove('visible');
            aromaticsStrip.setAttribute('aria-hidden', 'true');
            aromaticsSubPills.forEach(p => p.classList.remove('active'));
            renderCategoryFeed('all');
          } else {
            // Condition B: Activate Aromatics filter -> open sub-strip, keep feed waiting for sub-selection
            otherPrimaryPills.forEach(p => p.classList.remove('active'));
            if (poultryStrip) {
              poultryStrip.style.display = 'none';
              poultryStrip.classList.remove('visible');
              poultryStrip.setAttribute('aria-hidden', 'true');
              if (poultryBtn) {
                poultryBtn.classList.remove('active');
                poultryBtn.setAttribute('aria-expanded', 'false');
              }
              poultrySubPills.forEach(p => p.classList.remove('active'));
            }
            if (veggiesStrip) {
              veggiesStrip.style.display = 'none';
              veggiesStrip.classList.remove('visible');
              veggiesStrip.setAttribute('aria-hidden', 'true');
              if (veggiesBtn) {
                veggiesBtn.classList.remove('active');
                veggiesBtn.setAttribute('aria-expanded', 'false');
              }
              veggiesSubPills.forEach(p => p.classList.remove('active'));
            }
            if (carbStrip) {
              carbStrip.style.display = 'none';
              carbStrip.classList.remove('visible');
              carbStrip.setAttribute('aria-hidden', 'true');
              if (carbBtn) {
                carbBtn.classList.remove('active');
                carbBtn.setAttribute('aria-expanded', 'false');
              }
              carbSubPills.forEach(p => p.classList.remove('active'));
            }
            aromaticsBtn.classList.add('active');
            aromaticsBtn.setAttribute('aria-expanded', 'true');
            aromaticsStrip.style.display = 'flex';
            aromaticsStrip.classList.add('visible');
            aromaticsStrip.setAttribute('aria-hidden', 'false');
            aromaticsSubPills.forEach(p => p.classList.remove('active'));
            // Tier 1 rule: DO NOT execute search queries or clear/populate feed yet!
          }
        });

        // ══════════════════════════════════════════════════════════════════════
        // TIER 2 OPERATION: Tapping a Sub-Pill ("French Mirepoix", "Holy Trinity", etc.)
        // - Toggle targeted sub-pill to active Neon Cyan
        // - Instantly trigger async fetch for the 10 recipes in that active group
        // - Clean feed refresh before rendering the 10 accurate visuals
        // ══════════════════════════════════════════════════════════════════════
        aromaticsSubPills.forEach(pill => {
          pill.addEventListener('click', function (e) {
            e.preventDefault();
            const subGroup = pill.getAttribute('data-aromatics-sub');
            const isSelected = pill.classList.contains('active');

            if (isSelected) {
              // Deselect sub-filter
              pill.classList.remove('active');
            } else {
              // Select this sub-filter
              aromaticsSubPills.forEach(p => p.classList.remove('active'));
              pill.classList.add('active');
              // Instantly fetch & render the 10 subcategory recipes
              renderAromaticsCards(subGroup);
            }
          });
        });

        // Other primary pills hide aromatics sub-strip (Condition A)
        otherPrimaryPills.forEach(pill => {
          pill.addEventListener('click', function () {
            aromaticsBtn.classList.remove('active');
            aromaticsBtn.setAttribute('aria-expanded', 'false');
            aromaticsStrip.style.display = 'none';
            aromaticsStrip.classList.remove('visible');
            aromaticsStrip.setAttribute('aria-hidden', 'true');
            aromaticsSubPills.forEach(p => p.classList.remove('active'));
          });
        });
      }
      window.initAromaticsFilterEngine = initAromaticsFilterEngine;
`;

if (!html.includes('function initAromaticsFilterEngine()')) {
  const insertPos = html.indexOf('// ══════════════════════════════════════════════════════════════════════\n      // DYNAMIC CULINARY DATA DICTIONARY ENGINE');
  if (insertPos !== -1) {
    html = html.slice(0, insertPos) + aromaticsJSFunctions + '\n\n      ' + html.slice(insertPos);
    console.log('Inserted Aromatics JS functions before CULINARY_DICTIONARY.');
  } else {
    console.error('Could not find CULINARY_DICTIONARY position for inserting aromatics JS functions!');
  }
}

// 6. Update Poultry, Veggies, and Base/Carb filter engines to also close Aromatics sub-strip
const poultryAromaticsCloseSnippet = `            if (aromaticsStrip) {
              aromaticsStrip.style.display = 'none';
              aromaticsStrip.classList.remove('visible');
              aromaticsStrip.setAttribute('aria-hidden', 'true');
              if (aromaticsBtn) {
                aromaticsBtn.classList.remove('active');
                aromaticsBtn.setAttribute('aria-expanded', 'false');
              }
              aromaticsSubPills.forEach(p => p.classList.remove('active'));
            }`;

// Ensure Aromatics variables are declared in poultry, veggies, base-carb filter engines
const poultryVarsOld = `const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');`;
const poultryVarsNew = `const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const aromaticsBtn = document.getElementById('primary-pill-aromatics') || document.querySelector('[data-primary-filter="aromatics"]');
        const aromaticsStrip = document.getElementById('aromatics-subfilter-strip');
        const aromaticsSubPills = document.querySelectorAll('.subfilter-pill[data-aromatics-sub]');`;

if (!html.includes('const aromaticsBtn = document.getElementById(\'primary-pill-aromatics\');')) {
  // Let's check initPoultryFilterEngine
  html = html.replace(
    `function initPoultryFilterEngine() {
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const subStrip = document.getElementById('poultry-subfilter-strip');
        const subPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-poultry)');`,
    `function initPoultryFilterEngine() {
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const subStrip = document.getElementById('poultry-subfilter-strip');
        const subPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const aromaticsBtn = document.getElementById('primary-pill-aromatics') || document.querySelector('[data-primary-filter="aromatics"]');
        const aromaticsStrip = document.getElementById('aromatics-subfilter-strip');
        const aromaticsSubPills = document.querySelectorAll('.subfilter-pill[data-aromatics-sub]');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-poultry)');`
  );

  html = html.replace(
    `function initVeggiesFilterEngine() {
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const poultryStrip = document.getElementById('poultry-subfilter-strip');
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const poultrySubPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-veggies)');`,
    `function initVeggiesFilterEngine() {
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const poultryStrip = document.getElementById('poultry-subfilter-strip');
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const aromaticsBtn = document.getElementById('primary-pill-aromatics') || document.querySelector('[data-primary-filter="aromatics"]');
        const aromaticsStrip = document.getElementById('aromatics-subfilter-strip');
        const aromaticsSubPills = document.querySelectorAll('.subfilter-pill[data-aromatics-sub]');
        const poultrySubPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-veggies)');`
  );

  html = html.replace(
    `function initBaseCarbFilterEngine() {
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const poultryStrip = document.getElementById('poultry-subfilter-strip');
        const poultrySubPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-base-carb)');`,
    `function initBaseCarbFilterEngine() {
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const poultryStrip = document.getElementById('poultry-subfilter-strip');
        const poultrySubPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const aromaticsBtn = document.getElementById('primary-pill-aromatics') || document.querySelector('[data-primary-filter="aromatics"]');
        const aromaticsStrip = document.getElementById('aromatics-subfilter-strip');
        const aromaticsSubPills = document.querySelectorAll('.subfilter-pill[data-aromatics-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-base-carb)');`
  );
}

// Add aromaticsStrip cross-closing logic into poultry, veggies, base-carb click listeners
if (!html.includes('if (aromaticsStrip) {\n              aromaticsStrip.style.display = \'none\';')) {
  // In poultry click handler:
  html = html.replace(
    `            if (carbStrip) {
              carbStrip.style.display = 'none';
              carbStrip.classList.remove('visible');
              carbStrip.setAttribute('aria-hidden', 'true');
              if (carbBtn) {
                carbBtn.classList.remove('active');
                carbBtn.setAttribute('aria-expanded', 'false');
              }
              carbSubPills.forEach(p => p.classList.remove('active'));
            }
            poultryBtn.classList.add('active');`,
    `            if (carbStrip) {
              carbStrip.style.display = 'none';
              carbStrip.classList.remove('visible');
              carbStrip.setAttribute('aria-hidden', 'true');
              if (carbBtn) {
                carbBtn.classList.remove('active');
                carbBtn.setAttribute('aria-expanded', 'false');
              }
              carbSubPills.forEach(p => p.classList.remove('active'));
            }
            if (aromaticsStrip) {
              aromaticsStrip.style.display = 'none';
              aromaticsStrip.classList.remove('visible');
              aromaticsStrip.setAttribute('aria-hidden', 'true');
              if (aromaticsBtn) {
                aromaticsBtn.classList.remove('active');
                aromaticsBtn.setAttribute('aria-expanded', 'false');
              }
              aromaticsSubPills.forEach(p => p.classList.remove('active'));
            }
            poultryBtn.classList.add('active');`
  );

  // In veggies click handler:
  html = html.replace(
    `            if (carbStrip) {
              carbStrip.style.display = 'none';
              carbStrip.classList.remove('visible');
              carbStrip.setAttribute('aria-hidden', 'true');
              if (carbBtn) {
                carbBtn.classList.remove('active');
                carbBtn.setAttribute('aria-expanded', 'false');
              }
              carbSubPills.forEach(p => p.classList.remove('active'));
            }
            veggiesBtn.classList.add('active');`,
    `            if (carbStrip) {
              carbStrip.style.display = 'none';
              carbStrip.classList.remove('visible');
              carbStrip.setAttribute('aria-hidden', 'true');
              if (carbBtn) {
                carbBtn.classList.remove('active');
                carbBtn.setAttribute('aria-expanded', 'false');
              }
              carbSubPills.forEach(p => p.classList.remove('active'));
            }
            if (aromaticsStrip) {
              aromaticsStrip.style.display = 'none';
              aromaticsStrip.classList.remove('visible');
              aromaticsStrip.setAttribute('aria-hidden', 'true');
              if (aromaticsBtn) {
                aromaticsBtn.classList.remove('active');
                aromaticsBtn.setAttribute('aria-expanded', 'false');
              }
              aromaticsSubPills.forEach(p => p.classList.remove('active'));
            }
            veggiesBtn.classList.add('active');`
  );

  // In carb click handler:
  html = html.replace(
    `            if (veggiesStrip) {
              veggiesStrip.style.display = 'none';
              veggiesStrip.classList.remove('visible');
              veggiesStrip.setAttribute('aria-hidden', 'true');
              if (veggiesBtn) {
                veggiesBtn.classList.remove('active');
                veggiesBtn.setAttribute('aria-expanded', 'false');
              }
              veggiesSubPills.forEach(p => p.classList.remove('active'));
            }
            carbBtn.classList.add('active');`,
    `            if (veggiesStrip) {
              veggiesStrip.style.display = 'none';
              veggiesStrip.classList.remove('visible');
              veggiesStrip.setAttribute('aria-hidden', 'true');
              if (veggiesBtn) {
                veggiesBtn.classList.remove('active');
                veggiesBtn.setAttribute('aria-expanded', 'false');
              }
              veggiesSubPills.forEach(p => p.classList.remove('active'));
            }
            if (aromaticsStrip) {
              aromaticsStrip.style.display = 'none';
              aromaticsStrip.classList.remove('visible');
              aromaticsStrip.setAttribute('aria-hidden', 'true');
              if (aromaticsBtn) {
                aromaticsBtn.classList.remove('active');
                aromaticsBtn.setAttribute('aria-expanded', 'false');
              }
              aromaticsSubPills.forEach(p => p.classList.remove('active'));
            }
            carbBtn.classList.add('active');`
  );
}

// 7. Update initDashboardFeedEngine to call initAromaticsFilterEngine()
if (!html.includes('initAromaticsFilterEngine();')) {
  html = html.replace(
    `        initBaseCarbFilterEngine();
      }`,
    `        initBaseCarbFilterEngine();
        initAromaticsFilterEngine();
      }`
  );
  console.log('Hooked initAromaticsFilterEngine() into initDashboardFeedEngine().');
}

fs.writeFileSync(dashboardPath, html, 'utf8');
console.log('Successfully updated dashboard.html with Aromatics dual-tier engine!');
