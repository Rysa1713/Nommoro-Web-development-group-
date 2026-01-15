
-- NOMMORO Recipe Sharing Platform Database
-- MySQL Database Structure

-- Create database
CREATE DATABASE IF NOT EXISTS nommoro_db;
USE nommoro_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    language_preference VARCHAR(5) DEFAULT 'en'
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ingredients table
CREATE TABLE ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    description TEXT,
    image_url VARCHAR(255),
    nutritional_info JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Recipes table
CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    prep_time INT, -- in minutes
    cook_time INT, -- in minutes
    total_time INT, -- in minutes
    servings INT,
    difficulty_level ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Easy',
    cuisine_type VARCHAR(50),
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Recipe ingredients junction table
CREATE TABLE recipe_ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

-- Recipe tags table
CREATE TABLE recipe_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT,
    tag_name VARCHAR(50),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_tag_name (tag_name)
);

-- User pantry table
CREATE TABLE user_pantry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    ingredient_id INT,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    expiry_date DATE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
    UNIQUE KEY unique_user_ingredient (user_id, ingredient_id)
);

-- Saved recipes table
CREATE TABLE saved_recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    recipe_id INT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe (user_id, recipe_id)
);

-- Recipe ratings table
CREATE TABLE recipe_ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    recipe_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe_rating (user_id, recipe_id)
);

-- Recipe views table for analytics
CREATE TABLE recipe_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT,
    user_id INT NULL, -- NULL for anonymous views
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Cooking sessions table
CREATE TABLE cooking_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    recipe_id INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    status ENUM('started', 'completed', 'abandoned') DEFAULT 'started',
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- User preferences table
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    dietary_restrictions JSON, -- e.g., ["vegetarian", "gluten-free"]
    allergies JSON, -- e.g., ["nuts", "dairy"]
    preferred_cuisines JSON, -- e.g., ["italian", "asian"]
    difficulty_preference ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Easy',
    max_cook_time INT DEFAULT 60, -- in minutes
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert initial categories
INSERT INTO categories (name, description) VALUES
('Dairy', 'Milk, cheese, yogurt and other dairy products'),
('Vegetables', 'Fresh and frozen vegetables'),
('Meat', 'Beef, chicken, pork, fish and seafood'),
('Grains & Pasta', 'Rice, pasta, bread, flour and grains'),
('Fruits', 'Fresh and dried fruits'),
('Herbs & Spices', 'Cooking herbs and spices'),
('Pantry Staples', 'Oil, vinegar, salt, sugar and basic ingredients'),
('Beverages', 'Drinks and liquid ingredients');

-- Insert common ingredients
INSERT INTO ingredients (name, category_id) VALUES
-- Dairy
('Milk', 1), ('Cheese', 1), ('Butter', 1), ('Yogurt', 1), ('Cream', 1), 
('Sour Cream', 1), ('Cottage Cheese', 1), ('Mozzarella', 1),
-- Vegetables
('Tomatoes', 2), ('Onions', 2), ('Garlic', 2), ('Carrots', 2), 
('Bell Peppers', 2), ('Broccoli', 2), ('Spinach', 2), ('Mushrooms', 2),
('Potatoes', 2), ('Lettuce', 2), ('Cucumber', 2), ('Zucchini', 2),
-- Meat
('Chicken', 3), ('Beef', 3), ('Pork', 3), ('Turkey', 3), ('Salmon', 3),
('Tuna', 3), ('Shrimp', 3), ('Ground Beef', 3), ('Bacon', 3), ('Sausage', 3),
-- Grains & Pasta
('Rice', 4), ('Pasta', 4), ('Bread', 4), ('Flour', 4), ('Oats', 4),
('Quinoa', 4), ('Noodles', 4), ('Tortillas', 4),
-- Pantry Staples
('Eggs', 7), ('Olive Oil', 7), ('Salt', 7), ('Pepper', 7);

-- Insert sample recipes
INSERT INTO recipes (title, description, instructions, prep_time, cook_time, total_time, servings, difficulty_level, cuisine_type, image_url, created_by) VALUES
('Creamy Chicken Alfredo Pasta', 'Rich and creamy pasta with tender chicken pieces', 
'1. Cook pasta according to package directions. 2. Season and cook chicken until golden. 3. Make alfredo sauce with butter, cream, and cheese. 4. Combine pasta, chicken, and sauce.', 
15, 25, 40, 4, 'Easy', 'Italian', 'https://img.youtube.com/vi/ZvgwceROdTY/maxresdefault.jpg', 1),

('Spicy Beef Tacos', 'Flavorful beef tacos with fresh toppings',
'1. Brown ground beef with spices. 2. Warm tortillas. 3. Prepare fresh toppings. 4. Assemble tacos with beef and toppings.',
10, 15, 25, 6, 'Easy', 'Mexican', 'https://img.youtube.com/vi/qweh3aDnqWs/maxresdefault.jpg', 1),

('Vegetarian Pizza Margherita', 'Classic Italian pizza with fresh basil and mozzarella',
'1. Prepare pizza dough. 2. Make tomato sauce. 3. Assemble pizza with sauce, cheese, and basil. 4. Bake until golden.',
20, 15, 35, 2, 'Medium', 'Italian', 'https://img.youtube.com/vi/1-SJGQ2HLp8/maxresdefault.jpg', 1);

