const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Login Authentification
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    db.query(
      "SELECT * FROM users WHERE user_name = ?",
      [username],
      async (error, results) => {
        if (
          results.length < 1 ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("login", {
            message: "Username or Password Incorrect!",
          });
        } else {
          const idusers = results[0].idusers;

          const token = jwt.sign({ idusers }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("Token is: " + token);
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookieOptions);
          console.log(results);
          res.status(200).redirect("/");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Signup Authentification
exports.signup = (req, res) => {
  console.log(req.body);

  const { firstname, lastname, username, email, password } = req.body;

  //1. Check if username already taken
  db.query(
    "SELECT user_name FROM users WHERE user_name = ?",
    [username],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("signup", {
          message: "Username is already taken!",
        });
      }

      //2. Check if email already taken
      db.query(
        "SELECT user_email FROM users WHERE user_email = ?",
        [email],
        async (error, results) => {
          if (error) {
            console.log(error);
          }
          if (results.length > 0) {
            return res.render("signup", {
              message: "Email is already taken!",
            });
          }

          //3. Create hashed password
          let encryptPass = await bcrypt.hash(password, 6);
          console.log(encryptPass);

          //4. Insert new account data into SQL database
          db.query(
            "INSERT INTO users SET ?",
            {
              first_name: firstname,
              last_name: lastname,
              user_name: username,
              user_email: email,
              password: encryptPass,
            },
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                req.flash("success_msg", "success");
                res.status(200).redirect("/login");
                console.log(results);
              }
            }
          );
        }
      );
    }
  );
};

//1. User already logged in checker
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //2. Check Cookie || Token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      console.log(decoded);

      //3. Check if valid account
      const sqly =
        "SELECT users.*, SUM(user_scores.score) AS total_score FROM users LEFT JOIN user_scores  ON users.idusers = user_scores.idusers WHERE users.idusers = ?";
      db.query(sqly, [decoded.idusers], (error, result) => {
        console.log[decoded.idusers];
        console.log(error);
        console.log(result);

        if (!result) {
          return next();
        }
        req.user = result[0];
        return next();
      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
};

// Log out function
exports.logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).redirect("/");
};
