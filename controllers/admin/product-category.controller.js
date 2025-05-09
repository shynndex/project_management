const ProductCategory = require("../../models/product-category.model");
const systemConfix = require("../../config/system");


//[GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const productCategory = await ProductCategory.find(find)

  res.render("admin/pages/products-category/index", {
    title: "Danh mục sản phẩm",
    category:productCategory,
  });
};

//[GET] /admin/products-category/create
module.exports.create = (req, res) => {
  res.render("admin/pages/products-category/create", {
    title: "Tạo danh mục sản phẩm",
  });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  try{
    const productCategory = new ProductCategory(req.body);
    await productCategory.save();
    req.flash("success", "Thêm danh mục thành công!");
    res.redirect(`${systemConfix.prefixAdmin}/products-category`);
  }
  
  catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi thêm danh mục!");
    res.redirect(`${systemConfix.prefixAdmin}/products-category`);
  }
};
