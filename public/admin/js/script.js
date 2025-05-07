// Button Status
//lấy tất cả thẻ dựa vào thuộc tính tự định nghĩa bằng cách dùng []
const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  //Tạo đối tượng URL từ đường dẫn hiện tại
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      //kiểm tra status có tồn tại,nếu có sẽ set theo status
      if (status) {
        url.searchParams.set("status", status);
        // url.searchParams.delete("page");
      } else {
        url.searchParams.delete("status");
      }
      //Cập nhật lại url
      window.location.href = url.href;
    });
  });
}

//End Button Status

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value; //document.querySelector("input").value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}
//End Form search

//pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((item) => {
    item.addEventListener("click", () => {
      const page = item.getAttribute("button-pagination");
      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
      window.location.href = url.href;
    });
  });
}

//end pagination

//Check box multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputcheckAll = checkboxMulti.querySelector("input[name=checkall]");
  const inputsid = checkboxMulti.querySelectorAll("input[name=id]");
  inputcheckAll.addEventListener("click", () => {
    if (inputcheckAll.checked) {
      inputsid.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsid.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsid.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name=id]:checked"
      );
      //có thể dùng every(tham khảo)
      if (countChecked.length === inputsid.length) {
        inputcheckAll.checked = true;
      } else {
        inputcheckAll.checked = false;
      }
    });
  });
}

//End Check box multi

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name=id]:checked"
    );

    const typeChange = e.target.elements.type.value;

    if (typeChange == "deleted-all") {
      const isConfirmed=confirm("Bạn có chắc chắn muốn xóa ?");

      if(!isConfirmed){
        return;
      }
    }
      
    if (inputChecked.length > 0) {
        let ids = [];
        const inputIds = formChangeMulti.querySelector("input[name='ids']");

        inputChecked.forEach((input) => {
          const id = input.value;

          if (typeChange == "change-position") {
            // Đi ra thẻ <tr> rồi tìm lại input có name='position'
            const position = input
              .closest("tr")
              .querySelector("input[name='position']").value;

              ids.push(`${id} - ${position}`);
          } else {
            ids.push(id);
          }
        });
        inputIds.value = ids.join(", ");

        formChangeMulti.submit();
      } else {
        alert("Vui lòng chọn ít nhất 1 bản ghi !");
      }
      });
    }
//End Form Change Multi

//Show alert
const showAlert=document.querySelector("[show-alert]");
if(showAlert){
  const time=parseInt(showAlert.getAttribute("data-time"));
  const closeAlert=showAlert.querySelector("[close-alert]");
  
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener('click',()=>{
    showAlert.classList.add("alert-hidden");
  })
}
//End Show alert

//Upload Image
  const uploadImage=document.querySelector("[upload-image]");


  if(uploadImage){
    const uploadImageInput=document.querySelector("[upload-image-input]");
    const uploadImagePreview=document.querySelector("[upload-image-preview]");
    const uploadImageRemove=document.querySelector("[remove-image-btn]");


    uploadImageInput.addEventListener('change',(e)=>{
      const file=e.target.files[0];
      if(file){
        uploadImagePreview.src=URL.createObjectURL(file);
        uploadImageRemove.classList.remove("d-none");
      }
    });

    uploadImageRemove.addEventListener('click',()=>{
      URL.revokeObjectURL(uploadImagePreview.src); // giải phóng bộ nhớ
      uploadImageInput.value="";
      uploadImagePreview.src="";
      uploadImageRemove.classList.add("d-none");
    })
  }

 
//End Upload Image

//Sort
const sort=document.querySelector("[sort]");
if(sort){
  let url = new URL(window.location.href);
  const sortSelect=sort.querySelector("[sort-select]");
  const sortClear=sort.querySelector("[sort-clear]");

 //sort
  sortSelect.addEventListener("change",(e)=>{
    const value=e.target.value;

    const [sortKey,sortValue]=value.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  //Reset sort
  sortClear.addEventListener("click",()=>{
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;
  });

  //Add selected

  const sortKey=url.searchParams.get("sortKey");
  const sortValue=url.searchParams.get("sortValue");
  
  if(sortKey && sortValue){
    const stringSort=`${sortKey}-${sortValue}`;
    const optionSelected=sortSelect.querySelector(`option[value='${stringSort}']`);
    optionSelected.selected=true;
  }

}
//End Sort
