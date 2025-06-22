const User = require("../../models/user.model");

//[GET] /user/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;

  const users = await User.find({
    _id: { $ne: userId },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");
  
  res.render("client/pages/users/not-friend", {
    title: "Danh sách người dùng",
    users: users,
  });
};
