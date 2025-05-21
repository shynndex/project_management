const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfix = require("../../config/system");

//[GET] /admin/auth/login
module.exports.login = (req, res) => {
  //có thể kiểm tra token có hợp lệ không(trường hợp bị sửa token)
  if (req.cookies.token) {
    res.redirect(`${systemConfix.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      title: "Đăng nhập",
    });
  }
};

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  //destructuring: const {email,password}=req.body
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `Email không tồn tại!`);
    res.redirect(
      req.get("Referer") || `${systemConfix.prefixAdmin}/auth/login`
    );
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", `Sai mật khẩu!`);
    res.redirect(
      req.get("Referer") || `${systemConfix.prefixAdmin}/auth/login`
    );
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", `Tài khoản đã bị khóa!`);
    res.redirect(
      req.get("Referer") || `${systemConfix.prefixAdmin}/auth/login`
    );
    return;
  }

  res.cookie("token", user.token);
  req.flash("success", "Đăng nhập thành công!");
  res.redirect(`${systemConfix.prefixAdmin}/dashboard`);
};

//[POST] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfix.prefixAdmin}/auth/login`);
};
