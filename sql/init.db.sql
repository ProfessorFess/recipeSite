-- 1. Database
-- ----------------------------------------------------------
DROP DATABASE IF EXISTS recipe_db;
CREATE DATABASE recipe_db;
USE recipe_db;

-- 2. Ingredients (master list and facts for hover pop-ups)
-- ----------------------------------------------------------
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fact_title VARCHAR(100),
    fact_content TEXT
);

-- 3. Recipes
-- ----------------------------------------------------------
CREATE TABLE recipes (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    main_protein ENUM(
        'Chicken',
        'Beef',
        'Pork',
        'Turkey',
        'Duck',
        'Fish',
        'Salmon',
        'Tuna',
        'Cod',
        'Shrimp',
        'Shellfish',
        'Crab',
        'Lobster',
        'Eggs',
        'Tofu',
        'Tempeh',
        'Seitan',
        'Grains',
        'Quinoa',
        'Lentils',
        'Beans',
        'Chickpeas',
        'Lamb',
        'Venison',
        'Sausage',
        'Ham',
        'Bacon',
        'Salami',
        'Plant-based Meat',
        'Impossible Burger',
        'Beyond Meat',
        'Vegan Protein',
        'Paneer',
        'Cottage Cheese',
        'Cheese',
        'Yogurt',
        'Goose',
        'Rabbit',
        'Other'
    ) NOT NULL,
    prep_time_mins INT
);

-- 4. Recipe–ingredients junction (many ingredients per recipe)
-- ----------------------------------------------------------
CREATE TABLE recipe_ingredients (
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity VARCHAR(50) NULL,
    unit VARCHAR(30) NULL,
    sort_order INT NULL DEFAULT 0,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
);

-- 5. Seed: ingredients
-- ----------------------------------------------------------
INSERT INTO ingredients (name, fact_title, fact_content) VALUES
('Cumin', 'Origin', 'Cumin is native from the east Mediterranean to East India and has been used for over 5,000 years.'),
('Chicken Breast', 'Safety Tip', 'Always ensure poultry reaches an internal temperature of 165°F (74°C) to prevent foodborne illness.'),
('Firm Tofu', 'Quick Fact', 'Tofu is a great source of complete protein, containing all nine essential amino acids.'),
('Quinoa', 'Origin', 'Quinoa was considered the "mother of all grains" by the Inca Empire in the Andes Mountains.');

-- 6. Seed: recipes
-- ----------------------------------------------------------
INSERT INTO recipes (title, description, instructions, main_protein, prep_time_mins) VALUES
('Spiced Cumin Chicken', 'A smoky and savory grilled chicken dish.', '1. Rub chicken with cumin. 2. Grill for 6 mins per side. 3. Serve with lime.', 'Chicken', 25),
('Crispy Tofu Stir-fry', 'A quick vegetarian meal with a crunch.', '1. Press tofu. 2. Fry until golden. 3. Toss with soy sauce and veggies.', 'Tofu', 30),
('Zesty Quinoa Salad', 'A refreshing grain-based bowl.', '1. Boil quinoa. 2. Mix with cucumbers, lemon, and cumin. 3. Chill before serving.', 'Grains', 15);

-- 7. Seed: recipe_ingredients
-- ----------------------------------------------------------
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, sort_order) VALUES
(1, 2, NULL, NULL, 0),
(1, 1, NULL, NULL, 1),
(2, 3, NULL, NULL, 0),
(3, 4, NULL, NULL, 0),
(3, 1, NULL, NULL, 1);