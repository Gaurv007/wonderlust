const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapasycn = require("../utils/wrapasycn.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controlers/users.js");

// SIGNUP
router
  .route("/signup")
  .get(userController.rendersignupform)
  .post(wrapasycn(userController.signup));

// LOGIN
router
  .route("/login")
  .get(userController.renderloginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
