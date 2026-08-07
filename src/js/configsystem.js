document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const profileForm = document.querySelector(".profile-card");
  const navItems = document.querySelectorAll(".nav-item");
  const avatarButton = document.querySelector(".secondary-button");
  const exportButton = document.getElementById("export-data");
  const importButton = document.getElementById("import-data");
  const importFile = document.getElementById("import-file");
  const backupMessage = document.getElementById("backup-message");

  function updateBackupSummary() {
    const database = Storage.getDatabase();
    document.getElementById("backup-summary").textContent = `${database.customers.length} clientes · ${database.products.length} productos · ${database.suppliers.length} proveedores · ${database.orders.length} pedidos`;
  }

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

  exportButton.addEventListener("click", () => {
    Storage.downloadAll(`adminpro-backup-${new Date().toISOString().slice(0, 10)}.json`);
    backupMessage.textContent = "Respaldo exportado correctamente.";
  });

  importButton.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async () => {
    const file = importFile.files[0]; if (!file) return;
    try {
      Storage.importAll(await file.text());
      backupMessage.textContent = "Información restaurada correctamente.";
      updateBackupSummary();
    } catch (error) {
      backupMessage.textContent = error.message;
    } finally {
      importFile.value = "";
    }
  });
  updateBackupSummary();
});
