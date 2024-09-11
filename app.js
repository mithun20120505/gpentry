const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// SQL Server Configuration
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

To create a complete Node.js project with Express.js for a user login page that redirects to an employee information page, here's a step-by-step guide.

1. Project Structure
Here's how the project structure will look:

bash
Copy code
/project-root
  ├── /views
  │    ├── login.pug
  │    ├── employeeInfo.pug
  ├── /public
  │    ├── styles.css
  ├── app.js
  ├── package.json
  └── .env
2. Setting Up the Project
Initialize the Project:

Open your terminal and run:

bash
Copy code
npm init -y
Install Dependencies:

Install the required Node.js packages:

bash
Copy code
npm install express pug body-parser mssql dotenv
Create .env File:

Create a .env file in the project root to store environment variables, such as your database connection details.

env
Copy code
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SERVER=your_db_server
3. Creating the Express Server (app.js)
In app.js, set up your Express.js server, Pug as the template engine, and SQL Server connection.

javascript
Copy code
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Set Pug as the template engine
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// SQL Server Configuration
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    options: {
        encrypt: true,
        enableArithAbort: true,
    },
};

// Routes
app.get('/', (req, res) => {
    res.render('login');
})
// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Verify username and password with the database
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query`SELECT * FROM Users WHERE Username = ${username} AND PasswordHash = HASHBYTES('SHA2_512', ${password})`;
        if (result.recordset.length > 0) {
            res.redirect('/employee-info');
        } else {
            res.send('Invalid credentials');
        }
    } catch (err) {
        res.send('Database error: ' + err);
    }
});

// Employee Info Route
app.post('/employee-info', async (req, res) => {
    const { uan, pan, mobile } = req.body;
    // Call the API to check employment status
    try {
        const response = await fetch(`API_ENDPOINT?uan=${uan}&pan=${pan}&mobile=${mobile}`);
        const data = await response.json();
        const status = data.isWorkingMultipleCompanies ? "Employee is working in multiple companies" : "Employee is working in a single company";
        res.render('employeeInfo', { status });
    } catch (err) {
        res.send('Error checking employee status: ' + err);
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = app;
