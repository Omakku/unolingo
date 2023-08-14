const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

//  Send Quiz Score to database
exports.saveScore = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(userinfo.idusers);
    console.log(req.body.finalScore);

    const finalScore = req.body.finalScore;
    const finalTime = req.body.finalTime;
    const userId = userinfo.idusers;
    const lessonId = req.body.quizNumber;

    // CHECK IF RECORD EXISTS BETWEEN LESSON ID AND USER ID
    const selectQuery =
      "SELECT score FROM user_scores WHERE idlesson = ? AND idusers = ?";

    db.query(selectQuery, [lessonId, userId], (err, rows) => {
      if (err) {
        console.error("Error executing the SELECT query:", err.message);
        return;
      }

      if (rows.length === 0) {
        // NO RECORD OF QUIZ EXISTS, SO INSERT SCORE
        const insertQuery =
          "INSERT INTO user_scores (score, idlesson, idusers, completion_time) VALUES (?, ?, ?, ?)";
        db.query(
          insertQuery,
          [finalScore, lessonId, userId, finalTime],
          (insertErr, result) => {
            if (insertErr) {
              console.error(
                "Error executing the INSERT query:",
                insertErr.message
              );
              return;
            }
            console.log(
              "Score successfully inserted into the user_scores table."
            );
            incrementLessonCompleted();
            res.status(200).redirect("/learn");
          }
        );
      } else {
        // RECORD EXISTS, SO UPDATE IF SCORE IS HIGHER
        const existingScore = rows[0].score;
        if (finalScore > existingScore) {
          const updateQuery =
            "UPDATE user_scores SET score = ?, completion_time = ? WHERE idlesson = ? AND idusers = ?";
          db.query(
            updateQuery,
            [finalScore, finalTime, lessonId, userId],
            (updateErr, result) => {
              if (updateErr) {
                console.error(
                  "Error executing the UPDATE scores query:",
                  updateErr.message
                );
                return;
              }
              console.log(
                "Score and final time successfully updated in the user_scores table."
              );
              res.status(200).redirect("/learn");
            }
          );
        } else {
          console.log(
            "The new score is not higher than the existing score. No update needed."
          );
          res.status(200).redirect("/learn");
        }
      }
    });

    // UPDATE AND INCREMENENT LESSON COMPLETE
    function incrementLessonCompleted() {
      const updateLessonCompletedQuery =
        "UPDATE users SET lessons_completed = lessons_completed + 1 WHERE idusers = ?";
      db.query(updateLessonCompletedQuery, [userId], (updateErr, result) => {
        if (updateErr) {
          console.error("Error executing the UPDATE query:", updateErr.message);
          return;
        }
        console.log(
          "Lesson completed count successfully incremented in the users table."
        );
      });
    }
  });
};
