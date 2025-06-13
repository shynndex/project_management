const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email:String,
    otp:String,
    expireAt:{
     type: Date,
     default: Date.now, 
    },
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục TTL cho trường expireAt, và tài liệu sẽ tự động bị xóa sau 3600 giây (1 giờ)
forgotPasswordSchema.index({ expireAt: 1 }, { expireAfterSeconds: 180 });

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;
