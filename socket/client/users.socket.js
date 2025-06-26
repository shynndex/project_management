const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (friendId) => {
      const userId = res.locals.user.id;
      //Thêm id của A vào acceptFriend của B

      const existAcceptFriend = await User.findOne({
        _id: friendId,
        acceptFriends: userId,
      });

      if (!existAcceptFriend) {
        await User.updateOne(
          {
            _id: friendId,
          },
          {
            $push: { acceptFriends: userId },
          }
        );
      }

      //Thêm id của B vào requestFriends của A
      const existrequestFriends = await User.findOne({
        _id: userId,
        requestFriends: friendId,
      });

      if (!existrequestFriends) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { requestFriends: friendId },
          }
        );
      }

      //Lấy ra acceptFriends của B và hiện ra giao diện

      const infoUserFriend = await User.findOne({
        _id: friendId,
      });

      const lengthAcceptFriends = infoUserFriend.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        friendId: friendId,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      //Lấy ra thông tin của A và trả về cho B
      const infoUser = await User.findOne({
        _id: userId,
      }).select("id avatar fullName");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        friendId: friendId,
        infoUser: infoUser,
      });
    });

    socket.on("CLIENT_CANCEL_FRIEND", async (friendId) => {
      const userId = res.locals.user.id;
      //Xóa id của A vào acceptFriend của B
      const existAcceptFriend = await User.findOne({
        _id: friendId,
        acceptFriends: userId,
      });

      if (existAcceptFriend) {
        await User.updateOne(
          {
            _id: friendId,
          },
          {
            $pull: { acceptFriends: userId },
          }
        );
      }

      //Xóa id của B vào requestFriends của A
      const existrequestFriends = await User.findOne({
        _id: userId,
        requestFriends: friendId,
      });

      if (existrequestFriends) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: friendId },
          }
        );
      }
      const infoUserFriend = await User.findOne({
        _id: friendId,
      });

      const lengthAcceptFriends = infoUserFriend.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        friendId: friendId,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        friendId: friendId,
        userId: userId,
      });
    });

    socket.on("CLIENT_REFUSE_FRIEND", async (friendId) => {
      const userId = res.locals.user.id;
      //Xóa id của A vào acceptFriend của B
      const existAcceptFriend = await User.findOne({
        _id: userId,
        acceptFriends: friendId,
      });

      if (existAcceptFriend) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: friendId },
          }
        );
      }

      //Xóa id của B vào requestFriends của A
      const existRequestFriends = await User.findOne({
        _id: friendId,
        requestFriends: userId,
      });

      if (existRequestFriends) {
        await User.updateOne(
          {
            _id: friendId,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
    });

    socket.on("CLIENT_ACCEPT_FRIEND", async (friendId) => {
      const userId = res.locals.user.id;
      //Xóa id của A vào acceptFriend của B
      // Thêm {user_id, room_chat_id} của A vào friendsList của B
      const existAcceptFriend = await User.findOne({
        _id: userId,
        acceptFriends: friendId,
      });

      if (existAcceptFriend) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              friendList: {
                user_id: friendId,
                room_chat_id: "",
              },
            },
            $pull: { acceptFriends: friendId },
          }
        );
      }

      //Xóa id của B vào requestFriends của A
      // Thêm {user_id, room_chat_id} của B vào friendsList của A
      const existRequestFriends = await User.findOne({
        _id: friendId,
        requestFriends: userId,
      });

      if (existRequestFriends) {
        await User.updateOne(
          {
            _id: friendId,
          },
          {
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: userId },
          }
        );
      }
    });
  });
};
