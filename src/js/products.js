/**
 * script.js
 * ---------------------------------------------------------------
 * Lógica de la vista "Administración de Productos":
 *  - Datos de ejemplo (reemplázalos por una llamada a tu API/backend)
 *  - Render de filas de la tabla
 *  - Búsqueda local por nombre / SKU / categoría
 *  - Toggle vista lista / cuadrícula (visual, ambas usan la tabla)
 *  - Paginación (simulada sobre el set de datos de ejemplo)
 *  - Menú de acciones por fila
 * ---------------------------------------------------------------
 */

const PRODUCTS = [
    {
        id: 1,
        name: 'Ergo Wireless Mouse M-1',
        sku: 'ERG-001',
        category: 'Electronics',
        price: 49.99,
        stock: 342,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=96&h=96&fit=crop'
    },
    {
        id: 2,
        name: 'ProType Mechanical Keyboard',
        sku: 'KBD-PRO-87',
        category: 'Electronics',
        price: 129.50,
        stock: 4,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=96&h=96&fit=crop'
    },
    {
        id: 3,
        name: 'AluDesk Laptop Stand',
        sku: 'STD-AL-01',
        category: 'Accessories',
        price: 34.00,
        stock: 0,
        status: 'out_of_stock',
        image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=96&h=96&fit=crop'
    }
];

const LOW_STOCK_THRESHOLD = 10;
const TOTAL_PRODUCTS = 150; // total real vendría del backend / paginación server-side
const PAGE_SIZE = PRODUCTS.length;
const TOTAL_PAGES = 3;

let currentPage = 1;

const tableBody = document.getElementById('product-table-body');
const searchInput = document.getElementById('product-search');
const resultsSummary = document.getElementById('results-summary');
const pagination = document.getElementById('pagination');
const viewToggle = document.querySelector('.view-toggle');

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(PRODUCTS);
    wireSearch();
    wireViewToggle();
    wirePagination();
    wireHeaderActions();

    // Estado inicial de la paginación (página 1: "anterior" deshabilitado)
    document.querySelector('[data-page="prev"]').disabled = true;
});

/**
 * Pinta las filas de la tabla a partir de un arreglo de productos.
 * @param {Array<Object>} products
 */
function renderProducts(products) {
    tableBody.innerHTML = '';

    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 32px; text-align: center; color: var(--color-on-surface-variant);">
                    No se encontraron productos que coincidan con la búsqueda.
                </td>
            </tr>
        `;
        return;
    }

    products.forEach((product) => {
        tableBody.appendChild(buildRow(product));
    });
}

function buildRow(product) {
    const tr = document.createElement('tr');
    const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
    if (isLowStock) {
        tr.classList.add('row-warning');
    }

    tr.innerHTML = `
        <td>
            <div class="product-cell">
                <div class="product-thumb">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" />
                </div>
                <div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-sku">SKU: ${product.sku}</div>
                </div>
            </div>
        </td>
        <td>${product.category}</td>
        <td class="align-right">${formatPrice(product.price)}</td>
        <td class="align-right">${renderStock(product.stock, isLowStock)}</td>
        <td>${renderStatus(product.status)}</td>
        <td>
            <div class="row-actions">
                <button class="action-menu-btn" data-action-for="${product.id}" aria-label="Más acciones">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="5" r="1.5"></circle>
                        <circle cx="12" cy="12" r="1.5"></circle>
                        <circle cx="12" cy="19" r="1.5"></circle>
                    </svg>
                </button>
            </div>
        </td>
    `;

    tr.querySelector('[data-action-for]').addEventListener('click', () => {
        // Aquí conectarías un menú contextual real (editar / duplicar / eliminar).
        console.log(`Acciones para producto #${product.id}: ${product.name}`);
    });

    return tr;
}

function renderStock(stock, isLowStock) {
    if (isLowStock) {
        return `
            <span class="stock-low">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12" y2="17"></line>
                </svg>
                ${stock}
            </span>
        `;
    }
    return `<span class="stock-value">${stock}</span>`;
}

function renderStatus(status) {
    if (status === 'out_of_stock') {
        return `<span class="tag tag-out">Out of Stock</span>`;
    }
    return `<span class="tag tag-active">Active</span>`;
}

function formatPrice(value) {
    return `$${value.toFixed(2)}`;
}

/* -------------------------------------------------------------
   Búsqueda local
   ------------------------------------------------------------- */
function wireSearch() {
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.trim().toLowerCase();

        if (!term) {
            renderProducts(PRODUCTS);
            return;
        }

        const filtered = PRODUCTS.filter((p) =>
            p.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        );

        renderProducts(filtered);
    });
}

/* -------------------------------------------------------------
   Toggle vista lista / cuadrícula
   (visual únicamente en esta demo — ambas usan la misma tabla;
   conecta aquí tu propia vista en grilla si la necesitas)
   ------------------------------------------------------------- */
function wireViewToggle() {
    viewToggle.addEventListener('click', (event) => {
        const btn = event.target.closest('.view-btn');
        if (!btn) return;

        viewToggle.querySelectorAll('.view-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
    });
}

/* -------------------------------------------------------------
   Paginación
   ------------------------------------------------------------- */
function wirePagination() {
    pagination.addEventListener('click', (event) => {
        const btn = event.target.closest('.page-btn');
        if (!btn || btn.disabled) return;

        const target = btn.dataset.page;

        if (target === 'prev') {
            goToPage(currentPage - 1);
        } else if (target === 'next') {
            goToPage(currentPage + 1);
        } else {
            goToPage(Number(target));
        }
    });
}

function goToPage(page) {
    if (page < 1 || page > TOTAL_PAGES) return;
    currentPage = page;

    // Demo: en una integración real, aquí pedirías la página al backend.
    // Por ahora reutilizamos el mismo set de ejemplo para ilustrar el estado activo.
    renderProducts(PRODUCTS);

    pagination.querySelectorAll('.page-btn[data-page]').forEach((btn) => {
        const isNumber = !Number.isNaN(Number(btn.dataset.page));
        if (isNumber) {
            btn.classList.toggle('active', Number(btn.dataset.page) === currentPage);
        }
    });

    const prevBtn = pagination.querySelector('[data-page="prev"]');
    const nextBtn = pagination.querySelector('[data-page="next"]');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === TOTAL_PAGES;

    updateResultsSummary();
}

function updateResultsSummary() {
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, TOTAL_PRODUCTS);
    resultsSummary.textContent = `Showing ${start} to ${end} of ${TOTAL_PRODUCTS} products`;
}

/* -------------------------------------------------------------
   Botones del encabezado (Filters / Añadir Producto)
   ------------------------------------------------------------- */
function wireHeaderActions() {
    document.getElementById('filters-btn').addEventListener('click', () => {
        // Conecta aquí tu panel/modal real de filtros.
        console.log('Abrir panel de filtros');
    });

    document.getElementById('add-product-btn').addEventListener('click', () => {
        // Conecta aquí tu modal/formulario real de creación de producto.
        console.log('Abrir formulario de nuevo producto');
    });
}