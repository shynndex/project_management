const express = require("express");
const router = express.Router();
const controller=require("../../controllers/client/chat.controller");
const chatMiddleware = require("../../middlewares/client/chat.middleware");
const connectMiddleware = require("../../middlewares/client/connect.middleware");


//Gắn connectMiddleware ở đây để lấy roomChatID
router.get("/:roomChatId",chatMiddleware.isAccess,connectMiddleware.connect,controller.index);

module.exports = router;
