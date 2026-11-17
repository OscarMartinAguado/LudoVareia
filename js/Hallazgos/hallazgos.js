/* =========================================================
   LUDOVAREIA — FICHAS INTERACTIVAS DE HALLAZGOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("artifact-modal");

  // Si la página no contiene fichas, no hacemos nada.
  if (!modal) return;

  const modalImage = document.getElementById("artifact-modal-image");
  const modalCategory = document.getElementById("artifact-modal-category");
  const modalTitle = document.getElementById("artifact-modal-title");
  const modalDescription = document.getElementById(
    "artifact-modal-description",
  );
  const modalContext = document.getElementById("artifact-modal-context");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");

  let previousTrigger = null;

  // Abrir la ficha correspondiente al objeto seleccionado.
  function openModal(card) {
    previousTrigger = card;

    const title = card.dataset.title || "Pieza arqueológica";
    const category = card.dataset.category || "Hallazgo";
    const image = card.dataset.image || "";
    const alt = card.dataset.alt || title;
    const description = card.dataset.description || "";
    const context = card.dataset.context || "";

    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDescription.textContent = description;
    modalContext.textContent = context;

    modalImage.alt = alt;

    // Se asigna la ruta del HTML, sin construir URLs externas.
    modalImage.src = image;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const closeButton = modal.querySelector(".artifact-modal__close");

    if (closeButton) {
      closeButton.focus();
    }
  }

  // Cerrar la ficha y restaurar la página.
  function closeModal() {
    if (modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";

    // Liberamos la imagen al cerrar.
    modalImage.removeAttribute("src");
    modalImage.alt = "";

    if (previousTrigger && previousTrigger.isConnected) {
      previousTrigger.focus();
    }

    previousTrigger = null;
  }

  // Todas las tarjetas de la galería.
  document.querySelectorAll(".artifact-card").forEach((card) => {
    card.addEventListener("click", () => {
      openModal(card);
    });
  });

  // Cerrar al pulsar la X o el fondo oscuro.
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  // Cerrar con Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  // Mantener el foco dentro de la ventana con el teclado.
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || modal.hidden) return;

    const focusable = Array.from(
      modal.querySelectorAll(
        "button:not([disabled]), a[href], input:not([disabled]), " +
          "select:not([disabled]), textarea:not([disabled]), " +
          '[tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
