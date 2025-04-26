const productRoutes=require("./product.route");
const homeRoutes=require("./home.route");
// Xuất một hàm nhận app (Express instance) làm tham số.
module.exports = (app) => {
  app.use("/",homeRoutes);
  app.use("/products", productRoutes);
};
