const User = require("../../models/user.model");
const usersSocket = require("../../socket/client/users.socket");

//[GET] /user/not-friend
module.exports.notFriend = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    $and: [
      {
        _id: { $ne: userId },
      },
      {
        _id: { $nin: requestFriends },
      },
      {
        _id: { $nin: acceptFriends },
      },
    ],
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/not-friend", {
    title: "Danh sách người dùng",
    users: users,
  });
};

//[GET] /user/request
module.exports.request = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends;

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/request", {
    title: "Lời mời đã gửi",
    users: users,
  });
};


//[GET] /user/accept
module.exports.accept = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/accept", {
    title: "Lời mời đã nhận",
    users: users,
  });
};

//[GET] /user/friends
module.exports.friends = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const friendList = myUser.friendList;
  const friendListId = friendList.map(user=>user.user_id);

  const users = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false,
  }).select("id fullName avatar statusOnline");
  console.log(users);

  res.render("client/pages/users/friends", {
    title: "Danh sách bạn bè",
    users: users,
  });
};