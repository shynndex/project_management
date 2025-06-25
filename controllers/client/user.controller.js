const e = require("express");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");

//[GET] /user/auth
module.exports.auth = (req, res) => {
  if (req.cookies.tokenUser) {
    res.redirect("/");
  } else {
    res.render("client/pages/user/auth", {
      title: "Đăng nhập",
    });
  }
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

    const cart = await Cart.findOne({
      user_id: user.id,
    });

    if (cart) {
      res.cookie("cartId", cart.id);
    } else {
      await Cart.updateOne(
        {
          _id: req.cookies.cartId,
        },
        {
          user_id: user.id,
        }
      );
    }

    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 ngày
    res.cookie("tokenUser", user.tokenUser, { expires });
    await User.updateOne(
      {
        tokenUser: user.tokenUser,
      },
      {
        statusOnline: "online",
      }
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne(
    {
      tokenUser: req.cookies.tokenUser,
    },
    {
      statusOnline: "offline",
    }
  );
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");

  res.redirect("/");
};

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    title: "Lấy lại mật khẩu",
  });
};

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại !");
    res.redirect(req.get("Referer") || "/user/password/forgot");
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  const subject = "Mã xác minh đổi mật khẩu";
  const html = `<h3>Mã OTP của bạn là:</h3></br><h2><b>${otp}</b></h2><br>Mã này có hiệu lực trong 3 phút.<b>KHÔNG ĐƯỢC CHIA SẺ</b>`;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp/?email=${email}`);
};

//[GET] /user/password/forgot
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    title: "Nhập mã otp",
    email: email,
  });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "Otp không hợp lệ !");
    res.redirect(req.get("Referer") || "/user/password/otp");
    return;
  }

  //tạo token để xác thực user
  const user = await User.findOne({
    email: email,
  });

  //dùng token để tìm đúng tài khoản cần đổi
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

//[GET] /user/password/otp
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    title: "Đổi mật khẩu",
  });
};

//[POST] /user/password/otp
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  res.redirect("/");
  req.flash("error", "Email không tồn tại !");
};

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    title: "Thông tin tài khoản",
  });
};

module.exports.infoUpdate = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    req.body
  );

  req.flash("success", "Thay đổi thông tin thành công!");
  res.redirect(req.get("Referer") || "/user/info");
};
