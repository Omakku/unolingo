const express = require("express");
const app = express();
const router = express.Router();
const authController = require("../controllers/auth");

app.set("view engine", "ejs");

//Login screen
router.get("/login", (req, res) => {
  var message = req.flash("message");
  res.render("login", { message: message });
});

//Signup screen
router.get("/signup", (req, res) => {
  var message = req.flash("message");
  res.render("signup", { message: message });
});

//Landing Page screen
router.get("/landing", (req, res) => {
  res.render("landing");
});

//Settings screen
router.get("/settings", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    res.render("settings", { myUser: myUser, message: req.flash("message") });
  } else {
    res.redirect("/login");
  }
});

//Profile screen
router.get("/", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    res.render("profile", { myUser: myUser });
  } else {
    res.redirect("/landing");
  }
});

//Quiz Selector screen
router.get("/learn", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    res.render("learn", { myUser: myUser });
  } else {
    res.redirect("/login");
  }
});

//Quiz/Lesson App screens
router.get("/lesson1", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    res.render("quizzes/lesson1", { myUser: myUser });
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson2", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    res.render("quizzes/lesson2", { myUser: myUser });
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson3", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    res.render("quizzes/lesson3", { myUser: myUser });
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson4", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 300) {
      res.render("quizzes/lesson4", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson5", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 300) {
      res.render("quizzes/lesson5", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson6", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 300) {
      res.render("quizzes/lesson6", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson7", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 600) {
      res.render("quizzes/lesson7", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson8", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 600) {
      res.render("quizzes/lesson8", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/lesson9", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 600) {
      res.render("quizzes/lesson9", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson10", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 900) {
      res.render("quizzes/lesson10", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson11", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 900) {
      res.render("quizzes/lesson11", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/lesson12", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    var myUser = req.user;
    if (req.user.total_score >= 900) {
      res.render("quizzes/lesson12", { myUser: myUser });
    } else {
      res.redirect("/learn");
    }
  } else {
    res.redirect("/login");
  }
});
module.exports = router;
