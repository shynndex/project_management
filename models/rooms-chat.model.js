const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    typeRoom: String, //Kiểu phòng,ví dụ:friend:bạn bè,group:nhóm
    status: String, // Trạng thái,ví dụ:khóa phòng,chỉ trưởng,phó nhóm mới được nhắn tin
    users: [
      {
        user_id: String,
        role: String, //Phân quyền(admin,user,..)
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;
