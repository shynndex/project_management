const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const systemConfix = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");


//[GET] /admin/products-category
module.exports.index = async (req, res) => {

  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

 if (req.query.status == "deleted") {
   find.deleted = true;
 } else {
   find.deleted = false;
   if (req.query.status) {
     find.status = req.query.status;
   }
 }

  const objectSearch=searchHelper(req.query);

  if(objectSearch.regex){
    find.title=objectSearch.regex;
  }

  const productCategory = await ProductCategory.find(find)

  const newProductCategory = createTreeHelper(productCategory);

  res.render("admin/pages/products-category/index", {
    title: "Danh mục sản phẩm",
    keyword:objectSearch.keyword,
    filterStatus:filterStatus,
    category:newProductCategory,
  });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {

  let find = {
    deleted:false,
  }

  const parentCategory = await ProductCategory.find(find);

  const newProductCategory = createTreeHelper(parentCategory);


  res.render("admin/pages/products-category/create", {
    title: "Tạo danh mục sản phẩm",
    parentCategory: newProductCategory,
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
