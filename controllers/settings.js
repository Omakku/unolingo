const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

//UPDATE USERNAME IN DATABASE
exports.changeName = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log(userinfo.idusers);
    try {
      const userid = userinfo.idusers;
      const updatedName = req.body.new_name;

      // SEND USER UPDATE QUERY TO SQL
      const updateQuery = "UPDATE users SET user_name = ? WHERE idusers = ?";
      db.query(updateQuery, [updatedName, userid], (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "An error occurred" });
        }
        res.status(200).redirect("/settings");
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
};

//UPDATE EMAIL IN DATABASE
exports.changeEmail = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log(userinfo.idusers);
    try {
      const userid = userinfo.idusers;
      const updatedEmail = req.body.new_email;

      // SEND USER UPDATE QUERY TO SQL
      const updateQuery = "UPDATE users SET user_email = ? WHERE idusers = ?";
      db.query(updateQuery, [updatedEmail, userid], (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "An error occurred" });
        }
        res.status(200).redirect("/settings");
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
};

//UPDATE USERNAME IN DATABASE
exports.changePass = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const token = req.cookies.jwt;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userinfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      console.log(userinfo.idusers);

      try {
        const userid = userinfo.idusers;
        const passCheckQuery = "SELECT * FROM users WHERE idusers = ?";

        db.query(passCheckQuery, [userid], async (error, results) => {
          if (
            results.length < 1 ||
            !(await bcrypt.compare(oldPassword, results[0].password))
          ) {
            console.log("Wrong Password!");
            req.flash("message", "bad password");
            res.redirect("/settings");
          } else {
            let newEncryptPass = await bcrypt.hash(newPassword, 6);
            console.log(newEncryptPass);

            const passUpdateQuery =
              "UPDATE users SET password = ? WHERE idusers = ?";
            db.query(
              passUpdateQuery,
              [newEncryptPass, userid],
              (error, result) => {
                if (error) {
                  console.error(error);
                  return res.status(500).json({ error: "An error occurred" });
                } else {
                  console.log(result);
                  return res
                    .status(200)
                    .json({ message: "Password updated successfully" });
                }
              }
            );
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
};
