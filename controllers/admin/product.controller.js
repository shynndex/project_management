const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfix = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const createTreeHelper = require("../../helpers/createTree");

//[GET] /admin/products
module.exports.product = async (req, res) => {
  //tạo object để render ra giao diện cho trường hợp có nhiều trạng thái khác
  // console.log(req.query.);

  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  //sửa key trạng thái hoạt động,nếu phát hiện request trên url có status thì lọc
  if (req.query.status === "deleted") {
    find.deleted = true;
  } else {
    find.deleted = false;
    if (req.query.status) {
      find.status = req.query.status;
    }
  }

  const objectSearch = searchHelper(req.query);

  //kiểm tra nếu có regex được truyền vào
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 5,
    },
    req.query,
    countProducts
  );
  //End Pagination

  //Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //End Sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  for (const product of products) {
    // Get creator information
    const creator = await Account.findOne({
      _id: product.createdBy.account_id,
    });

    if (creator) {
      product.accountFullName = creator.fullName;
    }

    // Get editor information
    // const updatedBy = product.updatedBy[product.updatedBy.length - 1];
     const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const editor = await Account.findOne({
        _id: updatedBy.account_id,
      });
      
      updatedBy.accountFullName=editor.fullName;//???
    }
  }

  res.render("admin/pages/products/index", {
    title: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );

  req.flash("success", "Cập nhật trạng thái thành công !");
  res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/products`);
};

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  //lặp qua từng phần tử trong mảng:
  const ids = req.body.ids.split(", "); //.map(item=>item.trim())

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công !`
      );
      break;

    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm  thành công !`
      );
      break;

    case "deleted-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Đã xóa sản phẩm  ${ids.length} thành công !`);

      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-").map((item) => item.trim());
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          { position: position, $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Thay đổi vị trí của sản phẩm  ${ids.length} thành công !`
        );
      }
      break;
    default:
      break;
  }

  res.redirect(req.get("Referer") || "/admin/products");
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );

  req.flash("success", `Đã xóa sản phẩm ${id.length} thành công !`);

  res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/products`);
};

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper(category);
  res.render("admin/pages/products/create", {
    title: "Thêm mới sản phẩm",
    category: newCategory,
  });
};

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  try {
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };
    const product = new Product(req.body);
    await product.save();
    req.flash("success", "Thêm sản phẩm thành công!");
    res.redirect(`${systemConfix.prefixAdmin}/products`);
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi thêm sản phẩm!");
    res.redirect(`${systemConfix.prefixAdmin}/products`);
  }
};

//[GET] /admin/products/edit
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    const category = await ProductCategory.find({ deleted: false });
    const newCategory = createTreeHelper(category);

    res.render("admin/pages/products/edit", {
      title: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi tìm sản phẩm!");
    res.redirect(`${systemConfix.prefixAdmin}/products`);
  }
};

//[PATCH] /admin/products/edit
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash(
      "success",
      `Đã cập nhật sản phẩm ${req.body.position} thành công !`
    );
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra,vui lòng thử lại");
  }

  res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/products`);
};

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      title: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi tìm sản phẩm!");
    res.redirect(`${systemConfix.prefixAdmin}/products`);
  }
};
