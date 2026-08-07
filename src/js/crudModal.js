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
    let valid = true;
    form.querySelectorAll("input, select").forEach((control) => {
      const wrapper = control.closest(".crud-modal__field");
      const error = wrapper.querySelector(".field-error-message");
      let message = "";
      if (control.validity.valueMissing) message = "Este campo es obligatorio.";
      else if (control.validity.typeMismatch) message = control.type === "email" ? "Ingresa un correo válido, por ejemplo usuario@dominio.com." : "El formato ingresado no es válido.";
      else if (control.validity.patternMismatch) message = control.dataset.patternMessage || "El formato ingresado no es válido.";
      else if (control.validity.rangeUnderflow) message = `El valor mínimo permitido es ${control.min}.`;
      else if (control.validity.rangeOverflow) message = `El valor máximo permitido es ${control.max}.`;
      else if (control.validity.stepMismatch) message = "Ingresa un valor numérico válido.";
      wrapper.classList.toggle("is-invalid", Boolean(message));
      error.textContent = message;
      if (message) valid = false;
    });
    if (!valid) return;
    const values = Object.fromEntries(new FormData(form).entries());
    modal.hidden = true;
    document.body.classList.remove("crud-modal-open");
    const resolve = resolveCurrent;
    resolveCurrent = null;
    resolve(values);
  }

  function open({ title, fields, values = {}, readOnly = false }) {
    ensureModal();
    if (resolveCurrent) resolveCurrent(null);
    modal.querySelector(".crud-modal__title").textContent = title;
    modal.querySelector(".crud-modal__error").textContent = "";
    const saveButton = modal.querySelector(".crud-modal__button--save");
    const cancelButton = modal.querySelector(".crud-modal__button--cancel");
    saveButton.hidden = readOnly;
    cancelButton.textContent = readOnly ? "Cerrar" : "Cancelar";
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
        if (field.pattern) control.pattern = field.pattern;
        if (field.patternMessage) control.dataset.patternMessage = field.patternMessage;
        if (field.placeholder) control.placeholder = field.placeholder;
      }
      control.id = `modal-${field.name}`;
      control.name = field.name;
      control.value = values[field.name] ?? field.default ?? "";
      control.required = Boolean(field.required);
      control.disabled = readOnly;
      const fieldError = document.createElement("small");
      fieldError.className = "field-error-message";
      control.addEventListener("input", () => { wrapper.classList.remove("is-invalid"); fieldError.textContent = ""; });
      wrapper.append(label, control, fieldError);
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
