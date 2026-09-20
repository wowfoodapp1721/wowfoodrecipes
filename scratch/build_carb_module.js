const fs = require('fs');
const path = require('path');

const dashPath = path.resolve(__dirname, '../dashboard.html');
let content = fs.readFileSync(dashPath, 'utf8');

// 1. Define the BASE_CARB_GROUPS dataset
const baseCarbGroupsCode = `
      // ==========================================================================
      // 🍚 EXPANDED BASE / CARB CULINARY DATA MATRIX (40 Iconic Global Dishes)
      // ==========================================================================
      const BASE_CARB_GROUPS = {
        // ==========================================================================
        // 🍚 RICE-BASED CLASSICS (10 Famous Recipes)
        // ==========================================================================
        "rice-based": [
          {
            title: "Risotto alla Milanese",
            searchTerm: "Risotto",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "4",
            badge: "Lombardy Gold",
            desc: "Creamy Carnaroli rice slowly simmered in saffron broth, rich beef bone marrow, white wine, and aged Parmigiano-Reggiano.",
            calories: "450 kcal",
            protein: "14g",
            fat: "18g",
            carbs: "58g",
            health: "9.2/10",
            sub: "Saffron & Bone Marrow Risotto",
            ingredients: [
              "Carnaroli or Arborio Rice (320g)",
              "Saffron Threads Infused in Warm Broth (1 tsp)",
              "Beef Bone Marrow & Butter (40g)",
              "Dry White Wine (0.5 cup)",
              "Aged Parmigiano-Reggiano Grated (60g)"
            ],
            steps: [
              "Melt bone marrow and butter; toast Carnaroli rice until translucent.",
              "Deglaze with white wine; ladle simmering saffron beef broth gradually while stirring.",
              "Mantecatura: vigorously beat in cold butter and Parmigiano-Reggiano off heat until wave-like creamy."
            ]
          },
          {
            title: "Seafood Paella",
            searchTerm: "Paella",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "4",
            badge: "Valencian Classic",
            desc: "Traditional Bomba rice cooked in rich seafood sofrito with saffron, jumbo prawns, Mediterranean mussels, calamari, and crispy socarrat.",
            calories: "520 kcal",
            protein: "32g",
            fat: "16g",
            carbs: "62g",
            health: "9.4/10",
            sub: "Saffron Seafood & Socarrat",
            ingredients: [
              "Spanish Bomba Rice (350g)",
              "Jumbo Tiger Prawns & Fresh Calamari (300g)",
              "Mediterranean Mussels Cleaned (200g)",
              "Rich Saffron Fish Broth (800ml)",
              "Tomato Sofrito & Smoked Paprika (3 tbsp)"
            ],
            steps: [
              "Sear prawns and calamari in paella pan; remove and sauté sofrito with smoked paprika.",
              "Stir in Bomba rice to coat; pour saffron fish broth and nestle mussels and seafood on top.",
              "Simmer without stirring for 20 minutes to develop the golden crispy bottom socarrat crust."
            ]
          },
          {
            title: "Chicken Biryani",
            searchTerm: "Chicken Biryani",
            group: "rice-based",
            fallbackImage: "assets/biryani.png",
            time: "50 Min",
            serves: "4",
            badge: "Hyderabadi Dum",
            desc: "Fragrant aged basmati rice layered with spiced marinated chicken, saffron milk, caramelized onions, fresh mint, and toasted whole spices.",
            calories: "580 kcal",
            protein: "36g",
            fat: "20g",
            carbs: "64g",
            health: "9.0/10",
            sub: "Saffron Fragrant Dum Rice",
            ingredients: [
              "Extra Long Grain Aged Basmati Rice (400g)",
              "Yogurt & Spiced Marinated Chicken (500g)",
              "Saffron Infused Warm Milk (4 tbsp)",
              "Crispy Fried Birista Onions (1 cup)",
              "Fresh Mint & Coriander Leaves (0.5 cup)"
            ],
            steps: [
              "Parboil basmati rice with whole green cardamom, star anise, and cloves to 70% doneness.",
              "Layer marinated spiced chicken at the bottom of a heavy pot; top with fragrant rice.",
              "Drizzle saffron milk, ghee, and fried onions; seal pot tightly and slow cook on dum for 30 minutes."
            ]
          },
          {
            title: "Sushi Rolls (Maki)",
            searchTerm: "Sushi",
            group: "rice-based",
            fallbackImage: "assets/sushi.png",
            time: "35 Min",
            serves: "2",
            badge: "Tokyo Edomae",
            desc: "Seasoned Japanese short-grain sushi rice rolled in toasted nori sheets with fresh sashimi-grade tuna, salmon, ripe avocado, and cucumber.",
            calories: "390 kcal",
            protein: "24g",
            fat: "10g",
            carbs: "52g",
            health: "9.6/10",
            sub: "Artisanal Nori Maki Rolls",
            ingredients: [
              "Japanese Short-Grain Sushi Rice (300g)",
              "Seasoned Rice Vinegar Dressing (3 tbsp)",
              "Toasted Nori Seaweed Sheets (4 sheets)",
              "Sashimi Grade Salmon & Tuna Strips (200g)",
              "Fresh Avocado & Crisp Cucumber Matchsticks (1 cup)"
            ],
            steps: [
              "Cook sushi rice and gently fold in seasoned rice vinegar while cooling with a fan.",
              "Spread rice evenly across nori sheet on bamboo mat; arrange fish and vegetables in center.",
              "Roll tightly into compact cylinders; slice into pristine rounds with a wet sharp knife."
            ]
          },
          {
            title: "Nasi Goreng Indonesian",
            searchTerm: "Nasi Goreng",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
            time: "20 Min",
            serves: "2",
            badge: "Balinese Street Icon",
            desc: "Wok-fried Jasmine rice with sweet kecap manis, shrimp paste sambal, scallions, chicken satay skewers, and a crispy sunny-side egg.",
            calories: "490 kcal",
            protein: "26g",
            fat: "18g",
            carbs: "58g",
            health: "8.9/10",
            sub: "Wok-Tossed Kecap Manis Rice",
            ingredients: [
              "Chilled Day-Old Jasmine Rice (3 cups)",
              "Kecap Manis Sweet Soy Sauce (3 tbsp)",
              "Shallot, Garlic & Red Chili Sambal (2 tbsp)",
              "Diced Chicken & Shrimps (150g)",
              "Fried Eggs & Fresh Cucumber Slices (2 servings)"
            ],
            steps: [
              "Sear sambal paste in screaming hot wok until intensely fragrant.",
              "Add chicken and shrimp, tossing rapidly; add cold rice and break apart clumps.",
              "Drizzle kecap manis around wok edges to caramelize; serve topped with a crispy fried egg."
            ]
          },
          {
            title: "Creamy Rice Pudding",
            searchTerm: "Rice Pudding",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "4",
            badge: "Velvety Comfort",
            desc: "Slow-cooked short grain rice in whole milk and vanilla bean cream, infused with cinnamon sticks, citrus peel, and freshly grated nutmeg.",
            calories: "320 kcal",
            protein: "8g",
            fat: "10g",
            carbs: "50g",
            health: "8.7/10",
            sub: "Vanilla Bean Arroz con Leche",
            ingredients: [
              "Arborio or Short Grain Rice (150g)",
              "Whole Milk & Heavy Cream (800ml)",
              "Madagascar Vanilla Bean & Cinnamon Stick (1 each)",
              "Pure Cane Sugar (0.5 cup)",
              "Fresh Lemon Peel & Grated Nutmeg (1 tsp)"
            ],
            steps: [
              "Simmer rice in milk and cream with split vanilla bean, cinnamon stick, and lemon peel.",
              "Cook over gentle low heat for 35 minutes, stirring frequently until thick and luscious.",
              "Stir in sugar off heat; serve warm or chilled dusted with fresh cinnamon and nutmeg."
            ]
          },
          {
            title: "Classic Fried Rice",
            searchTerm: "Fried Rice",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
            time: "15 Min",
            serves: "3",
            badge: "Wok Hei Master",
            desc: "Fluffy wok-tossed Jasmine rice with scrambled pasture eggs, sweet green peas, scallions, premium light soy sauce, and toasted sesame oil.",
            calories: "410 kcal",
            protein: "14g",
            fat: "14g",
            carbs: "56g",
            health: "9.0/10",
            sub: "Golden Wok Hei Toss",
            ingredients: [
              "Day-Old Jasmine Rice (3.5 cups)",
              "Pasture-Raised Eggs Beaten (3 large)",
              "Finely Chopped Scallions & Garlic (4 tbsp)",
              "Light Soy Sauce & Toasted Sesame Oil (2 tbsp)",
              "Sweet Green Peas & Carrots (1 cup)"
            ],
            steps: [
              "Heat wok with oil until smoking; scramble beaten eggs soft and set aside.",
              "Stir fry garlic, scallions, and vegetables for 1 minute; add cold rice.",
              "Toss vigorously over high flame with soy sauce and sesame oil; fold in scrambled eggs."
            ]
          },
          {
            title: "Arancini Rice Balls",
            searchTerm: "Arancini",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "4",
            badge: "Sicilian Crisp",
            desc: "Golden crispy breadcrumb-crusted risotto spheres stuffed with melted fresh mozzarella, savory ragù, and sweet green peas.",
            calories: "460 kcal",
            protein: "18g",
            fat: "22g",
            carbs: "48g",
            health: "8.6/10",
            sub: "Mozzarella-Stuffed Risotto Spheres",
            ingredients: [
              "Chilled Saffron Risotto (3 cups)",
              "Fresh Mozzarella Cubes (150g)",
              "Slow-Cooked Meat Ragù & Peas (0.5 cup)",
              "Panko Breadcrumbs & Flour (1.5 cups)",
              "Whisked Eggs for Breading (2 large)"
            ],
            steps: [
              "Scoop cooled risotto in hand; flatten and insert mozzarella and spoonful of ragù in center.",
              "Form into smooth spheres; dredge in flour, dip in beaten eggs, and coat with panko.",
              "Deep fry at 180°C (350°F) for 4 minutes until crispy golden-brown; serve with warm marinara."
            ]
          },
          {
            title: "Cajun Jambalaya Rice",
            searchTerm: "Jambalaya",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "4",
            badge: "New Orleans Creole",
            desc: "One-pot Creole long-grain rice braised with smoky andouille sausage, tender chicken thighs, Gulf shrimp, bell peppers, celery, and onions.",
            calories: "530 kcal",
            protein: "34g",
            fat: "18g",
            carbs: "58g",
            health: "9.1/10",
            sub: "Creole Holy Trinity & Andouille",
            ingredients: [
              "Long Grain White Rice (300g)",
              "Smoked Andouille Sausage Sliced (200g)",
              "Chicken Thighs & Gulf Shrimp (300g)",
              "Holy Trinity: Onion, Celery, Bell Pepper (2 cups)",
              "Crushed Tomatoes & Cajun Spice Blend (2 tbsp)"
            ],
            steps: [
              "Brown sliced andouille sausage and chicken in heavy Dutch oven; remove.",
              "Sauté holy trinity vegetables until tender; stir in Cajun spices and rice to toast.",
              "Add crushed tomatoes and broth; simmer covered for 25 minutes; stir in shrimp during final 5 minutes."
            ]
          },
          {
            title: "Tahdig Persian Crisp Rice",
            searchTerm: "Tahdig",
            group: "rice-based",
            fallbackImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",
            time: "50 Min",
            serves: "4",
            badge: "Persian Golden Crust",
            desc: "Steamed fluffy basmati rice with a glorious, glass-crisp golden saffron and yogurt bottom crust, crowned with dried barberries.",
            calories: "420 kcal",
            protein: "10g",
            fat: "16g",
            carbs: "60g",
            health: "9.0/10",
            sub: "Saffron Yogurt Crisp Crust",
            ingredients: [
              "Aged Long Grain Basmati Rice (350g)",
              "Greek Yogurt & Saffron Infusion (0.5 cup)",
              "Melted Ghee or Clarified Butter (4 tbsp)",
              "Tart Dried Barberries (Zereshk) (2 tbsp)",
              "Sea Salt & Blooming Saffron Water (2 tbsp)"
            ],
            steps: [
              "Parboil rinsed basmati rice in salted water for 6 minutes; drain.",
              "Mix 1 cup parboiled rice with yogurt, saffron water, and melted ghee; spread on bottom of nonstick pot.",
              "Mound remaining rice into a pyramid; cover with wrapped lid and steam on low for 45 minutes until ultra-crisp."
            ]
          }
        ],

        // ==========================================================================
        // 🌾 WHEAT, FLOUR & PASTA ICONS (10 Famous Recipes)
        // ==========================================================================
        "flour-pasta": [
          {
            title: "Spaghetti Carbonara",
            searchTerm: "Carbonara",
            group: "flour-pasta",
            fallbackImage: "assets/carbonara.png",
            time: "20 Min",
            serves: "2",
            badge: "Roman Masterpiece",
            desc: "Bronze-die extruded spaghetti tossed with crispy guanciale, rich pasture egg yolks, aged Pecorino Romano, and cracked black pepper.",
            calories: "560 kcal",
            protein: "26g",
            fat: "24g",
            carbs: "60g",
            health: "8.8/10",
            sub: "Guanciale & Pecorino Emulsion",
            ingredients: [
              "Bronze-Die Spaghetti (200g)",
              "Artisanal Cured Guanciale Cubed (100g)",
              "Fresh Pasture Egg Yolks (4 large)",
              "Aged Pecorino Romano Grated (60g)",
              "Freshly Toasted Coarse Black Pepper (1 tbsp)"
            ],
            steps: [
              "Crisp diced guanciale slowly in pan until golden and rendered; set aside.",
              "Boil spaghetti in salted water until al dente; reserve starchy cooking water.",
              "Whisk egg yolks with Pecorino; toss hot pasta in pan off heat with guanciale and egg cream until emulsified."
            ]
          },
          {
            title: "Neapolitan Pizza",
            searchTerm: "Pizza",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
            time: "15 Min",
            serves: "2",
            badge: "Wood-Fired DOC",
            desc: "Long-fermented Tipo 00 dough blistered in a 450°C oven, topped with San Marzano D.O.P. tomatoes, Mozzarella di Bufala, and fresh basil.",
            calories: "620 kcal",
            protein: "24g",
            fat: "18g",
            carbs: "88g",
            health: "9.1/10",
            sub: "San Marzano & Bufala Margherita",
            ingredients: [
              "Tipo 00 Fermented Pizza Dough (250g)",
              "San Marzano D.O.P. Crushed Tomatoes (0.5 cup)",
              "Fresh Mozzarella di Bufala Campana (120g)",
              "Fresh Sweet Basil Leaves (6 leaves)",
              "Extra Virgin Olive Oil (1 tbsp)"
            ],
            steps: [
              "Hand-stretch fermented dough on semolina flour into 12-inch disc with raised cornicione rim.",
              "Spread crushed San Marzano tomatoes, torn buffalo mozzarella, and fresh basil leaves.",
              "Bake on preheated pizza stone at maximum temperature for 90-120 seconds until charred and bubbling."
            ]
          },
          {
            title: "Tonkotsu Ramen",
            searchTerm: "Ramen",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "2",
            badge: "Hakata Artisanal",
            desc: "Hand-crafted alkaline wheat noodles in velvety 18-hour pork marrow broth with seared chashu pork belly, ajitsuke tamago, and black garlic oil.",
            calories: "680 kcal",
            protein: "38g",
            fat: "32g",
            carbs: "62g",
            health: "8.9/10",
            sub: "18-Hour Broth & Chashu Belly",
            ingredients: [
              "Fresh Alkaline Ramen Noodles (220g)",
              "Rich Tonkotsu Pork Bone Broth (600ml)",
              "Rolled Seared Pork Belly Chashu (4 slices)",
              "Soy Marinated Soft-Boiled Egg (Ajitama) (2 halves)",
              "Menma Bamboo Shoots, Nori & Mayu Black Garlic Oil (2 tbsp)"
            ],
            steps: [
              "Boil fresh ramen noodles for exactly 90 seconds for firm al dente texture; drain well.",
              "Ladle piping hot tonkotsu broth into heated ceramic bowls over shoyu tare seasoning.",
              "Fold in noodles; arrange chashu pork, marinated egg, menma, and finish with aromatic black garlic oil."
            ]
          },
          {
            title: "Lasagna Bolognese",
            searchTerm: "Lasagna",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1200&q=80",
            time: "55 Min",
            serves: "4",
            badge: "Emilian Masterpiece",
            desc: "Layers of silky homemade spinach pasta sheets, slow-simmered beef and pork ragù alla Bolognese, velvety nutmeg béchamel, and Parmigiano.",
            calories: "640 kcal",
            protein: "36g",
            fat: "28g",
            carbs: "60g",
            health: "8.7/10",
            sub: "Ragù alla Bolognese & Béchamel",
            ingredients: [
              "Fresh Egg Pasta Sheets (8 sheets)",
              "Slow-Simmered Bolognese Meat Sauce (3 cups)",
              "Velvety Nutmeg Béchamel Sauce (2 cups)",
              "Aged Parmigiano-Reggiano Grated (1 cup)",
              "European Butter for Layering (2 tbsp)"
            ],
            steps: [
              "Blanch fresh pasta sheets in salted boiling water for 1 minute; transfer to ice bath.",
              "Layer pasta, Bolognese ragù, creamy béchamel, and Parmigiano across 5 successive tiers.",
              "Bake at 190°C (375°F) for 30 minutes until bubbling with a golden caramelized crust."
            ]
          },
          {
            title: "Fettuccine Alfredo",
            searchTerm: "Fettuccine",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=1200&q=80",
            time: "20 Min",
            serves: "2",
            badge: "Original Roman",
            desc: "Fresh egg fettuccine ribbon pasta swirled in an emulsion of triple-churned European butter, 24-month Parmigiano-Reggiano, and starchy pasta water.",
            calories: "580 kcal",
            protein: "22g",
            fat: "30g",
            carbs: "54g",
            health: "8.5/10",
            sub: "Parmigiano & Butter Emulsion",
            ingredients: [
              "Fresh Egg Fettuccine Pasta (250g)",
              "European High-Fat Cultured Butter (60g)",
              "24-Month Parmigiano-Reggiano Finely Grated (100g)",
              "Starchy Pasta Cooking Water (0.5 cup)",
              "Freshly Cracked Black Pepper (1 tsp)"
            ],
            steps: [
              "Boil fresh fettuccine for 2-3 minutes until al dente; reserve cooking water.",
              "Melt cultured butter in wide sauté pan with splash of pasta water over gentle heat.",
              "Add hot pasta; toss with heaps of Parmigiano vigorously off heat until glossy velvet coating forms."
            ]
          },
          {
            title: "Fluffy Garlic Naan",
            searchTerm: "Naan",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "3",
            badge: "Tandoor Blistered",
            desc: "Pillowy yogurt-leavened flatbread slapped onto a screaming hot tandoor surface, slathered with roasted garlic ghee and fresh cilantro.",
            calories: "320 kcal",
            protein: "9g",
            fat: "10g",
            carbs: "48g",
            health: "8.9/10",
            sub: "Roasted Garlic Ghee Flatbread",
            ingredients: [
              "All-Purpose Flour & Yogurt Yeast Dough (300g)",
              "Clarified Butter (Desi Ghee) (3 tbsp)",
              "Minced Roasted Garlic & Nigella Seeds (2 tbsp)",
              "Fresh Chopped Cilantro (2 tbsp)",
              "Flaky Sea Salt (1 tsp)"
            ],
            steps: [
              "Roll fermented dough into teardrop shapes; press minced garlic and nigella seeds into top surface.",
              "Brush bottom with water; slap onto red-hot cast iron skillet or tandoor wall.",
              "Flip directly over open flame until large blisters puff; brush generously with melted garlic ghee."
            ]
          },
          {
            title: "Homemade Sourdough Bread",
            searchTerm: "Sourdough",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "6",
            badge: "Artisanal Levain",
            desc: "Naturally fermented wild sourdough loaf with an open custardy crumb, deep caramel blistered crust, and complex lactic tang.",
            calories: "240 kcal",
            protein: "9g",
            fat: "2g",
            carbs: "48g",
            health: "9.7/10",
            sub: "Naturally Fermented Wild Boule",
            ingredients: [
              "High-Protein Unbleached Bread Flour (450g)",
              "Active Wild Sourdough Starter (Levain) (90g)",
              "Hydration Filtered Water (340ml)",
              "Fine Sea Salt (10g)",
              "Rice Flour for Banneton Dusting (2 tbsp)"
            ],
            steps: [
              "Autolyse flour and water; incorporate active starter and salt through coil folds over 4 hours.",
              "Pre-shape into round boule; cold retard in banneton basket overnight for 14 hours.",
              "Score with razor blade and bake in preheated Dutch oven at 230°C (450°F) for 40 minutes."
            ]
          },
          {
            title: "Penne alla Arrabbiata",
            searchTerm: "Arrabbiata",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1621996346565-e3adc644d942?auto=format&fit=crop&w=1200&q=80",
            time: "18 Min",
            serves: "2",
            badge: "Fiery Roman Classic",
            desc: "Ridged penne rigate coated in a fiery San Marzano tomato sauce infused with golden garlic slivers, red pepper flakes, and fresh parsley.",
            calories: "460 kcal",
            protein: "16g",
            fat: "12g",
            carbs: "72g",
            health: "9.3/10",
            sub: "Fiery Garlic Chili Marinara",
            ingredients: [
              "Penne Rigate Pasta (200g)",
              "San Marzano Whole Peeled Tomatoes Crushed (400g)",
              "Thinly Sliced Garlic Cloves (4 cloves)",
              "Calabrian Dried Red Chili Pepper Flakes (1 tbsp)",
              "Extra Virgin Olive Oil & Fresh Parsley (3 tbsp)"
            ],
            steps: [
              "Sizzle sliced garlic and chili flakes gently in olive oil until golden and fragrant.",
              "Pour crushed tomatoes; simmer rapidly for 10 minutes to concentrate flavors.",
              "Toss penne al dente directly into sauce with parsley and starchy water for 2 minutes."
            ]
          },
          {
            title: "Authentic Beef Pho",
            searchTerm: "Pho",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80",
            time: "40 Min",
            serves: "2",
            badge: "Hanoi Heritage",
            desc: "Silky flat rice noodles in a crystalline star anise and roasted ginger beef marrow broth, topped with thinly sliced beef sirloin and herbs.",
            calories: "480 kcal",
            protein: "34g",
            fat: "14g",
            carbs: "54g",
            health: "9.5/10",
            sub: "Star Anise Bone Marrow Broth",
            ingredients: [
              "Fresh Flat Rice/Wheat Pho Noodles (250g)",
              "12-Hour Simmered Spiced Beef Bone Broth (800ml)",
              "Shaved Raw Beef Tenderloin / Sirloin (180g)",
              "Charred Ginger, Onion, Star Anise & Cinnamon (1 batch)",
              "Fresh Thai Basil, Cilantro, Lime & Bean Sprouts (1 cup)"
            ],
            steps: [
              "Blanch fresh flat noodles for 30 seconds; divide into large preheated soup bowls.",
              "Arrange thinly shaved raw beef and fresh scallions on top of noodles.",
              "Ladle boiling fragrant marrow broth over beef to cook instantly; serve with herbs and lime."
            ]
          },
          {
            title: "Crispy Vegetable Gyoza",
            searchTerm: "Gyoza",
            group: "flour-pasta",
            fallbackImage: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "2",
            badge: "Crisp Hanetsuki",
            desc: "Delicate pleated wheat wrappers stuffed with minced Napa cabbage, shiitake mushrooms, ginger, and scallions with a lacy crispy bottom.",
            calories: "340 kcal",
            protein: "12g",
            fat: "12g",
            carbs: "46g",
            health: "9.4/10",
            sub: "Pan-Fried Lacy Dumplings",
            ingredients: [
              "Thin Wheat Gyoza Wrapper Skins (16 wrappers)",
              "Finely Minced Napa Cabbage & Shiitake (2 cups)",
              "Grated Ginger, Garlic & Scallions (2 tbsp)",
              "Sesame Oil & Soy Seasoning (1.5 tbsp)",
              "Cornstarch Slurry for Crispy Lace Skirt (0.5 cup)"
            ],
            steps: [
              "Pleat vegetable filling tightly into wrappers with crescent edges.",
              "Pan-sear gyoza bottoms in sesame oil until golden-crisp; pour cornstarch slurry.",
              "Cover with lid to steam for 3 minutes; uncover until a delicate crispy lacy skirt forms."
            ]
          }
        ],

        // ==========================================================================
        // 🥔 POTATO-CENTRIC FAVORITES (10 Famous Recipes)
        // ==========================================================================
        "potato-centric": [
          {
            title: "Gnocchi di Patate",
            searchTerm: "Gnocchi",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "3",
            badge: "Pillowy Northern Italian",
            desc: "Light, melt-in-your-mouth Russet potato gnocchi pillows pan-seared in hazelnut brown butter with crispy sage leaves and Parmigiano.",
            calories: "440 kcal",
            protein: "14g",
            fat: "18g",
            carbs: "56g",
            health: "9.1/10",
            sub: "Brown Butter Sage Dumplings",
            ingredients: [
              "Baked Riced Russet Potatoes (600g)",
              "Tipo 00 Flour & Egg Yolk (150g flour, 1 yolk)",
              "European Butter for Brown Butter (50g)",
              "Fresh Sage Leaves (12 leaves)",
              "Aged Parmigiano-Reggiano Grated (4 tbsp)"
            ],
            steps: [
              "Bake potatoes dry; pass through ricer and knead gently with flour and egg yolk into soft dough.",
              "Roll into ropes, cut into 1-inch pillows, and roll across gnocchi board for ridges.",
              "Boil until floating (2 min); toss directly into foamy nutty brown butter with crispy sage."
            ]
          },
          {
            title: "French Poutine",
            searchTerm: "Poutine",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1586805608485-add336722759?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "2",
            badge: "Quebecois Heritage",
            desc: "Crispy double-fried hand-cut Russet fries topped with squeaky fresh cheese curds and smothered in piping-hot rich savory beef gravy.",
            calories: "690 kcal",
            protein: "24g",
            fat: "38g",
            carbs: "62g",
            health: "8.2/10",
            sub: "Savory Gravy & Squeaky Curds",
            ingredients: [
              "Russet Potatoes Hand-Cut into Batons (500g)",
              "Fresh White Cheddar Cheese Curds (150g)",
              "Rich Beef & Peppercorn Brown Gravy (1.5 cups)",
              "High Smoke Point Peanut Oil for Frying (for frying)",
              "Flaky Sea Salt & Fresh Black Pepper (1 tsp)"
            ],
            steps: [
              "Soak potato batons in cold water; blanch at 150°C (300°F) for 5 minutes; drain.",
              "Flash-fry at 190°C (375°F) for 3 minutes until deeply golden and extra crispy.",
              "Toss into serving dish, scatter squeaky cheese curds, and pour boiling gravy over top."
            ]
          },
          {
            title: "Aloo Gobi",
            searchTerm: "Aloo Gobi",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "3",
            badge: "Punjabi Homestyle",
            desc: "Golden-roasted potatoes and tender cauliflower florets sautéed with ginger juliennes, cumin seeds, turmeric, and fresh cilantro.",
            calories: "280 kcal",
            protein: "8g",
            fat: "10g",
            carbs: "42g",
            health: "9.7/10",
            sub: "Spiced Potato & Cauliflower",
            ingredients: [
              "Yukon Gold Potatoes Diced (300g)",
              "Fresh Cauliflower Cut into Florets (350g)",
              "Ginger Juliennes, Garlic & Green Chili (3 tbsp)",
              "Turmeric, Cumin & Coriander Spices (1.5 tbsp)",
              "Fresh Chopped Cilantro & Lemon Juice (2 tbsp)"
            ],
            steps: [
              "Temper cumin seeds in hot oil; add ginger, garlic, and diced potatoes.",
              "Stir in cauliflower florets and ground spices; cover and cook on medium-low for 15 minutes.",
              "Uncover and roast on high heat for 5 minutes until caramelized; garnish with fresh cilantro."
            ]
          },
          {
            title: "Classic Potato Gratin",
            searchTerm: "Potato Gratin",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
            time: "50 Min",
            serves: "4",
            badge: "Dauphinois Tradition",
            desc: "Mandoline-sliced Yukon Gold potatoes shingled in garlic and thyme-infused heavy cream, baked with a golden bubbling Gruyère crust.",
            calories: "480 kcal",
            protein: "14g",
            fat: "32g",
            carbs: "36g",
            health: "8.6/10",
            sub: "Garlic Cream Gratin Dauphinois",
            ingredients: [
              "Yukon Gold Potatoes Thinly Sliced (700g)",
              "Heavy Cream & Whole Milk (350ml)",
              "Grated Gruyère or Comté Cheese (150g)",
              "Fresh Garlic Cloves & Thyme Leaves (3 cloves, 1 tbsp)",
              "Fresh Nutmeg Grated & Sea Salt (1 tsp)"
            ],
            steps: [
              "Infuse heavy cream with crushed garlic, fresh thyme, and nutmeg over gentle heat.",
              "Layer thin potato slices overlapping in buttered baking dish; pour seasoned cream.",
              "Top with grated Gruyère cheese and bake at 180°C (350°F) for 45 minutes until knife-tender and golden."
            ]
          },
          {
            title: "Spanish Tortilla de Patatas",
            searchTerm: "Tortilla de Patatas",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "4",
            badge: "Madrid Classic Tapas",
            desc: "Thick, tender Spanish omelette packed with slow-confit Yukon potatoes and sweet caramelized onions, served with a silky custard center.",
            calories: "380 kcal",
            protein: "16g",
            fat: "22g",
            carbs: "30g",
            health: "9.2/10",
            sub: "Slow-Confit Potato Omelette",
            ingredients: [
              "Yukon Gold Potatoes Thinly Sliced (500g)",
              "Sweet Spanish Onions Thinly Sliced (1 large)",
              "Pasture-Raised Eggs Whisked (6 large)",
              "Spanish Extra Virgin Olive Oil (1 cup for confit)",
              "Flaky Sea Salt (1 tsp)"
            ],
            steps: [
              "Poach potato slices and onions gently in warm olive oil until melt-in-your-mouth tender; drain.",
              "Fold warm potatoes into whisked eggs; rest for 10 minutes to absorb.",
              "Cook in skillet for 2 minutes per side, flipping with a plate to keep the center deliciously creamy."
            ]
          },
          {
            title: "Crispy French Fries",
            searchTerm: "French Fries",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "3",
            badge: "Belgian Frites",
            desc: "Hand-cut Russet potato frites double-fried in beef tallow to crunchy perfection, seasoned with Maldon flaky sea salt and rosemary.",
            calories: "390 kcal",
            protein: "6g",
            fat: "18g",
            carbs: "52g",
            health: "8.5/10",
            sub: "Double-Fried Belgian Frites",
            ingredients: [
              "High-Starch Russet Potatoes (600g)",
              "Cold Water for Starch Soaking (1 bowl)",
              "Peanut Oil or Beef Tallow for Frying (for frying)",
              "Maldon Flaky Sea Salt (1 tbsp)",
              "Finely Chopped Fresh Rosemary (1 tsp)"
            ],
            steps: [
              "Cut potatoes into 3/8-inch fries and soak in ice water for 30 minutes to wash off surface starch.",
              "Par-cook in 150°C (300°F) oil for 5 minutes; cool completely.",
              "Final fry at 195°C (385°F) for 3 minutes until shattering crisp; toss immediately with sea salt."
            ]
          },
          {
            title: "Garlic Mashed Potatoes",
            searchTerm: "Mashed Potatoes",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1633436375795-12b3b339712f?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "4",
            badge: "Silk Velvet Puree",
            desc: "Luxuriously velvety Yukon Gold potatoes whipped with slow-roasted sweet garlic cloves, cultured European butter, and warm cream.",
            calories: "340 kcal",
            protein: "6g",
            fat: "18g",
            carbs: "40g",
            health: "9.0/10",
            sub: "Roasted Garlic Butter Mash",
            ingredients: [
              "Yukon Gold Potatoes Peeled & Quartered (700g)",
              "Whole Head of Roasted Garlic Puree (1 head)",
              "Cultured European Butter Cubed (80g)",
              "Warm Heavy Cream & Whole Milk (150ml)",
              "Fresh Chives & Flaky Sea Salt (1 tbsp)"
            ],
            steps: [
              "Boil potatoes in salted water until fork-tender; drain and dry steam in pot for 2 minutes.",
              "Pass through fine potato ricer directly over warm melted butter and roasted garlic puree.",
              "Gently fold in warm cream until silky and glossy; finish with chopped chives."
            ]
          },
          {
            title: "Hasselback Potatoes",
            searchTerm: "Hasselback Potatoes",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80",
            time: "45 Min",
            serves: "3",
            badge: "Accordion Crisp",
            desc: "Thinly accordion-sliced roasted potatoes basted with garlic herb butter, creating crispy fan edges and a soft fluffy interior.",
            calories: "310 kcal",
            protein: "6g",
            fat: "14g",
            carbs: "42g",
            health: "9.2/10",
            sub: "Garlic Herb Accordion Fan",
            ingredients: [
              "Medium Yukon Gold or Russet Potatoes (4 potatoes)",
              "Melted Butter & Olive Oil (4 tbsp)",
              "Minced Garlic, Thyme & Rosemary (2 tbsp)",
              "Grated Parmesan Cheese (3 tbsp)",
              "Flaky Sea Salt & Black Pepper (1 tsp)"
            ],
            steps: [
              "Place potato between chopsticks; make thin parallel cuts 75% down without cutting through.",
              "Brush generously with garlic herb butter, ensuring it slips between every slice.",
              "Bake at 200°C (400°F) for 45 minutes, basting twice; sprinkle parmesan in final 10 minutes."
            ]
          },
          {
            title: "Loaded Baked Potato",
            searchTerm: "Baked Potato",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
            time: "50 Min",
            serves: "2",
            badge: "Steakhouse Classic",
            desc: "Salt-crusted crisp-skin baked Russet potato split open and piled high with melted sharp cheddar, crispy smoked bacon, sour cream, and scallions.",
            calories: "520 kcal",
            protein: "18g",
            fat: "26g",
            carbs: "54g",
            health: "8.7/10",
            sub: "Cheddar Bacon & Sour Cream",
            ingredients: [
              "Jumbo Russet Potatoes (2 large)",
              "Sharp Aged Cheddar Cheese Shredded (0.75 cup)",
              "Crispy Smoked Bacon Bits (4 slices)",
              "Chilled Sour Cream & Chopped Scallions (0.5 cup)",
              "Coarse Sea Salt & Olive Oil (1 tbsp)"
            ],
            steps: [
              "Rub potato skins with olive oil and coarse sea salt; prick with fork.",
              "Bake at 200°C (400°F) for 50 minutes until skin is crackling and interior is tender.",
              "Slice top open, fluff interior with fork, and load with melted cheddar, bacon, sour cream, and scallions."
            ]
          },
          {
            title: "Crispy Potato Latkes",
            searchTerm: "Latkes",
            group: "potato-centric",
            fallbackImage: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "4",
            badge: "Hanukkah Heritage",
            desc: "Golden lacy shredded potato and onion fritters fried in sizzling oil, served alongside chilled sour cream and homemade spiced applesauce.",
            calories: "320 kcal",
            protein: "6g",
            fat: "16g",
            carbs: "38g",
            health: "9.1/10",
            sub: "Crisp Lacy Potato Pancakes",
            ingredients: [
              "Russet Potatoes Shredded Coarsely (500g)",
              "Yellow Onion Grated (1 medium)",
              "Pasture Egg Beaten & Matzo Meal (1 egg, 2 tbsp)",
              "High Smoke Point Oil for Shallow Frying (0.5 cup)",
              "Sour Cream & Spiced Applesauce for Serving (0.5 cup)"
            ],
            steps: [
              "Squeeze shredded potato and onion thoroughly in cheesecloth to extract all moisture.",
              "Mix with beaten egg, matzo meal, salt, and pepper.",
              "Drop dollops into hot shimmering oil; flatten into discs and fry 3 minutes per side until deeply crisp."
            ]
          }
        ],

        // ==========================================================================
        // 🌽 CORN & MAIZE STAPLES (10 Famous Recipes)
        // ==========================================================================
        "corn-maize": [
          {
            title: "Mexican Street Tacos",
            searchTerm: "Tacos",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
            time: "20 Min",
            serves: "3",
            badge: "Oaxacan Masa",
            desc: "Charred stone-ground heirloom corn tortillas topped with seasoned seared carne asada, diced white onions, fresh cilantro, and tomatillo salsa.",
            calories: "460 kcal",
            protein: "28g",
            fat: "16g",
            carbs: "50g",
            health: "9.4/10",
            sub: "Stone-Ground Corn Tortillas",
            ingredients: [
              "Fresh Nixtamalized Corn Tortillas (6 tortillas)",
              "Citrus-Marinated Flank Steak Grilled (300g)",
              "Finely Diced White Onion & Cilantro (0.5 cup)",
              "Charred Tomatillo Salsa Verde (4 tbsp)",
              "Fresh Lime Wedges & Radish Slices (1 cup)"
            ],
            steps: [
              "Warm fresh corn tortillas on dry cast iron comal until soft and fragrant with light charred spots.",
              "Fill double tortillas with grilled sliced steak, diced white onion, and fresh cilantro.",
              "Drizzle with roasted tomatillo salsa verde and serve with fresh lime wedges."
            ]
          },
          {
            title: "Shrimp and Grits",
            searchTerm: "Shrimp and Grits",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "2",
            badge: "Lowcountry Heritage",
            desc: "Creamy stone-ground white corn grits enriched with sharp cheddar, topped with wild Gulf shrimp, andouille pan gravy, and scallions.",
            calories: "520 kcal",
            protein: "32g",
            fat: "22g",
            carbs: "46g",
            health: "9.1/10",
            sub: "Stone-Ground Cheddar Grits",
            ingredients: [
              "Stone-Ground White Cornmeal Grits (1 cup)",
              "Whole Milk, Chicken Broth & Sharp Cheddar (3 cups, 1 cup cheese)",
              "Wild Gulf Shrimp Peeled (300g)",
              "Smoked Andouille Sausage Diced (100g)",
              "Garlic Lemon Pan Gravy & Scallions (3 tbsp)"
            ],
            steps: [
              "Slow-cook stone-ground grits in simmering broth and milk for 25 minutes until ultra-creamy; stir in cheddar.",
              "Sear diced andouille sausage and shrimp in skillet with garlic and lemon butter.",
              "Ladle warm cheesy grits into bowls and spoon shrimp and rich pan drippings over top."
            ]
          },
          {
            title: "Polenta Concia",
            searchTerm: "Polenta",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80",
            time: "35 Min",
            serves: "3",
            badge: "Valle d'Aosta Luxe",
            desc: "Slow-simmered coarse yellow cornmeal polenta whipped with melted Fontina cheese, alpine butter, and sage-infused pan juices.",
            calories: "440 kcal",
            protein: "14g",
            fat: "24g",
            carbs: "44g",
            health: "8.9/10",
            sub: "Alpine Fontina Cheese Polenta",
            ingredients: [
              "Coarse Yellow Cornmeal (Bramata) (200g)",
              "Alpine Fontina & Parmigiano Cheese (150g)",
              "Cultured Mountain Butter (50g)",
              "Fresh Sage Leaves Sizzled in Butter (8 leaves)",
              "Sea Salt & Water / Milk (800ml)"
            ],
            steps: [
              "Rain cornmeal into salted boiling water, whisking vigorously to avoid lumps.",
              "Cook on low heat for 30 minutes, stirring steadily until thick and pulling from pan sides.",
              "Fold in cubed Fontina and butter until completely melted and velvety; garnish with sage."
            ]
          },
          {
            title: "Creamy Sweet Corn Soup",
            searchTerm: "Corn Soup",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "3",
            badge: "Velvety Summer Harvest",
            desc: "Fresh sweet summer corn kernels simmered with shallots, lemongrass, coconut cream, and finished with chili crisp and scallion oil.",
            calories: "290 kcal",
            protein: "6g",
            fat: "14g",
            carbs: "38g",
            health: "9.5/10",
            sub: "Coconut Lemongrass Corn Chowder",
            ingredients: [
              "Fresh Sweet Corn Kernels Shucked (4 ears)",
              "Coconut Cream & Vegetable Broth (500ml)",
              "Shallots, Lemongrass & Garlic Minced (3 tbsp)",
              "Smoked Paprika & Chili Crisp Oil (1 tbsp)",
              "Fresh Lime Juice & Micro Cilantro (2 tbsp)"
            ],
            steps: [
              "Saute shallots, garlic, and bruised lemongrass in olive oil; add fresh sweet corn.",
              "Pour broth and simmer for 15 minutes; blend half the soup silky smooth and return to pot.",
              "Stir in coconut cream and fresh lime juice; serve drizzled with fragrant chili crisp."
            ]
          },
          {
            title: "Venezuelan Arepas",
            searchTerm: "Arepas",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
            time: "25 Min",
            serves: "2",
            badge: "Caracas Street Food",
            desc: "Crisp-crusted, soft-centered pre-cooked cornmeal patties split open and stuffed with shredded chicken, avocado, and crumbled queso.",
            calories: "450 kcal",
            protein: "26g",
            fat: "18g",
            carbs: "46g",
            health: "9.3/10",
            sub: "Reina Pepiada Stuffed Arepas",
            ingredients: [
              "Pre-Cooked White Cornmeal (Harina P.A.N.) (200g)",
              "Lukewarm Water & Sea Salt (250ml)",
              "Shredded Chicken Breast & Ripe Avocado (200g)",
              "Crumbled Queso Blanco (0.5 cup)",
              "Olive Oil for Griddling (1 tbsp)"
            ],
            steps: [
              "Knead Harina P.A.N. with warm salted water until smooth and pliable; form into thick discs.",
              "Sear on hot greased budare or skillet for 5 minutes per side until golden crust develops.",
              "Bake at 180°C for 10 minutes until hollow sounding; slice pocket open and stuff with chicken avocado filling."
            ]
          },
          {
            title: "Golden Sweet Cornbread",
            searchTerm: "Cornbread",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
            time: "30 Min",
            serves: "6",
            badge: "Southern Cast Iron",
            desc: "Skillet-baked sweet yellow cornmeal bread with a golden caramelized crust, laced with wildflower honey and melted butter.",
            calories: "280 kcal",
            protein: "6g",
            fat: "10g",
            carbs: "42g",
            health: "8.8/10",
            sub: "Honey Butter Cast Iron Loaf",
            ingredients: [
              "Yellow Stone-Ground Cornmeal (1.5 cups)",
              "All-Purpose Flour & Baking Powder (1 cup, 1 tbsp)",
              "Cultured Buttermilk & Pasture Eggs (1.25 cups, 2 eggs)",
              "Wildflower Honey & Melted Butter (4 tbsp each)",
              "Coarse Sea Salt (1 tsp)"
            ],
            steps: [
              "Preheat heavy cast-iron skillet in 200°C (400°F) oven with tablespoon of butter.",
              "Whisk dry and wet ingredients together gently until just combined.",
              "Pour batter into sizzling hot skillet and bake for 22 minutes until golden-brown and fragrant."
            ]
          },
          {
            title: "Crispy Corn Fritters",
            searchTerm: "Corn Fritters",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
            time: "20 Min",
            serves: "3",
            badge: "Pan-Fried Crisp",
            desc: "Crisp pan-fried sweet corn fritters packed with fresh scallions, diced red bell pepper, and cumin, served with zesty lime sour cream.",
            calories: "310 kcal",
            protein: "8g",
            fat: "14g",
            carbs: "38g",
            health: "9.2/10",
            sub: "Sweet Corn & Scallion Fritters",
            ingredients: [
              "Fresh Sweet Corn Kernels (2.5 cups)",
              "Cornmeal, Flour & Baking Powder (0.5 cup each)",
              "Pasture Eggs Beaten (2 large)",
              "Diced Scallions, Red Pepper & Cilantro (0.5 cup)",
              "Lime Crema & Smoked Paprika for Dipping (4 tbsp)"
            ],
            steps: [
              "Combine corn, scallions, herbs, eggs, flour, and cornmeal into thick batter.",
              "Drop large spoonfuls into hot shallow oil; press gently into flat patties.",
              "Pan fry for 3 minutes per side until crisp and deep golden; serve with lime crema."
            ]
          },
          {
            title: "Traditional Tamales",
            searchTerm: "Tamales",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
            time: "60 Min",
            serves: "4",
            badge: "Mesoamerican Heritage",
            desc: "Light whipped corn masa dough filled with slow-cooked shredded pork in rich red chili salsa, steamed inside tender corn husks.",
            calories: "410 kcal",
            protein: "22g",
            fat: "18g",
            carbs: "42g",
            health: "9.3/10",
            sub: "Steamed Masa & Red Chili Pork",
            ingredients: [
              "Masa Harina for Tamales (3 cups)",
              "Warmed Broth & Whipped Lard/Vegetable Shortening (1 cup)",
              "Slow-Cooked Ancho Chili Pork (300g)",
              "Dried Corn Husks Soaked in Warm Water (12 husks)",
              "Salsa Roja & Crumbled Cotija Cheese (4 tbsp)"
            ],
            steps: [
              "Beat masa harina with broth and whipped shortening until light and fluffy (floats in water).",
              "Spread masa onto softened corn husk; add line of seasoned pork salsa down center.",
              "Fold husk tightly and steam upright in tamale pot for 45 minutes until masa releases cleanly."
            ]
          },
          {
            title: "Mexican Elote Street Corn",
            searchTerm: "Elote",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
            time: "15 Min",
            serves: "2",
            badge: "Street Market Classic",
            desc: "Charred sweet corn on the cob slathered with lime crema, crumbled Cotija cheese, ancho chili powder, and fresh cilantro.",
            calories: "280 kcal",
            protein: "8g",
            fat: "14g",
            carbs: "34g",
            health: "9.4/10",
            sub: "Charred Cotija & Chili Cob",
            ingredients: [
              "Fresh Ears of Sweet Corn (2 ears)",
              "Mexican Crema or Mayonnaise (3 tbsp)",
              "Crumbled Salty Cotija Cheese (0.5 cup)",
              "Ancho Chili Powder & Cayenne (1 tsp)",
              "Fresh Lime Wedges & Chopped Cilantro (2 tbsp)"
            ],
            steps: [
              "Grill corn ears directly over hot coals or cast iron skillet for 10 minutes, turning until charred all around.",
              "Brush immediately with thick layer of Mexican crema or mayonnaise.",
              "Roll in crumbled cotija cheese; dust with ancho chili powder and finish with squeeze of fresh lime."
            ]
          },
          {
            title: "Crispy Tortilla Chips",
            searchTerm: "Tortilla Chips",
            group: "corn-maize",
            fallbackImage: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=1200&q=80",
            time: "12 Min",
            serves: "4",
            badge: "House-Made Totopos",
            desc: "Freshly fried stone-ground yellow corn tortilla triangles dusted with flaky sea salt, lime zest, and smoked paprika, served with fresh guacamole.",
            calories: "260 kcal",
            protein: "4g",
            fat: "12g",
            carbs: "34g",
            health: "9.0/10",
            sub: "Stone-Ground Salt & Lime Totopos",
            ingredients: [
              "Stone-Ground Corn Tortillas Cut into Wedges (8 tortillas)",
              "High-Heat Frying Oil (Peanut or Avocado) (2 cups)",
              "Flaky Sea Salt & Lime Zest (1 tbsp)",
              "Fresh Guacamole & Roasted Tomato Salsa (1 cup)"
            ],
            steps: [
              "Cut fresh corn tortillas into 6 triangular wedges per tortilla.",
              "Fry in 180°C (350°F) oil in batches for 2 minutes until crisp and bubbling stops.",
              "Drain on paper towels and toss immediately with flaky sea salt and lime zest."
            ]
          }
        ]
      };
`;

