
/* ==========================================================================
   AdminPro — Enterprise ERP
   Renderiza toda la interfaz a partir de un único objeto de datos (`data`),
   siguiendo los tokens visuales de desing.md. Sin dependencias externas.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * 1. Datos de la aplicación
   * ------------------------------------------------------------------ */
  const data = {
    app: {
      name: 'AdminPro',
      tagline: 'Enterprise ERP'
    },
    navigation: {
      menuItems: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid', active: true },
        { id: 'customers', label: 'Customers', icon: 'users', active: false },
        { id: 'products', label: 'Products', icon: 'box', active: false },
        { id: 'suppliers', label: 'Suppliers', icon: 'truck', active: false }
      ],
      footerItems: [
        { id: 'settings', label: 'Settings', icon: 'gear' }
      ]
    },
    topBar: {
      title: 'Panel de Control',
      search: { placeholder: 'Buscar...' },
      notifications: { hasUnread: true },
      user: {
        name: 'Alex Mercer',
        role: 'Administrator',
        avatarUrl: 'assets/avatar-alex.png'
      }
    },
    welcomeSection: {
      greeting: 'Bienvenido de nuevo, Alex',
      subtitle: 'Resumen general de actividad',
      date: '2023-10-24',
      actions: [
        { label: 'Exportar Reporte', icon: 'download', type: 'primary' }
      ]
    },
    kpiCards: [
      {
        id: 'total_clientes',
        label: 'Total Clientes',
        value: 1280,
        icon: 'users',
        trend: { direction: 'up', percentage: 12 },
        status: 'normal'
      },
      {
        id: 'total_productos',
        label: 'Total Productos',
        value: 450,
        icon: 'archive',
        trend: { direction: 'up', percentage: 5 },
        status: 'normal'
      },
      {
        id: 'total_proveedores',
        label: 'Total Proveedores',
        value: 84,
        icon: 'ruler',
        trend: { direction: 'flat', percentage: 0 },
        status: 'normal'
      },
      {
        id: 'productos_disponibles',
        label: 'Productos Disp.',
        value: 320,
        icon: 'cube',
        trend: { direction: 'down', percentage: -2 },
        status: 'warning',
        alert: 'Alerta de stock'
      }
    ],
    monthlyGrowthChart: {
      title: 'Crecimiento Mensual',
      filters: [
        { label: 'Mes', active: true },
        { label: 'Año', active: false }
      ],
      chartType: 'bar',
      data: [],
      placeholder: 'Área de Visualización de Datos'
    },
    recentActivity: {
      title: 'Actividad Reciente',
      items: [
        {
          id: 1,
          type: 'new_customer',
          icon: 'user-plus',
          message: 'Nuevo cliente registrado: TechCorp Inc.',
          highlight: 'TechCorp Inc.',
          timestamp: 'Hace 10 min'
        },
        {
          id: 2,
          type: 'low_stock',
          icon: 'alert-triangle',
          message: 'Stock bajo para Monitor Dell 27" (Quedan 3)',
          highlight: 'Monitor Dell 27"',
          timestamp: 'Hace 45 min'
        },
        {
          id: 3,
          type: 'order_completed',
          icon: 'check-circle',
          message: 'Orden #8942 completada exitosamente.',
          highlight: '#8942',
          timestamp: 'Hace 2 horas'
        }
      ]
    }
  };

  /* ------------------------------------------------------------------
   * 2. Librería de íconos (trazo 2px, minimalista — ver desing.md §Icons)
   *    Cada entrada es el contenido interno de un <svg viewBox="0 0 24 24">
   * ------------------------------------------------------------------ */
  const ICONS = {
    'layout-grid': '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>',
    'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    'box': '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"></path><path d="M3 8l9 5 9-5"></path><path d="M12 21V13"></path>',
    'truck': '<rect x="1" y="3" width="15" height="13" rx="1"></rect><path d="M16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
    'settings': '<circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"></line><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"></line><line x1="17.7" y1="6.3" x2="19.8" y2="4.2"></line>',
    'x': '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
    'menu': '<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
    'search': '<circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
    'bell': '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
    'circle-user': '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="10" r="3"></circle><path d="M6.5 19a5.5 5.5 0 0 1 11 0"></path>',
    'download': '<path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path><path d="M5 21h14"></path>',
    'archive': '<rect x="2" y="4" width="20" height="5" rx="1"></rect><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"></path><line x1="10" y1="13" x2="14" y2="13"></line>',
    'ruler': '<rect x="3" y="8" width="18" height="8" rx="1"></rect><line x1="7" y1="8" x2="7" y2="11"></line><line x1="10.5" y1="8" x2="10.5" y2="11"></line><line x1="14" y1="8" x2="14" y2="11"></line><line x1="17.5" y1="8" x2="17.5" y2="11"></line>',
    'trending-up': '<polyline points="3 17 9 11 13 15 21 6"></polyline><polyline points="15 6 21 6 21 12"></polyline>',
    'trending-down': '<polyline points="3 7 9 13 13 9 21 18"></polyline><polyline points="15 18 21 18 21 12"></polyline>',
    'minus': '<line x1="5" y1="12" x2="19" y2="12"></line>',
    'triangle-alert': '<path d="M10.3 4.2L2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z"></path><line x1="12" y1="9.5" x2="12" y2="13.5"></line><line x1="12" y1="16.5" x2="12.01" y2="16.5"></line>',
    'bar-chart': '<line x1="5" y1="21" x2="5" y2="13"></line><line x1="12" y1="21" x2="12" y2="7"></line><line x1="19" y1="21" x2="19" y2="16"></line>',
    'user-plus': '<path d="M13 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="7" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line>',
    'check-circle': '<circle cx="12" cy="12" r="9"></circle><polyline points="8 12.5 11 15.5 16 9"></polyline>'
  };

  // Traduce los nombres de ícono del JSON de datos a claves de ICONS
  const ICON_ALIAS = {
    grid: 'layout-grid',
    gear: 'settings',
    cube: 'box',
    'alert-triangle': 'triangle-alert'
  };

  function iconMarkup(name) {
    const key = ICON_ALIAS[name] || name;
    const inner = ICONS[key] || '';
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + inner + '</svg>';
  }

  function mountIcons(root) {
    root.querySelectorAll('[data-icon]').forEach(function (el) {
      el.innerHTML = iconMarkup(el.getAttribute('data-icon'));
    });
  }

  /* ------------------------------------------------------------------
   * 3. Utilidades
   * ------------------------------------------------------------------ */
  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function formatDateEs(isoDate) {
    const parts = isoDate.split('-');
    const year = parts[0];
    const month = MESES[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    return day + ' ' + month + ' ' + year;
  }

  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Envuelve la primera aparición de `highlight` dentro de `message` en <b>
  function highlightMessage(message, highlight) {
    const safeMessage = escapeHtml(message);
    if (!highlight) return safeMessage;
    const safeHighlight = escapeHtml(highlight);
    const idx = safeMessage.indexOf(safeHighlight);
    if (idx === -1) return safeMessage;
    return (
      safeMessage.slice(0, idx) +
      '<b>' + safeHighlight + '</b>' +
      safeMessage.slice(idx + safeHighlight.length)
    );
  }

  function initials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(function (w) { return w[0]; })
      .join('')
      .toUpperCase();
  }

  const KPI_ACCENT = {
    total_clientes: { bg: 'var(--accent-blue-bg)', fg: 'var(--accent-blue-fg)' },
    total_productos: { bg: 'var(--accent-purple-bg)', fg: 'var(--accent-purple-fg)' },
    total_proveedores: { bg: 'var(--accent-green-bg)', fg: 'var(--accent-green-fg)' },
    productos_disponibles: { bg: 'var(--accent-orange-bg)', fg: 'var(--accent-orange-fg)' }
  };

  const ACTIVITY_ACCENT = {
    new_customer: { bg: 'var(--accent-blue-bg)', fg: 'var(--accent-blue-fg)' },
    low_stock: { bg: 'var(--accent-orange-bg)', fg: 'var(--accent-orange-fg)' },
    order_completed: { bg: 'var(--accent-success-bg)', fg: 'var(--accent-success-fg)' }
  };

  const TREND_ICON = { up: 'trending-up', down: 'trending-down', flat: 'minus' };

  /* ------------------------------------------------------------------
   * 4. Renderizado
   * ------------------------------------------------------------------ */

  function renderBrand() {
    document.getElementById('brandName').textContent = data.app.name;
    document.getElementById('brandTagline').textContent = data.app.tagline;
  }

  function renderNav() {
    const nav = document.getElementById('nav');
    nav.addEventListener('click', function (e) {
      const btn = e.target.closest('.nav-item');
      if (!btn) return;
      nav.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('is-active'); });
      btn.classList.add('is-active');
      closeMobileNav();
    });

    const footer = document.getElementById('navFooter');
    footer.innerHTML = data.navigation.footerItems.map(function (item) {
      return (
        '<button type="button" class="nav-item" data-nav-id="' + item.id + '">' +
        '<span data-icon="' + item.icon + '"></span>' +
        '<span>' + escapeHtml(item.label) + '</span>' +
        '</button>'
      );
    }).join('');
  }

  function renderUserCard() {
    const u = data.topBar.user;
    document.getElementById('userCard').innerHTML =
      '<span class="user-avatar">' + escapeHtml(initials(u.name)) + '</span>' +
      '<div>' +
      '<div class="user-name">' + escapeHtml(u.name) + '</div>' +
      '<div class="user-role">' + escapeHtml(u.role) + '</div>' +
      '</div>';
  }

  function renderTopBar() {
    document.getElementById('topbarTitle').className = 'topbar-title type-display';
    document.getElementById('topbarTitle').textContent = data.topBar.title;
    document.getElementById('searchInput').placeholder = data.topBar.search.placeholder;
    document.getElementById('bellDot').hidden = !data.topBar.notifications.hasUnread;
  }

  function renderWelcome() {
    const w = data.welcomeSection;
    const actionsHtml = w.actions.map(function (a) {
      return (
        '<button type="button" class="btn btn-primary">' +
        '<span data-icon="' + a.icon + '"></span>' +
        '<span>' + escapeHtml(a.label) + '</span>' +
        '</button>'
      );
    }).join('');

    document.getElementById('welcome').innerHTML =
      '<div class="welcome-copy">' +
      '<h2 class="welcome-greeting type-headline-md">' + escapeHtml(w.greeting) + '</h2>' +
      '<p class="welcome-subtitle type-body-md">' + escapeHtml(w.subtitle) + ' - Hoy, ' + formatDateEs(w.date) + '</p>' +
      '</div>' +
      '<div class="welcome-actions">' + actionsHtml + '</div>';
  }

  function renderKpiCards() {
    const grid = document.getElementById('kpiGrid');
    grid.innerHTML = data.kpiCards.map(function (card) {
      const accent = KPI_ACCENT[card.id] || KPI_ACCENT.total_clientes;
      const isWarning = card.status === 'warning';
      const direction = card.trend.direction;
      const trendIcon = TREND_ICON[direction] || 'minus';
      const pct = card.trend.percentage;
      const trendLabel = direction === 'flat' ? (pct + '%') : (pct > 0 ? '+' + pct + '%' : pct + '%');

      const alertHtml = (isWarning && card.alert)
        ? '<span class="kpi-alert type-label-sm"><span data-icon="triangle-alert"></span>' + escapeHtml(card.alert) + '</span>'
        : '';

      return (
        '<article class="kpi-card' + (isWarning ? ' is-warning' : '') + '">' +
        '<div class="kpi-top">' +
        '<span class="kpi-icon" style="background:' + accent.bg + ';color:' + accent.fg + '" data-icon="' + card.icon + '"></span>' +
        '<span class="kpi-trend is-' + direction + ' type-label-sm">' +
        '<span data-icon="' + trendIcon + '"></span>' + trendLabel +
        '</span>' +
        '</div>' +
        '<div class="kpi-body">' +
        '<span class="kpi-label type-label-md">' + escapeHtml(card.label) + '</span>' +
        '<div class="kpi-value-row">' +
        '<span class="kpi-value">' + formatNumber(card.value) + '</span>' +
        alertHtml +
        '</div>' +
        '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderChartPanel() {
    const c = data.monthlyGrowthChart;
    const filtersHtml = c.filters.map(function (f, i) {
      return '<button type="button" class="segmented-btn' + (f.active ? ' is-active' : '') + '" data-filter-index="' + i + '">' + escapeHtml(f.label) + '</button>';
    }).join('');

    const panel = document.getElementById('chartPanel');
    panel.innerHTML =
      '<div class="chart-panel-header">' +
      '<h2 class="type-headline-md">' + escapeHtml(c.title) + '</h2>' +
      '<div class="segmented">' + filtersHtml + '</div>' +
      '</div>' +
      '<div class="chart-placeholder">' +
      '<span data-icon="bar-chart"></span>' +
      '<span class="type-body-md">' + escapeHtml(c.placeholder) + '</span>' +
      '</div>';

    panel.querySelector('.segmented').addEventListener('click', function (e) {
      const btn = e.target.closest('.segmented-btn');
      if (!btn) return;
      panel.querySelectorAll('.segmented-btn').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  }

  function renderActivityPanel() {
    const a = data.recentActivity;
    const itemsHtml = a.items.map(function (item) {
      const accent = ACTIVITY_ACCENT[item.type] || ACTIVITY_ACCENT.new_customer;
      return (
        '<li class="activity-item">' +
        '<span class="activity-icon" style="background:' + accent.bg + ';color:' + accent.fg + '" data-icon="' + item.icon + '"></span>' +
        '<div class="activity-copy">' +
        '<p class="activity-message type-body-md">' + highlightMessage(item.message, item.highlight) + '</p>' +
        '<span class="activity-time type-label-md">' + escapeHtml(item.timestamp) + '</span>' +
        '</div>' +
        '</li>'
      );
    }).join('');

    document.getElementById('activityPanel').innerHTML =
      '<h2 class="type-headline-md">' + escapeHtml(a.title) + '</h2>' +
      '<ul class="activity-list">' + itemsHtml + '</ul>';
  }

  /* ------------------------------------------------------------------
   * 5. Navegación móvil (sidebar off-canvas)
   * ------------------------------------------------------------------ */
  function openMobileNav() {
    document.querySelector('.app-shell').classList.add('nav-open');
    document.getElementById('scrim').hidden = false;
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'true');
  }
  function closeMobileNav() {
    document.querySelector('.app-shell').classList.remove('nav-open');
    document.getElementById('scrim').hidden = true;
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
  }
  function initMobileNav() {
    document.getElementById('menuBtn').addEventListener('click', openMobileNav);
    document.getElementById('sidebarClose').addEventListener('click', closeMobileNav);
    document.getElementById('scrim').addEventListener('click', closeMobileNav);
  }

  /* ------------------------------------------------------------------
   * 6. Arranque
   * ------------------------------------------------------------------ */
  function init() {
    renderBrand();
    renderNav();
    renderUserCard();
    renderTopBar();
    renderWelcome();
    renderKpiCards();
    renderChartPanel();
    renderActivityPanel();
    initMobileNav();
    mountIcons(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();