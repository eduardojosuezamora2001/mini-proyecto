/* ==========================================================================
   AdminPro — data-driven render
   ========================================================================== */

// ---------------------------------------------------------------------------
// 1. Data (exactly as supplied)
// ---------------------------------------------------------------------------
const DATA = {
  app: {
    name: "AdminPro",
    tagline: "Enterprise ERP",
    logoIcon: "compass"
  },
  navigation: {
    activeItem: "Suppliers",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "grid", route: "/dashboard", isActive: false },
      { id: "customers", label: "Customers", icon: "users", route: "/customers", isActive: false },
      { id: "products", label: "Products", icon: "box", route: "/products", isActive: false },
      { id: "suppliers", label: "Suppliers", icon: "truck", route: "/suppliers", isActive: true }
    ],
    footerItems: [
      { id: "settings", label: "Settings", icon: "gear", route: "/settings", isActive: false }
    ]
  },
  header: {
    search: {
      placeholder: "Search suppliers...",
      value: ""
    },
    notifications: {
      hasUnread: false
    },
    user: {
      avatarUrl: "/avatars/user.jpg"
    }
  },
  page: {
    title: "Administración de Proveedores",
    subtitle: "Manage and monitor enterprise supplier relationships.",
    primaryAction: {
      label: "Nuevo Proveedor",
      icon: "plus"
    },
    toolbar: {
      filterButton: { label: "Filter", icon: "filter" },
      exportButton: { label: "Export", icon: "download" }
    },
    table: {
      columns: ["Company Name", "Contact Person", "Contact Info", "Address", "Status", "Actions"],
      rows: [
        {
          id: "1",
          companyName: "GlobalTech Supplies",
          initials: "GT",
          contactPerson: "Elena Rodriguez",
          contactInfo: {
            email: "[elena.r@globaltech.com](mailto:elena.r@globaltech.com)",
            phone: "+1 (555) 123-4567"
          },
          address: "1200 Innovation Way, San ...",
          status: "Active",
          actions: { type: "menu", icon: "dots-vertical" }
        },
        {
          id: "2",
          companyName: "Apex Manufacturing",
          initials: "AP",
          contactPerson: "Marcus Chen",
          contactInfo: {
            email: "[m.chen@apex-mfg.com](mailto:m.chen@apex-mfg.com)",
            phone: "+1 (555) 987-6543"
          },
          address: "88 Industrial Pkwy, Detroit,...",
          status: "Active",
          actions: { type: "menu", icon: "dots-vertical" }
        },
        {
          id: "3",
          companyName: "Summit Logistics",
          initials: "SL",
          contactPerson: "Sarah Jenkins",
          contactInfo: {
            email: "[s.jenkins@summit.net](mailto:s.jenkins@summit.net)",
            phone: "+44 20 7123 4567"
          },
          address: "45 Canary Wharf, London, ...",
          status: "Inactive",
          actions: { type: "menu", icon: "dots-vertical" }
        }
      ]
    },
    pagination: {
      summaryText: "Showing 1 to 3 of 12 entries",
      currentPage: 1,
      totalPages: 3,
      totalEntries: 12,
      entriesPerPage: 3,
      hasPrevious: false,
      hasNext: true
    }
  }
};

// ---------------------------------------------------------------------------
// 2. Icon library — inline SVG, 2px stroke minimalist set
// ---------------------------------------------------------------------------
const ICONS = {
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="14" height="10" rx="1.5"/><path d="M15 10h4l3 3v3h-7z"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  "dots-vertical": '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>',
  "chevron-left": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  "chevron-right": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>'
};

function icon(name) {
  return ICONS[name] || "";
}

// ---------------------------------------------------------------------------
// 3. Helpers
// ---------------------------------------------------------------------------

// Accepts either a plain email or a "[text](mailto:addr)" markdown-style link
function parseEmailField(raw) {
  const match = /^\[(.+?)\]\(mailto:(.+?)\)$/.exec(raw || "");
  if (match) return { text: match[1], href: "mailto:" + match[2] };
  return { text: raw, href: "mailto:" + raw };
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

// ---------------------------------------------------------------------------
// Filtros — estado + persistencia en localStorage
// ---------------------------------------------------------------------------
const FILTERS_STORAGE_KEY = "adminpro.suppliers.filters";

const DEFAULT_FILTERS = {
  statusActive: true,
  statusInactive: true,
  dateFrom: "",
  dateTo: ""
};

function loadFilters() {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FILTERS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_FILTERS, ...parsed };
  } catch (err) {
    return { ...DEFAULT_FILTERS };
  }
}

function saveFilters(filters) {
  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch (err) {
    // localStorage no disponible; los filtros no persisten
  }
}

