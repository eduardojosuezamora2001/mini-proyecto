const PRODUCT_KEY = "products";
const LOW_STOCK_THRESHOLD = 10;
const PRODUCT_SEED = [
  { id: "1", name: "Ergo Wireless Mouse M-1", sku: "ERG-001", category: "Electronics", price: 49.99, stock: 342, status: "active", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=96&h=96&fit=crop" },
  { id: "2", name: "ProType Mechanical Keyboard", sku: "KBD-PRO-87", category: "Electronics", price: 129.50, stock: 4, status: "active", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=96&h=96&fit=crop" },
  { id: "3", name: "AluDesk Laptop Stand", sku: "STD-AL-01", category: "Accessories", price: 34, stock: 0, status: "out_of_stock", image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=96&h=96&fit=crop" }
];

const tableBody = document.getElementById("product-table-body");
const searchInput = document.getElementById("product-search");
const resultsSummary = document.getElementById("results-summary");
let currentPage = 1;
let sortState = { key:null, direction:"asc" };

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function products() { return Storage.get(PRODUCT_KEY); }

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products().filter((product) => [product.name, product.sku, product.category].join(" ").toLowerCase().includes(term));
  const sorted = UIComponents.sort(filtered, sortState, { price:(product)=>Number(product.price), stock:(product)=>Number(product.stock) });
  const result = AppCore.page(sorted, currentPage); currentPage = result.current;
  tableBody.innerHTML = result.items.length ? result.items.map(buildRow).join("") : `<tr><td colspan="6" style="padding:32px;text-align:center">No se encontraron productos.</td></tr>`;
  resultsSummary.textContent = `Showing ${filtered.length} of ${products().length} products`;
  AppCore.pagination(document.getElementById("pagination"), result, (page) => { currentPage = page; renderProducts(); });
  AppCore.applyPermissions(tableBody);
}

function buildRow(product) {
  const low = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  return `<tr class="${low ? "row-warning" : ""}" data-id="${escapeHtml(product.id)}">
    <td><div class="product-cell"><div class="product-thumb"><img src="${escapeHtml(product.image || "")}" alt="${escapeHtml(product.name)}" /></div><div><div class="product-name">${escapeHtml(product.name)}</div><div class="product-sku">SKU: ${escapeHtml(product.sku)}</div></div></div></td>
    <td>${escapeHtml(product.category)}<small style="display:block;color:#687083">${escapeHtml(Storage.find("suppliers", product.supplierId)?.companyName || "Sin proveedor")}</small></td><td class="align-right">$${Number(product.price).toFixed(2)}</td>
    <td class="align-right"><span class="${low ? "stock-low" : "stock-value"}">${Number(product.stock)}</span></td>
    <td><span class="tag ${product.status === "out_of_stock" ? "tag-out" : "tag-active"}">${product.status === "out_of_stock" ? "Out of Stock" : "Active"}</span></td>
    <td class="product-crud">${UIComponents.actions()}</td></tr>`;
}

function productFields() {
  return [
    { name: "name", label: "Nombre", required: true, full: true },
    { name: "sku", label: "SKU", required: true },
    { name: "category", label: "Categoría", required: true, default: "General" },
    { name: "supplierId", label: "Proveedor", type: "select", required: true, options: [{ value: "", label: "Selecciona un proveedor" }, ...Storage.get("suppliers").map((supplier) => ({ value: String(supplier.id), label: supplier.companyName }))] },
    { name: "price", label: "Precio", type: "number", min: "0.01", step: "0.01", required: true, default: "0.01" },
    { name: "stock", label: "Existencias", type: "number", min: "0", step: "1", required: true, default: "0" },
    { name: "image", label: "URL de imagen", type: "url", placeholder: "https://...", full: true }
  ];
}

function viewProduct(product) {
  return CrudModal.open({ title: "Detalle del producto", values: product, fields: productFields(), readOnly: true });
}

async function askProduct(current = {}) {
  const values = await CrudModal.open({
    title: current.id ? "Editar producto" : "Añadir producto",
    values: current,
    fields: productFields()
  });
  if (!values) return null;
  const price = Number(values.price); const stock = Number(values.stock);
  return { ...values, name: values.name.trim(), sku: values.sku.trim(), category: values.category.trim(), price, stock, status: stock === 0 ? "out_of_stock" : "active", image: values.image.trim() };
}

document.addEventListener("DOMContentLoaded", () => {
  if (!Storage.exists(PRODUCT_KEY)) Storage.save(PRODUCT_KEY, PRODUCT_SEED);
  sortState = UIComponents.makeSortable(document.querySelector(".product-table"), { 0:"name", 1:"category", 2:"price", 3:"stock", 4:"status" }, () => { currentPage = 1; renderProducts(); });
  renderProducts();
  searchInput.addEventListener("input", AppCore.debounce(() => { currentPage = 1; renderProducts(); }));
  document.getElementById("add-product-btn").addEventListener("click", async () => { const item = await askProduct(); if (item) { Storage.add(PRODUCT_KEY, item); renderProducts(); } });
  document.getElementById("filters-btn").addEventListener("click", () => searchInput.focus());
  document.querySelector(".view-toggle").addEventListener("click", (event) => { const btn = event.target.closest(".view-btn"); if (btn) { document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active")); btn.classList.add("active"); } });
  tableBody.addEventListener("click", AppErrors.guard(async (event) => {
    const button = event.target.closest("[data-action]"); if (!button) return;
    const id = button.closest("tr").dataset.id; const item = Storage.find(PRODUCT_KEY, id);
    if (button.dataset.action === "view") { await viewProduct(item); }
    else if (button.dataset.action === "edit" && AppCore.can("edit")) { const changes = await askProduct(item); if (changes) Storage.update(PRODUCT_KEY, id, changes); }
    else if (AppCore.can("delete")) {
      const related = BusinessRules.relatedOrders("products", id).length;
      const warning = related ? `Este producto aparece en ${related} pedido(s). Si continúas, los pedidos conservarán la referencia pero ya no podrán calcular ese artículo.\n\n` : "";
      if (confirm(`${warning}¿Eliminar ${item.name}?`)) UndoManager.remove({ entity:PRODUCT_KEY, id, label:item.name, onChange:renderProducts });
    }
    if (button.dataset.action !== "delete") renderProducts();
  }, "Acciones de productos"));
  document.getElementById("pagination").hidden = false;
});
