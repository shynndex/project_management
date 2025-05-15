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
module.exports.create = (req, res) => {
 
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

//[GET] /admin/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false,
    };

    const data=await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      title: "Sửa Nhóm quyền",
      data: data,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi tìm nhóm quyền!");
    res.redirect(`${systemConfix.prefixAdmin}/roles`);
  }
};

//[PATCH] /admin/product-category/edit
module.exports.editPatch = async (req, res) => {
  const id=req.params.id;

  try {
    await Role.updateOne({_id:id},req.body );
    req.flash("success", `Đã cập nhật danh mục "${req.body.title}" thành công !`);

  } catch (error) {
    req.flash("error","Có lỗi xảy ra,vui lòng thử lại")
  }

  res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/roles`);
};