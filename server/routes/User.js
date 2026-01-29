const express = require("express");
const router = express.Router();

const {auth, isStudent, isFreelancer, isTraveller} = require("../middlewares/auth");
const {signup, login , forgotPassword, resetPassword, logout} = require("../controllers/Auth");

// Route for user login
router.post("/log-in", login)

// Route for user signup
router.post("/sign-up", signup)

// Route for sending email to the user's email
router.post("/forgot-password", forgotPassword)

// Route for Changing the password
router.post("/reset-password/:token", resetPassword);

router.get("/logout",auth, logout);

module.exports = router;