function isFiltersDefault(filters) {
  return (
    filters.statusActive === DEFAULT_FILTERS.statusActive &&
    filters.statusInactive === DEFAULT_FILTERS.statusInactive &&
    filters.dateFrom === DEFAULT_FILTERS.dateFrom &&
    filters.dateTo === DEFAULT_FILTERS.dateTo
  );
}

function matchesFilters(row, filters) {
  const status = row.status.toLowerCase();
  if (status === "active" && !filters.statusActive) return false;
  if (status === "inactive" && !filters.statusInactive) return false;
  if (filters.dateFrom && row.dateAdded < filters.dateFrom) return false;
  if (filters.dateTo && row.dateAdded > filters.dateTo) return false;
  return true;
}

let currentFilters = loadFilters();




// ---------------------------------------------------------------------------
// 4. Render: sidebar brand + navigation
// ---------------------------------------------------------------------------
function renderBrand(app) {
  document.getElementById("logo-icon").innerHTML = icon(app.logoIcon);
  document.getElementById("brand-name").textContent = app.name;
  document.getElementById("brand-tagline").textContent = app.tagline;
}

function renderNav(navigation) {
  const navMain = document.getElementById("nav-main");
  navMain.innerHTML = navigation.items.map(renderNavItem).join("");

  const navFooter = document.getElementById("nav-footer");
  navFooter.innerHTML = navigation.footerItems.map(renderNavItem).join("");
}

function renderNavItem(item) {
  return `
    <button class="nav-item ${item.isActive ? "is-active" : ""}" data-route="${item.route}" data-id="${item.id}">
      <span class="nav-icon">${icon(item.icon)}</span>
      <span class="nav-label">${escapeHtml(item.label)}</span>
    </button>
  `;
}

// ---------------------------------------------------------------------------
// 5. Render: topbar
// ---------------------------------------------------------------------------
function renderHeader(header) {
  document.getElementById("search-icon").innerHTML = icon("search");

  const searchInput = document.getElementById("search-input");
  searchInput.placeholder = header.search.placeholder;
  searchInput.value = header.search.value;

  document.getElementById("bell-icon").innerHTML = icon("bell");
  document.getElementById("notif-dot").hidden = !header.notifications.hasUnread;

  const avatarBtn = document.getElementById("user-avatar");
  const img = document.createElement("img");
  img.alt = "Avatar de usuario";
  img.src = header.user.avatarUrl;
  img.onerror = () => {
    avatarBtn.innerHTML = "";
    avatarBtn.textContent = "U";
  };
  avatarBtn.appendChild(img);
}

// ---------------------------------------------------------------------------
// 6. Render: page heading + toolbar
// ---------------------------------------------------------------------------
function renderPageHeading(page) {
  document.getElementById("page-title").textContent = page.title;
  document.getElementById("page-subtitle").textContent = page.subtitle;

  const primaryBtn = document.getElementById("primary-action");
  primaryBtn.innerHTML = `${icon(page.primaryAction.icon)}<span>${escapeHtml(page.primaryAction.label)}</span>`;
  primaryBtn.addEventListener("click", () => showToast(`"${page.primaryAction.label}" — formulario próximamente`));
}
function renderToolbar(toolbar) {
  const el = document.getElementById("toolbar");
  el.innerHTML = `
    <div class="filter-wrap" id="filter-wrap">
      <button class="btn btn-secondary filter-btn-wrap" id="filter-btn">
        ${icon(toolbar.filterButton.icon)}<span>${escapeHtml(toolbar.filterButton.label)}</span>
        <span class="filter-dot" id="filter-dot" hidden></span>
      </button>

      <div class="filter-panel" id="filter-panel">
        <div class="filter-panel-header">
          <span class="filter-panel-title">Filtros</span>
          <button type="button" class="filter-clear" id="filter-clear">Limpiar</button>
        </div>

        <div class="filter-group">
          <span class="filter-group-label">Estado</span>
          <div class="filter-checkbox-row">
            <label class="filter-checkbox">
              <input type="checkbox" id="filter-status-active">
              Activo
            </label>
            <label class="filter-checkbox">
              <input type="checkbox" id="filter-status-inactive">
              Inactivo
            </label>
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-group-label">Fecha de alta</span>
          <div class="filter-date-row">
            <input type="date" class="filter-date-input" id="filter-date-from" aria-label="Desde">
            <span>—</span>
            <input type="date" class="filter-date-input" id="filter-date-to" aria-label="Hasta">
          </div>
        </div>

        <div class="filter-panel-footer">
          <button type="button" class="btn btn-secondary" id="filter-cancel">Cancelar</button>
          <button type="button" class="btn btn-primary" id="filter-apply">Aplicar</button>
        </div>
      </div>
    </div>

    <button class="btn btn-secondary" id="export-btn">
      ${icon(toolbar.exportButton.icon)}<span>${escapeHtml(toolbar.exportButton.label)}</span>
    </button>
  `;

  document.getElementById("export-btn").addEventListener("click", () => showToast("Exportando proveedores..."));

  setupFilterPanel();
}

