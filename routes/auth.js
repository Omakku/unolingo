const express = require("express");
const authController = require("../controllers/auth");
const lessonController = require("../controllers/lesson");
const settingsController = require("../controllers/settings");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/lesson", lessonController.saveScore);
router.post("/change-username", settingsController.changeName);
router.post("/change-password", settingsController.changePass);
router.post("/change-email", settingsController.changeEmail);

module.exports = router;
