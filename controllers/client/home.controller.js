const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// .index là đặt tên để gọi làm từ bên file khác
//[GET] /
module.exports.index = async (req, res) => {
  //Product featured
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);

  const newProductFeatured = productsHelper.priceNewProducts(productsFeatured);
  // End Product featured

  //Newest Product
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" }).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  //End Newest Product

  res.render("client/pages/home/index", {
    title: "Trang chủ",
    productsFeatured: newProductFeatured,
    productsNew: newProductsNew,
  });
};
