document.addEventListener("DOMContentLoaded", () => {
  const KEY = "customers";
  const seed = [
    { id: "1", name: "Elena Silva", phone: "+34 612 345 678", email: "elena.silva@example.com", status: "active", lastOrder: "2 days ago" },
    { id: "2", name: "Miguel Rodríguez", phone: "+34 689 123 456", email: "m.rodriguez@empresa.com", status: "pending", lastOrder: "No orders yet" },
    { id: "3", name: "Laura Carmen", phone: "+34 654 321 098", email: "laura.c@domain.net", status: "inactive", lastOrder: "Jan 15, 2023" },
    { id: "4", name: "Carlos García", phone: "+34 677 889 900", email: "carlos.g@techcorp.com", status: "active", lastOrder: "4 hours ago" }
  ];

  if (!Storage.exists(KEY)) Storage.save(KEY, seed);
  lucide.createIcons();

  const tbody = document.querySelector("#customer-list");
  const searchInput = document.querySelector("#customer-search");
  const statusFilter = document.querySelector("#status-filter");
  const emptyState = document.querySelector(".empty-state");
  const visibleCount = document.querySelector("#visible-count");
  const totalCount = document.querySelector("#customer-total");
  const selectAll = document.querySelector("#select-all");
  const pagination = document.querySelector(".pagination");
  let currentPage = 1;

  const escapeHtml = (value) => {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  };

  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function render() {
    const customers = Storage.get(KEY);
    const term = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const visible = customers.filter((customer) => {
      const matchesText = [customer.name, customer.email, customer.phone].join(" ").toLowerCase().includes(term);
      return matchesText && (status === "all" || customer.status === status);
    });

    const result = AppCore.page(visible, currentPage); currentPage = result.current;
    tbody.innerHTML = result.items.map((customer) => `
      <tr data-id="${escapeHtml(customer.id)}" data-status="${escapeHtml(customer.status)}">
        <td><input type="checkbox" aria-label="Seleccionar ${escapeHtml(customer.name)}" /></td>
        <td><div class="person ${customer.status === "inactive" ? "muted" : ""}"><span class="avatar ${customer.status === "inactive" ? "gray" : "blue"}">${escapeHtml(initials(customer.name))}</span><span><strong>${escapeHtml(customer.name)}</strong><small>${escapeHtml(customer.phone)}</small></span></div></td>
        <td>${escapeHtml(customer.email)}</td>
        <td><span class="status ${escapeHtml(customer.status)}"><b></b>${escapeHtml(customer.status[0].toUpperCase() + customer.status.slice(1))}</span></td>
        <td>${escapeHtml(customer.lastOrder || "No orders yet")}</td>
        <td class="crud-actions"><button data-action="view" title="Ver">Ver</button><button data-action="edit" data-permission="edit" title="Modificar">Modificar</button><button data-action="delete" data-permission="delete" title="Eliminar">Eliminar</button></td>
      </tr>`).join("");

    emptyState.hidden = visible.length !== 0;
    visibleCount.textContent = String(visible.length);
    totalCount.textContent = String(customers.length);
    selectAll.checked = false;
    AppCore.pagination(pagination, result, (page) => { currentPage = page; render(); });
    AppCore.applyPermissions(tbody);
  }

  function customerFields() {
    return [
      { name: "name", label: "Nombre completo", required: true, full: true },
      { name: "email", label: "Correo electrónico", type: "email", required: true },
      { name: "phone", label: "Teléfono", type: "tel", required: true },
      { name: "status", label: "Estado", type: "select", default: "active", options: [{ value: "active", label: "Activo" }, { value: "pending", label: "Pendiente" }, { value: "inactive", label: "Inactivo" }] },
      { name: "lastOrder", label: "Último pedido", default: "No orders yet", full: true }
    ];
  }

  function viewCustomer(customer) {
    return CrudModal.open({ title: "Detalle del cliente", values: customer, fields: customerFields(), readOnly: true });
  }

  async function askCustomer(current = {}) {
    const values = await CrudModal.open({
      title: current.id ? "Editar cliente" : "Nuevo cliente",
      values: current,
      fields: customerFields()
    });
    if (!values) return null;
    return { ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() };
  }

  searchInput.addEventListener("input", AppCore.debounce(() => { currentPage = 1; render(); }));
  statusFilter.addEventListener("change", () => { currentPage = 1; render(); });
  selectAll.addEventListener("change", () => tbody.querySelectorAll('input[type="checkbox"]').forEach((box) => { box.checked = selectAll.checked; }));

  document.querySelector("#add-customer").addEventListener("click", async () => {
    const customer = await askCustomer();
    if (customer) { Storage.add(KEY, customer); render(); }
  });

  tbody.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const id = button.closest("tr").dataset.id;
    const customer = Storage.find(KEY, id);
    if (button.dataset.action === "view") {
      await viewCustomer(customer);
    } else if (button.dataset.action === "edit" && AppCore.can("edit")) {
      const changes = await askCustomer(customer);
      if (changes) Storage.update(KEY, id, changes);
    } else if (AppCore.can("delete")) {
      const related = BusinessRules.relatedOrders("customers", id).length;
      const warning = related ? `Este cliente tiene ${related} pedido(s) asociado(s). Los pedidos conservarán su referencia histórica.\n\n` : "";
      if (confirm(`${warning}¿Eliminar a ${customer.name}?`)) Storage.delete(KEY, id);
    }
    render();
  });

  render();
});
