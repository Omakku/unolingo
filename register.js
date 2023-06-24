const mysql = require('mysql');
const express = require('express');
const app = express();

app.use("/public", express.static(__dirname + "/public"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "brazil20!",
    database: "mydb"
});

connection.connect(function(error){
    if (error) throw error
    else console.log("Successful Database Connection!")
})

app.get("/", function(req,res){
    res.sendFile( __dirname + "/index_signup.html");
})

app.post("/",function(req,res){
    connection.query("select * from ")
})

app.listen(4500); 