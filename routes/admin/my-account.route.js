const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const controller = require("../../controllers/admin/my-account.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validate/admin/my-account.validate");


router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPost,
  controller.editPatch
);

module.exports = router;
