const express = require('express');
const app = express();
const db = require('./config/db');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// home page route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// recipe listing page with db connection
app.get('/recipes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM recipes');
        res.render('recipes', { recipes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/recipe/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const [rows] = await db.query('SELECT * FROM recipes WHERE recipe_id = ?', [recipeId]);
        if (rows.length === 0) {
            return res.status(404).send('Recipe not found');
        }
        const [ingredientRows] = await db.query(
            `SELECT i.name, i.fact_title, i.fact_content, ri.quantity, ri.unit
             FROM recipe_ingredients ri
             JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
             WHERE ri.recipe_id = ?
             ORDER BY ri.sort_order`,
            [recipeId]
        );
        res.render('recipe', { recipe: rows[0], ingredients: ingredientRows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

const MAIN_PROTEIN_OPTIONS = [
    'Chicken', 'Beef', 'Pork', 'Turkey', 'Duck',
    'Fish', 'Salmon', 'Tuna', 'Cod',
    'Shrimp', 'Shellfish', 'Crab', 'Lobster',
    'Eggs', 'Tofu', 'Tempeh', 'Seitan',
    'Grains', 'Quinoa', 'Lentils', 'Beans', 'Chickpeas',
    'Lamb', 'Venison', 'Sausage', 'Ham', 'Bacon', 'Salami',
    'Plant-based Meat', 'Impossible Burger', 'Beyond Meat', 'Vegan Protein',
    'Paneer', 'Cottage Cheese', 'Cheese', 'Yogurt',
    'Goose', 'Rabbit', 'Other'
];

app.get('/add-recipe', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ingredients');
        res.render('add-recipe', { ingredients: rows, mainProteinOptions: MAIN_PROTEIN_OPTIONS });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

// POST method to add recipes to db
app.post('/recipe/add', async (req, res) => {
    try {
        const {
            title,
            description,
            instructions,
            main_protein,
            prep_time_mins
        } = req.body;

        const sql = `
            INSERT INTO recipes (title, description, instructions, main_protein, prep_time_mins)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            title,
            description,
            instructions,
            main_protein,
            prep_time_mins || null
        ]);

        const newRecipeId = result.insertId;

        // Normalize ingredient_ids to array (repeated name or single value)
        let ingredientIds = req.body.ingredient_ids;
        if (ingredientIds == null) ingredientIds = [];
        if (!Array.isArray(ingredientIds)) ingredientIds = [ingredientIds];
        const ids = ingredientIds.filter(id => id !== '' && id != null).map(id => parseInt(id, 10)).filter(n => !isNaN(n));

        for (let i = 0; i < ids.length; i++) {
            await db.query(
                'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, sort_order) VALUES (?, ?, NULL, NULL, ?)',
                [newRecipeId, ids[i], i]
            );
        }

        res.redirect(`/recipe/${newRecipeId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving recipe');
    }
});

app.get('/ingredients', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ingredients ORDER BY name');
        res.render('ingredients', { ingredients: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.delete('/recipe/delete/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const [result] = await db.query('DELETE FROM recipes WHERE recipe_id = ?', [recipeId]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).send('Recipe deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting recipe');
    }
});

app.post('/ingredient/add', async (req, res) => {
    try {
        const { name, fact_title, fact_content } = req.body;

        // Basic validation
        if (!name || name.trim().length === 0) {
            return res.status(400).send('Ingredient name is required');
        }

        const sql = `
            INSERT INTO ingredients (name, fact_title, fact_content)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            name.trim(),
            fact_title ? fact_title.trim() : null,
            fact_content ? fact_content.trim() : null
        ]);

        // Optionally redirect or return success JSON
        res.status(201).json({
            ingredient_id: result.insertId,
            name: name.trim(),
            fact_title: fact_title ? fact_title.trim() : null,
            fact_content: fact_content ? fact_content.trim() : null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding ingredient');
    }
});

app.post('/ingredient/edit/:id', async (req, res) => {
    try {
        const ingredientId = req.params.id;
        const { name, fact_title, fact_content } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).send('Ingredient name is required');
        }

        const sql = `
            UPDATE ingredients
            SET name = ?, fact_title = ?, fact_content = ?
            WHERE ingredient_id = ?
        `;

        const [result] = await db.query(sql, [
            name.trim(),
            fact_title ? fact_title.trim() : null,
            fact_content ? fact_content.trim() : null,
            ingredientId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Ingredient not found');
        }

        res.json({
            ingredient_id: ingredientId,
            name: name.trim(),
            fact_title: fact_title ? fact_title.trim() : null,
            fact_content: fact_content ? fact_content.trim() : null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating ingredient');
    }
});

app.delete('/ingredient/delete/:id', async (req, res) => {
    try {
        const ingredientId = req.params.id;
        const [result] = await db.query('DELETE FROM ingredients WHERE ingredient_id = ?', [ingredientId]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Ingredient not found');
        }
        res.status(200).send('Ingredient deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting ingredient');
    }
});

// start the server here
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});