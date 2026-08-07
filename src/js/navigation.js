/**
 * navigation.js
 * -----------------------------------------------------------------------
 * Componente de navegación "todo en uno". Este archivo:
 *   1. Contiene la configuración del menú (labels, iconos, links, etc.)
 *   2. Genera el HTML del sidebar
 *   3. Detecta automáticamente en qué página está el usuario
 *   4. Lo inyecta dentro de <aside id="sidebar"></aside>
 *
 * En cada documento HTML SOLO necesitas:
 *
 *   <body data-page="customers">
 *     <aside id="sidebar"></aside>
 *     ...
 *     <script src="navigation.js" defer></script>
 *   </body>
 *
 * "data-page" identifica la página actual (debe coincidir con el "id"
 * del item correspondiente en MENU_ITEMS, más abajo) y es lo único que
 * cambia entre un HTML y otro. Si no pones data-page, el script intenta
 * adivinarlo a partir del nombre del archivo (ej: customers.html -> customers).
 * -----------------------------------------------------------------------
 */
(function () {
    'use strict';

    /* =======================================================================
     * 1) CONFIGURACIÓN — edita aquí las secciones, labels e iconos
     * ===================================================================== */

    const BRAND = {
        name: 'MiApp',
        tagline: 'Panel de control'
    };

    const MENU_ITEMS = [
        { id: 'adminpanel', label: 'Dashboard', icon: 'grid', href: 'adminpanel.html' },
        { id: 'customers', label: 'Customers', icon: 'users', href: 'customers.html' },
        { id: 'products', label: 'Products', icon: 'box', href: 'products.html' },
        { id: 'supplierman', label: 'Suppliers', icon: 'truck', href: 'supplierman.html' }
    ];

    const FOOTER_ITEMS = [
        { id: 'settings', label: 'Configuración', icon: 'settings', href: 'settings.html' },
        { id: 'logout', label: 'Cerrar sesión', icon: 'log-out', href: '#' }
    ];

    const USER = {
        name: 'Juan Pérez',
        role: 'Administrador',
        icon: 'user'
    };

    /**
     * Overrides opcionales de labels por página.
     * Clave = id de la página (el mismo valor que pones en data-page).
     * Valor = objeto { idDelItem: 'nuevo label' }.
     * Útil si en una página quieres, por ejemplo, mostrar un contador
     * o un texto distinto sin duplicar todo el menú.
     *
     * Ejemplo:
     *   customers: { customers: 'Clientes (12)' }
     */
    const PAGE_LABEL_OVERRIDES = {
        // customers: { customers: 'Clientes (12)' }
    };

    /* =======================================================================
     * 2) LÓGICA — normalmente no necesitas tocar nada de aquí para abajo
     * ===================================================================== */

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function iconSpan(icon, extraClass) {
        return `<span class="${extraClass || ''}" data-icon="${escapeHTML(icon)}" aria-hidden="true"></span>`;
    }

    function renderMenuItem(item, currentId) {
        const isActive = item.id === currentId;
        return `
      <a href="${escapeHTML(item.href || '#')}" class="nav-item${isActive ? ' active' : ''}" data-id="${escapeHTML(item.id)}"${isActive ? ' aria-current="page"' : ''}>
        ${iconSpan(item.icon)}
        <span class="nav-label">${escapeHTML(item.label)}</span>
      </a>`;
    }

    function renderUserCard(user) {
        if (!user) return '';
        return `
      <div class="user-avatar" data-icon="${escapeHTML(user.icon || 'user')}" aria-hidden="true"></div>
      <div class="user-info">
        <span class="user-name">${escapeHTML(user.name || '')}</span>
        <span class="user-role">${escapeHTML(user.role || '')}</span>
      </div>`;
    }

    function detectCurrentPageId() {
        // 1) Prioridad: <body data-page="...">
        const fromBody = document.body ? document.body.dataset.page : null;
        if (fromBody) return fromBody;

        // 2) Fallback: deducirlo del nombre de archivo (customers.html -> customers)
        const file = (location.pathname.split('/').pop() || '').replace(/\.html?$/i, '');
        return file || 'dashboard';
    }

    function withLabelOverrides(items, currentId) {
        const overrides = PAGE_LABEL_OVERRIDES[currentId];
        if (!overrides) return items;
        return items.map((item) =>
            overrides[item.id] ? { ...item, label: overrides[item.id] } : item
        );
    }

    function buildSidebarHTML(currentId) {
        const menuItems = withLabelOverrides(MENU_ITEMS, currentId);
        const footerItems = withLabelOverrides(FOOTER_ITEMS, currentId);

        return `
      <div class="sidebar-top">
        <div class="brand">
          <span class="brand-mark" data-icon="layout-grid" aria-hidden="true"></span>
          <div class="brand-copy">
            <span class="brand-name" id="brandName">${escapeHTML(BRAND.name)}</span>
            <span class="brand-tagline" id="brandTagline">${escapeHTML(BRAND.tagline)}</span>
          </div>
          <button class="sidebar-close" id="sidebarClose" aria-label="Cerrar menú" data-icon="x"></button>
        </div>
        <nav class="nav" id="nav" aria-label="Secciones">
          ${menuItems.map((item) => renderMenuItem(item, currentId)).join('')}
        </nav>
      </div>
      <div class="sidebar-bottom">
        <div class="nav-footer" id="navFooter">
          ${footerItems.map((item) => renderMenuItem(item, currentId)).join('')}
        </div>
        <div class="user-card" id="userCard">
          ${renderUserCard(USER)}
        </div>
      </div>
    `;
    }

    function init() {
        const currentId = detectCurrentPageId();

        let aside = document.getElementById('sidebar');
        if (!aside) {
            aside = document.createElement('aside');
            aside.id = 'sidebar';
            document.body.insertBefore(aside, document.body.firstChild);
        }
        aside.className = 'sidebar';
        aside.setAttribute('aria-label', 'Navegación principal');
        aside.innerHTML = buildSidebarHTML(currentId);

        // Botón de cerrar (uso típico en móvil)
        const closeBtn = aside.querySelector('#sidebarClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                aside.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            });
        }

        // Re-ejecuta el sistema de iconos si existe (ej. lucide, feather, o uno propio)
        if (typeof window.initIcons === 'function') {
            window.initIcons(aside);
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Se expone por si necesitas volver a renderizar manualmente (ej. tras un cambio de idioma)
    window.NavigationComponent = { init };
})();