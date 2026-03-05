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
        res.render('recipe', { recipe: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/add-recipe', (req, res) => {
    res.render('add-recipe');
});

// POST method to add recipes to db
app.post('/recipe/add', async (req, res) => {
    try {
        const {
            title,
            description,
            instructions,
            main_protein,
            prep_time_mins,
            featured_ingredient_id
        } = req.body;

        const sql = `
            INSERT INTO recipes (title, description, instructions, main_protein, prep_time_mins, featured_ingredient_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            title,
            description,
            instructions,
            main_protein,
            prep_time_mins || null,
            featured_ingredient_id || null
        ]);

        // after saving, redirect to recipe page
        // get the last inserted recipe ID to redirect to its info page
        const newRecipeId = result.insertId;
        res.redirect(`/recipe/${newRecipeId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving recipe ');
    }
});

// start the server here
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});