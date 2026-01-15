// Global variables
let currentLanguage = 'en';
let selectedIngredients = [];
let activeFilters = [];
let recipes = [];
let filteredRecipes = [];

// Simple authentication system
function checkLoginStatus() {
    const userData = localStorage.getItem('nomorroUser');
    if (userData) {
        const user = JSON.parse(userData);
        showLoggedInState(user.name);
    }
}

function showLoggedInState(userName) {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
}

function logout() {
    localStorage.removeItem('nomorroUser');
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    if (loginBtn) loginBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
}

// Language translations
const translations = {
    en: {
        // Navigation
        home: "Home",
        recipes: "Recipes",
        pantry: "Pantry",
        dashboard: "Dashboard",
        login: "Login",
        
        // Recipe page
        recipesTitle: "RECIPES",
        canMake: "You can make 30 recipes!",
        doYouHave: "Do you have these?",
        vegan: "Vegan",
        under30: "Under 30 minutes",
        easy: "Easy",
        healthy: "Healthy",
        italian: "Italian",
        asian: "Asian",
        searchPlaceholder: "Search recipes, ingredients, or cooking methods...",
        pantryIngredients: "Pantry Ingredients",
        sustainability: "Sustainability",
        sdg12Title: "SDG 12: Responsible Consumption and Production",
        sdg12RecipeDesc: "Reduce food waste and promote sustainable cooking practices through smart recipe planning and ingredient management.",
        
        // Ingredients
        dairy: "Dairy",
        vegetables: "Vegetables",
        meat: "Meat",
        grains: "Grains & Pasta",
        milk: "Milk",
        cheese: "Cheese",
        butter: "Butter",
        yogurt: "Yogurt",
        cream: "Cream",
        sourCream: "Sour Cream",
        cottageCheese: "Cottage Cheese",
        mozzarella: "Mozzarella",
        tomatoes: "Tomatoes",
        onions: "Onions",
        garlic: "Garlic",
        carrots: "Carrots",
        bellPeppers: "Bell Peppers",
        broccoli: "Broccoli",
        spinach: "Spinach",
        mushrooms: "Mushrooms",
        potatoes: "Potatoes",
        lettuce: "Lettuce",
        cucumber: "Cucumber",
        zucchini: "Zucchini",
        chicken: "Chicken",
        beef: "Beef",
        pork: "Pork",
        turkey: "Turkey",
        salmon: "Salmon",
        tuna: "Tuna",
        shrimp: "Shrimp",
        groundBeef: "Ground Beef",
        bacon: "Bacon",
        sausage: "Sausage",
        rice: "Rice",
        pasta: "Pasta",
        bread: "Bread",
        flour: "Flour",
        oats: "Oats",
        quinoa: "Quinoa",
        noodles: "Noodles",
        tortillas: "Tortillas",
        eggs: "Eggs",
        oliveOil: "Olive Oil",
        salt: "Salt",
        pepper: "Pepper"
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing recipe page...');
    loadLanguage();
    initializeEventListeners();
    initializeRecipePage();
    checkLoginStatus();
});

// Language functions
function loadLanguage() {
    const savedLang = localStorage.getItem('language') || 'en';
    currentLanguage = savedLang;
    updateLanguageDisplay();
}

function updateLanguageDisplay() {
    // Update all elements with data-key attributes
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update placeholder texts
    const placeholderElements = document.querySelectorAll('[data-placeholder-key]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-placeholder-key');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
}

function initializeEventListeners() {
    // Initialize ingredient checkboxes
   const checkboxes = document.querySelectorAll('.category-items input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const ingredient = this.value;
        if (this.checked) {
            if (!selectedIngredients.includes(ingredient)) {
                selectedIngredients.push(ingredient);
            }
        } else {
            selectedIngredients = selectedIngredients.filter(ing => ing !== ingredient);
        }

        filterRecipes();
        updateIngredientCounts();
        renderClearPantryButton(); // <-- NEW: Update the Clear Pantry button
    });
});
}
        
// Recipe page specific functions
function initializeRecipePage() {
    console.log('Initializing recipe page...');
    loadRecipes();
    updateRecipeDisplay();
}

