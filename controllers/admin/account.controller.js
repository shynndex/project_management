const Account = require("../../models/account.model");
const systemConfix = require("../../config/system");
const Role = require("../../models/role.model");
const md5 = require("md5");

//[GET] /admin/account
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  //Dấu "-" để loại trường không cần lấy
  const accounts = await Account.find(find).select("-password -token");

  for (const account of accounts) {
    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false,
    });
    account.role = role;
  }

  res.render("admin/pages/accounts/index", {
    title: "Danh sách tài khoản",
    accounts: accounts,
  });
};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const role = await Role.find({ deleted: false });

  res.render("admin/pages/accounts/create", {
    title: "Tạo mới tài khoản",
    role: role,
  });
};

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    const phoneExist = await Account.findOne({
      phone: req.body.phone,
      deleted: false,
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
      return res.redirect(`${systemConfix.prefixAdmin}/accounts/create`);
    }

    req.body.password = md5(req.body.password);
    const account = new Account(req.body);
    await account.save();
    req.flash("success", "Thêm tài khoản thành công!");
    res.redirect(`${systemConfix.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi thêm tài khoản!");
    res.redirect(`${systemConfix.prefixAdmin}/accounts`);
  }
};

//[GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
  try {
    let find = {
      _id: req.params.id,
      deleted: false,
    };

    const account = await Account.findOne(find);
    const role = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      title: "Chỉnh sửa tài khoản",
      role: role,
      account: account,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi tìm tài khoản!");
    res.redirect(`${systemConfix.prefixAdmin}/accounts`);
  }
};

//[PATCH] /admin/accounts/edit
module.exports.editPatch = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
      _id: { $ne: req.params.id },
    });

    const phoneExist = await Account.findOne({
      phone: req.body.phone,
      deleted: false,
      _id: { $ne: req.params.id },
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
      res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/accounts`);
    }

    await Account.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", `Đã cập nhật tài khoản thành công !`);
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra,vui lòng thử lại");
  }

  res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/accounts`);
};