// 2. Define the Base/Carb fetch, resolution, and rendering functions
const baseCarbModuleCode = `
      // ==========================================
      // 🍚 BASE / CARB ASYNC FETCH & RENDERING MODULES
      // ==========================================
      const BASE_CARB_SUBCATEGORY_CACHE = {};

      async function fetchBaseCarbTheMealDBItem(item) {
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
          console.warn('TheMealDB async query fallback for base/carb', item.title, e);
        }
        return {
          ...item,
          idMeal: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          strMealThumb: wowPremiumImageRegistry[recipeTitleKey] || item.fallbackImage,
          resolvedImage: wowPremiumImageRegistry[recipeTitleKey] || item.fallbackImage
        };
      }

      async function ensureBaseCarbSubgroupResolved(subGroup) {
        const groupKey = (subGroup || 'rice-based').toLowerCase().trim();
        if (BASE_CARB_SUBCATEGORY_CACHE[groupKey]) {
          return BASE_CARB_SUBCATEGORY_CACHE[groupKey];
        }

        const items = BASE_CARB_GROUPS[groupKey] || [];
        const resolvedList = await Promise.all(items.map(item => fetchBaseCarbTheMealDBItem(item)));

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

        BASE_CARB_SUBCATEGORY_CACHE[groupKey] = resolvedList;
        return resolvedList;
      }

      async function renderBaseCarbCards(subGroup) {
        const feedContainer = document.getElementById('recipe-feed-container') || document.getElementById('main-recipe-feed');
        if (!feedContainer) return;

        const targetGroup = (subGroup || 'rice-based').toLowerCase().trim();
        let displayGroupName = targetGroup.replace('-', ' ').toUpperCase();
        if (targetGroup === 'rice-based') displayGroupName = 'RICE-BASED';
        if (targetGroup === 'flour-pasta') displayGroupName = 'FLOUR & PASTA';
        if (targetGroup === 'potato-centric') displayGroupName = 'POTATO-CENTRIC';
        if (targetGroup === 'corn-maize') displayGroupName = 'CORN & MAIZE';

        // Clean Feed Refresh: Clear out all elements completely and show sleek loading spinner
        feedContainer.innerHTML = \`
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 20px; gap: 12px; width: 100%;">
            <div style="width: 28px; height: 28px; border: 3px solid rgba(61, 242, 224, 0.2); border-top-color: #3DF2E0; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <span style="font-size: 12px; color: #8E9AA6; font-weight: 600; letter-spacing: 0.02em;">Fetching 10 Gourmet \${displayGroupName} Creations...</span>
          </div>
        \`;

        const filteredItems = await ensureBaseCarbSubgroupResolved(targetGroup);
        feedContainer.innerHTML = '';

        if (filteredItems.length === 0) {
          feedContainer.innerHTML = \`
            <div style="text-align: center; padding: 48px 20px; color: #8E8E93; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
              <span class="material-symbols-outlined" style="font-size: 36px; color: #3DF2E0; margin-bottom: 4px;">search_off</span>
              <div style="font-size: 15px; font-weight: 700; color: #FFFFFF;">No "\${displayGroupName}" Dishes Found</div>
              <div style="font-size: 12px; color: #8E9AA6;">Try selecting Rice-Based, Flour &amp; Pasta, Potato-Centric, or Corn &amp; Maize.</div>
            </div>
          \`;
          return;
        }

        filteredItems.forEach(function (meal) {
          const mealTitle = meal.title || (meal.strMeal ? meal.strMeal.trim() : 'Gourmet Base / Carb');
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
          const itemDesc = meal.desc || 'Gourmet artisanal recipe.';
          const groupName = displayGroupName;

          const card = document.createElement('article');
          card.className = 'recipe-card glass-panel-neon animate-fade-in duration-300 transform scale-98 transition-all relative overflow-hidden rounded-2xl border border-[#3DF2E0]/35 hover:border-[#3DF2E0]/70 shadow-[0_0_24px_rgba(61,242,224,0.22)] mb-4';
          card.id = cardId;
          card.setAttribute('data-recipe-id', slug);
          card.setAttribute('data-category', 'base-carb ' + (meal.group || targetGroup));
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
                  <span class="tag tag--red text-[10px] font-bold px-2 py-0.5 rounded bg-[#3DF2E0]/20 text-[#3DF2E0] border border-[#3DF2E0]/30">BASE / CARB</span>
                  <span class="tag tag--green text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600/25 text-emerald-400 border border-emerald-500/30">\${groupName}</span>
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
      window.renderBaseCarbCards = renderBaseCarbCards;

      function initBaseCarbFilterEngine() {
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');
        const poultryBtn = document.getElementById('primary-pill-poultry') || document.querySelector('[data-primary-filter="poultry"]');
        const poultryStrip = document.getElementById('poultry-subfilter-strip');
        const poultrySubPills = document.querySelectorAll('.subfilter-pill[data-poultry-sub]');
        const veggiesBtn = document.getElementById('primary-pill-veggies') || document.querySelector('[data-primary-filter="veggies"]');
        const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const veggiesSubPills = document.querySelectorAll('.subfilter-pill[data-veggies-sub]');
        const otherPrimaryPills = document.querySelectorAll('#primary-ingredients-row .filter-pill:not(#primary-pill-base-carb)');

        if (!carbBtn || !carbStrip) return;

        // ══════════════════════════════════════════════════════════════════════
        // STRICT INITIAL STATE MASKING
        // Ensure base/carb sub-category container is completely hidden on init
        // ══════════════════════════════════════════════════════════════════════
        carbStrip.style.display = 'none';
        carbStrip.classList.remove('visible');
        carbStrip.setAttribute('aria-hidden', 'true');

        // ══════════════════════════════════════════════════════════════════════
        // TIER 1 OPERATION: Tapping "Base / Carb"
        // - Instantly set active Neon Cyan style state
        // - Slide open sub-category scroll line directly underneath
        // - Close Poultry & Veggies sub-filter strips if open
        // - DO NOT execute API search queries or clear/populate feed yet!
        // ══════════════════════════════════════════════════════════════════════
        carbBtn.addEventListener('click', function (e) {
          e.preventDefault();
          const isCurrentlyActive = carbBtn.classList.contains('active');

          if (isCurrentlyActive) {
            // Condition A: Deactivate Base/Carb filter -> slide closed and restore default feed
            carbBtn.classList.remove('active');
            carbBtn.setAttribute('aria-expanded', 'false');
            carbStrip.style.display = 'none';
            carbStrip.classList.remove('visible');
            carbStrip.setAttribute('aria-hidden', 'true');
            carbSubPills.forEach(p => p.classList.remove('active'));
            renderCategoryFeed('all');
          } else {
            // Condition B: Activate Base/Carb filter -> open sub-strip, keep feed waiting for sub-selection
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
            carbBtn.classList.add('active');
            carbBtn.setAttribute('aria-expanded', 'true');
            carbStrip.style.display = 'flex';
            carbStrip.classList.add('visible');
            carbStrip.setAttribute('aria-hidden', 'false');
            carbSubPills.forEach(p => p.classList.remove('active'));
            // Tier 1 rule: DO NOT execute search queries or clear/populate feed yet!
          }
        });

        // ══════════════════════════════════════════════════════════════════════
        // TIER 2 OPERATION: Tapping a Sub-Pill ("Rice-Based", "Flour & Pasta", etc.)
        // - Toggle targeted sub-pill to active Neon Cyan
        // - Instantly trigger async fetch for the 10 recipes in that active group
        // - Clean feed refresh before rendering the 10 accurate visuals
        // ══════════════════════════════════════════════════════════════════════
        carbSubPills.forEach(pill => {
          pill.addEventListener('click', function (e) {
            e.preventDefault();
            const subGroup = pill.getAttribute('data-carb-sub');
            const isSelected = pill.classList.contains('active');

            if (isSelected) {
              // Deselect sub-filter
              pill.classList.remove('active');
            } else {
              // Select this sub-filter
              carbSubPills.forEach(p => p.classList.remove('active'));
              pill.classList.add('active');
              // Instantly fetch & render the 10 subcategory recipes
              renderBaseCarbCards(subGroup);
            }
          });
        });

        // Other primary pills hide carb sub-strip (Condition A)
        otherPrimaryPills.forEach(pill => {
          pill.addEventListener('click', function () {
            carbBtn.classList.remove('active');
            carbBtn.setAttribute('aria-expanded', 'false');
            carbStrip.style.display = 'none';
            carbStrip.classList.remove('visible');
            carbStrip.setAttribute('aria-hidden', 'true');
            carbSubPills.forEach(p => p.classList.remove('active'));
          });
        });
      }
      window.initBaseCarbFilterEngine = initBaseCarbFilterEngine;
`;