function updateFilterDot() {
  document.getElementById("filter-dot").hidden = isFiltersDefault(currentFilters);
}

function fillFilterInputs(filters) {
  document.getElementById("filter-status-active").checked = filters.statusActive;
  document.getElementById("filter-status-inactive").checked = filters.statusInactive;
  document.getElementById("filter-date-from").value = filters.dateFrom;
  document.getElementById("filter-date-to").value = filters.dateTo;
}

function readFilterInputs() {
  return {
    statusActive: document.getElementById("filter-status-active").checked,
    statusInactive: document.getElementById("filter-status-inactive").checked,
    dateFrom: document.getElementById("filter-date-from").value,
    dateTo: document.getElementById("filter-date-to").value
  };
}

function setupFilterPanel() {
  const wrap = document.getElementById("filter-wrap");
  const btn = document.getElementById("filter-btn");
  const panel = document.getElementById("filter-panel");

  fillFilterInputs(currentFilters);
  updateFilterDot();

  function openPanel() {
    fillFilterInputs(currentFilters);
    panel.classList.add("is-open");
  }
  function closePanel() {
    panel.classList.remove("is-open");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.contains("is-open");
    closeAllMenus();
    if (isOpen) closePanel(); else openPanel();
  });

  panel.addEventListener("click", (e) => e.stopPropagation());

  document.getElementById("filter-cancel").addEventListener("click", closePanel);

  document.getElementById("filter-apply").addEventListener("click", () => {
    currentFilters = readFilterInputs();
    saveFilters(currentFilters);
    updateFilterDot();
    refreshTable();
    closePanel();
    showToast("Filtros aplicados");
  });






  function refreshTable() {
    const input = document.getElementById("search-input");
    renderTableBody(DATA.page.table.rows, input ? input.value : "", currentFilters);
  }


  function setupSearch(rows) {
    const input = document.getElementById("search-input");
    input.addEventListener("input", () => refreshTable());
  }

  document.getElementById("filter-clear").addEventListener("click", () => {
    currentFilters = { ...DEFAULT_FILTERS };
    saveFilters(currentFilters);
    fillFilterInputs(currentFilters);
    updateFilterDot();
    refreshTable();
    closePanel();
    showToast("Filtros limpiados");
  });
}




