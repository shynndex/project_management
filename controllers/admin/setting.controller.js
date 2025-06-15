const SettingGeneral = require("../../models/settings-general.model");

//[GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settings = await SettingGeneral.findOne({});
  res.render("admin/pages/settings/general", {
    title: "Cài đặt chung",
    settings: settings,
  });
};

//[PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  try {
    const settings = await SettingGeneral.findOne({});
    if (settings) {
      await SettingGeneral.updateOne({ _id: settings.id }, req.body);
    } else {
      const settingGeneral = new SettingGeneral(req.body);

      await settingGeneral.save();
    }
    req.flash("success", "Cài đặt thành công !");
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra,vui lòng thử lại!");
  }
  res.redirect(req.get("Referer") || `${systemConfix.prefixAdmin}/products`);
};
