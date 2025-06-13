const express = require("express");
const router = express.Router();
const controller=require("../../controllers/client/user.controller");
const validate = require("../../validate/client/user.validate");



router.get("/auth", controller.auth);
router.post("/register", validate.registerPost, controller.registerPost);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/logout",controller.logout);
router.get("/password/forgot",controller.forgotPassword);
router.post("/password/forgot",validate.forgotPasswordPost,controller.forgotPasswordPost);
router.get("/password/otp",controller.otpPassword);
router.post("/password/otp",controller.otpPasswordPost);
router.get("/password/reset",controller.resetPassword);
router.post("/password/reset",validate.resetPasswordPost,controller.resetPasswordPost);


module.exports = router;