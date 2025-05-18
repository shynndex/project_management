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
      _id:account.role_id,
      deleted:false,
    });
    account.role=role;
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