// Insert BASE_CARB_GROUPS right before wowPremiumImageRegistry
const targetRegistryStr = 'const wowPremiumImageRegistry = {';
if (content.includes(targetRegistryStr)) {
  content = content.replace(targetRegistryStr, baseCarbGroupsCode + '\n      ' + targetRegistryStr);
  console.log('Inserted BASE_CARB_GROUPS successfully.');
} else {
  console.error('Target wowPremiumImageRegistry not found');
  process.exit(1);
}

// Add the 40 Base/Carb images to wowPremiumImageRegistry
const registryEntries = `
        // 🍚 Rice-Based Classics (10 Famous Recipes)
        "Risotto alla Milanese": "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80",
        "Seafood Paella": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
        "Chicken Biryani": "assets/biryani.png",
        "Sushi Rolls (Maki)": "assets/sushi.png",
        "Sushi Rolls": "assets/sushi.png",
        "Nasi Goreng Indonesian": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "Nasi Goreng": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "Creamy Rice Pudding": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1200&q=80",
        "Classic Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
        "Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
        "Arancini Rice Balls": "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=1200&q=80",
        "Arancini": "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=1200&q=80",
        "Cajun Jambalaya Rice": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Jambalaya": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
        "Tahdig Persian Crisp Rice": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",
        "Tahdig": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",

        // 🌾 Wheat, Flour & Pasta Icons (10 Famous Recipes)
        "Spaghetti Carbonara": "assets/carbonara.png",
        "Neapolitan Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        "Tonkotsu Ramen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
        "Lasagna Bolognese": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1200&q=80",
        "Fettuccine Alfredo": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=1200&q=80",
        "Fluffy Garlic Naan": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
        "Garlic Naan": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
        "Homemade Sourdough Bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "Sourdough Bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "Penne alla Arrabbiata": "https://images.unsplash.com/photo-1621996346565-e3adc644d942?auto=format&fit=crop&w=1200&q=80",
        "Authentic Beef Pho": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80",
        "Beef Pho": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80",
        "Crispy Vegetable Gyoza": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80",
        "Vegetable Gyoza": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80",

        // 🥔 Potato-Centric Favorites (10 Famous Recipes)
        "Gnocchi di Patate": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
        "French Poutine": "https://images.unsplash.com/photo-1586805608485-add336722759?auto=format&fit=crop&w=1200&q=80",
        "Aloo Gobi": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
        "Spanish Tortilla de Patatas": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
        "Spanish Tortilla": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
        "Crispy French Fries": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=80",
        "French Fries": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=80",
        "Garlic Mashed Potatoes": "https://images.unsplash.com/photo-1633436375795-12b3b339712f?auto=format&fit=crop&w=1200&q=80",
        "Mashed Potatoes": "https://images.unsplash.com/photo-1633436375795-12b3b339712f?auto=format&fit=crop&w=1200&q=80",
        "Hasselback Potatoes": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80",
        "Loaded Baked Potato": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
        "Baked Potato": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
        "Crispy Potato Latkes": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80",
        "Potato Latkes": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80",

        // 🌽 Corn & Maize Staples (10 Famous Recipes)
        "Mexican Street Tacos": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Street Tacos": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Shrimp and Grits": "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
        "Polenta Concia": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80",
        "Polenta": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80",
        "Creamy Sweet Corn Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Sweet Corn Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "Venezuelan Arepas": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Arepas": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Golden Sweet Cornbread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "Sweet Cornbread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "Crispy Corn Fritters": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
        "Corn Fritters": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
        "Traditional Tamales": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Tamales": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
        "Mexican Elote Street Corn": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Elote Street Corn": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
        "Crispy Tortilla Chips": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=1200&q=80",
        "Tortilla Chips": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=1200&q=80",
`;

