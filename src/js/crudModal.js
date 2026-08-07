const CrudModal = (() => {
  let resolveCurrent = null;
  let modal;

  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "crud-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="crud-modal__backdrop" data-modal-close></div>
      <section class="crud-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="crud-modal-title">
        <header class="crud-modal__header"><h2 class="crud-modal__title" id="crud-modal-title"></h2><button class="crud-modal__close" type="button" data-modal-close aria-label="Cerrar">&times;</button></header>
        <form class="crud-modal__form"><div class="crud-modal__fields"></div><p class="crud-modal__error" role="alert"></p><div class="crud-modal__actions"><button class="crud-modal__button crud-modal__button--cancel" type="button" data-modal-close>Cancelar</button><button class="crud-modal__button crud-modal__button--save" type="submit">Guardar</button></div></form>
      </section>`;
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-modal-close]").forEach((element) => element.addEventListener("click", close));
    modal.querySelector("form").addEventListener("submit", submit);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) close(); });
  }

  function close() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("crud-modal-open");
    if (resolveCurrent) resolveCurrent(null);
    resolveCurrent = null;
  }

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    modal.hidden = true;
    document.body.classList.remove("crud-modal-open");
    const resolve = resolveCurrent;
    resolveCurrent = null;
    resolve(values);
  }

  function open({ title, fields, values = {} }) {
    ensureModal();
    if (resolveCurrent) resolveCurrent(null);
    modal.querySelector(".crud-modal__title").textContent = title;
    modal.querySelector(".crud-modal__error").textContent = "";
    const container = modal.querySelector(".crud-modal__fields");
    container.innerHTML = "";
    fields.forEach((field) => {
      const wrapper = document.createElement("div");
      wrapper.className = `crud-modal__field${field.full ? " crud-modal__field--full" : ""}`;
      const label = document.createElement("label");
      label.htmlFor = `modal-${field.name}`;
      label.textContent = field.label;
      let control;
      if (field.type === "select") {
        control = document.createElement("select");
        field.options.forEach((option) => control.add(new Option(option.label, option.value)));
      } else {
        control = document.createElement("input");
        control.type = field.type || "text";
        if (field.min !== undefined) control.min = field.min;
        if (field.step !== undefined) control.step = field.step;
        if (field.placeholder) control.placeholder = field.placeholder;
      }
      control.id = `modal-${field.name}`;
      control.name = field.name;
      control.value = values[field.name] ?? field.default ?? "";
      control.required = Boolean(field.required);
      wrapper.append(label, control);
      container.appendChild(wrapper);
    });
    modal.hidden = false;
    document.body.classList.add("crud-modal-open");
    requestAnimationFrame(() => container.querySelector("input, select")?.focus());
    return new Promise((resolve) => { resolveCurrent = resolve; });
  }

  return { open, close };
})();

window.CrudModal = CrudModal;
