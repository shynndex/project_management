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
    });
  });
};
