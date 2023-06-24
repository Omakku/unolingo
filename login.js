const mysql = require('mysql');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './.env'})

const app = express();

app.use("/public", express.static(__dirname + "/public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "brazil20!",
    database: "mydb"
});

db.connect( (error) => {
    if(error){
        console.log(error)
    }
    else{
        console.log("Successful Connection")
    }
})

app.listen(4500); 