-- Insert recipe ingredients relationships
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
-- Chicken Alfredo Pasta
(1, 23, 1, 'lb'), -- Chicken
(1, 22, 1, 'lb'), -- Pasta
(1, 5, 1, 'cup'), -- Cream
(1, 2, 0.5, 'cup'), -- Cheese
(1, 11, 3, 'cloves'), -- Garlic
-- Spicy Beef Tacos
(2, 28, 1, 'lb'), -- Ground Beef
(2, 32, 8, 'pieces'), -- Tortillas
(2, 9, 2, 'medium'), -- Tomatoes
(2, 10, 1, 'medium'), -- Onions
(2, 2, 0.5, 'cup'), -- Cheese
-- Pizza Margherita
(3, 26, 2, 'cups'), -- Flour
(3, 9, 4, 'medium'), -- Tomatoes
(3, 8, 8, 'oz'), -- Mozzarella
(3, 34, 2, 'tbsp'); -- Olive Oil

-- Insert recipe tags
INSERT INTO recipe_tags (recipe_id, tag_name) VALUES
(1, 'italian'), (1, 'pasta'), (1, 'chicken'), (1, 'creamy'), (1, 'easy'),
(2, 'mexican'), (2, 'beef'), (2, 'spicy'), (2, 'quick'), (2, 'easy'),
(3, 'italian'), (3, 'vegetarian'), (3, 'pizza'), (3, 'classic'), (3, 'medium');

-- Create indexes for better performance
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty_level);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine_type);
CREATE INDEX idx_recipes_created_by ON recipes(created_by);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
CREATE INDEX idx_user_pantry_user ON user_pantry(user_id);
CREATE INDEX idx_saved_recipes_user ON saved_recipes(user_id);
CREATE INDEX idx_recipe_ratings_recipe ON recipe_ratings(recipe_id);
CREATE INDEX idx_recipe_views_recipe ON recipe_views(recipe_id);

-- Create a view for recipe search with ratings
CREATE VIEW recipe_search_view AS
SELECT 
    r.id,
    r.title,
    r.description,
    r.prep_time,
    r.cook_time,
    r.total_time,
    r.servings,
    r.difficulty_level,
    r.cuisine_type,
    r.image_url,
    r.video_url,
    r.created_at,
    AVG(rt.rating) as average_rating,
    COUNT(rt.rating) as rating_count,
    COUNT(sv.id) as save_count,
    GROUP_CONCAT(DISTINCT rt_tags.tag_name) as tags,
    GROUP_CONCAT(DISTINCT CONCAT(i.name, ':', ri.quantity, ' ', ri.unit)) as ingredients_list
FROM recipes r
LEFT JOIN recipe_ratings rt ON r.id = rt.recipe_id
LEFT JOIN saved_recipes sv ON r.id = sv.recipe_id
LEFT JOIN recipe_tags rt_tags ON r.id = rt_tags.recipe_id
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
LEFT JOIN ingredients i ON ri.ingredient_id = i.id
WHERE r.is_active = TRUE
GROUP BY r.id;

-- Stored procedure to get recipes by available ingredients
DELIMITER $$
CREATE PROCEDURE GetRecipesByIngredients(IN ingredient_list TEXT)
BEGIN
    SET @sql = CONCAT('
        SELECT DISTINCT r.*, 
               COUNT(ri.ingredient_id) as matching_ingredients,
               (COUNT(ri.ingredient_id) * 100.0 / (
                   SELECT COUNT(*) FROM recipe_ingredients ri2 WHERE ri2.recipe_id = r.id
               )) as match_percentage
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE i.name IN (', ingredient_list, ')
        AND r.is_active = TRUE
        GROUP BY r.id
        ORDER BY matching_ingredients DESC, match_percentage DESC
    ');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$
DELIMITER ;

-- Function to calculate recipe difficulty score
DELIMITER $$
CREATE FUNCTION CalculateDifficultyScore(recipe_id INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE ingredient_count INT DEFAULT 0;
    DECLARE total_time INT DEFAULT 0;
    DECLARE difficulty_score INT DEFAULT 0;
    
    SELECT COUNT(*), r.total_time
    INTO ingredient_count, total_time
    FROM recipe_ingredients ri
    JOIN recipes r ON ri.recipe_id = r.id
    WHERE ri.recipe_id = recipe_id;
    
    SET difficulty_score = ingredient_count + (total_time / 10);
    
    RETURN difficulty_score;
END$$
DELIMITER ;

-- Trigger to automatically update recipe total_time
DELIMITER $$
CREATE TRIGGER update_recipe_total_time
    BEFORE UPDATE ON recipes
    FOR EACH ROW
BEGIN
    IF NEW.prep_time IS NOT NULL AND NEW.cook_time IS NOT NULL THEN
        SET NEW.total_time = NEW.prep_time + NEW.cook_time;
    END IF;
END$$
DELIMITER ;

-- Create user for the application
CREATE USER IF NOT EXISTS 'nommoro_app'@'localhost' IDENTIFIED BY 'nommoro_secure_password_2024';
GRANT SELECT, INSERT, UPDATE, DELETE ON nommoro_db.* TO 'nommoro_app'@'localhost';
FLUSH PRIVILEGES;
