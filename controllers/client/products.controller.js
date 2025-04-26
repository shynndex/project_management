const Product = require("../../models/product.model");

// .index là đặt tên để gọi làm từ bên file khác
//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position:"desc"});

  const newProduct=products.map((item) => {
    //tạo ra key pricenew để tính giá sau giảm
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) / 100 ).toFixed(0);
      return item;
  });

  // console.log(newProduct);

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
      status:"active",
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