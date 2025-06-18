import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}
//End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");
  let htmlFullname = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullname = `<div class="inner-name">${data.fullName}</div> `;
    div.classList.add("inner-incoming");
  }
  div.innerHTML = `
  ${htmlFullname}
  <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});
//End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom

// Emoji
const buttonIcon = document.querySelector(".button-icon");
const tooltip = document.querySelector(".tooltip");

if (buttonIcon && tooltip) {
  const popperInstance = Popper.createPopper(buttonIcon, tooltip, {
    placement: "top-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8], // Điều chỉnh khoảng cách nếu muốn
        },
      },
    ],
  });

  buttonIcon.onclick = (e) => {
    tooltip.classList.toggle("shown");
    // Nếu muốn reset vị trí popper mỗi lần hiện
    popperInstance.update();
  };

  // Ẩn tooltip khi click ra ngoài
  document.addEventListener("mousedown", (event) => {
    if (!tooltip.contains(event.target) && !buttonIcon.contains(event.target)) {
      tooltip.classList.remove("shown");
    }
  });
}

// Insert emoji to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });
}
// End Insert emoji to input

// Emoji
