const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if (inputsQuantity.length > 0) {
inputsQuantity.forEach((input) => {
    //phải thêm sự kiện change hoặc input (quay lại cart/index.pug để tìm hiểu)
  input.addEventListener("change", () => {
    const productId=input.getAttribute("product-id");
    const quantity = input.value;

    console.log(productId);
    console.log(quantity);

    window.location.href=`/cart/update/${productId}/${quantity}`;
  });
});

}
