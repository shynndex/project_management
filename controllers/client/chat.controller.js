const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require("../../helpers/uploadCloundinary");

module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // SocketIO
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      try {
        let images = [];
        for (const imageBuffer of data.images) {
          const link = await uploadToCloudinary(imageBuffer);
          images.push(link);
        }
        // Lưu vào db
        const chat = new Chat({
          user_id: userId,
          content: data.content,
          images: images,
        });
        await chat.save();

        // Trả data realtime
        _io.emit("SERVER_RETURN_MESSAGE", {
          userId: userId,
          fullName: fullName,
          content: data.content,
          images: images,
        });
      } catch (error) {
        // Gửi lỗi về client hoặc log lỗi
        socket.emit("SERVER_ERROR_MESSAGE", {
          message: "Đã có lỗi xảy ra khi gửi tin nhắn",
        });
        console.error("Lỗi CLIENT_SEND_MESSAGE:", error);
      }
    });

    // Typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
    // End Typing
  });
  // End SocketIO

  try {
    const chats = await Chat.find({
      deleted: false,
    });

    for (const chat of chats) {
      const infoUser = await User.findOne({
        _id: chat.user_id,
      }).select("fullName");
      chat.infoUser = infoUser;
    }

    res.render("client/pages/chat/index", {
      title: "Chat",
      chats: chats,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách chat:", error);
    res.status(500).send("Có lỗi khi tải trang chat.");
  }
};
