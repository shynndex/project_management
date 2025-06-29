const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const roomChat = await RoomChat.find({
    deleted: false,
    "users.user_id": userId,
    typeRoom:"group",
  }).select("title avatar");


  res.render("client/pages/rooms-chat/index", {
    title: "Danh sách phòng",
    roomChat:roomChat,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
    }).select("fullName avatar");

    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create", {
    title: "Tạo phòng",
    friendList: friendList,
  });
};

// [GET] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const userId = req.body.usersId;

  const dataChat = {
    title: title,
    typeRoom: "group",
    users: [
      {
        user_id: res.locals.user.id,
        role: "superAdmin",
      },
    ],
  };

  userId.forEach((userId) => {
    dataChat.users.push({
      user_id: userId,
      role: "user",
    });
  });

  const room = new RoomChat(dataChat);
  await room.save();
  res.redirect(`/chat/${room.id}`);
};