const poultryHeader = '// 🐔 Chicken Group (10 Items)';
if (content.includes(poultryHeader)) {
  content = content.replace(poultryHeader, registryEntries + '\n        ' + poultryHeader);
  console.log('Inserted registry entries successfully.');
} else {
  console.error('poultryHeader not found');
  process.exit(1);
}

// Insert baseCarbModuleCode right after initVeggiesFilterEngine
const targetVeggiesEndStr = 'window.initVeggiesFilterEngine = initVeggiesFilterEngine;';
if (content.includes(targetVeggiesEndStr)) {
  content = content.replace(targetVeggiesEndStr, targetVeggiesEndStr + '\n' + baseCarbModuleCode);
  console.log('Inserted baseCarbModuleCode successfully.');
} else {
  console.error('targetVeggiesEndStr not found');
  process.exit(1);
}

// Update poultry engine to also close base-carb strip
content = content.replace(
  `const veggiesStrip = document.getElementById('veggies-subfilter-strip');`,
  `const veggiesStrip = document.getElementById('veggies-subfilter-strip');
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');`
);

content = content.replace(
  `veggiesSubPills.forEach(p => p.classList.remove('active'));
            }`,
  `veggiesSubPills.forEach(p => p.classList.remove('active'));
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
            }`
);

// Update veggies engine to also close base-carb strip
content = content.replace(
  `const poultryStrip = document.getElementById('poultry-subfilter-strip');`,
  `const poultryStrip = document.getElementById('poultry-subfilter-strip');
        const carbBtn = document.getElementById('primary-pill-base-carb') || document.querySelector('[data-primary-filter="base-carb"]');
        const carbStrip = document.getElementById('base-carb-subfilter-strip');
        const carbSubPills = document.querySelectorAll('.subfilter-pill[data-carb-sub]');`
);

content = content.replace(
  `poultrySubPills.forEach(p => p.classList.remove('active'));
            }`,
  `poultrySubPills.forEach(p => p.classList.remove('active'));
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
            }`
);

// Update initDashboardFeedEngine to call initBaseCarbFilterEngine()
content = content.replace(
  `initVeggiesFilterEngine();`,
  `initVeggiesFilterEngine();
        initBaseCarbFilterEngine();`
);

fs.writeFileSync(dashPath, content, 'utf8');
console.log('dashboard.html fully updated with Base / Carb dual-tier system!');
