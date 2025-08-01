import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview(
  "upload-images",
  {
    multiple: true,
    maxFileCount: 6,
  }
);
//End file-upload-with-preview

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray;

    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      clearTimeout(timeOut); // Dừng luôn timer typing nếu có
    }
  });
}
//End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  const div = document.createElement("div");
  let htmlFullname = "";
  let htmlContent = "";
  let htmlImage = "";
  let htmlDropdown = "";

  if (myId == data.userId) {
    htmlDropdown = `
    <button class="inner-dot dropdown-toggle" data-bs-display="dynamic" data-bs-toggle="dropdown" aria-expanded="false" style="background:none; border:none;">
      <i class="fa-solid fa-ellipsis-vertical fa-lg" style="color:rgba(63, 60, 60, 0.45);"></i>
    </button>
    <ul class="dropdown-menu">
      <li class="dropdown-item" edit-message>Chỉnh sửa</li>
      <li class="dropdown-item" delete-message>Gỡ</li>
    </ul>
  `;
    div.classList.add("inner-outgoing");
    div.setAttribute("chat-id",data.chatId);
  } else {
    htmlFullname = `<div class="inner-name">${data.fullName}</div> `;
    div.classList.add("inner-incoming");
    div.setAttribute("chat-id",data.chatId);

  }

  if (data.content) {
    htmlContent = `
    <div class="message-row">
    ${htmlDropdown}
    <div class="inner-content">${data.content}</div>
    `;
  }

  if (data.images.length > 0) {
    htmlImage += `<div class="inner-images">`;
    data.images.forEach((image) => {
      htmlImage += `<img src="${image}">`;
    });
    htmlImage += `</div>`;
  }

  div.innerHTML = `
  ${htmlFullname}
  ${htmlContent}
  ${htmlImage}
  `;

  body.insertBefore(div, boxTyping);
  const deleteButtons = div.querySelectorAll("[delete-message]");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const messageDiv = button.closest("div[chat-id]");
      const chatId = messageDiv.getAttribute("chat-id");
      socket.emit("CLIENT_SEND_DELETE_MESSAGE", { chatId: chatId });
    });
  });

  body.scrollTop = body.scrollHeight;
  setTimeout(() => {
    body.scrollTop = body.scrollHeight;
  }, 400);

  fullImagePreview(div);
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

//Show typing
let timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
//End Show typing

// Insert emoji to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    const end = inputChat.value.length;
    inputChat.focus();
    inputChat.setSelectionRange(end, end);
    showTyping();
  });

  //Typing
  inputChat.addEventListener("input", () => {
    showTyping();
  });
  //End Typing
}
// End Insert emoji to input

// Emoji

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
// const myId = document.querySelector("[my-id]").getAttribute("my-id");
if (elementListTyping) {
  // if (data.userId === myId) return;
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `<div class="inner-name">${data.fullName}</div>
    <div class="inner-dots">
      <span></span>
     <span></span>
     <span></span>
     </div>`;

        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const existTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      if (existTypingRemove) {
        elementListTyping.removeChild(existTypingRemove);
      }
    }
  });
}

//End SERVER_RETURN_TYPING

const fullImagePreview = (bodyChat) => {
  if (bodyChat) {
    const gallery = new Viewer(bodyChat, {
      // Chỉ các thẻ img bên trong mới được zoom
      navbar: true,
      toolbar: {
        prev: true,
        next: true,
      },
      title: false,
      movable: false,
      scalable: false,
      zoomable: true,
      rotatable: false,
      transition: true,
      fullscreen: false,
      loop: true,
      zoomOnWheel: true,
      slideOnTouch: true,
      toggleOnDblclick: true,
    });
  }
};
//Full Image
// mediumZoom('.chat .inner-body img');
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");

fullImagePreview(bodyChatPreviewImage);

//End Full Image

// SERVER_RETURN_USER_STATUS_ONLINE_CHAT
let offlineTimeOut = {};
socket.on("SERVER_RETURN_USER_STATUS_ONLINE_CHAT", (data) => {
  const chatBox = document.querySelector(".chat");
  if (chatBox) {
    const userAvatarChat = chatBox.querySelector(".inner-avatar");
    const userInfoChat = chatBox.querySelector(".inner-info");
    if (data.status == "online") {
      //Add icon status realtime
      if (offlineTimeOut[data.userId]) {
        clearTimeout(offlineTimeOut[data.userId]);
        delete offlineTimeOut[data.userId];
      }

      const statusIcon = userAvatarChat.querySelector(".icon-status-online");
      if (!statusIcon) {
        const statusIconDiv = document.createElement("i");
        statusIconDiv.className = "fa-solid fa-circle icon-status-online";
        statusIconDiv.setAttribute("status", data.status);
        userAvatarChat.appendChild(statusIconDiv);
      }

      //Add status realtime
      const userStatus = userInfoChat.querySelector(".inner-status");
      if (!userStatus) {
        const userStatusDiv = document.createElement("div");
        userStatusDiv.classList.add("inner-status");
        userStatusDiv.innerText = "Đang hoạt động";
        userInfoChat.appendChild(userStatusDiv);
      }
    } else {
      if (offlineTimeOut[data.userId]) {
        clearTimeout(offlineTimeOut[data.userId]);
      }

      const iconOnline = userAvatarChat.querySelector(".icon-status-online");
      const statusOnline = userInfoChat.querySelector(".inner-status");
      if (iconOnline && statusOnline) {
        offlineTimeOut[data.userId] = setTimeout(() => {
          iconOnline.remove();
          statusOnline.remove();
          delete offlineTimeOut[data.userId];
        }, 2000);
      }
    }
  }
});

// End SERVER_RETURN_USER_STATUS_ONLINE_CHAT

//Delete message
const chatBox = document.querySelector(".chat");
if (chatBox) {
  const deleteButton = chatBox.querySelectorAll("[delete-message]");
  deleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      const messageDiv = button.closest("div[chat-id]");
      const chatId = messageDiv.getAttribute("chat-id");

      socket.emit("CLIENT_SEND_DELETE_MESSAGE", {
        chatId: chatId,
      });
    });
  });
}
//End Delete message

// SERVER_SEND_DELETE_MESSAGE
socket.on("SERVER_SEND_DELETE_MESSAGE", (data) => {
  const chatBox = document.querySelector(".chat");
  const myId = chatBox.getAttribute("my-id");

  const chatDiv = document.querySelector(`[chat-id="${data.chatId}"]`);
  if (chatDiv) {
    const dropdownDot = chatDiv.querySelector(".message-row .inner-dot");
    const chatContent = chatDiv.querySelector(".inner-content");
    if (myId == data.userId) {
      chatContent.textContent = "Bạn đã thu hồi tin nhắn";
      chatContent.className = "inner-content-deleted-outgoing";
      dropdownDot.remove();
    } else {
      chatContent.textContent = "Đã thu hồi tin nhắn";
      chatContent.className = "inner-content-deleted-incoming";
      dropdownDot.remove();
    }
  }
});
// End SERVER_SEND_DELETE_MESSAGE
