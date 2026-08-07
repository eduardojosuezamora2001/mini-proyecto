class AdminSidebar extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.classList.add("sidebar", "admin-sidebar");
    const active = this.getAttribute("active") || "dashboard";
    const items = [
      ["dashboard", "adminpanel.html", "Dashboard", "grid"],
      ["customers", "customers.html", "Customers", "users"],
      ["products", "products.html", "Products", "box"],
      ["suppliers", "supplierman.html", "Suppliers", "truck"],
      ["orders", "orders.html", "Orders", "cart"]
    ];
    const session = window.Storage?.getSession?.();
    const user = session?.user || { name:"Administrador", role:"admin" };
    const roleLabels = { admin:"Administrador", operator:"Operador", client:"Cliente", supplier:"Proveedor" };
    const initials = String(user.name || "AdminPro").split(/\s+/).slice(0,2).map((word)=>word[0]).join("").toUpperCase();
    this.innerHTML = `<div class="admin-sidebar__top"><a class="admin-sidebar__brand" href="adminpanel.html"><span class="admin-sidebar__mark">AP</span><span class="admin-sidebar__brand-copy"><strong id="brandName">AdminPro</strong><small id="brandTagline">Enterprise ERP</small></span></a><button class="admin-sidebar__close" id="sidebarClose" type="button" aria-label="Cerrar menú">×</button><nav class="admin-sidebar__nav" id="nav" aria-label="Navegación principal">${items.map(([id,href,label,icon])=>`<a class="admin-sidebar__link ${active===id?"is-active":""}" href="${href}" ${active===id?'aria-current="page"':""}><span class="admin-sidebar__icon">${this.icon(icon)}</span><span>${label}</span></a>`).join("")}</nav></div><div class="admin-sidebar__bottom"><nav id="navFooter"><a class="admin-sidebar__link ${active==="settings"?"is-active":""}" href="configsystem.html" ${active==="settings"?'aria-current="page"':""}><span class="admin-sidebar__icon">${this.icon("settings")}</span><span>Settings</span></a></nav><div class="admin-sidebar__user" id="userCard"><span class="admin-sidebar__avatar">${this.escape(initials)}</span><span class="admin-sidebar__user-copy"><strong>${this.escape(user.name)}</strong><small>${this.escape(roleLabels[user.role] || "Usuario")}</small></span></div></div>`;
    this.querySelector("#sidebarClose").addEventListener("click", () => {
      document.querySelector(".app-shell")?.classList.remove("nav-open");
      const scrim = document.getElementById("scrim"); if (scrim) scrim.hidden = true;
    });
  }
  escape(value) { const div=document.createElement("div"); div.textContent=value??""; return div.innerHTML; }
  icon(name) {
    const paths={grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',box:'<path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 21v-8"/>',truck:'<path d="M1 5h14v11H1zM15 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="19" cy="18" r="2"/>',cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.5 11h11l2-7H6"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2.9 2.9-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1-2.9-2.9.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1 2.9-2.9.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1 2.9 2.9-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>'};
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]||""}</svg>`;
  }
}
customElements.define("admin-sidebar", AdminSidebar);
