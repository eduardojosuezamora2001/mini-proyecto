document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const profileForm = document.querySelector(".profile-card");
  const navItems = document.querySelectorAll(".nav-item");
  const avatarButton = document.querySelector(".secondary-button");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const navigationGroup = item.parentElement;

      navigationGroup
        .querySelectorAll(".nav-item")
        .forEach((navItem) => navItem.classList.remove("active"));

      item.classList.add("active");
    });
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const saveButton = profileForm.querySelector(".primary-button");
    const originalText = saveButton.textContent;

    saveButton.textContent = "Saved!";
    saveButton.disabled = true;

    window.setTimeout(() => {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    }, 1600);
  });

  avatarButton.addEventListener("click", () => {
    const filePicker = document.createElement("input");

    filePicker.type = "file";
    filePicker.accept = "image/png,image/jpeg,image/gif";
    filePicker.click();
  });
});