import { addUser, getUsers } from "../auth/users.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const message = document.getElementById("register-error");
  const submit = document.getElementById("register-submit");

  function showMessage(text, success = false) {
    message.textContent = text;
    message.hidden = false;
    message.classList.toggle("is-success", success);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.hidden = true;
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const username = data.username.trim();
    const email = data.email.trim().toLowerCase();
    const users = getUsers();

    if (data.password !== data.confirmPassword) {
      showMessage("Las contraseñas no coinciden.");
      return;
    }
    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      showMessage("El nombre de usuario ya está registrado.");
      return;
    }
    if (users.some((user) => String(user.email || "").toLowerCase() === email)) {
      showMessage("El correo electrónico ya está registrado.");
      return;
    }
    if (!["client", "supplier"].includes(data.role)) {
      showMessage("Selecciona un rol válido.");
      return;
    }

    submit.disabled = true;
    addUser({ username, email, password: data.password, name: username, role: data.role });
    showMessage("Cuenta creada correctamente. Redirigiendo al inicio de sesión…", true);
    setTimeout(() => window.location.replace("login.html"), 1200);
  });
});
