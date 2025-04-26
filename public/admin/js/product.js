// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      const changeStatus = statusCurrent == "active" ? "inactive" : "active";
      // console.log(statusCurrent);
      // console.log(id);
      // console.log(changeStatus);

      const action = path + `/${changeStatus}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}

//End Change Status

// Delete Product
const buttonDelete = document.querySelectorAll("[button-delete]");

if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-product");
  const path = formDeleteItem.getAttribute("data-path");

  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const id = button.getAttribute("data-id");
          const action = `${path}/${id}?_method=DELETE`;
          formDeleteItem.action = action;

          // Thêm một delay nhỏ để SweetAlert đóng hoàn toàn
          setTimeout(() => {
            formDeleteItem.submit();
          }, 300);
        }
       
      });
    });
  });
}

// const url = new URLSearchParams(window.location.search);
// const message=url.get("message");

// if(message==="delete-success"){
//   Swal.fire({
//     icon: "success",
//     title: "Đã xóa thành công!",
//     showConfirmButton: true,
//     timer: 3000,
//   });
// }

// // Xoá message khỏi URL để F5 không hiện lại
// window.history.replaceState({}, "", window.location.pathname);
//End Delete Product


