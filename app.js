const mysql = require("mysql");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");

dotenv.config({ path: "./.env" });

//------ Initialize server
const app = express();

//----- Add Bootstrap and Jquery
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

//----- Parse data sent from HTML froms
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

//------ Initialize database connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

//----- Get css, image files, and js from public dir
app.use(express.static(__dirname + "/public"));

//----- Set view engine and location of views folder
app.set("quizzes", path.join(__dirname, "/views/quizzes"));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//----- Connect Flash
app.use(flash());

//----- Use express sessions
app.use(
  session({
    secret: "lebron james",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

//-----Test Connection to SQL Database
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Successful Database Connection");
  }
});

//----- Get routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(4500, () => {
  console.log("Server is running on port 4500");
});
