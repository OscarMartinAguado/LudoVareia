// =====================================================
// DONACIONES - LUDOVAREIA
// =====================================================

// ELEMENTOS
const donateButton = document.getElementById("donate-button");
const donatePopup = document.getElementById("donate-popup");
const thankYouPopup = document.getElementById("donate-thank-you");
const overlay = document.querySelector(".donate-overlay");

const donationForm = document.getElementById("donation-form");
const amountInput = document.getElementById("donation-amount");
const amountButtons = document.querySelectorAll(".donate-amount");

const donationSummary = document.getElementById("donation-summary");
const thankYouAmount = document.getElementById("thank-you-amount");

const closeButtons = document.querySelectorAll("[data-donate-close]");

// ELEMENTOS DE LA PÁGINA QUE DEBEN QUEDAR INACTIVOS
const pageElements = document.querySelectorAll("header, nav, main, footer");

let selectedAmount = 20;
let previousFocus = null;
let activePopup = null;

// =====================================================
// FORMATO DE LOS IMPORTES
// =====================================================

function formatAmount(amount) {
  return (
    amount.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

// =====================================================
// ACTUALIZAR CANTIDAD SELECCIONADA
// =====================================================

function updateAmount(amount) {
  selectedAmount = amount;

  amountButtons.forEach((button) => {
    const isSelected = Number(button.dataset.amount) === amount;

    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  donationSummary.textContent = formatAmount(amount);
}

// SELECCIONAR UNA CANTIDAD PREDETERMINADA

amountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    amountInput.value = "";

    updateAmount(Number(button.dataset.amount));
  });
});

// CANTIDAD PERSONALIZADA

amountInput.addEventListener("input", () => {
  amountInput.setCustomValidity("");
  const amount = Number(amountInput.value);

  if (amountInput.value === "") {
    updateAmount(20);
    return;
  }

  // Desactivar cantidades predeterminadas
  amountButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });

  selectedAmount = null;

  if (Number.isFinite(amount) && amount >= 1 && amount <= 5000) {
    donationSummary.textContent = formatAmount(amount);
  } else {
    donationSummary.textContent = "Cantidad no válida";
  }
});

// =====================================================
// BLOQUEAR Y DESBLOQUEAR LA PÁGINA
// =====================================================

function setPageInert(disabled) {
  pageElements.forEach((element) => {
    element.inert = disabled;
  });
}

// =====================================================
// ABRIR POPUP
// =====================================================

function openPopup(popup) {
  previousFocus = document.activeElement;

  activePopup = popup;

  // Mostrar fondo oscuro
  overlay.hidden = false;

  // Mostrar popup correspondiente
  popup.hidden = false;

  // Bloquear el resto de la página
  setPageInert(true);

  // Evitar desplazamiento del fondo
  document.body.style.overflow = "hidden";

  // Colocar el foco dentro del popup
  const firstFocusable = popup.querySelector("button, input");

  if (firstFocusable) {
    firstFocusable.focus();
  }
}

// ABRIR POPUP DE DONACIÓN

donateButton.addEventListener("click", (e) => {
  e.preventDefault();

  amountInput.value = "";
  updateAmount(20);

  openPopup(donatePopup);
});

// =====================================================
// CERRAR POPUPS
// =====================================================

function closePopup() {
  if (!activePopup) return;

  donatePopup.hidden = true;
  thankYouPopup.hidden = true;
  overlay.hidden = true;

  // Desbloquear la página
  setPageInert(false);

  // Recuperar desplazamiento
  document.body.style.overflow = "";

  // Recuperar foco
  if (previousFocus) {
    previousFocus.focus();
  }

  activePopup = null;
  previousFocus = null;
}

// CERRAR MEDIANTE LOS BOTONES

closeButtons.forEach((button) => {
  button.addEventListener("click", closePopup);
});

// CERRAR AL PULSAR FUERA DEL POPUP

overlay.addEventListener("click", closePopup);

// CERRAR CON ESCAPE

document.addEventListener("keydown", (e) => {
  if (!activePopup) return;

  if (e.key === "Escape") {
    closePopup();
    return;
  }

  // MANTENER EL FOCO DENTRO DEL POPUP
  if (e.key === "Tab") {
    const focusableElements = activePopup.querySelectorAll(
      "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
    );

    const elements = Array.from(focusableElements);

    if (elements.length === 0) return;

    const first = elements[0];
    const last = elements[elements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// =====================================================
// CONFIRMAR APORTACIÓN
// =====================================================

donationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let amount;

  // Comprobar si se ha introducido una cantidad personalizada
  if (amountInput.value.trim() !== "") {
    amount = Number(amountInput.value);
  } else {
    amount = selectedAmount;
  }

  // Validar cantidad
  if (!Number.isFinite(amount) || amount < 1 || amount > 5000) {
    amountInput.setCustomValidity(
      "Introduce una cantidad entre 1 € y 5.000 €.",
    );

    amountInput.reportValidity();
    return;
  }

  amountInput.setCustomValidity("");

  // Mostrar cantidad en agradecimiento
  thankYouAmount.textContent =
    "Aportación seleccionada: " + formatAmount(amount);

  // Cambiar de popup sin cerrar el overlay
  donatePopup.hidden = true;
  thankYouPopup.hidden = false;

  activePopup = thankYouPopup;

  // Colocar foco en el nuevo popup
  thankYouPopup.querySelector("[data-donate-close]").focus();
});