function loadRecipes() {
    // 30 Real recipes with external links
    recipes = [
        {
            id: 1,
            title: "Creamy Chicken Alfredo Pasta",
            description: "Rich and creamy pasta with tender chicken pieces",
            image: "https://midwestfoodieblog.com/wp-content/uploads/2023/07/chicken-alfredo-1-2.jpg",
            time: "25 min",
            difficulty: "Easy",
            ingredients: ["chicken", "pasta", "cream", "cheese", "garlic", "butter"],
            tags: ["italian", "easy", "under-30"],
            category: "Main Course",
            url: "https://www.recipetineats.com/one-pot-chicken-alfredo-pasta/"
        },
        {
            id: 2,
            title: "Beef Tacos",
            description: "Flavorful ground beef tacos with fresh toppings",
            image: "https://danosseasoning.com/wp-content/uploads/2022/03/Beef-Tacos-1024x767.jpg",
            time: "20 min",
            difficulty: "Easy",
            ingredients: ["ground-beef", "tortillas", "tomatoes", "onions", "cheese"],
            tags: ["mexican", "easy", "under-30"],
            category: "Main Course",
            url: "https://www.recipetineats.com/ground-beef-tacos-recipe/"
        },
        {
            id: 3,
            title: "Margherita Pizza",
            description: "Classic Italian pizza with fresh basil and mozzarella",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
            time: "30 min",
            difficulty: "Medium",
            ingredients: ["flour", "tomatoes", "mozzarella", "olive-oil", "garlic"],
            tags: ["italian", "vegetarian", "under-30"],
            category: "Main Course",
            url: "https://www.bbcgoodfood.com/recipes/pizza-margherita-4-easy-steps"
        },
        {
            id: 4,
            title: "Garlic Butter Salmon",
            description: "Pan-seared salmon with garlic butter sauce",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
            time: "18 min",
            difficulty: "Easy",
            ingredients: ["salmon", "garlic", "butter", "olive-oil"],
            tags: ["healthy", "easy", "under-30"],
            category: "Main Course",
            url: "https://cafedelites.com/garlic-butter-baked-salmon/"
        },
        {
            id: 5,
            title: "Vegetable Stir Fry",
            description: "Quick and healthy mixed vegetable stir fry",
            image: "https://natashaskitchen.com/wp-content/uploads/2020/08/Vegetable-Stir-Fry-SQ.jpg",
            time: "15 min",
            difficulty: "Easy",
            ingredients: ["broccoli", "carrots", "bell-peppers", "garlic", "olive-oil"],
            tags: ["vegan", "healthy", "asian", "under-30"],
            category: "Main Course",
            url: "https://www.recipetineats.com/vegetable-stir-fry/"
        },
        {
            id: 6,
            title: "Caesar Salad",
            description: "Fresh romaine lettuce with classic Caesar dressing",
            image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
            time: "10 min",
            difficulty: "Easy",
            ingredients: ["lettuce", "cheese", "garlic", "olive-oil", "eggs"],
            tags: ["easy", "under-30", "healthy"],
            category: "Salad",
            url: "https://www.loveandlemons.com/caesar-salad/"
        },
        {
            id: 7,
            title: "Chocolate Chip Cookies",
            description: "Soft and chewy cookies with chocolate chips",
            image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
            time: "22 min",
            difficulty: "Easy",
            ingredients: ["flour", "butter", "eggs", "milk"],
            tags: ["dessert", "sweet", "easy"],
            category: "Dessert",
            url: "https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/"
        },
        {
            id: 8,
            title: "Thai Green Curry",
            description: "Aromatic curry with coconut milk and vegetables",
            image: "https://hot-thai-kitchen.com/wp-content/uploads/2022/04/green-curry-new-sq-3.jpg",
            time: "28 min",
            difficulty: "Medium",
            ingredients: ["chicken", "bell-peppers", "garlic", "onions"],
            tags: ["thai", "curry", "asian"],
            category: "Main Course",
            url: "https://www.bbcgoodfood.com/recipes/thai-green-curry"
        },
        {
            id: 9,
            title: "Greek Yogurt Parfait",
            description: "Layered parfait with yogurt, berries, and granola",
            image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
            time: "5 min",
            difficulty: "Easy",
            ingredients: ["yogurt", "oats"],
            tags: ["healthy", "easy", "under-30"],
            category: "Breakfast",
            url: "hhttps://foolproofliving.com/layered-yogurt-parfait/"
        },
        {
            id: 10,
            title: "BBQ Pulled Beef",
            description: "Slow-cooked beef with tangy BBQ sauce",
            image: "https://www.peelwithzeal.com/wp-content/uploads/2023/01/BBQ-shredded-beef.jpg",
            time: "4 hours",
            difficulty: "Hard",
            ingredients: ["beef", "bread", "onions"],
            tags: ["bbq", "beef"],
            category: "Main Course",
            url: "https://www.thechunkychef.com/crockpot-shredded-beef-barbecue/"
        },
        {
            id: 11,
            title: "Avocado Toast",
            description: "Toasted bread topped with creamy avocado",
            image: "https://cdn.jwplayer.com/v2/media/MNay5QBU/poster.jpg?width=1280",
            time: "10 min",
            difficulty: "Easy",
            ingredients: ["bread", "olive-oil"],
            tags: ["vegan", "easy", "under-30"],
            category: "Breakfast",
            url: "https://www.loveandlemons.com/avocado-toast-recipe/"
        },
        {
            id: 12,
            title: "Shrimp Scampi",
            description: "Garlic butter shrimp with pasta",
            image: "https://bakerbynature.com/wp-content/uploads/2023/02/shrimp-scampi-119-500x500.jpg",
            time: "20 min",
            difficulty: "Medium",
            ingredients: ["shrimp", "pasta", "butter", "garlic", "olive-oil"],
            tags: ["seafood", "pasta", "under-30"],
            category: "Main Course",
            url: "https://cafedelites.com/garlic-butter-shrimp-scampi/"
        },
        {
            id: 13,
            title: "Chicken Fried Rice",
            description: "Asian-style fried rice with chicken and vegetables",
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
            time: "15 min",
            difficulty: "Easy",
            ingredients: ["rice", "chicken", "eggs", "carrots", "garlic"],
            tags: ["asian", "under-30", "easy"],
            category: "Main Course",
            url: "https://www.recipetineats.com/chicken-fried-rice/"
        },
        {
            id: 14,
            title: "Tomato Basil Soup",
            description: "Creamy tomato soup with fresh herbs",
            image: "https://www.cubesnjuliennes.com/wp-content/uploads/2022/09/Tomato-Basil-Soup-Recipe.jpg",
            time: "25 min",
            difficulty: "Easy",
            ingredients: ["tomatoes", "cream", "onions", "garlic", "olive-oil"],
            tags: ["soup", "vegetarian", "under-30"],
            category: "Soup",
            url: "https://www.allrecipes.com/recipe/39544/garden-fresh-tomato-soup/"
        },
        {
            id: 15,
            title: "Beef Stroganoff",
            description: "Creamy beef and mushroom sauce over noodles",
            image: "https://www.allrecipes.com/thmb/txgejbRaNYg1Pbzw87YKZsTAXYI=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/16311-simple-beef-stroganoff-DDMFS-4x3-1e966286eef54c0f96c882e569926eb3.jpg",
            time: "35 min",
            difficulty: "Medium",
            ingredients: ["beef", "mushrooms", "cream", "onions", "noodles"],
            tags: ["beef", "comfort-food"],
            category: "Main Course",
            url: "https://www.recipetineats.com/beef-stroganoff/"
        },
        {
            id: 16,
            title: "Pancakes",
            description: "Fluffy buttermilk pancakes",
            image: "https://www.allrecipes.com/thmb/FE0PiuuR0Uh06uVh1c2AsKjRGbc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_002-0e249c95678f446291ebc9408ae64c05.jpg",
            time: "20 min",
            difficulty: "Easy",
            ingredients: ["flour", "milk", "eggs", "butter"],
            tags: ["breakfast", "easy", "under-30"],
            category: "Breakfast",
            url: "https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/"
        },
        {
            id: 17,
            title: "Caprese Salad",
            description: "Fresh tomatoes with mozzarella and basil",
            image: "https://www.nonguiltypleasures.com/wp-content/uploads/2025/01/pesto-caprese-salad.jpg",
            time: "10 min",
            difficulty: "Easy",
            ingredients: ["tomatoes", "mozzarella", "olive-oil"],
            tags: ["salad", "vegetarian", "italian", "under-30"],
            category: "Salad",
            url: "https://www.loveandlemons.com/caprese-salad/"
        },
        {
            id: 18,
            title: "Grilled Cheese Sandwich",
            description: "Classic grilled cheese with butter and cheese",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vj3-uBCjNn2SmI5jxio6gSI5yeHciXOZ3w&s",
            time: "10 min",
            difficulty: "Easy",
            ingredients: ["bread", "cheese", "butter"],
            tags: ["easy", "under-30", "comfort-food"],
            category: "Snack",
            url: "https://www.recipetineats.com/grilled-cheese-sandwich/"
        },
        {
            id: 19,
            title: "Quinoa Bowl",
            description: "Healthy quinoa bowl with vegetables",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            time: "20 min",
            difficulty: "Easy",
            ingredients: ["quinoa", "tomatoes", "spinach", "olive-oil"],
            tags: ["healthy", "vegetarian", "under-30"],
            category: "Healthy",
            url: "https://www.loveandlemons.com/quinoa-bowl-recipe/"
        },
        {
            id: 20,
            title: "Chicken Teriyaki",
            description: "Sweet and savory glazed chicken",
            image: "https://www.onceuponachef.com/images/2024/01/chicken-teriyaki.jpg",
            time: "25 min",
            difficulty: "Easy",
            ingredients: ["chicken", "garlic", "onions"],
            tags: ["asian", "easy", "under-30"],
            category: "Main Course",
            url: "https://www.tamingtwins.com/simple-sticky-midweek-chicken-teriyaki-recipe/"
        },
        {
            id: 21,
            title: "Mushroom Risotto",
            description: "Creamy Italian rice with mushrooms",
            image: "https://www.allrecipes.com/thmb/854efwMYEwilYjKr0FiF4FkwBvM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/85389-gourmet-mushroom-risotto-DDMFS-4x3-a8a80a8deb064c6a8f15452b808a0258.jpg",
            time: "35 min",
            difficulty: "Medium",
            ingredients: ["rice", "mushrooms", "cheese", "butter", "onions"],
            tags: ["italian", "vegetarian"],
            category: "Main Course",
            url: "https://www.bbcgoodfood.com/recipes/mushroom-risotto"
        },
        {
            id: 22,
            title: "Fish Tacos",
            description: "Grilled fish with fresh toppings in tortillas",
            image: "https://www.ourhappymess.com/wp-content/uploads/2024/06/Fish-Tacos-with-Mango-Salsa-square-featured.jpg",
            time: "20 min",
            difficulty: "Easy",
            ingredients: ["salmon", "tortillas", "tomatoes", "onions"],
            tags: ["healthy", "mexican", "under-30"],
            category: "Main Course",
            url: "https://natashaskitchen.com/fish-tacos-recipe/"
        },
        {
            id: 23,
            title: "Vegetable Curry",
            description: "Spiced vegetable curry with coconut",
            image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2023/07/vegetable-curry-recipe.jpg",
            time: "30 min",
            difficulty: "Medium",
            ingredients: ["potatoes", "carrots", "onions", "garlic", "tomatoes"],
            tags: ["vegan", "healthy", "curry"],
            category: "Main Course",
            url: "https://www.indianhealthyrecipes.com/mixed-vegetable-curry/"
        },
        {
            id: 24,
            title: "Chicken Noodle Soup",
            description: "Comforting soup with chicken and noodles",
            image: "https://www.recipetineats.com/tachyon/2017/05/Chicken-Noodle-Soup-from-scratch_3.jpg",
            time: "40 min",
            difficulty: "Easy",
            ingredients: ["chicken", "noodles", "carrots", "onions", "garlic"],
            tags: ["soup", "comfort-food", "easy"],
            category: "Soup",
            url: "https://www.allrecipes.com/recipe/26460/quick-and-easy-chicken-noodle-soup/"
        },
        {
            id: 25,
            title: "Stuffed Bell Peppers",
            description: "Bell peppers stuffed with rice and ground beef",
            image: "https://recipesbyclare.com/assets/images/1747327156262-khaoaz0l.webp",
            time: "45 min",
            difficulty: "Medium",
            ingredients: ["bell-peppers", "ground-beef", "rice", "onions", "cheese"],
            tags: ["comfort-food", "healthy"],
            category: "Main Course",
            url: "https://www.budgetbytes.com/stuffed-bell-peppers/"
        },
        {
            id: 26,
            title: "Tuna Salad",
            description: "Fresh tuna salad with vegetables",
            image: "https://littlespoonfarm.com/wp-content/uploads/2021/08/tuna-salad-recipe-card.jpg",
            time: "10 min",
            difficulty: "Easy",
            ingredients: ["tuna", "lettuce", "tomatoes", "olive-oil"],
            tags: ["healthy", "easy", "under-30"],
            category: "Salad",
            url: "https://downshiftology.com/recipes/tuna-salad/"
        },
        {
            id: 27,
            title: "Grilled salmon",
            description: "Juicy pan-seared grilled salmon",
            image: "https://hips.hearstapps.com/hmg-prod/images/how-to-grill-salmon-recipe2-1655870552.jpg",
            time: "25 min",
            difficulty: "Medium",
            ingredients: ["salmon", "garlic", "butter", "olive-oil"],
            tags: ["easy", "under-30"],
            category: "Main Course",
            url: "https://www.allrecipes.com/recipe/12720/grilled-salmon-i/"
        },
        {
            id: 28,
            title: "Vegetable Soup",
            description: "Hearty soup with mixed vegetables",
            image: "https://static01.nyt.com/images/2023/10/12/multimedia/LH-vegetable-soup-ckfp-copy/LH-vegetable-soup-ckfp-mediumSquareAt3X.jpg",
            time: "35 min",
            difficulty: "Easy",
            ingredients: ["carrots", "potatoes", "onions", "garlic", "tomatoes"],
            tags: ["vegan", "healthy", "soup"],
            category: "Soup",
            url: "https://www.inspiredtaste.net/37646/vegetable-soup-recipe/"
        },
        {
            id: 29,
            title: "Chicken Caesar Wrap",
            description: "Grilled chicken with Caesar dressing in tortilla",
            image: "https://www.erinliveswhole.com/wp-content/uploads/2023/04/chicken-caesar-wraps-9.jpg",
            time: "15 min",
            difficulty: "Easy",
            ingredients: ["chicken", "tortillas", "lettuce", "cheese"],
            tags: ["easy", "under-30", "healthy"],
            category: "Main Course",
            url: "https://www.tasteandtellblog.com/chicken-caesar-wraps/"
        },
        {
            id: 30,
            title: "Turkey Sandwich",
            description: "Classic turkey sandwich with fresh vegetables",
            image: "https://www.spendwithpennies.com/wp-content/uploads/2023/10/Turkey-Sandwich-SpendWithPennies-4-500x500.jpg",
            time: "5 min",
            difficulty: "Easy",
            ingredients: ["turkey", "bread", "tomatoes", "lettuce"],
            tags: ["easy", "under-30", "healthy"],
            category: "Snack",
            url: "https://www.favfamilyrecipes.com/turkey-sandwich/"
        }
    ];
    
    filteredRecipes = [...recipes];
    console.log('Loaded', recipes.length, 'recipes');
}

