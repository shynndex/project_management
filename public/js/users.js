// Send request
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");

      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// End Send request

// Cancel request
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// End Cancel request

// Cancel accept
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");

    const userId = button.getAttribute("btn-refuse-friend");

    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  });
};
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    refuseFriend(button);
  });
}
// End Cancel accept

// Accept
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");

    const userId = button.getAttribute("btn-accept-friend");

    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
};
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    acceptFriend(button);
  });
}
// End accept

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
  const userId = badgeUsersAccept.getAttribute("badge-users-accept");
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    if (userId === data.friendId) {
      badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
  });
}

// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  //Trang lời mời đã nhận
  const dataUserAccept = document.querySelector("[data-users-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-users-accept");
    if (userId === data.friendId) {
      const div = document.createElement("div");
      div.classList.add("col-4");
      div.setAttribute("user-id", data.infoUser._id);

      div.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="/images/avatar.png" alt="${data.infoUser.fullName}">
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUser.fullName}</div>
            <div class="inner-button">
              <button
                class="btn btn-sm btn-primary me-1"
                btn-accept-friend="${data.infoUser._id}">
                Chấp nhận
              </button>
              <button
                class="btn btn-sm btn-secondary me-1"
                btn-refuse-friend="${data.infoUser._id}">
                Xóa
              </button>
              <button
                class="btn btn-sm btn-secondary me-1"
                btn-deleted-friend
                disabled>
                Đã Xóa
              </button>
              <button
                class="btn btn-sm btn-primary me-1"
                btn-accepted-friend
                disabled= "">
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `;

      const nodeBefore = dataUserAccept.querySelector(".col-4");
      if (nodeBefore) {
        dataUserAccept.insertBefore(div, nodeBefore);
      } else {
        dataUserAccept.appendChild(div);
      }

      const buttonRefuse = div.querySelector("[btn-refuse-friend]");
      const buttonAccept = div.querySelector("[btn-accept-friend]");

      refuseFriend(buttonRefuse);
      acceptFriend(buttonAccept);
    }
  }

  //Trang danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId === data.friendId) {
      const boxUserRemove = dataUserNotFriend.querySelector(
        `[user-id="${data.infoUser._id}"]`
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});

// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const boxUserRemove = document.querySelector(`[user-id="${data.userId}"]`);

  if (boxUserRemove) {
    const dataUserAccept = document.querySelector("[data-users-accept]");
    const userId = dataUserAccept.getAttribute("data-users-accept");
    if (userId == data.friendId) {
      dataUserAccept.removeChild(boxUserRemove);
    }
  }
});
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND
