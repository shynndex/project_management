const express = require("express");
const router = express.Router();
const multer = require("multer");
// const storageMulter=require("../../helpers/storageMulter")
const upload = multer({
  limits: {
    fieldSize: 10 * 1024 * 1024, 
    fileSize: 5 * 1024 * 1024    
  }
});
const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validate/admin/product.validate");

const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.product);
//truyền data động bằng cách dùng :
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteProduct);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
