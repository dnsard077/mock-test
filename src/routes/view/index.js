const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register.ejs");
});
router.get("/login", (req, res) => {
  res.render("login.ejs");
});
router.get("/dashboard", (req, res) => {
  res.render("dashboard.ejs");
});

module.exports = router;
