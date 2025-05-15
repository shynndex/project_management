const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const systemConfix = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");


//[GET] /admin/product-category
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

  res.render("admin/pages/product-category/index", {
    title: "Danh mục sản phẩm",
    keyword:objectSearch.keyword,
    filterStatus:filterStatus,
    category:newProductCategory,
  });
};

//[GET] /admin/product-category/create
module.exports.create = async (req, res) => {

  let find = {
    deleted:false,
  }

  const parentCategory = await ProductCategory.find(find);

  const newProductCategory = createTreeHelper(parentCategory);


  res.render("admin/pages/product-category/create", {
    title: "Tạo danh mục sản phẩm",
    parentCategory: newProductCategory,
  });
};

//[POST] /admin/product-category/create
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
    res.redirect(`${systemConfix.prefixAdmin}/product-category`);
  }
  
  catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi thêm danh mục!");
    res.redirect(`${systemConfix.prefixAdmin}/product-category`);
  }
};

//[GET] /admin/product-category/edit
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const productCategory = await ProductCategory.findOne(find);
    
    const parentCategory = await ProductCategory.find({
      deleted:false,
    });

    const newProductCategory = createTreeHelper(parentCategory);


    res.render("admin/pages/product-category/edit", {
      title: "Chỉnh sửa danh mục",
      productCategory: productCategory,
      parentCategory:newProductCategory,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi tìm sản phẩm!");
    res.redirect(`${systemConfix.prefixAdmin}/product-category`);
  }
};

//[PATCH] /admin/product-category/edit
module.exports.editPatch = async (req, res) => {
  const id=req.params.id;
  req.body.position = parseInt(req.body.position);

  try {
    await ProductCategory.updateOne({_id:id},req.body );
   req.flash("success", `Đã cập nhật sản phẩm ${req.body.position} thành công !`);

  } catch (error) {
    req.flash("error","Có lỗi xảy ra,vui lòng thử lại")
  }

  res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/product-category`);
};