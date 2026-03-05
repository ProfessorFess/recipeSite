# Fess's Recipe Site

Welcome to **Fess's Recipe Site** – a simple, easy-to-use web application for organizing your favorite recipes and ingredients! Whether you're a passionate home cook or simply looking to keep your meal ideas organized, this app provides a friendly interface to add, view, and manage recipes and their ingredients. Designed by Fess Myhre, this site aims to make home cooking more enjoyable and approachable for everyone.

Explore recipes by main protein, add your own culinary creations, and easily manage a list of ingredients. Get started by following the setup instructions below to run the site on your own machine. Happy cooking!

## Website Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) running locally

### 1. Clone the Repository
```bash
git clone git@github.com:ProfessorFess/recipeSite.git
cd recipeSite.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure the Database Connection
Create a `.env` file in the root directory of your project with the following content (update credentials if you changed them):

```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=recipe_db
```

### 4. Initialize the Database
Open MySQL Workbench (or use the command line) and run the SQL script in `sql/init.db.sql` to set up and seed the database.

### 5. Start the Server
```bash
npm start
```
or, if your entry file is `app.js`:
```bash
node app.js
```
The website should now be running locally at [http://localhost:3000](http://localhost:3000).

### Extra Database Setup Clarification
Database Setup
1. Open MySQL Workbench.
2. Create a new connection to your local MySQL instance.
3. Open the script located at /db/init.db.sql.
4. Execute the script to create the recipe_db schema and populate it with sample data.