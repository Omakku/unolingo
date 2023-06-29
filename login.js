const mysql = require('mysql');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


dotenv.config({ path: './.env'})

//------ Initialize server
const app = express();

//------ Initialize database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//----- Get css and image files from public dir
app.use(express.static(__dirname + '/public'));

//----- Set view engine and location of views folder
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


//-----Test Connection to SQL Database
db.connect( (error) => {
    if(error){
        console.log(error)
    }
    else{
        console.log("Successful Database Connection")
    }
})


//----- Get routes
app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

//------------------------------------------
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser()); 

app.listen(4500, () => {
    console.log("Server is running on port 4500");
})