module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword.trim();

    //dùng regex để tìm kiếm tất cả chuỗi có chuỗi con giống keyword,sau đó lọc từ db
    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regex = regex;
  }

  return objectSearch;
};
