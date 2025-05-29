const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");


// .index là đặt tên để gọi làm từ bên file khác
//[GET] /
module.exports.index = async (req, res) => {

const productsFeatured = await Product.find({
  featured: "1",
  deleted:false,
  status:"active",
}).limit(6);

const newProduct = productsHelper.priceNewProducts(productsFeatured);


res.render("client/pages/home/index", {
    title: "Trang chủ",
    productsFeatured:newProduct,
  });
};
