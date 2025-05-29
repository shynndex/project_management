const Product = require("../../models/product.model");

const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category");


// .index là đặt tên để gọi làm từ bên file khác
//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProduct = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    title: "Trang sản phẩm",
    products: newProduct,
  });
};

//[GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      title: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi tìm sản phẩm!");
    res.redirect(`/products`);
  }
};

//[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      deleted: false,
      status: "active",
    });

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
      status: "active",
    }).sort({ position: "desc" });

    const newProduct = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
      title: `Danh mục ${category.title}`,
      products: newProduct,
    });
  } catch (error) {
    console.error("Error occurred in category page:", error);
    req.flash("error", "Đã xảy ra lỗi khi tìm danh mục!");
    res.redirect(`/`);
  }
};
