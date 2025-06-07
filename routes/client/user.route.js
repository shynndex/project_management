const express = require("express");
const router = express.Router();
const controller=require("../../controllers/client/user.controller");
const validate = require("../../validate/client/user.validate");



router.get("/auth", controller.auth);
router.post("/register", validate.registerPost, controller.registerPost);
router.post("/login", validate.loginPost, controller.loginPost);

module.exports = router;