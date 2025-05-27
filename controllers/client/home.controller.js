
// .index là đặt tên để gọi làm từ bên file khác
//[GET] /
module.exports.index = async (req, res) => {
res.render("client/pages/home/index", {
    title: "Trang chủ",
  });
};
