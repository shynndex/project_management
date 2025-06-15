const mongoose = require("mongoose");


const settingGeneralchema = new mongoose.Schema(
  {
    websiteName:String,
    logo:String,
    phone:String,
    email:String,
    address:String,
    copyright:String,
  },
  {
     timestamps: true
  }
);

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralchema, "settings-general");

module.exports = SettingGeneral;
