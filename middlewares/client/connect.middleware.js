const User = require("../../models/user.model");

module.exports.connect = async (req, res, next) => {
 const roomChatId = req.params.roomChatId;

  const userId = res.locals.user.id;
  if (userId) {
    _io.once("connection", async (socket) => {
      socket.join(roomChatId);
      if (userId) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            statusOnline: "online",
          }
        );
      }
      socket.to(roomChatId).emit("SERVER_RETURN_USER_STATUS_ONLINE_CHAT", {
        userId,
        status: "online",
      });
      socket.on("disconnect", async () => {
        if (userId) {
          await User.updateOne(
            {
              _id: userId,
            },
            {
              statusOnline: "offline",
            }
          );

          socket.to(roomChatId).emit("SERVER_RETURN_USER_STATUS_ONLINE_CHAT", {
            userId,
            status: "offline",
          });
        }
      });
    });
    next();
  }
};
