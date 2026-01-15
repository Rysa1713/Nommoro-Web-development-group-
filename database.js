// Database service for handling user authentication and recipe management
class DatabaseService {
  constructor() {
    this.dbName = 'NommoroDB';
    this.dbVersion = 1;
    this.db = null;
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create users table
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('username', 'username', { unique: true });
          userStore.createIndex('email', 'email', { unique: true });
        }
        
        // Create recipes table
        if (!db.objectStoreNames.contains('recipes')) {
          const recipeStore = db.createObjectStore('recipes', { keyPath: 'id', autoIncrement: true });
          recipeStore.createIndex('title', 'title', { unique: false });
        }
        
        // Create saved_recipes table
        if (!db.objectStoreNames.contains('saved_recipes')) {
          const savedRecipeStore = db.createObjectStore('saved_recipes', { keyPath: 'id', autoIncrement: true });
          savedRecipeStore.createIndex('user_id', 'user_id', { unique: false });
          savedRecipeStore.createIndex('recipe_id', 'recipe_id', { unique: false });
          savedRecipeStore.createIndex('user_recipe', ['user_id', 'recipe_id'], { unique: true });
        }
      };
    });
  }

  // User authentication methods
  async registerUser(userData) {
    const transaction = this.db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    
    // Check if username exists
    const usernameCheck = await this.getUserByUsername(userData.username);
    if (usernameCheck) {
      throw new Error('Username already exists');
    }
    
    // Check if email exists
    const emailCheck = await this.getUserByEmail(userData.email);
    if (emailCheck) {
      throw new Error('Email already registered');
    }
    
    // Hash password (simple hash for demo - in production use proper hashing)
    userData.password = btoa(userData.password);
    userData.registeredAt = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      const request = store.add(userData);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async loginUser(username, password) {
    const user = await this.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Check password (simple comparison for demo)
    if (atob(user.password) !== password) {
      throw new Error('Invalid username or password');
    }
    
    // Don't return password in session
    const { password: _, ...userSession } = user;
    return userSession;
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('username');
      const request = index.get(username);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Recipe methods
  async saveRecipe(recipeData) {
    const transaction = this.db.transaction(['recipes'], 'readwrite');
    const store = transaction.objectStore('recipes');
    
    return new Promise((resolve, reject) => {
      const request = store.add(recipeData);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveUserRecipe(userId, recipeId, notes = '') {
    const transaction = this.db.transaction(['saved_recipes'], 'readwrite');
    const store = transaction.objectStore('saved_recipes');
    
    const savedRecipe = {
      user_id: userId,
      recipe_id: recipeId,
      notes: notes,
      saved_at: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.add(savedRecipe);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserSavedRecipes(userId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['saved_recipes', 'recipes'], 'readonly');
      const savedStore = transaction.objectStore('saved_recipes');
      const recipeStore = transaction.objectStore('recipes');
      const index = savedStore.index('user_id');
      const request = index.getAll(userId);
      
      request.onsuccess = async () => {
        const savedRecipes = request.result;
        const recipesWithDetails = [];
        
        for (const saved of savedRecipes) {
          const recipeRequest = recipeStore.get(saved.recipe_id);
          recipeRequest.onsuccess = () => {
            if (recipeRequest.result) {
              recipesWithDetails.push({
                ...recipeRequest.result,
                saved_at: saved.saved_at,
                notes: saved.notes
              });
            }
          };
        }
        
        resolve(recipesWithDetails);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async removeUserRecipe(userId, recipeId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['saved_recipes'], 'readwrite');
      const store = transaction.objectStore('saved_recipes');
      const index = store.index('user_recipe');
      const request = index.get([userId, recipeId]);
      
      request.onsuccess = () => {
        if (request.result) {
          const deleteRequest = store.delete(request.result.id);
          deleteRequest.onsuccess = () => resolve(true);
          deleteRequest.onerror = () => reject(deleteRequest.error);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Initialize database service
const dbService = new DatabaseService();
window.dbService = dbService;