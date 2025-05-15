const Role = require("../../models/role.model");
const systemConfix = require("../../config/system");


//[GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const roles = await Role.find(find);
  res.render("admin/pages/roles/index", {
    title: "Nhóm quyền",
    roles:roles,
  });
};


//[GET] /admin/create
module.exports.create = async (req, res) => {
 
  res.render("admin/pages/roles/create", {
    title: "Tạo Nhóm quyền",
  });
};

//[POST] /admin/create
module.exports.createPost = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    req.flash("success", "Thêm danh mục thành công!");
    res.redirect(`${systemConfix.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi thêm sản phẩm!");
    res.redirect(`${systemConfix.prefixAdmin}/roles`);
  }
};