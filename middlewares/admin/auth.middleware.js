const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfix = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfix.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({ token: req.cookies.token }).select("-password");
    if (!user) {
      res.redirect(`${systemConfix.prefixAdmin}/auth/login`);
    } else {
        const role=await Role.findOne({
            _id:user.role_id,
        }).select("title permissions");
        //tạo ra biến local để dùng cho pug,có thể dùng res. hoặc app.
        res.locals.user=user;
        res.locals.role=role;
      next();
    }
  }
};
