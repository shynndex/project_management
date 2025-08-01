const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const connectMiddleware = require("../../middlewares/client/connect.middleware");


const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");
const roomsChatRoutes = require("./rooms-chat.route");


// Xuất một hàm nhận app (Express instance) làm tham số.
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cardId);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.settingGeneral);


  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
  app.use("/chat", authMiddleware.requireAuth, chatRoutes);
  app.use("/users", authMiddleware.requireAuth,connectMiddleware.connect, usersRoutes);
  app.use("/rooms-chat", authMiddleware.requireAuth,connectMiddleware.connect, roomsChatRoutes);

};
