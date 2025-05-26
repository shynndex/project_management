const Account = require("../../models/account.model");
const md5 = require("md5");

//[GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    title: "Thông tin cá nhân",
  });
};

//[GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    title: "Chỉnh sửa thông tin cá nhân",
  });
};

//[PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  try {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
      _id: { $ne: id },
    });

    const phoneExist = await Account.findOne({
      phone: req.body.phone,
      deleted: false,
      _id: { $ne: id },
    });

    let hasError = false;

    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      hasError = true;
    }

    if (phoneExist) {
      req.flash("error", `<br>Số điện thoại ${req.body.phone} đã tồn tại!`);
      hasError = true;
    }

    if (hasError) {
      res.redirect(
        req.get("Referer") || `${systemConfix.prefixAdmin}/my-account`
      );
      return;
    }

    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", `Đã cập nhật tài khoản thành công !`);
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra,vui lòng thử lại");
  }
  res.redirect(
    req.get("Referer") || `${systemConfix.prefixAdmin}/my-account/edit`
  );
};