// ---------------------------------------------------------------------------
// 7. Render: table
// ---------------------------------------------------------------------------
function renderTableHead(columns) {
  const thead = document.getElementById("table-head");
  thead.innerHTML = `<tr>${columns.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
}

function renderTableBody(rows, searchTerm = "", filters = DEFAULT_FILTERS) {
  const tbody = document.getElementById("table-body");
  const term = searchTerm.trim().toLowerCase();

  const filtered = rows.filter(r => {
    const matchesSearch = !term ||
      r.companyName.toLowerCase().includes(term) ||
      r.contactPerson.toLowerCase().includes(term);
    return matchesSearch && matchesFilters(r, filters);
  });

  tbody.innerHTML = filtered.map(renderRow).join("");

  // wire up per-row action menus
  tbody.querySelectorAll(".action-trigger").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      const isOpen = menu.classList.contains("is-open");
      closeAllMenus();
      if (!isOpen) menu.classList.add("is-open");
    });
  });

  tbody.querySelectorAll(".action-menu button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      showToast(btn.dataset.toast);
      closeAllMenus();
    });
  });
}

function closeAllMenus() {
  document.querySelectorAll(".action-menu.is-open").forEach(m => m.classList.remove("is-open"));
  document.querySelectorAll(".filter-panel.is-open").forEach(m => m.classList.remove("is-open"));
}

function renderRow(row) {
  const email = parseEmailField(row.contactInfo.email);
  const statusClass = row.status.toLowerCase() === "active" ? "status-active" : "status-inactive";

  return `
    <tr data-id="${row.id}">
      <td>
        <div class="cell-company">
          <div class="company-avatar">${escapeHtml(row.initials)}</div>
          <span class="company-name">${escapeHtml(row.companyName)}</span>
        </div>
      </td>
      <td class="cell-contact-person">${escapeHtml(row.contactPerson)}</td>
      <td class="cell-contact-info">
        <a class="contact-email" href="${email.href}">${escapeHtml(email.text)}</a>
        <span class="contact-phone">${escapeHtml(row.contactInfo.phone)}</span>
      </td>
      <td class="cell-address" title="${escapeHtml(row.address)}">${escapeHtml(row.address)}</td>
      <td><span class="status-chip ${statusClass}">${escapeHtml(row.status)}</span></td>
      <td class="cell-actions">
        <div class="action-menu-wrap">
          <button class="action-trigger" aria-label="Acciones para ${escapeHtml(row.companyName)}">
            ${icon(row.actions.icon)}
          </button>
          <div class="action-menu">
            <button data-toast="Viendo detalles de ${escapeHtml(row.companyName)}">${icon("eye")}<span>Ver detalles</span></button>
            <button data-toast="Editando ${escapeHtml(row.companyName)}">${icon("edit")}<span>Editar</span></button>
            <button class="danger" data-toast="${escapeHtml(row.companyName)} eliminado">${icon("trash")}<span>Eliminar</span></button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

// ---------------------------------------------------------------------------
// 8. Render: pagination
// ---------------------------------------------------------------------------
function renderPagination(pagination, onPageChange) {
  document.getElementById("table-summary").textContent = pagination.summaryText;

  const nav = document.getElementById("pagination");
  const pages = [];

  pages.push(`
    <button class="page-btn" id="page-prev" ${pagination.hasPrevious ? "" : "disabled"} aria-label="Página anterior">
      ${icon("chevron-left")}
    </button>
  `);

  for (let p = 1; p <= pagination.totalPages; p++) {
    pages.push(`
      <button class="page-btn ${p === pagination.currentPage ? "is-active" : ""}" data-page="${p}">${p}</button>
    `);
  }

  pages.push(`
    <button class="page-btn" id="page-next" ${pagination.hasNext ? "" : "disabled"} aria-label="Página siguiente">
      ${icon("chevron-right")}
    </button>
  `);

  nav.innerHTML = pages.join("");

  nav.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => onPageChange(parseInt(btn.dataset.page, 10)));
  });

  const prevBtn = document.getElementById("page-prev");
  const nextBtn = document.getElementById("page-next");
  if (!prevBtn.disabled) prevBtn.addEventListener("click", () => onPageChange(pagination.currentPage - 1));
  if (!nextBtn.disabled) nextBtn.addEventListener("click", () => onPageChange(pagination.currentPage + 1));
}

function goToPage(pageNumber) {
  const pagination = DATA.page.pagination;
  pagination.currentPage = pageNumber;
  pagination.hasPrevious = pageNumber > 1;
  pagination.hasNext = pageNumber < pagination.totalPages;

  const start = (pageNumber - 1) * pagination.entriesPerPage + 1;
  const end = Math.min(pageNumber * pagination.entriesPerPage, pagination.totalEntries);
  pagination.summaryText = `Showing ${start} to ${end} of ${pagination.totalEntries} entries`;

  renderPagination(pagination, goToPage);
  showToast(`Página ${pageNumber}`);
}

// ---------------------------------------------------------------------------
// 9. Sidebar mobile toggle
// ---------------------------------------------------------------------------
function setupMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const openBtn = document.getElementById("mobile-menu-toggle");
  const closeBtn = document.getElementById("sidebar-close");

  openBtn.innerHTML = icon("menu");
  closeBtn.innerHTML = icon("close");

  function open() {
    sidebar.classList.add("is-open");
    backdrop.classList.add("is-open");
  }
  function close() {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-open");
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
}

// ---------------------------------------------------------------------------
// 10. Wire-up: search filter, nav clicks, outside-click menu close
// ---------------------------------------------------------------------------
function setupSearch(rows) {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => renderTableBody(rows, input.value));
}

function setupNavClicks() {
  document.getElementById("nav-main").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-item");
    if (!btn) return;
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("is-active"));
    btn.classList.add("is-active");
    if (window.innerWidth <= 680) {
      document.getElementById("sidebar").classList.remove("is-open");
      document.getElementById("sidebar-backdrop").classList.remove("is-open");
    }
  });
}

document.addEventListener("click", closeAllMenus);

// ---------------------------------------------------------------------------
// 11. Init
// ---------------------------------------------------------------------------
function init() {
  renderBrand(DATA.app);
  renderNav(DATA.navigation);
  renderHeader(DATA.header);
  renderPageHeading(DATA.page);
  renderToolbar(DATA.page.toolbar);
  renderTableHead(DATA.page.table.columns);
  renderTableBody(DATA.page.table.rows, "", currentFilters);
  renderPagination(DATA.page.pagination, goToPage);
  setupSearch(DATA.page.table.rows);
  setupNavClicks();
  setupMobileSidebar();
}

document.addEventListener("DOMContentLoaded", init);







