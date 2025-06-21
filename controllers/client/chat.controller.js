const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../socket/client/chat.socket");

module.exports.index = async (req, res) => {
  // SocketIO
  chatSocket(res);
  // End SocketIO

  //Lấy data db
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
