const mongoose = require("mongoose");

//định nghĩa .connect là tên hàm để gọi
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect success !");
  } catch (error) {
    console.error("Connect error:", error);
  }
};