function updateRecipeDisplay() {
    const grid = document.getElementById('recipeGrid');
    if (!grid) {
        console.error('Recipe grid not found');
        return;
    }
    
    grid.innerHTML = '';
    
    filteredRecipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        grid.appendChild(card);
    });
    
    updateResultCount();
    console.log('Displayed', filteredRecipes.length, 'recipes');
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'">
        <div class="recipe-content">
            <h3 class="recipe-title">${recipe.title}</h3>
            <p class="recipe-description">${recipe.description}</p>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time}</span>
                <span>👨‍🍳 ${recipe.difficulty}</span>
            </div>
            <div class="recipe-ingredients">
                <h4>Key Ingredients:</h4>
                <div class="ingredient-tags">
                    ${recipe.ingredients.slice(0, 3).map(ing => `<span class="ingredient-tag">${ing.replace('-', ' ')}</span>`).join('')}
                </div>
            </div>
            <div class="recipe-actions">
                <button class="action-btn view-btn" onclick="viewRecipe(${recipe.id})">View Recipe</button>
                <button class="action-btn share-btn" onclick="shareRecipe(${recipe.id})">Share</button>
            </div>
        </div>
    `;
    
    return card;
}

function updateResultCount() {
    const countElement = document.getElementById('resultCount');
    if (countElement) {
        countElement.textContent = `You can make ${filteredRecipes.length} recipes!`;
    }
}

// Recipe actions
function viewRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    if (recipe && recipe.url) {
        window.open(recipe.url, '_blank');
    } else {
        alert(`Recipe ${id} - External link not available`);
    }
}

function saveRecipe(id) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    if (!savedRecipes.includes(id)) {
        savedRecipes.push(id);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        alert('Recipe saved!');
    } else {
        alert('Recipe already saved!');
    }
}

function rateRecipe(id) {
    const rating = prompt('Rate this recipe (1-5 stars):');
    if (rating && rating >= 1 && rating <= 5) {
        alert(`You rated this recipe ${rating} stars!`);
    }
}

function shareRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    if (navigator.share && recipe) {
        navigator.share({
            title: recipe.title,
            text: `Check out this recipe: ${recipe.title}`,
            url: recipe.url || window.location.href
        });
    } else if (recipe && recipe.url) {
        navigator.clipboard.writeText(recipe.url);
        alert('Recipe link copied to clipboard!');
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Page link copied to clipboard!');
    }
}

// Filter functions
function toggleFilter(filter) {
    const button = document.querySelector(`[data-filter="${filter}"]`);
    if (activeFilters.includes(filter)) {
        activeFilters = activeFilters.filter(f => f !== filter);
        if (button) button.classList.remove('active');
    } else {
        activeFilters.push(filter);
        if (button) button.classList.add('active');
    }
    
    updateActiveFiltersDisplay();
    filterRecipes();
}

function updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    container.innerHTML = '';
    activeFilters.forEach(filter => {
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            ${filter}
            <button class="remove-filter" onclick="removeFilter('${filter}')">×</button>
        `;
        container.appendChild(filterElement);
    });
}

