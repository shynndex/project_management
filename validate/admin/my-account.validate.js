const { prefixAdmin } = require("../../config/system");

module.exports.editPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên !`);
    res.redirect(req.get("Referer") || `${prefixAdmin}/my-account/edit`);
    return;
  }
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email !`);
    res.redirect(req.get("Referer") || "/admin/my-account/edit");
    return;
  }
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);
    res.redirect(req.get("Referer") || "/admin/my-account/edit");
    return;
  }
  next();
};
