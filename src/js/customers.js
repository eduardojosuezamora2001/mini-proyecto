document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const searchInput = document.querySelector("#customer-search");
  const statusFilter = document.querySelector("#status-filter");
  const rows = [...document.querySelectorAll("#customer-list tr")];
  const emptyState = document.querySelector(".empty-state");
  const visibleCount = document.querySelector("#visible-count");
  const selectAll = document.querySelector("#select-all");

  function filterCustomers() {
    const term = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    let visible = 0;

    rows.forEach((row) => {
      const matchesText = row.textContent.toLowerCase().includes(term);
      const matchesStatus = status === "all" || row.dataset.status === status;
      const shouldShow = matchesText && matchesStatus;

      row.hidden = !shouldShow;
      if (shouldShow) visible += 1;
    });

    emptyState.hidden = visible !== 0;
    visibleCount.textContent = visible ? `1 to ${visible}` : "0";
  }

  searchInput.addEventListener("input", filterCustomers);
  statusFilter.addEventListener("change", filterCustomers);

  selectAll.addEventListener("change", () => {
    rows.forEach((row) => {
      if (!row.hidden) row.querySelector('input[type="checkbox"]').checked = selectAll.checked;
    });
  });

  document.querySelectorAll(".side-nav .nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".side-nav .nav-item").forEach((navItem) => navItem.classList.remove("active"));
      item.classList.add("active");
    });
  });

  document.querySelectorAll(".pagination button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".pagination .current").forEach((current) => current.classList.remove("current"));
      if (/^\d+$/.test(button.textContent.trim())) button.classList.add("current");
    });
  });

  document.querySelector("#add-customer").addEventListener("click", () => {
    window.alert("Aquí puedes conectar un modal o formulario para crear un nuevo cliente.");
  });
});