function removeFilter(filter) {
    activeFilters = activeFilters.filter(f => f !== filter);
    const button = document.querySelector(`[data-filter="${filter}"]`);
    if (button) button.classList.remove('active');
    updateActiveFiltersDisplay();
    filterRecipes();
}

function searchRecipes() {
    const searchInput = document.getElementById('globalSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    filterRecipes(searchTerm);
}

function filterRecipes(searchTerm = '') {
    filteredRecipes = recipes.filter(recipe => {
        // Search term filter
        const matchesSearch = !searchTerm || 
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
        
        // Active filters
        const matchesFilters = activeFilters.length === 0 ||
            activeFilters.some(filter => 
                recipe.tags.includes(filter) ||
                recipe.difficulty.toLowerCase() === filter ||
                recipe.category.toLowerCase().includes(filter)
            );
        
        // Selected ingredients - recipe must contain ANY of the selected ingredients
        const matchesIngredients = selectedIngredients.length === 0 ||
            selectedIngredients.some(ingredient => 
                recipe.ingredients.some(recipeIng => 
                    recipeIng.toLowerCase().includes(ingredient.toLowerCase()) ||
                    ingredient.toLowerCase().includes(recipeIng.toLowerCase())
                )
            );

        // Return true only if all conditions are met
        return matchesSearch && matchesFilters && matchesIngredients;
    });
    
    updateRecipeDisplay();
}

// Category toggle functions
function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId);
    const header = category.previousElementSibling;
    
    if (category.classList.contains('show')) {
        category.classList.remove('show');
        header.classList.remove('open');
    } else {
        category.classList.add('show');
        header.classList.add('open');
    }
}

