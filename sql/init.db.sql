-- ==========================================================
-- SQL script for recipe database
-- Author: Fess Myhre
-- ==========================================================

-- 1. Setup database
-- ----------------------------------------------------------
DROP DATABASE IF EXISTS recipe_db;
CREATE DATABASE recipe_db;
USE recipe_db;

-- 2. Create Ingredients Table
-- ----------------------------------------------------------
-- This table stores the master list of ingredients and 
-- the facts that will show up in the hover pop-ups.
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fact_title VARCHAR(100),
    fact_content TEXT
);

-- 3. Create Recipes Table
-- ----------------------------------------------------------
-- This table stores the core recipe details.
-- The 'main_protein' column allows you to filter by protein type.
CREATE TABLE recipes (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    main_protein ENUM('Chicken', 'Beef', 'Tofu', 'Grains', 'Fish') NOT NULL,
    prep_time_mins INT,
    -- This stores which ingredient is featured in this recipe
    featured_ingredient_id INT,
    FOREIGN KEY (featured_ingredient_id) REFERENCES ingredients(ingredient_id)
    ON DELETE SET NULL
);

-- 4. Seed data (initial population)
-- ----------------------------------------------------------

-- Populate ingredients table
INSERT INTO ingredients (name, fact_title, fact_content) VALUES
('Cumin', 'Origin', 'Cumin is native from the east Mediterranean to East India and has been used for over 5,000 years.'),
('Chicken Breast', 'Safety Tip', 'Always ensure poultry reaches an internal temperature of 165°F (74°C) to prevent foodborne illness.'),
('Firm Tofu', 'Quick Fact', 'Tofu is a great source of complete protein, containing all nine essential amino acids.'),
('Quinoa', 'Origin', 'Quinoa was considered the "mother of all grains" by the Inca Empire in the Andes Mountains.');

-- Populate recipes table
INSERT INTO recipes (title, description, instructions, main_protein, prep_time_mins, featured_ingredient_id) VALUES
('Spiced Cumin Chicken', 'A smoky and savory grilled chicken dish.', '1. Rub chicken with cumin. 2. Grill for 6 mins per side. 3. Serve with lime.', 'Chicken', 25, 2),
('Crispy Tofu Stir-fry', 'A quick vegetarian meal with a crunch.', '1. Press tofu. 2. Fry until golden. 3. Toss with soy sauce and veggies.', 'Tofu', 30, 3),
('Zesty Quinoa Salad', 'A refreshing grain-based bowl.', '1. Boil quinoa. 2. Mix with cucumbers, lemon, and cumin. 3. Chill before serving.', 'Grains', 15, 4);

-- 5. Verification Query
-- ----------------------------------------------------------
-- Run this to make sure the join works
SELECT r.title, r.main_protein, i.name AS highlighted_ingredient, i.fact_content
FROM recipes r
LEFT JOIN ingredients i ON r.featured_ingredient_id = i.ingredient_id;