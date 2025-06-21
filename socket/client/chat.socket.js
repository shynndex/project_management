const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadCloundinary");

module.exports = (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
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
};
