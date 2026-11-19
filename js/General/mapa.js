document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("map-modal");
  const trigger = document.getElementById("open-map");

  if (!modal || !trigger) return;

  const closeButton = modal.querySelector(".map-modal__close");
  const closeElements = modal.querySelectorAll("[data-map-close]");
  const pageElements = [...document.body.children].filter(
    (element) => element !== modal,
  );
  let previousFocus = null;
  let previousInertState = [];

  function openMap() {
    previousFocus = document.activeElement;
    previousInertState = pageElements.map((element) => element.inert);
    pageElements.forEach((element) => {
      element.inert = true;
    });
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeMap() {
    if (modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";
    pageElements.forEach((element, index) => {
      element.inert = previousInertState[index];
    });
    previousFocus?.focus();
  }

  trigger.addEventListener("click", openMap);

  closeElements.forEach((element) => {
    element.addEventListener("click", closeMap);
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      closeMap();
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = [
        ...modal.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!modal.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
});
