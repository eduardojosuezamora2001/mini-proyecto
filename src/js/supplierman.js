document.addEventListener("DOMContentLoaded", () => {
  const KEY = "suppliers";
  const seed = [
    { id: "1", companyName: "GlobalTech Supplies", contactPerson: "Elena Rodriguez", contactInfo: { email: "elena.r@globaltech.com", phone: "+1 (555) 123-4567" }, address: "1200 Innovation Way", status: "Active" },
    { id: "2", companyName: "Apex Manufacturing", contactPerson: "Marcus Chen", contactInfo: { email: "m.chen@apex-mfg.com", phone: "+1 (555) 987-6543" }, address: "88 Industrial Parkway", status: "Active" },
    { id: "3", companyName: "Summit Logistics", contactPerson: "Sarah Jenkins", contactInfo: { email: "s.jenkins@summit.net", phone: "+44 20 7123 4567" }, address: "45 Canary Wharf, London", status: "Inactive" }
  ];
  if (!Storage.exists(KEY)) Storage.save(KEY, seed);
  lucide.createIcons();
  const tbody = document.getElementById("supplier-list"); const search = document.getElementById("supplier-search"); const status = document.getElementById("supplier-status");
  let currentPage = 1;
  const sortState = UIComponents.makeSortable(document.querySelector("table"), { 0:"companyName", 1:"contactPerson", 2:"email", 3:"status", 4:"address" }, () => { currentPage = 1; render(); });
  const escape = (value) => { const div = document.createElement("div"); div.textContent = value ?? ""; return div.innerHTML; };
  const initials = (name) => name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

  function render() {
    const all = Storage.get(KEY); const term = search.value.trim().toLowerCase();
    const rows = all.filter((item) => [item.companyName, item.contactPerson, item.contactInfo?.email, item.contactInfo?.phone, item.address].join(" ").toLowerCase().includes(term) && (status.value === "all" || item.status.toLowerCase() === status.value));
    const sorted = UIComponents.sort(rows, sortState, { email:(item)=>item.contactInfo?.email || "" });
    const result = AppCore.page(sorted, currentPage); currentPage = result.current;
    tbody.innerHTML = result.items.map((item) => `<tr data-id="${escape(item.id)}"><td><div class="person"><span class="avatar blue">${escape(initials(item.companyName))}</span><strong>${escape(item.companyName)}</strong></div></td><td>${escape(item.contactPerson)}</td><td><strong>${escape(item.contactInfo?.email)}</strong><br><small>${escape(item.contactInfo?.phone)}</small></td><td><span class="status ${item.status.toLowerCase()}"><b></b>${escape(item.status)}</span></td><td>${escape(item.address)}</td><td>${UIComponents.actions()}</td></tr>`).join("");
    document.querySelector(".empty-state").hidden = rows.length !== 0; document.getElementById("supplier-visible").textContent = rows.length; document.getElementById("supplier-total").textContent = all.length; AppCore.pagination(document.getElementById("supplier-pagination"), result, (page) => { currentPage = page; render(); }); AppCore.applyPermissions(tbody);
  }

  function supplierFields() {
    return [
      { name: "companyName", label: "Nombre de la empresa", required: true, full: true }, { name: "contactPerson", label: "Persona de contacto", required: true, full: true },
      { name: "email", label: "Correo electrónico", type: "email", required: true }, { name: "phone", label: "Teléfono", type: "tel", required: true, pattern: "[+0-9() -]{8,20}", patternMessage: "Usa entre 8 y 20 caracteres: números, espacios, +, guiones o paréntesis." },
      { name: "address", label: "Dirección", required: true, full: true }, { name: "status", label: "Estado", type: "select", full: true, options: [{ value: "active", label: "Activo" }, { value: "inactive", label: "Inactivo" }] }
    ];
  }

  function modalValues(current = {}) {
    const info = current.contactInfo || {};
    return { ...current, email: info.email, phone: info.phone, status: (current.status || "Active").toLowerCase() };
  }

  function viewSupplier(current) {
    return CrudModal.open({ title: "Detalle del proveedor", values: modalValues(current), fields: supplierFields(), readOnly: true });
  }

  async function form(current = {}) {
    const values = await CrudModal.open({ title: current.id ? "Editar proveedor" : "Nuevo proveedor", values: modalValues(current), fields: supplierFields() });
    return values && { companyName: values.companyName.trim(), contactPerson: values.contactPerson.trim(), contactInfo: { email: values.email.trim(), phone: values.phone.trim() }, address: values.address.trim(), status: values.status === "active" ? "Active" : "Inactive" };
  }

  search.addEventListener("input", AppCore.debounce(() => { currentPage = 1; render(); })); status.addEventListener("change", () => { currentPage = 1; render(); });
  document.getElementById("add-supplier").addEventListener("click", async () => { const item = await form(); if (item) { Storage.add(KEY, item); render(); } });
  tbody.addEventListener("click", AppErrors.guard(async (event) => { const button = event.target.closest("[data-action]"); if (!button) return; const id = button.closest("tr").dataset.id; const item = Storage.find(KEY, id); if (button.dataset.action === "view") { await viewSupplier(item); render(); } else if (button.dataset.action === "edit" && AppCore.can("edit")) { const changes = await form(item); if (changes) Storage.update(KEY, id, changes); render(); } else if (AppCore.can("delete")) { const related = BusinessRules.productsBySupplier(id).length; const warning = related ? `Este proveedor suministra ${related} producto(s). Los productos quedarán sin proveedor.\n\n` : ""; if (confirm(`${warning}¿Eliminar ${item.companyName}?`)) UndoManager.remove({ entity:KEY, id, label:item.companyName, onChange:render }); } }, "Acciones de proveedores"));
  document.getElementById("export-suppliers").addEventListener("click", () => { const blob = new Blob([Storage.export(KEY)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "suppliers.json"; link.click(); URL.revokeObjectURL(link.href); });
  render();
});
