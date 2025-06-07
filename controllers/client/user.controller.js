const e = require("express");
const User = require("../../models/user.model");
const md5 = require("md5");

//[GET] /user/auth
module.exports.auth = (req, res) => {
  res.render("client/pages/user/auth", {
    title: "Đăng nhập",
  });
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
  });

  if (existEmail) {
    req.flash("error", "Email đã tồn tại !");
    res.redirect(req.get("Referer") || "/user/auth");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  res.cookie("tokenUser", user.tokenUser, { expires: expires });

  res.redirect("/");
};

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      req.flash("error", "Email không tồn tại !");
      res.redirect(req.get("Referer") || "/user/auth");
      return;
    }
    if (md5(password) !== user.password) {
      req.flash("error", "Sai mật khẩu !");
      res.redirect(req.get("Referer") || "/user/auth");
      return;
    }

    if (user.status == "inactive") {
      req.flash("error", "Tài khoản đã bị khóa !");
      res.redirect(req.get("Referer") || "/user/auth");
      return;
    }

    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 ngày
    res.cookie("tokenUser", user.tokenUser,{expires});  
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
