module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên !`);
    res.redirect(req.get("Referer") || "/user/auth");
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email !`);
    res.redirect(req.get("Referer") || "/user/auth");
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);
    res.redirect(req.get("Referer") || "/user/auth");
    return;
  }
  next();
};

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email !`);
    res.redirect(req.get("Referer") || "/user/auth");
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);
    res.redirect(req.get("Referer") || "/user/auth");
    return;
  }
  next();
};

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email !`);
    res.redirect(req.get("Referer") || "/user/password/forgot");
    return;
  }
  next();
};

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);
    res.redirect(req.get("Referer") || "/user/password/reset");
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", `Vui lòng xác nhận mật khẩu !`);
    res.redirect(req.get("Referer") || "/user/password/reset");
    return;
  }

  if (req.body.password != req.body.confirmPassword) {
    req.flash("error", `Mật khẩu không khớp,vui lòng nhập lại !`);
    res.redirect(req.get("Referer") || "/user/password/reset");
    return;
  }
  next();
};
