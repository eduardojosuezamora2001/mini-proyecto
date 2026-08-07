import { getUsers, updateUser } from "../auth/users.js";
import { save as saveAuth } from "../auth/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  const session = Storage.getSession();
  const activeUser = session?.user || { id:"guest", name:"Invitado", username:"guest", role:"operator" };
  let settings = Storage.get("settings");
  if (!settings || Array.isArray(settings)) settings = {};
  settings.profiles ||= {};
  settings.preferences ||= {};
  let pendingAvatar = settings.profiles[activeUser.id]?.avatar || "";

  const profileForm = document.getElementById("profile-form");
  const securityForm = document.getElementById("security-form");
  const preferencesForm = document.getElementById("preferences-form");
  const profileStatus = document.getElementById("profile-status");
  const avatarImage = document.getElementById("avatar-image");

  function flash(element, message, error = false) {
    element.textContent = message;
    element.classList.toggle("is-error", error);
    clearTimeout(element._timer);
    element._timer = setTimeout(() => { element.textContent = ""; }, 3200);
  }

  function profileData() {
    const stored = settings.profiles[activeUser.id] || {};
    const account = getUsers().find((user) => String(user.id) === String(activeUser.id)) || {};
    const nameParts = String(stored.name || account.name || activeUser.name || "").trim().split(/\s+/);
    return { firstName:stored.firstName || nameParts[0] || "", lastName:stored.lastName || nameParts.slice(1).join(" "), email:stored.email || account.email || "", avatar:stored.avatar || "" };
  }

  function showAvatar(source) {
    pendingAvatar = source || "";
    avatarImage.src = pendingAvatar;
    avatarImage.hidden = !pendingAvatar;
    document.querySelector("#avatar-preview i").hidden = Boolean(pendingAvatar);
  }

  function loadProfile() {
    const profile = profileData();
    document.getElementById("first-name").value = profile.firstName;
    document.getElementById("last-name").value = profile.lastName;
    document.getElementById("email").value = profile.email;
    showAvatar(profile.avatar);
  }

  document.querySelectorAll("[data-settings-tab]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-settings-tab]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-settings-panel]").forEach((panel) => { panel.hidden = panel.dataset.settingsPanel !== button.dataset.settingsTab; });
    if (button.dataset.settingsTab === "system") renderSystemInfo();
  }));

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!profileForm.reportValidity()) return;
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    if (getUsers().some((user) => String(user.id) !== String(activeUser.id) && String(user.email || "").toLowerCase() === email)) { flash(profileStatus, "Ese correo ya pertenece a otra cuenta.", true); return; }
    const name = `${firstName} ${lastName}`.trim();
    settings.profiles[activeUser.id] = { firstName, lastName, name, email, avatar:pendingAvatar };
    Storage.save("settings", settings);
    const updated = updateUser(activeUser.id, { name, email });
    if (session && updated) { session.user = { ...session.user, name:updated.name, role:updated.role, username:updated.username }; saveAuth("session", session); }
    flash(profileStatus, "Perfil guardado correctamente.");
  });

  document.getElementById("cancel-profile").addEventListener("click", () => { loadProfile(); flash(profileStatus, "Cambios descartados."); });
  document.getElementById("change-avatar").addEventListener("click", () => document.getElementById("avatar-file").click());
  document.getElementById("avatar-file").addEventListener("change", (event) => {
    const file = event.target.files[0]; if (!file) return;
    if (!/^image\/(png|jpeg|gif)$/.test(file.type) || file.size > 800 * 1024) { flash(profileStatus, "Usa una imagen PNG, JPG o GIF menor de 800 KB.", true); event.target.value = ""; return; }
    const reader = new FileReader(); reader.onload = () => showAvatar(reader.result); reader.readAsDataURL(file); event.target.value = "";
  });

  securityForm.addEventListener("submit", (event) => {
    event.preventDefault(); const status = document.getElementById("security-status");
    const account = getUsers().find((user) => String(user.id) === String(activeUser.id));
    const current = document.getElementById("current-password").value;
    const password = document.getElementById("new-password").value;
    const confirmation = document.getElementById("confirm-password").value;
    if (!account || account.password !== current) { flash(status, "La contraseña actual es incorrecta.", true); return; }
    if (password.length < 6 || password !== confirmation) { flash(status, "La nueva contraseña debe tener 6 caracteres y coincidir.", true); return; }
    updateUser(activeUser.id, { password }); securityForm.reset(); flash(status, "Contraseña actualizada.");
  });

  function loadPreferences() {
    const preferences = settings.preferences[activeUser.id] || {};
    document.getElementById("language").value = preferences.language || "es";
    document.getElementById("notifications-enabled").checked = preferences.notifications !== false;
    document.getElementById("page-size").value = String(preferences.pageSize || 15);
  }
  preferencesForm.addEventListener("submit", (event) => {
    event.preventDefault(); settings.preferences[activeUser.id] = { language:document.getElementById("language").value, notifications:document.getElementById("notifications-enabled").checked, pageSize:Number(document.getElementById("page-size").value) }; Storage.save("settings", settings); flash(document.getElementById("preferences-status"), "Preferencias guardadas.");
  });

  function renderSystemInfo() {
    const database = Storage.getDatabase();
    document.getElementById("system-details").innerHTML = `<div><dt>Versión de datos</dt><dd>${database.version}</dd></div><div><dt>Usuario activo</dt><dd>${activeUser.username}</dd></div><div><dt>Rol</dt><dd>${activeUser.role}</dd></div><div><dt>Última actualización</dt><dd>${new Date(database.metadata.updatedAt).toLocaleString()}</dd></div>`;
  }

  const exportButton=document.getElementById("export-data"),importButton=document.getElementById("import-data"),importFile=document.getElementById("import-file"),backupMessage=document.getElementById("backup-message");
  function updateBackupSummary(){const db=Storage.getDatabase();document.getElementById("backup-summary").textContent=`${db.customers.length} clientes · ${db.products.length} productos · ${db.suppliers.length} proveedores · ${db.orders.length} pedidos`}
  exportButton.addEventListener("click",()=>{Storage.downloadAll(`adminpro-backup-${new Date().toISOString().slice(0,10)}.json`);backupMessage.textContent="Respaldo exportado correctamente."});
  importButton.addEventListener("click",()=>importFile.click());
  importFile.addEventListener("change",async()=>{const file=importFile.files[0];if(!file)return;try{Storage.importAll(await file.text());settings=Storage.get("settings")||{};settings.profiles||={};settings.preferences||={};backupMessage.textContent="Información restaurada correctamente.";loadProfile();loadPreferences();updateBackupSummary()}catch(error){backupMessage.textContent=error.message}finally{importFile.value=""}});

  document.querySelector(".search input").addEventListener("input", (event) => { const term=event.target.value.toLowerCase(); document.querySelectorAll("[data-settings-tab]").forEach((button)=>{button.hidden=Boolean(term)&&!button.textContent.toLowerCase().includes(term)}); });
  loadProfile(); loadPreferences(); updateBackupSummary(); renderSystemInfo();
});
