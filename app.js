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

// start the server here
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});