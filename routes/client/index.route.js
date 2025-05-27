const categoryMiddleware = require("../../middlewares/client/category.middleware");

const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
// Xuất một hàm nhận app (Express instance) làm tham số.
module.exports = (app) => {
  app.use(categoryMiddleware.category)

  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
};
