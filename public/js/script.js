// Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  if (closeAlert) {
    closeAlert.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
    });
  }
}
// End Show alert

//Button Back
const buttonBack = document.querySelectorAll("[button-back]");
if (buttonBack.length > 0) {
  buttonBack.forEach((button) => {
    button.addEventListener("click", () => {
      //sẽ lỗi hiển thị lại thông báo
      history.back();
    });
  });
}
//End Button Back


