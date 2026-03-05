## Website Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) running locally

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-project-folder>
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