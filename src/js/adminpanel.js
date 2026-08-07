(function () {
  const routes = [
    { label: "Dashboard", href: "adminpanel.html", icon: "▦", active: true },
    { label: "Customers", href: "customers.html", icon: "♙" },
    { label: "Products", href: "products.html", icon: "□" },
    { label: "Suppliers", href: "supplierman.html", icon: "◇" }
  ];

  const read = (key) => {
    try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : []; }
    catch { return []; }
  };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function renderNavigation() {
    document.getElementById("brandName").textContent = "AdminPro";
    document.getElementById("brandTagline").textContent = "Enterprise ERP";
    document.getElementById("nav").innerHTML = routes.map((item) => `<a class="nav-item ${item.active ? "is-active" : ""}" href="${item.href}" ${item.active ? 'aria-current="page"' : ""}><span class="simple-icon">${item.icon}</span><span>${item.label}</span></a>`).join("");
    document.getElementById("navFooter").innerHTML = `<a class="nav-item" href="configsystem.html"><span class="simple-icon">⚙</span><span>Settings</span></a>`;
  }

  function renderDashboard() {
    const customers = read("adminpro_customers");
    const products = read("adminpro_products");
    const suppliers = read("adminpro_suppliers");
    const available = products.filter((product) => Number(product.stock) > 0).length;
    const lowStock = products.filter((product) => Number(product.stock) <= 10).length;
    document.getElementById("topbarTitle").textContent = "Panel de Control";
    document.getElementById("searchInput").placeholder = "Buscar en AdminPro...";
    document.getElementById("welcome").innerHTML = `<div class="welcome-copy"><h2 class="welcome-greeting type-headline-md">Bienvenido de nuevo</h2><p class="welcome-subtitle type-body-md">Resumen actualizado de tu negocio</p></div>`;
    const cards = [
      ["Total Clientes", customers.length, "customers.html"], ["Total Productos", products.length, "products.html"],
      ["Total Proveedores", suppliers.length, "supplierman.html"], ["Productos disponibles", available, "products.html"]
    ];
    document.getElementById("kpiGrid").innerHTML = cards.map(([label, value, href]) => `<a class="kpi-card dashboard-link" href="${href}"><div class="kpi-body"><span class="kpi-label type-label-md">${label}</span><div class="kpi-value-row"><span class="kpi-value">${value}</span></div></div></a>`).join("");
    document.getElementById("chartPanel").innerHTML = `<div class="chart-panel-header"><h2 class="type-headline-md">Estado del inventario</h2></div><div class="chart-placeholder"><strong>${lowStock}</strong><span class="type-body-md">productos con stock bajo o agotado</span></div>`;
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
    renderNavigation(); renderDashboard(); mobileNavigation();
    document.getElementById("userCard").innerHTML = '<span class="user-avatar">AD</span><div><div class="user-name">Administrador</div><div class="user-role">AdminPro</div></div>';
  }
  document.addEventListener("DOMContentLoaded", init);
})();
