// Permissions
const tablePermission = document.querySelector("[table-permissions]");

if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermission.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;

          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });

    if (permissions.length > 0) {
      const formChangePermission = document.querySelector(
        "#form-change-permissions"
      );
      const inputPermission = formChangePermission.querySelector(
        "input[name='permissions']"
      );
      inputPermission.value = JSON.stringify(permissions);
      formChangePermission.submit();
    }
  });
}
// End Permissions

//Permission Data Default
const dataPermissions = document.querySelector("[data-permissions]");
if (dataPermissions) {
  const permissions = JSON.parse(
    dataPermissions.getAttribute("data-permissions")
  );
  const tablePermission = document.querySelector("[table-permissions]");

  permissions.forEach((item, index) => {
    const permissionList = item.permissions;
    console.log(permissionList);

    permissionList.forEach((data) => {
      const rows = tablePermission.querySelector(`[data-name="${data}"]`);
      const input = rows.querySelectorAll("input")[index];

      input.checked = true;
    });
  });
}
//End Permission Data Default