// Suggestion functions
function addSuggestion(ingredient) {
    if (!selectedIngredients.includes(ingredient)) {
        selectedIngredients.push(ingredient);
        
        // Check the corresponding checkbox if it exists
        const checkbox = document.querySelector(`input[type="checkbox"][value="${ingredient}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
        
        filterRecipes();
        updateIngredientCounts();
    }
}

function updateIngredientCounts() {
    // Update counts for each category
    const categories = ['dairy', 'vegetables', 'meat', 'grains'];
    categories.forEach(category => {
        const inputs = document.querySelectorAll(`#${category} input[type="checkbox"]`);
        const checkedInputs = document.querySelectorAll(`#${category} input[type="checkbox"]:checked`);
        const countElement = document.getElementById(`${category}Count`);
        if (countElement) {
            countElement.textContent = `(${checkedInputs.length}/${inputs.length})`;
        }
    });
}

function renderClearPantryButton() {
    const container = document.getElementById('clearPantryContainer');
    if (!container) return;

    container.innerHTML = ''; // Remove previous button if any

    if (selectedIngredients.length > 0) {
        const button = document.createElement('button');
        button.textContent = ' Clear Pantry x';
        button.className = 'clear-pantry-btn';
        button.onclick = () => {
            selectedIngredients = [];

            // Uncheck all ingredient checkboxes
            const checkboxes = document.querySelectorAll('.category-items input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);

            filterRecipes();
            updateIngredientCounts();
            renderClearPantryButton(); // Hide the button after clearing
        };

        container.appendChild(button);
    }
}