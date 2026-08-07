const AppCore = (() => {
  const PAGE_SIZE = 15;
  function session() { return Storage.getSession(); }
  function user() { const active = session()?.user; return active ? { ...active, role: active.role || (active.username === "admin" ? "admin" : "operator") } : { name: "Invitado", role: "operator" }; }
  function isAdmin() { return user().role === "admin"; }
  function roleLabel(role = user().role) { return ({ admin:"Administrador", operator:"Operador", client:"Cliente", supplier:"Proveedor" })[role] || "Usuario"; }
  function can(action) { return BusinessRules.can(user().role, action); }
  function applyPermissions(root = document) { root.querySelectorAll("[data-permission]").forEach((element) => { const allowed = can(element.dataset.permission); element.hidden = !allowed; element.disabled = !allowed; }); }
  function debounce(callback, wait = 250) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => callback(...args), wait); }; }
  function page(items, current = 1, size) { const preferred = Storage.get("settings")?.preferences?.[user().id]?.pageSize; const pageSize = Number(size || preferred || PAGE_SIZE); const totalPages = Math.max(1, Math.ceil(items.length / pageSize)); const safePage = Math.min(Math.max(1, current), totalPages); return { items: items.slice((safePage - 1) * pageSize, safePage * pageSize), current: safePage, totalPages, totalItems: items.length, pageSize }; }
  function pagination(container, result, onChange) { if (!container) return; container.innerHTML = `<button ${result.current === 1 ? "disabled" : ""} data-page="${result.current - 1}">‹</button><span>Página ${result.current} de ${result.totalPages}</span><button ${result.current === result.totalPages ? "disabled" : ""} data-page="${result.current + 1}">›</button>`; container.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => onChange(Number(button.dataset.page)))); }
  function notify(detail = {}) { window.dispatchEvent(new CustomEvent("adminpro:datachange", { detail })); }
  return { PAGE_SIZE, session, user, isAdmin, roleLabel, can, applyPermissions, debounce, page, pagination, notify };
})();
window.AppCore = AppCore;
