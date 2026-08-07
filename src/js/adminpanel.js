(function () {
  const routes = [
    { label: "Dashboard", href: "adminpanel.html", icon: "▦", active: true },
    { label: "Customers", href: "customers.html", icon: "♙" },
    { label: "Products", href: "products.html", icon: "□" },
    { label: "Suppliers", href: "supplierman.html", icon: "◇" },
    { label: "Orders", href: "orders.html", icon: "☷" }
  ];

  const read = (key) => {
    return Storage.get(key);
  };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function renderNavigation() {
    document.getElementById("brandName").textContent = "AdminPro";
    document.getElementById("brandTagline").textContent = "Enterprise ERP";
    document.getElementById("nav").innerHTML = routes.map((item) => `<a class="nav-item ${item.active ? "is-active" : ""}" href="${item.href}" ${item.active ? 'aria-current="page"' : ""}><span class="simple-icon">${item.icon}</span><span>${item.label}</span></a>`).join("");
    document.getElementById("navFooter").innerHTML = `<a class="nav-item" href="configsystem.html"><span class="simple-icon">⚙</span><span>Settings</span></a>`;
  }

  function renderDashboard() {
    const customers = read("customers");
    const products = read("products");
    const suppliers = read("suppliers");
    const orders = read("orders");
    const metrics = BusinessRules.analytics();
    const roleLabel = AppCore.roleLabel();
    document.getElementById("topbarTitle").textContent = `Panel de Control · ${roleLabel}`;
    document.getElementById("searchInput").placeholder = "Buscar en AdminPro...";
    document.getElementById("welcome").innerHTML = `<div class="welcome-copy"><h2 class="welcome-greeting type-headline-md">Bienvenido de nuevo</h2><p class="welcome-subtitle type-body-md">Resumen actualizado de tu negocio</p></div>`;
    const cards = [
      ["Total clientes", metrics.customers, "customers.html"], ["Inventario bajo", metrics.lowStock, "products.html"],
      ["Proveedor principal", metrics.topSupplier ? `${metrics.topSupplier.companyName} (${metrics.topSupplierProducts})` : "Sin datos", "supplierman.html"], ["Pedidos pendientes", metrics.pendingOrders, "orders.html"]
    ];
    document.getElementById("kpiGrid").innerHTML = cards.map(([label, value, href]) => `<a class="kpi-card dashboard-link" href="${href}"><div class="kpi-body"><span class="kpi-label type-label-md">${label}</span><div class="kpi-value-row"><span class="kpi-value">${value}</span></div></div></a>`).join("");
    document.getElementById("chartPanel").innerHTML = `<div class="chart-panel-header"><h2 class="type-headline-md">Pedidos: cambiar estado</h2></div><div class="dashboard-orders">${orders.length ? orders.slice(-6).reverse().map((order) => { const customer=customers.find((item)=>String(item.id)===String(order.customerId)); return `<label><span>#${escapeHtml(String(order.id).slice(-6))} · ${escapeHtml(customer?.name || "Cliente eliminado")}</span><select data-order-status="${escapeHtml(order.id)}"><option value="pending" ${order.status === "pending" ? "selected" : ""}>Pendiente</option><option value="processing" ${order.status === "processing" ? "selected" : ""}>En proceso</option><option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Entregado</option></select></label>`; }).join("") : "Aún no hay pedidos."}</div>`;
    document.querySelectorAll("[data-order-status]").forEach((select) => { select.disabled = !AppCore.can("edit"); select.title = select.disabled ? "Solo el Administrador puede cambiar estados" : "Cambiar estado"; select.addEventListener("change", () => { if (AppCore.can("edit")) Storage.update("orders", select.dataset.orderStatus, { status: select.value }); }); });
    const recent = [...customers.slice(-2).map((x) => `Cliente: ${x.name}`), ...products.slice(-2).map((x) => `Producto: ${x.name}`), ...suppliers.slice(-1).map((x) => `Proveedor: ${x.companyName}`)].reverse();
    document.getElementById("activityPanel").innerHTML = `<h2 class="type-headline-md">Registros recientes</h2><ul class="activity-list">${recent.length ? recent.map((text) => `<li class="activity-item"><span class="activity-icon">✓</span><div class="activity-copy"><p class="activity-message type-body-md">${escapeHtml(text)}</p></div></li>`).join("") : '<li class="activity-item">Aún no hay registros.</li>'}</ul>`;
  }

  function mobileNavigation() {
    const shell = document.querySelector(".app-shell"); const scrim = document.getElementById("scrim");
    const close = () => { shell.classList.remove("nav-open"); scrim.hidden = true; };
    document.getElementById("menuBtn").addEventListener("click", () => { shell.classList.add("nav-open"); scrim.hidden = false; });
    document.getElementById("sidebarClose").addEventListener("click", close); scrim.addEventListener("click", close);
  }

  function init() {
    renderDashboard(); mobileNavigation();
    window.addEventListener("adminpro:datachange", renderDashboard);
  }
  document.addEventListener("DOMContentLoaded", init);
})();
